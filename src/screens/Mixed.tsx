import { useEffect, useMemo, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { BossResult } from '../components/BossResult';
import { SessionHeader } from '../components/SessionHeader';
import { Icon } from '../components/ui/Icon';
import { WORDS_BY_ID, type Level } from '../data/curriculum';
import { audioUrl } from '../lib/audio';
import { BOSS_QUESTIONS, bossWordIds, isBossPassed } from '../lib/boss';
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

function useSessionQuestions(params: {
  errors: boolean;
  seed: number;
  studied: string[];
  misses: Record<string, { reason: MissReason; at: number }>;
  bossLevel?: Level;
}) {
  const { errors, seed, studied, misses, bossLevel } = params;
  return useMemo(() => {
    if (bossLevel) return makeMixed(bossWordIds(bossLevel), seed, BOSS_QUESTIONS);
    return errors ? makeErrorSession(misses, seed, 10) : makeMixed(studied, seed, 10);
  }, [bossLevel, errors, misses, seed, studied]);
}

function useMixedRun(params: {
  errors: boolean;
  bossLevel?: Level;
  studied: string[];
  misses: Record<string, { reason: MissReason; at: number }>;
}) {
  const { errors, bossLevel, studied, misses } = params;
  const [seed, setSeed] = useState(() => Date.now() % 1_000_000);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const questions = useSessionQuestions({ errors, seed, studied, misses, bossLevel });

  const retry = () => {
    setSeed(Date.now() % 1_000_000);
    setIndex(0);
    setScore(0);
  };

  const answer = (correct: boolean) => {
    const kind = bossLevel ? 'boss' : errors ? 'errors' : 'mixed';
    useLearner.getState().logActivity(kind, correct, Date.now(), questions[index].wordId);
    if (correct) setScore(score + 1);
    setIndex(index + 1);
  };

  return { seed, index, score, questions, retry, answer };
}

function useBossResult(
  bossLevel: Level | undefined,
  finished: boolean,
  score: number,
  total: number,
): boolean {
  const record = useLearner((s) => s.recordCertificate);
  const passed = bossLevel ? isBossPassed(score, total) : false;
  useEffect(() => {
    if (bossLevel && finished && passed) record(bossLevel, score, total);
  }, [bossLevel, finished, passed, record, score, total]);
  return passed;
}

function useStudiedWords(): string[] {
  const log = useLearner((s) => s.log);
  return useMemo(() => [...new Set(log.map((entry) => entry.wordId))], [log]);
}

function useCertificate(level?: Level) {
  return useLearner((s) => (level ? s.certificates[String(level)] : undefined));
}

function sessionLabel(errors: boolean, bossLevel?: Level): string {
  if (bossLevel) return `Jefe HSK ${bossLevel}`;
  return errors ? 'Tus fallos' : 'Sesión mixta';
}

function BossEnd({
  level,
  score,
  total,
  certificate,
  passed,
  onRetry,
}: {
  level: Level;
  score: number;
  total: number;
  certificate?: { at: number };
  passed: boolean;
  onRetry: () => void;
}) {
  return (
    <BossResult
      level={level}
      score={score}
      total={total}
      at={certificate?.at ?? Date.now()}
      passed={passed}
      onRetry={onRetry}
    />
  );
}

export function Mixed({ errors = false, bossLevel }: { errors?: boolean; bossLevel?: Level }) {
  const misses = useLearner((s) => s.misses);
  const studied = useStudiedWords();
  const certificate = useCertificate(bossLevel);
  const run = useMixedRun({ errors, bossLevel, studied, misses });
  const finished = run.index >= run.questions.length;
  const passed = useBossResult(bossLevel, finished, run.score, run.questions.length);

  if (run.questions.length === 0) return <Empty errors={errors} />;
  if (finished) {
    if (bossLevel) {
      return (
        <BossEnd
          level={bossLevel}
          score={run.score}
          total={run.questions.length}
          certificate={certificate}
          passed={passed}
          onRetry={run.retry}
        />
      );
    }
    return (
      <Summary score={run.score} total={run.questions.length} errors={errors} onRetry={run.retry} />
    );
  }
  return (
    <Question
      key={`${run.seed}-${run.index}`}
      item={run.questions[run.index]}
      index={run.index}
      total={run.questions.length}
      label={sessionLabel(errors, bossLevel)}
      onAnswer={run.answer}
    />
  );
}
