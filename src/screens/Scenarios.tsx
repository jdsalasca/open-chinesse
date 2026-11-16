import { useEffect, useRef, useState, type RefObject } from 'react';
import { AudioButton } from '../components/AudioButton';
import { PageHeader } from '../components/PageHeader';
import { SessionHeader } from '../components/SessionHeader';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import {
  SCENARIOS,
  type Scenario,
  type ScenarioLine,
  type ScenarioOption,
  type ScenarioStep,
} from '../data/scenarios';
import { audioUrl } from '../lib/audio';
import { navigate } from '../lib/router';
import { useEnterKey } from '../lib/hooks';
import { scenarioResult } from '../lib/scenario';
import { useLearner } from '../store/useLearner';

type ChoiceStep = Extract<ScenarioStep, { kind: 'choice' }>;
type Aids = { pinyin: boolean; translation: boolean };

function BubbleText({ line, aids }: { line: ScenarioLine; aids: Aids }) {
  return (
    <>
      {aids.pinyin && <p className="bubble__pinyin">{line.pinyin}</p>}
      {aids.translation && <p className="bubble__translation">{line.translation}</p>}
    </>
  );
}

function Bubble({
  line,
  audioId,
  mine = false,
  aids,
}: {
  line: ScenarioLine;
  audioId?: string;
  mine?: boolean;
  aids: Aids;
}) {
  return (
    <div className={`bubble${mine ? ' bubble--mine' : ''}`}>
      <div className="bubble__head">
        <p className="bubble__hanzi" lang="zh-Hans">
          {line.hanzi}
        </p>
        {!mine && audioId && (
          <AudioButton
            text={line.hanzi}
            label="la frase"
            src={audioUrl('scenarios', audioId)}
            compact
          />
        )}
      </div>
      <BubbleText line={line} aids={aids} />
    </div>
  );
}

function Summary({
  scenario,
  mistakes,
  onRetry,
}: {
  scenario: Scenario;
  mistakes: number;
  onRetry: () => void;
}) {
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="check" size={28} />
      </span>
      <p className="eyebrow">Situación completada</p>
      <h1>{scenario.title}</h1>
      <p className="scenario-done__lead">
        Has practicado: {scenario.goal.toLowerCase()}. Vuelve cuando quieras: la conversación no se
        agota en una pasada.
      </p>
      <p className="scenario-done__result">{scenarioResult(mistakes)}</p>
      <div className="scenario-done__actions">
        <button type="button" className="button button--primary" onClick={onRetry}>
          Repetir la escena
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => navigate('/situaciones')}
        >
          Otras situaciones
        </button>
      </div>
    </section>
  );
}

function OptionButton({
  option,
  index,
  picked,
  wrong,
  onPick,
  aids,
}: {
  option: ScenarioOption;
  index: number;
  picked: number | null;
  wrong: number[];
  onPick: (index: number, correct: boolean) => void;
  aids: Aids;
}) {
  const chosen = picked === index;
  const missed = wrong.includes(index);
  return (
    <button
      type="button"
      className={`choice__option${chosen ? ' is-correct' : ''}${missed ? ' is-wrong' : ''}`}
      disabled={picked !== null || missed}
      onClick={() => onPick(index, option.correct)}
    >
      <span className="choice__hanzi" lang="zh-Hans">
        {option.hanzi}
      </span>
      {aids.pinyin && <span className="choice__pinyin">{option.pinyin}</span>}
      {aids.translation && <span className="choice__meaning">{option.translation}</span>}
    </button>
  );
}

function ChoiceResult({
  step,
  picked,
  wrong,
  last,
  onNext,
}: {
  step: ChoiceStep;
  picked: number | null;
  wrong: number[];
  last: boolean;
  onNext: () => void;
}) {
  const lastWrong = wrong.length > 0 ? wrong[wrong.length - 1] : null;
  useEnterKey(onNext, picked !== null);
  return (
    <>
      {picked !== null && (
        <p className="choice__feedback is-correct">{step.options[picked].feedback}</p>
      )}
      {picked === null && lastWrong !== null && (
        <p className="choice__feedback is-wrong">{step.options[lastWrong].feedback}</p>
      )}
      {picked === null && <p className="choice__hint">Teclas 1–3 para elegir</p>}
      {picked !== null && (
        <div className="chat__advance">
          <button type="button" className="button button--primary" onClick={onNext}>
            {last ? 'Ver resumen' : 'Continuar'}
          </button>
        </div>
      )}
    </>
  );
}

function ChoiceOptions({
  step,
  picked,
  wrong,
  onPick,
  aids,
}: {
  step: ChoiceStep;
  picked: number | null;
  wrong: number[];
  onPick: (index: number, correct: boolean) => void;
  aids: Aids;
}) {
  return (
    <div className="choice__options">
      {step.options.map((option, index) => (
        <OptionButton
          key={option.hanzi}
          option={option}
          index={index}
          picked={picked}
          wrong={wrong}
          onPick={onPick}
          aids={aids}
        />
      ))}
    </div>
  );
}

function Choice({
  step,
  audioId,
  picked,
  wrong,
  last,
  onPick,
  onNext,
  aids,
}: {
  step: ChoiceStep;
  audioId: string;
  picked: number | null;
  wrong: number[];
  last: boolean;
  onPick: (index: number, correct: boolean) => void;
  onNext: () => void;
  aids: Aids;
}) {
  return (
    <div className="choice">
      <Bubble line={step.prompt} audioId={audioId} aids={aids} />
      <p className="choice__prompt">Elige tu respuesta</p>
      <ChoiceOptions step={step} picked={picked} wrong={wrong} onPick={onPick} aids={aids} />
      <ChoiceResult step={step} picked={picked} wrong={wrong} last={last} onNext={onNext} />
    </div>
  );
}

function LineStep({
  line,
  audioId,
  last,
  onNext,
  aids,
}: {
  line: ScenarioLine;
  audioId: string;
  last: boolean;
  onNext: () => void;
  aids: Aids;
}) {
  useEnterKey(onNext);
  return (
    <>
      <Bubble line={line} audioId={audioId} aids={aids} />
      <div className="chat__advance">
        <button type="button" className="button button--primary" onClick={onNext}>
          {last ? 'Ver resumen' : 'Continuar'}
        </button>
      </div>
    </>
  );
}

function HistoryStep({
  scenario,
  step,
  answer,
  aids,
}: {
  scenario: Scenario;
  step: ScenarioStep;
  answer?: number;
  aids: Aids;
}) {
  if (step.kind === 'line') {
    return <Bubble line={step.line} audioId={`${scenario.id}-${step.line.id}`} aids={aids} />;
  }
  return (
    <>
      <Bubble line={step.prompt} audioId={`${scenario.id}-${step.prompt.id}`} aids={aids} />
      {answer !== undefined && (
        <Bubble line={{ id: 'answer', speaker: 'yo', ...step.options[answer] }} mine aids={aids} />
      )}
    </>
  );
}

function History({
  scenario,
  index,
  answers,
  aids,
}: {
  scenario: Scenario;
  index: number;
  answers: number[];
  aids: Aids;
}) {
  return (
    <>
      {scenario.steps.slice(0, index).map((step, stepIndex) => (
        <HistoryStep
          key={step.kind === 'line' ? step.line.id : step.prompt.id}
          scenario={scenario}
          step={step}
          answer={answers[stepIndex]}
          aids={aids}
        />
      ))}
    </>
  );
}

function useChoiceKeys(
  step: ScenarioStep | undefined,
  picked: number | null,
  wrong: number[],
  onPick: (index: number, correct: boolean) => void,
) {
  useEffect(() => {
    if (!step || step.kind !== 'choice' || picked !== null) return;
    const onKey = (event: KeyboardEvent) => {
      if (!/^[1-3]$/.test(event.key)) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      const optionIndex = Number(event.key) - 1;
      const option = step.options[optionIndex];
      if (!option || wrong.includes(optionIndex)) return;
      event.preventDefault();
      onPick(optionIndex, option.correct);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, picked, wrong, onPick]);
}

function useScenarioPlay(scenario: Scenario) {
  const complete = useLearner((state) => state.completeScenario);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const endRef = useRef<HTMLDivElement | null>(null);
  const step = scenario.steps[index];

  const pick = (optionIndex: number, correct: boolean) => {
    if (picked !== null) return;
    if (!correct) {
      setWrong([...wrong, optionIndex]);
      setMistakes(mistakes + 1);
      return;
    }
    setPicked(optionIndex);
    setAnswers((previous) => {
      const copy = [...previous];
      copy[index] = optionIndex;
      return copy;
    });
  };

  useChoiceKeys(step, picked, wrong, pick);

  const next = () => {
    if (index + 1 >= scenario.steps.length) complete(scenario.id);
    setIndex(index + 1);
    setPicked(null);
    setWrong([]);
  };

  const reset = () => {
    setIndex(0);
    setAnswers([]);
    setPicked(null);
    setWrong([]);
    setMistakes(0);
  };

  return { index, answers, picked, wrong, mistakes, endRef, step, pick, next, reset };
}

function AidsBar({ aids, onToggle }: { aids: Aids; onToggle: (key: keyof Aids) => void }) {
  return (
    <div className="scenario__tools" role="group" aria-label="Ayudas de lectura">
      <span className="scenario__tools-label">Ayudas</span>
      <button
        type="button"
        className={`scenario__tool${aids.pinyin ? ' is-on' : ''}`}
        aria-pressed={aids.pinyin}
        onClick={() => onToggle('pinyin')}
      >
        Pinyin
      </button>
      <button
        type="button"
        className={`scenario__tool${aids.translation ? ' is-on' : ''}`}
        aria-pressed={aids.translation}
        onClick={() => onToggle('translation')}
      >
        Traducción
      </button>
    </div>
  );
}

type StepProps = {
  scenario: Scenario;
  index: number;
  step: ScenarioStep;
  picked: number | null;
  wrong: number[];
  aids: Aids;
  onPick: (index: number, correct: boolean) => void;
  onNext: () => void;
};

function CurrentStep({ scenario, index, step, picked, wrong, aids, onPick, onNext }: StepProps) {
  const last = index + 1 === scenario.steps.length;
  return (
    <div className="chat__current" aria-live="polite">
      {step.kind === 'line' ? (
        <LineStep
          line={step.line}
          audioId={`${scenario.id}-${step.line.id}`}
          last={last}
          onNext={onNext}
          aids={aids}
        />
      ) : (
        <Choice
          step={step}
          audioId={`${scenario.id}-${step.prompt.id}`}
          picked={picked}
          wrong={wrong}
          last={last}
          onPick={onPick}
          onNext={onNext}
          aids={aids}
        />
      )}
    </div>
  );
}

function ScenarioChat({
  scenario,
  index,
  answers,
  step,
  picked,
  wrong,
  aids,
  onPick,
  onNext,
  endRef,
}: {
  scenario: Scenario;
  index: number;
  answers: number[];
  step: ScenarioStep;
  picked: number | null;
  wrong: number[];
  aids: Aids;
  onPick: (index: number, correct: boolean) => void;
  onNext: () => void;
  endRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="chat">
      <History scenario={scenario} index={index} answers={answers} aids={aids} />
      <CurrentStep
        scenario={scenario}
        index={index}
        step={step}
        picked={picked}
        wrong={wrong}
        aids={aids}
        onPick={onPick}
        onNext={onNext}
      />
      <div ref={endRef} />
    </div>
  );
}

function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const { index, answers, picked, wrong, mistakes, endRef, step, pick, next, reset } =
    useScenarioPlay(scenario);
  const [aids, setAids] = useState<Aids>({ pinyin: true, translation: true });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [index, picked, wrong.length, endRef]);

  if (!step) return <Summary scenario={scenario} mistakes={mistakes} onRetry={reset} />;

  return (
    <div className="scenario">
      <SessionHeader
        label={scenario.place}
        count={`${index + 1} / ${scenario.steps.length}`}
        onExit={() => navigate('/situaciones')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / scenario.steps.length) * 100}%` }} />
      </div>
      <div className="scenario__meta">
        <p className="scenario__goal">{scenario.goal}</p>
        <AidsBar aids={aids} onToggle={(key) => setAids({ ...aids, [key]: !aids[key] })} />
      </div>
      <ScenarioChat
        scenario={scenario}
        index={index}
        answers={answers}
        step={step}
        picked={picked}
        wrong={wrong}
        aids={aids}
        onPick={pick}
        onNext={next}
        endRef={endRef}
      />
    </div>
  );
}

function ScenarioCard({ scenario, complete }: { scenario: Scenario; complete: boolean }) {
  const decisions = scenario.steps.filter((step) => step.kind === 'choice').length;
  return (
    <a
      className="scenario-card"
      href={`#/situaciones/${scenario.id}`}
      aria-label={`${scenario.title}: ${scenario.goal}${complete ? ', completada' : ''}`}
    >
      <span className="scenario-card__top">
        <span className="scenario-card__meta">
          HSK {scenario.level} · {scenario.place}
        </span>
        {complete && (
          <span className="scenario-card__done">
            <Icon name="check" size={13} /> Hecha
          </span>
        )}
      </span>
      <span className="scenario-card__title">{scenario.title}</span>
      <span className="scenario-card__goal">{scenario.goal}</span>
      <span className="scenario-card__meta">
        {scenario.minutes} min · {decisions} decisiones
      </span>
      <span className="scenario-card__cta">
        {complete ? 'Repetir' : 'Entrar'} <Icon name="arrow" size={14} />
      </span>
    </a>
  );
}

export function Scenarios() {
  const done = useLearner((state) => state.scenarios);
  return (
    <section className="scenarios">
      <PageHeader
        eyebrow="Situaciones"
        title="Habla antes de sentirte listo"
        lead="Diálogos cortos con una decisión en cada paso. Elige tu respuesta, escucha la reacción y vuelve a intentarlo sin castigo."
        aside={
          <Badge
            tone={done.length === SCENARIOS.length ? 'mint' : 'amber'}
            icon={<Icon name="check" size={14} />}
          >
            {done.length} de {SCENARIOS.length}
          </Badge>
        }
      />
      <div className="scenario-grid">
        {SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            complete={done.includes(scenario.id)}
          />
        ))}
      </div>
    </section>
  );
}

export function ScenarioView({ scenarioId }: { scenarioId: string }) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioId);
  if (!scenario) {
    return (
      <section className="empty">
        <h1>Situación no encontrada</h1>
        <div className="empty__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/situaciones')}
          >
            Ver situaciones
          </button>
        </div>
      </section>
    );
  }
  return <ScenarioPlayer key={scenario.id} scenario={scenario} />;
}
