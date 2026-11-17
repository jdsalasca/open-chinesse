import { useMemo, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { SessionHeader } from '../components/SessionHeader';
import { Icon } from '../components/ui/Icon';
import { WORDS_BY_ID } from '../data/curriculum';
import { audioUrl } from '../lib/audio';
import { useEnterKey } from '../lib/hooks';
import { makeMixed, makeErrorSession, type MixedKind, type MixedQuestion } from '../lib/mixed';
import type { MissReason } from '../lib/miss';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

const LABEL: Record<MixedKind, string> = {
  meaning: '¿Qué significa?',
  listen: 'Escucha y elige',
  context: 'Completa la frase',
  tone: 'Elige el pinyin',
};

function PromptAudio({ question }: { question: MixedQuestion }) {
  const word = question.audioWordId ? WORDS_BY_ID.get(question.audioWordId) : undefined;
  return (
    <div className="quiz__prompt-audio">
      <AudioButton
        text={word?.hanzi ?? question.answer}
        label="la palabra"
        src={question.audioWordId ? audioUrl('words', question.audioWordId) : undefined}
      />
      <span className="quiz__dots" aria-hidden="true">
        ••••
      </span>
    </div>
  );
}

function PromptText({ question }: { question: MixedQuestion }) {
  return (
    <>
      <div
        className={question.kind === 'context' ? 'quiz__sentence' : 'quiz__hanzi'}
        lang="zh-Hans"
      >
        {question.prompt}
      </div>
      {question.translation && <p className="hint">{question.translation}</p>}
    </>
  );
}

function Prompt({ question }: { question: MixedQuestion }) {
  const isAudio = question.kind === 'listen' || question.kind === 'tone';
  return (
    <div className="quiz__prompt">
      <span className="quiz__prompt-label">{LABEL[question.kind]}</span>
      {isAudio ? <PromptAudio question={question} /> : <PromptText question={question} />}
    </div>
  );
}

function Options({
  question,
  picked,
  onPick,
}: {
  question: MixedQuestion;
  picked: string | null;
  onPick: (option: string) => void;
}) {
  return (
    <div className="quiz__options" role="group" aria-label="Opciones">
      {question.options.map((option) => {
        const state =
          picked === null
            ? ''
            : option === question.answer
              ? ' is-correct'
              : option === picked
                ? ' is-wrong'
                : ' is-muted';
        return (
          <button
            key={option}
            type="button"
            className={`option${state}`}
            onClick={() => onPick(option)}
            disabled={picked !== null}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Feedback({
  question,
  picked,
  last,
  onNext,
}: {
  question: MixedQuestion;
  picked: string;
  last: boolean;
  onNext: () => void;
}) {
  useEnterKey(onNext);
  return (
    <div className="quiz__feedback">
      <p>{picked === question.answer ? 'Correcto.' : `Era: ${question.answer}.`}</p>
      <p className="hint">{question.explanation}</p>
      <button type="button" className="button button--primary" onClick={onNext}>
        {last ? 'Ver resultado' : 'Siguiente'}
      </button>
    </div>
  );
}

function Question({
  item,
  index,
  total,
  label,
  onAnswer,
}: {
  item: MixedQuestion;
  index: number;
  total: number;
  label: string;
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const last = index + 1 === total;
  return (
    <div className="lesson mixed">
      <SessionHeader
        label={label}
        count={`${index + 1} / ${total}`}
        onExit={() => navigate('/practicar')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <section className="quiz" aria-live="polite">
        <Prompt question={item} />
        <Options question={item} picked={picked} onPick={setPicked} />
        {picked !== null && (
          <Feedback
            question={item}
            picked={picked}
            last={last}
            onNext={() => onAnswer(picked === item.answer)}
          />
        )}
      </section>
    </div>
  );
}

function Empty({ errors }: { errors: boolean }) {
  return (
    <section className="empty">
      <h1>{errors ? 'Todavía no hay fallos que repasar' : 'Aún no hay palabras para mezclar'}</h1>
      <p>
        {errors
          ? 'Cuando falles una palabra en una práctica, aparecerá aquí con el formato que pida el motivo.'
          : 'Termina una unidad: la sesión mezcla palabras que ya hayas visto.'}
      </p>
      <div className="empty__actions">
        <button type="button" className="button button--primary" onClick={() => navigate('/')}>
          {errors ? 'Ir a practicar' : 'Ir a las unidades'}
        </button>
      </div>
    </section>
  );
}

function Summary({
  score,
  total,
  errors,
  onRetry,
}: {
  score: number;
  total: number;
  errors: boolean;
  onRetry: () => void;
}) {
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="check" size={28} />
      </span>
      <p className="eyebrow">{errors ? 'Tus fallos' : 'Sesión mixta'}</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="scenario-done__lead">
        {errors
          ? 'Vuelves a las palabras que fallaste, con el formato que pide cada error. El repaso normal las sigue viendo.'
          : 'Significado, escucha, contexto y tonos en la misma tanda. Mezclar tipos de recuperación entrena la memoria para la vida real.'}
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

function useSessionQuestions(
  errors: boolean,
  seed: number,
  studied: string[],
  misses: Record<string, { reason: MissReason; at: number }>,
) {
  return useMemo(
    () => (errors ? makeErrorSession(misses, seed, 10) : makeMixed(studied, seed, 10)),
    [errors, misses, seed, studied],
  );
}

function useStudiedWords(): string[] {
  const log = useLearner((s) => s.log);
  return useMemo(() => [...new Set(log.map((entry) => entry.wordId))], [log]);
}

export function Mixed({ errors = false }: { errors?: boolean }) {
  const misses = useLearner((s) => s.misses);
  const studied = useStudiedWords();
  const [seed, setSeed] = useState(() => Date.now() % 1_000_000);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const questions = useSessionQuestions(errors, seed, studied, misses);
  const label = errors ? 'Tus fallos' : 'Sesión mixta';
  if (questions.length === 0) return <Empty errors={errors} />;
  if (index >= questions.length) {
    return (
      <Summary
        score={score}
        total={questions.length}
        errors={errors}
        onRetry={() => {
          setSeed(Date.now() % 1_000_000);
          setIndex(0);
          setScore(0);
        }}
      />
    );
  }
  return (
    <Question
      key={`${seed}-${index}`}
      item={questions[index]}
      index={index}
      total={questions.length}
      label={label}
      onAnswer={(correct) => {
        useLearner
          .getState()
          .logActivity(errors ? 'errors' : 'mixed', correct, Date.now(), questions[index].wordId);
        if (correct) setScore(score + 1);
        setIndex(index + 1);
      }}
    />
  );
}
