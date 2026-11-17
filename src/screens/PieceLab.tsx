import { useState } from 'react';
import { SessionHeader } from '../components/SessionHeader';
import { Card } from '../components/ui/Card';
import {
  pieceRounds,
  type PieceChoice,
  type PieceComponent,
  type PieceRound,
} from '../lib/piece-quiz';
import { navigate } from '../lib/router';
import { dayKey } from '../store/metrics';
import { useLearner } from '../store/useLearner';

function RoleButtons({
  component,
  picked,
  checked,
  onAssign,
}: {
  component: PieceComponent;
  picked?: PieceChoice;
  checked: boolean;
  onAssign: (char: string, choice: PieceChoice) => void;
}) {
  return (
    <div className="pieces__roles" role="group" aria-label={`Rol de ${component.char}`}>
      <button
        type="button"
        className={`pieces__role${picked === 'meaning' ? ' is-active' : ''}`}
        aria-pressed={picked === 'meaning'}
        disabled={checked}
        onClick={() => onAssign(component.char, 'meaning')}
      >
        Significado
      </button>
      <button
        type="button"
        className={`pieces__role${picked === 'sound' ? ' is-active' : ''}`}
        aria-pressed={picked === 'sound'}
        disabled={checked}
        onClick={() => onAssign(component.char, 'sound')}
      >
        Sonido
      </button>
    </div>
  );
}

function PieceRow({
  component,
  picked,
  checked,
  onAssign,
}: {
  component: PieceComponent;
  picked?: PieceChoice;
  checked: boolean;
  onAssign: (char: string, choice: PieceChoice) => void;
}) {
  const correct = checked && picked === component.role;
  const wrong = checked && picked !== component.role;
  const className = `pieces__component${correct ? ' is-correct' : ''}${wrong ? ' is-wrong' : ''}`;
  return (
    <div className={className}>
      <div className="pieces__piece">
        <span className="pieces__char" lang="zh-Hans">
          {component.char}
        </span>
        <span className="pieces__label">{component.label}</span>
      </div>
      <RoleButtons component={component} picked={picked} checked={checked} onAssign={onAssign} />
      {checked && (
        <p className="pieces__result">
          {correct ? 'Correcto' : `Era ${component.role === 'sound' ? 'sonido' : 'significado'}`}
        </p>
      )}
    </div>
  );
}

function PieceSorter({
  round,
  assignments,
  checked,
  onAssign,
}: {
  round: PieceRound;
  assignments: Record<string, PieceChoice>;
  checked: boolean;
  onAssign: (char: string, choice: PieceChoice) => void;
}) {
  return (
    <div className="pieces__components">
      {round.components.map((component) => (
        <PieceRow
          key={component.char}
          component={component}
          picked={assignments[component.char]}
          checked={checked}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}

function RoundHead({ round }: { round: PieceRound }) {
  return (
    <div className="pieces__head">
      <span className="pieces__hanzi" lang="zh-Hans">
        {round.char}
      </span>
      <div>
        {round.reading && <p className="pieces__reading">{round.reading}</p>}
        {round.meaning && <p className="pieces__meaning">{round.meaning}</p>}
      </div>
    </div>
  );
}

function RoundCard({
  round,
  assignments,
  checked,
  onAssign,
}: {
  round: PieceRound;
  assignments: Record<string, PieceChoice>;
  checked: boolean;
  onAssign: (char: string, choice: PieceChoice) => void;
}) {
  const correct = round.components.every(
    (component) => assignments[component.char] === component.role,
  );
  return (
    <Card className="pieces__card">
      <p className="eyebrow">Laboratorio de piezas</p>
      <RoundHead round={round} />
      <p className="pieces__prompt">Clasifica cada pieza: ¿aporta significado o sonido?</p>
      <PieceSorter round={round} assignments={assignments} checked={checked} onAssign={onAssign} />
      {checked && (
        <p className={`choice__feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
          {correct ? 'Todas bien. ' : 'Hay una pieza mal clasificada. '}
          {round.explain}
        </p>
      )}
      {checked && (
        <a className="link" href={`#/caracter/${encodeURIComponent(round.char)}`}>
          Abrir la ficha de {round.char} →
        </a>
      )}
    </Card>
  );
}

function Summary({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  return (
    <section className="scenario-done">
      <p className="eyebrow">Laboratorio de piezas</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="scenario-done__lead">
        Clasificar las piezas te obliga a mirar el carácter por dentro: qué aporta la idea y qué
        aporta el sonido.
      </p>
      <div className="scenario-done__actions">
        <button type="button" className="button button--primary" onClick={onRetry}>
          Otra tanda
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => navigate('/practicar')}
        >
          Volver a Practicar
        </button>
      </div>
    </section>
  );
}

function usePieceProgress() {
  const [items, setItems] = useState(() => pieceRounds(dayKey(Date.now())));
  const [index, setIndex] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, PieceChoice>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const logActivity = useLearner((state) => state.logActivity);
  return {
    items,
    setItems,
    index,
    setIndex,
    assignments,
    setAssignments,
    checked,
    setChecked,
    results,
    setResults,
    logActivity,
  };
}

function usePieceLab() {
  const progress = usePieceProgress();
  const round = progress.items[progress.index];
  const assign = (char: string, choice: PieceChoice) =>
    progress.setAssignments((current) => ({ ...current, [char]: choice }));
  const complete = round
    ? round.components.every((component) => progress.assignments[component.char])
    : false;
  const check = () => {
    if (!round || !complete) return;
    const ok = round.components.every(
      (component) => progress.assignments[component.char] === component.role,
    );
    progress.setChecked(true);
    progress.setResults([...progress.results, ok]);
    progress.logActivity('pieces', ok);
  };
  const next = () => {
    progress.setIndex(progress.index + 1);
    progress.setAssignments({});
    progress.setChecked(false);
  };
  const restart = () => {
    progress.setItems(pieceRounds(String(Date.now())));
    progress.setIndex(0);
    progress.setAssignments({});
    progress.setChecked(false);
    progress.setResults([]);
  };
  return { ...progress, round, assign, complete, check, next, restart };
}

function LabTop({ index, total, onExit }: { index: number; total: number; onExit: () => void }) {
  return (
    <>
      <SessionHeader
        label="Laboratorio de piezas"
        count={`${index + 1} / ${total}`}
        onExit={onExit}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
    </>
  );
}

function LabActions({
  checked,
  complete,
  last,
  check,
  next,
}: {
  checked: boolean;
  complete: boolean;
  last: boolean;
  check: () => void;
  next: () => void;
}) {
  if (!checked) {
    return (
      <button type="button" className="button button--primary" disabled={!complete} onClick={check}>
        Comprobar las piezas
      </button>
    );
  }
  return (
    <button type="button" className="button button--primary" onClick={next}>
      {last ? 'Ver resultado' : 'Siguiente carácter'}
    </button>
  );
}

export function PieceLab() {
  const {
    items,
    index,
    assignments,
    checked,
    results,
    round,
    assign,
    complete,
    check,
    next,
    restart,
  } = usePieceLab();
  if (!round) {
    return (
      <Summary score={results.filter(Boolean).length} total={results.length} onRetry={restart} />
    );
  }
  return (
    <div className="pieces">
      <LabTop index={index} total={items.length} onExit={() => navigate('/practicar')} />
      <RoundCard round={round} assignments={assignments} checked={checked} onAssign={assign} />
      <LabActions
        checked={checked}
        complete={complete}
        last={index + 1 === items.length}
        check={check}
        next={next}
      />
    </div>
  );
}
