import { useEffect, useRef, useState, type RefObject } from 'react';
import { SessionHeader } from '../components/SessionHeader';
import { Bubble } from '../components/scenario/Bubble';
import { Choice } from '../components/scenario/Choice';
import { ScenarioSummary } from '../components/scenario/ScenarioSummary';
import type { Aids } from '../components/scenario/aids';
import type { Scenario, ScenarioLine, ScenarioStep } from '../data/scenarios';
import { useEnterKey } from '../lib/hooks';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

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

export function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const { index, answers, picked, wrong, mistakes, endRef, step, pick, next, reset } =
    useScenarioPlay(scenario);
  const [aids, setAids] = useState<Aids>({ pinyin: true, translation: true });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [index, picked, wrong.length, endRef]);

  if (!step) return <ScenarioSummary scenario={scenario} mistakes={mistakes} onRetry={reset} />;

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
