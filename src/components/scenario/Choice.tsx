import { useEnterKey } from '../../lib/hooks';
import type { ScenarioOption, ScenarioStep } from '../../data/scenarios';
import { Bubble } from './Bubble';
import type { Aids } from './aids';

type ChoiceStep = Extract<ScenarioStep, { kind: 'choice' }>;

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

export function Choice({
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
