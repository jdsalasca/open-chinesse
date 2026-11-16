import { useEffect, useRef, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { PageHeader } from '../components/PageHeader';
import { SessionHeader } from '../components/SessionHeader';
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
import { useLearner } from '../store/useLearner';

type ChoiceStep = Extract<ScenarioStep, { kind: 'choice' }>;

function Bubble({
  line,
  audioId,
  mine = false,
}: {
  line: ScenarioLine;
  audioId?: string;
  mine?: boolean;
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
      <p className="bubble__pinyin">{line.pinyin}</p>
      <p className="bubble__translation">{line.translation}</p>
    </div>
  );
}

function Summary({ scenario, onRetry }: { scenario: Scenario; onRetry: () => void }) {
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
}: {
  option: ScenarioOption;
  index: number;
  picked: number | null;
  wrong: number[];
  onPick: (index: number, correct: boolean) => void;
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
      <span className="choice__pinyin">{option.pinyin}</span>
      <span className="choice__meaning">{option.translation}</span>
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
          <button type="button" className="button button--primary" onClick={onNext} autoFocus>
            {last ? 'Ver resumen' : 'Continuar'}
          </button>
        </div>
      )}
    </>
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
}: {
  step: ChoiceStep;
  audioId: string;
  picked: number | null;
  wrong: number[];
  last: boolean;
  onPick: (index: number, correct: boolean) => void;
  onNext: () => void;
}) {
  return (
    <div className="choice">
      <Bubble line={step.prompt} audioId={audioId} />
      <p className="choice__prompt">Elige tu respuesta</p>
      <div className="choice__options">
        {step.options.map((option, index) => (
          <OptionButton
            key={option.hanzi}
            option={option}
            index={index}
            picked={picked}
            wrong={wrong}
            onPick={onPick}
          />
        ))}
      </div>
      <ChoiceResult step={step} picked={picked} wrong={wrong} last={last} onNext={onNext} />
    </div>
  );
}

function LineStep({
  line,
  audioId,
  last,
  onNext,
}: {
  line: ScenarioLine;
  audioId: string;
  last: boolean;
  onNext: () => void;
}) {
  return (
    <>
      <Bubble line={line} audioId={audioId} />
      <div className="chat__advance">
        <button type="button" className="button button--primary" onClick={onNext} autoFocus>
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
}: {
  scenario: Scenario;
  step: ScenarioStep;
  answer?: number;
}) {
  if (step.kind === 'line') {
    return <Bubble line={step.line} audioId={`${scenario.id}-${step.line.id}`} />;
  }
  return (
    <>
      <Bubble line={step.prompt} audioId={`${scenario.id}-${step.prompt.id}`} />
      {answer !== undefined && (
        <Bubble line={{ id: 'answer', speaker: 'yo', ...step.options[answer] }} mine />
      )}
    </>
  );
}

function History({
  scenario,
  index,
  answers,
}: {
  scenario: Scenario;
  index: number;
  answers: number[];
}) {
  return (
    <>
      {scenario.steps.slice(0, index).map((step, stepIndex) => (
        <HistoryStep
          key={step.kind === 'line' ? step.line.id : step.prompt.id}
          scenario={scenario}
          step={step}
          answer={answers[stepIndex]}
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
  const endRef = useRef<HTMLDivElement | null>(null);
  const step = scenario.steps[index];

  const pick = (optionIndex: number, correct: boolean) => {
    if (picked !== null) return;
    if (!correct) return setWrong([...wrong, optionIndex]);
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
  };

  return { index, answers, picked, wrong, endRef, step, pick, next, reset };
}

function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const { index, answers, picked, wrong, endRef, step, pick, next, reset } =
    useScenarioPlay(scenario);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [index, picked, wrong.length, endRef]);

  if (!step) return <Summary scenario={scenario} onRetry={reset} />;

  return (
    <div className="scenario">
      <SessionHeader
        label={scenario.place}
        count={`${index + 1} / ${scenario.steps.length}`}
        onExit={() => navigate('/situaciones')}
      />
      <p className="scenario__goal">{scenario.goal}</p>
      <div className="chat">
        <History scenario={scenario} index={index} answers={answers} />
        {step.kind === 'line' ? (
          <LineStep
            line={step.line}
            audioId={`${scenario.id}-${step.line.id}`}
            last={index + 1 === scenario.steps.length}
            onNext={next}
          />
        ) : (
          <Choice
            step={step}
            audioId={`${scenario.id}-${step.prompt.id}`}
            picked={picked}
            wrong={wrong}
            last={index + 1 === scenario.steps.length}
            onPick={pick}
            onNext={next}
          />
        )}
        <div ref={endRef} />
      </div>
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
