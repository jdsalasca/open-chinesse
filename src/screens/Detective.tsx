import { useState } from 'react';
import { SessionHeader } from '../components/SessionHeader';
import { Card } from '../components/ui/Card';
import { dayKey } from '../store/metrics';
import { useLearner } from '../store/useLearner';
import { detectiveRounds, type DetectiveRound } from '../lib/detective';
import { navigate } from '../lib/router';

function CharButton({
  char,
  round,
  picked,
  onPick,
}: {
  char: string;
  round: DetectiveRound;
  picked: string | null;
  onPick: (char: string) => void;
}) {
  const state = picked === null ? '' : char === round.answer ? ' is-correct' : ' is-wrong';
  return (
    <button
      type="button"
      className={`option detective__char${state}`}
      disabled={picked !== null}
      onClick={() => onPick(char)}
      lang="zh-Hans"
      aria-label={`Carácter ${char}`}
    >
      {char}
    </button>
  );
}

function RoundFeedback({ round, picked }: { round: DetectiveRound; picked: string }) {
  return (
    <>
      <p
        className={`choice__feedback ${picked === round.answer ? 'is-correct' : 'is-wrong'}`}
        role="status"
      >
        {picked === round.answer ? 'Correcto. ' : `No: era ${round.answer}. `}
        {round.explain}
      </p>
      <a className="link" href={`#/caracter/${encodeURIComponent(round.answer)}`}>
        Abrir la ficha de {round.answer} →
      </a>
    </>
  );
}

function RoundCard({
  round,
  picked,
  onPick,
}: {
  round: DetectiveRound;
  picked: string | null;
  onPick: (char: string) => void;
}) {
  return (
    <Card className="detective__card">
      <p className="eyebrow">Detective de confusables</p>
      <h1 className="detective__prompt">¿Cuál significa «{round.meaning}»?</h1>
      <div className="detective__options" role="group" aria-label="Caracteres">
        {round.options.map((char) => (
          <CharButton key={char} char={char} round={round} picked={picked} onPick={onPick} />
        ))}
      </div>
      {picked && <RoundFeedback round={round} picked={picked} />}
    </Card>
  );
}

function Summary({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  return (
    <section className="scenario-done">
      <p className="eyebrow">Detective de confusables</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="scenario-done__lead">
        Distinguir la forma es el primer paso; la ficha te dice qué pieza cambia el significado.
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

function useDetectiveQuiz() {
  const [items, setItems] = useState(() => detectiveRounds(dayKey(Date.now())));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const logActivity = useLearner((state) => state.logActivity);
  const round = items[index];
  const choose = (char: string) => {
    if (!round || picked) return;
    setPicked(char);
    setAnswers([...answers, char === round.answer]);
    logActivity('detective', char === round.answer);
  };
  const next = () => {
    setIndex(index + 1);
    setPicked(null);
  };
  const restart = () => {
    setItems(detectiveRounds(String(Date.now())));
    setIndex(0);
    setPicked(null);
    setAnswers([]);
  };
  return { items, index, picked, answers, round, choose, next, restart };
}

export function Detective() {
  const { items, index, picked, answers, round, choose, next, restart } = useDetectiveQuiz();
  if (!round) {
    return (
      <Summary score={answers.filter(Boolean).length} total={answers.length} onRetry={restart} />
    );
  }
  return (
    <div className="detective">
      <SessionHeader
        label="Detective de confusables"
        count={`${index + 1} / ${items.length}`}
        onExit={() => navigate('/practicar')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / items.length) * 100}%` }} />
      </div>
      <RoundCard round={round} picked={picked} onPick={choose} />
      {picked && (
        <button type="button" className="button button--primary" onClick={next}>
          {index + 1 === items.length ? 'Ver resultado' : 'Siguiente'}
        </button>
      )}
    </div>
  );
}
