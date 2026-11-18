import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { AudioButton } from '../components/AudioButton';
import { CharacterLinks } from '../components/CharacterLinks';
import { ExampleBlock } from '../components/ExampleBlock';
import { MissPicker } from '../components/MissPicker';
import { OrderExercise } from '../components/OrderExercise';
import { Pinyin } from '../components/Pinyin';
import { Confetti } from '../components/ui/Confetti';
import { Icon, type IconName } from '../components/ui/Icon';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ALL_WORDS, LEVEL_LABELS, UNITS, type Unit, type Word } from '../data/curriculum';
import { starsForScore, xpForLesson } from '../gamification/xp';
import { LESSON_PARTS, makeLessonPlan, type LessonStep } from '../lib/lesson';
import { CLOZE_BLANK } from '../lib/cloze';
import type { Question } from '../lib/quiz';
import { audioUrl } from '../lib/audio';
import { playComplete, playCorrect, playWrong } from '../lib/sfx';
import { SessionNext } from '../components/SessionNext';
import { SessionHeader } from '../components/SessionHeader';
import { useDailySession } from '../store/daily-session';
import { useEnterKey } from '../lib/hooks';
import { navigate } from '../lib/router';
import type { MissReason } from '../lib/miss';
import { useLearner } from '../store/useLearner';

type LessonAnswer = { wordId: string; correct: boolean };

type LessonProgress = {
  index: number;
  setIndex: (index: number) => void;
  answers: LessonAnswer[];
  setAnswers: Dispatch<SetStateAction<LessonAnswer[]>>;
  selected: string | null;
  setSelected: (selected: string | null) => void;
};

function useLessonPlan(unit: Unit | undefined): LessonStep[] {
  const [variant] = useState(() => Math.floor(Date.now() / 86400000));
  return useMemo(() => (unit ? makeLessonPlan(unit, variant) : []), [unit, variant]);
}

function useLessonProgress(): LessonProgress {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<LessonAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  return {
    index,
    setIndex,
    answers,
    setAnswers,
    selected,
    setSelected,
  };
}

function useIntroduceUnit(unit: Unit | undefined, introduceUnit: (unitId: string) => void): void {
  useEffect(() => {
    if (unit) introduceUnit(unit.id);
  }, [unit, introduceUnit]);
}

function useLessonRecord(
  unit: Unit | undefined,
  done: boolean,
  answers: LessonAnswer[],
  recordLesson: (unitId: string, correct: number, total: number) => void,
): void {
  const recorded = useRef(false);
  useEffect(() => {
    if (!done || !unit || recorded.current) return;
    recorded.current = true;
    recordLesson(
      unit.id,
      answers.filter((answer) => answer.correct).length,
      Math.max(answers.length, 1),
    );
  }, [done, unit, answers, recordLesson]);
}

function useLessonFinish(done: boolean, answers: LessonAnswer[]): void {
  useEffect(() => {
    if (!done) return;
    const correct = answers.filter((answer) => answer.correct).length;
    if (starsForScore(correct, Math.max(answers.length, 1)) === 3) playComplete();
    useDailySession.getState().finish('lesson');
  }, [done, answers]);
}

type LessonActionsParams = {
  plan: LessonStep[];
  progress: LessonProgress;
  noteMiss: (wordId: string, reason: MissReason) => void;
};

function useLessonActions({ plan, progress, noteMiss }: LessonActionsParams) {
  const { index, setIndex, setAnswers, selected, setSelected } = progress;
  const step = plan[index];

  const finish = (correct: boolean) => {
    if (!step || step.kind !== 'question') return;
    if (!correct && step.question.mode === 'order') noteMiss(step.question.wordId, 'order');
    setAnswers((prev) => [...prev, { wordId: step.question.wordId, correct }]);
    setSelected(null);
    setIndex(index + 1);
  };

  const next = () => {
    if (!step) return;
    if (step.kind === 'learn' || step.kind === 'review') {
      setSelected(null);
      return setIndex(index + 1);
    }
    if (selected !== null) finish(selected === step.question.answer);
  };

  const choose = (option: string) => {
    if (!step || step.kind !== 'question' || selected !== null) return;
    setSelected(option);
    if (option === step.question.answer) playCorrect();
    else playWrong();
  };

  const orderMode = step?.kind === 'question' && step.question.mode === 'order';
  useEnterKey(next, Boolean(step) && !orderMode);
  return { next, choose, finish };
}

function LessonProgress({ round, total }: { round: number; total: number }) {
  return (
    <div className="lesson-progress" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => {
        const state = index + 1 < round ? ' is-done' : index + 1 === round ? ' is-current' : '';
        return <span key={index} className={`lesson-progress__seg${state}`} />;
      })}
    </div>
  );
}

function LessonHeader({
  label,
  count,
  round,
  totalRounds,
  goal,
}: {
  label: string;
  count: string;
  round: number;
  totalRounds: number;
  goal?: string;
}) {
  return (
    <>
      <SessionHeader label={label} count={count} onExit={() => navigate('/')} />
      <LessonProgress round={round} total={totalRounds} />
      {goal && <p className="lesson__goal">{goal}</p>}
    </>
  );
}

function FlashcardWord({
  word,
  round,
  totalRounds,
  showToneNote,
}: {
  word: Word;
  round: number;
  totalRounds: number;
  showToneNote: boolean;
}) {
  return (
    <div className="flashcard__word">
      <p className="flashcard__step">
        Parte {round} de {totalRounds} · Primer contacto
      </p>
      <div className="flashcard__hanzi" lang="zh-Hans">
        {word.hanzi}
      </div>
      <div className="flashcard__row">
        <Pinyin pinyin={word.pinyin} className="flashcard__pinyin" showToneNumber />
        <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
      </div>
      {showToneNote && (
        <p className="flashcard__tone-note">
          Tonos: <span className="tone-1">1 alto</span> · <span className="tone-2">2 sube</span> ·{' '}
          <span className="tone-3">3 baja-sube</span> · <span className="tone-4">4 cae</span> ·{' '}
          <span className="tone-5">5 neutro</span>
        </p>
      )}
      <p className="flashcard__speak">Escucha y repite en voz alta.</p>
      <CharacterLinks hanzi={word.hanzi} />
    </div>
  );
}

function Flashcard({
  word,
  round,
  totalRounds,
  showToneNote,
}: {
  word: Word;
  round: number;
  totalRounds: number;
  showToneNote: boolean;
}) {
  return (
    <article className="flashcard" aria-live="polite">
      <span className="flashcard__ghost" aria-hidden="true" lang="zh-Hans">
        {word.hanzi}
      </span>
      <FlashcardWord
        word={word}
        round={round}
        totalRounds={totalRounds}
        showToneNote={showToneNote}
      />
      <div className="flashcard__context">
        <p className="flashcard__meaning">{word.meaning}</p>
        <ExampleBlock word={word} />
      </div>
    </article>
  );
}

function LearnActions({
  nextKind,
  next,
}: {
  nextKind: LessonStep['kind'] | undefined;
  next: () => void;
}) {
  return (
    <div className="lesson__actions">
      <button type="button" className="button button--primary" onClick={next}>
        {nextKind === 'review'
          ? 'Repasar la parte'
          : nextKind === 'question'
            ? 'Comprobar lo aprendido'
            : 'Siguiente palabra'}
      </button>
      <span className="hint">Lee el ejemplo y sigue cuando quieras.</span>
    </div>
  );
}

function LearnHeader({
  unit,
  wordIndex,
  round,
  totalRounds,
}: {
  unit: Unit;
  wordIndex: number;
  round: number;
  totalRounds: number;
}) {
  return (
    <LessonHeader
      label={`${LEVEL_LABELS[unit.level]} · ${unit.title}`}
      count={`${wordIndex + 1} / ${unit.words.length}`}
      round={round}
      totalRounds={totalRounds}
      goal={`Objetivo: ${unit.subtitle}`}
    />
  );
}

function LearnPhase({
  unit,
  wordId,
  part,
  nextKind,
  next,
}: {
  unit: Unit;
  wordId: string;
  part: number;
  nextKind: LessonStep['kind'] | undefined;
  next: () => void;
}) {
  const wordIndex = unit.words.findIndex((word) => word.id === wordId);
  const word = unit.words[wordIndex];
  if (!word) return <LessonMissing />;
  return (
    <div className="lesson">
      <LearnHeader unit={unit} wordIndex={wordIndex} round={part} totalRounds={LESSON_PARTS} />
      <Flashcard
        word={word}
        round={part}
        totalRounds={LESSON_PARTS}
        showToneNote={wordIndex === 0}
      />
      <LearnActions nextKind={nextKind} next={next} />
    </div>
  );
}

function GapSentence({ prompt }: { prompt: string }) {
  const [before, ...rest] = prompt.split(CLOZE_BLANK);
  return (
    <>
      {before}
      <span className="quiz__blank" role="img" aria-label="palabra que falta" />
      {rest.join(CLOZE_BLANK)}
    </>
  );
}

function PromptLabel({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <span className="quiz__prompt-label">
      <span className="quiz__prompt-icon" aria-hidden="true">
        <Icon name={icon} size={14} />
      </span>
      {children}
    </span>
  );
}

function GapPrompt({ question }: { question: Question }) {
  return (
    <div className="quiz__prompt">
      <PromptLabel icon="chat">Completa la frase</PromptLabel>
      <p className="quiz__sentence" lang="zh-Hans">
        <GapSentence prompt={question.prompt ?? ''} />
      </p>
      {question.translation && <p className="quiz__translation">{question.translation}</p>}
    </div>
  );
}

function AudioPrompt({ label, word, note }: { label: string; word: Word; note?: string }) {
  const icon: IconName = note ? 'sparkles' : 'speaker';
  return (
    <div className="quiz__prompt">
      <PromptLabel icon={icon}>{label}</PromptLabel>
      <div className="quiz__prompt-audio">
        <AudioButton text={word.hanzi} label="la palabra" src={audioUrl('words', word.id)} />
        <span className="quiz__dots" aria-hidden="true">
          ••••
        </span>
      </div>
      {note && <p className="quiz__translation">{note}</p>}
    </div>
  );
}

function MeaningPrompt({ word }: { word: Word }) {
  return (
    <div className="quiz__prompt">
      <PromptLabel icon="book">¿Qué significa?</PromptLabel>
      <div className="quiz__hanzi" lang="zh-Hans">
        {word.hanzi}
      </div>
      <div className="quiz__audio">
        <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
        <Pinyin pinyin={word.pinyin} />
      </div>
    </div>
  );
}

function QuizPrompt({ question, word }: { question: Question; word: Word }) {
  if (question.mode === 'order') {
    return (
      <div className="quiz__prompt">
        <PromptLabel icon="arrow">Ordena la frase</PromptLabel>
      </div>
    );
  }
  if (question.mode === 'gap') return <GapPrompt question={question} />;
  if (question.mode === 'tone') {
    return (
      <AudioPrompt
        label="Escucha y elige el pinyin"
        word={word}
        note="Fíjate en la marca del tono."
      />
    );
  }
  if (question.mode === 'listen') return <AudioPrompt label="Escucha y elige" word={word} />;
  return <MeaningPrompt word={word} />;
}

function OptionText({ option, mode }: { option: string; mode: Question['mode'] }) {
  if (mode === 'tone') return <Pinyin pinyin={option} />;
  return <span lang={mode === 'gap' ? 'zh-Hans' : undefined}>{option}</span>;
}

type OptionState = { className: string; mark: 'correct' | 'wrong' | null };

function optionState(option: string, answer: string, selected: string | null): OptionState {
  if (selected === null) return { className: '', mark: null };
  if (option === answer) return { className: ' is-correct', mark: 'correct' };
  if (option === selected) return { className: ' is-wrong', mark: 'wrong' };
  return { className: ' is-muted', mark: null };
}

function OptionMark({ mark }: { mark: OptionState['mark'] }) {
  if (mark === 'correct') {
    return (
      <span className="option__mark is-correct" aria-hidden="true">
        <Icon name="check" size={15} />
      </span>
    );
  }
  if (mark === 'wrong') {
    return (
      <span className="option__mark is-wrong" aria-hidden="true">
        ×
      </span>
    );
  }
  return null;
}

type QuizOptionsProps = {
  options: string[];
  answer: string;
  mode: Question['mode'];
  selected: string | null;
  onPick: (option: string) => void;
};

function QuizOptions({ options, answer, mode, selected, onPick }: QuizOptionsProps) {
  return (
    <div className="quiz__options" role="group" aria-label="Opciones">
      {options.map((option) => {
        const state = optionState(option, answer, selected);
        return (
          <button
            key={option}
            type="button"
            className={`option${state.className}`}
            onClick={() => onPick(option)}
            disabled={selected !== null}
          >
            <span className="option__label">
              <OptionText option={option} mode={mode} />
            </span>
            <OptionMark mark={state.mark} />
          </button>
        );
      })}
    </div>
  );
}

function QuizContrast({
  selected,
  answer,
  mode,
}: {
  selected: string | null;
  answer: string;
  mode: Question['mode'];
}) {
  const correct = selected === answer;
  return (
    <div className="quiz__contrast">
      {!correct && selected !== null && (
        <div className="quiz__contrast-row is-wrong">
          <span>Elegiste</span>
          <strong>
            <OptionText option={selected} mode={mode} />
          </strong>
        </div>
      )}
      <div className="quiz__contrast-row is-correct">
        <span>{correct ? 'Correcto' : 'Respuesta'}</span>
        <strong>
          <OptionText option={answer} mode={mode} />
        </strong>
      </div>
    </div>
  );
}

function verdictFor(question: Question, word: Word, correct: boolean): string {
  if (question.mode === 'tone') {
    return correct
      ? `Correcto: se oye ${word.pinyin} (${word.meaning}).`
      : `Era ${word.pinyin}: ${word.meaning}.`;
  }
  if (question.mode === 'gap') {
    return correct
      ? `Correcto: falta ${word.hanzi} (${word.meaning}).`
      : `Era ${word.hanzi}: ${word.meaning}.`;
  }
  return correct ? `Correcto: ${word.hanzi} significa ${word.meaning}.` : `Era ${word.meaning}.`;
}

function QuizFeedback({
  question,
  word,
  selected,
  onNext,
  onMiss,
  last,
}: {
  question: Question;
  word: Word;
  selected: string | null;
  onNext: () => void;
  onMiss: (reason: MissReason) => void;
  last: boolean;
}) {
  const correct = selected === question.answer;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest' });
  }, []);
  return (
    <div className="quiz__feedback" ref={ref}>
      <div className={`quiz__result${correct ? ' is-correct' : ' is-wrong'}`} role="status">
        <span className="quiz__result-icon" aria-hidden="true">
          {correct ? <Icon name="check" size={16} /> : '×'}
        </span>
        <p className="quiz__verdict">{verdictFor(question, word, correct)}</p>
      </div>
      <QuizContrast selected={selected} answer={question.answer} mode={question.mode} />
      <ExampleBlock word={word} />
      {question.mode === 'tone' && (
        <p className="quiz__why">El tono cambia el significado: escucha la marca.</p>
      )}
      {!correct && <MissPicker key={`${word.id}-${question.mode}`} onPick={onMiss} />}
      <button type="button" className="button button--primary" onClick={onNext}>
        {last ? 'Terminar' : 'Siguiente'}
      </button>
    </div>
  );
}

function OrderStage({
  question,
  word,
  last,
  onFinish,
}: {
  question: Question;
  word: Word;
  last: boolean;
  onFinish: (correct: boolean) => void;
}) {
  return (
    <>
      <QuizPrompt question={question} word={word} />
      <OrderExercise
        key={question.wordId}
        chunks={question.options}
        sentence={word.example.hanzi}
        translation={word.example.translation}
        last={last}
        onNext={onFinish}
      />
    </>
  );
}

function ChoiceStage({
  question,
  word,
  selected,
  last,
  onSelect,
  onNext,
  onMiss,
}: {
  question: Question;
  word: Word;
  selected: string | null;
  last: boolean;
  onSelect: (option: string) => void;
  onNext: () => void;
  onMiss: (reason: MissReason) => void;
}) {
  return (
    <>
      <QuizPrompt question={question} word={word} />
      <QuizOptions
        options={question.options}
        answer={question.answer}
        mode={question.mode}
        selected={selected}
        onPick={onSelect}
      />
      {selected !== null && (
        <QuizFeedback
          question={question}
          word={word}
          selected={selected}
          onNext={onNext}
          onMiss={onMiss}
          last={last}
        />
      )}
    </>
  );
}

function QuizStage({
  question,
  word,
  selected,
  last,
  onSelect,
  onNext,
  onMiss,
  onFinish,
}: {
  question: Question;
  word: Word;
  selected: string | null;
  last: boolean;
  onSelect: (option: string) => void;
  onNext: () => void;
  onMiss: (reason: MissReason) => void;
  onFinish: (correct: boolean) => void;
}) {
  if (question.mode === 'order') {
    return <OrderStage question={question} word={word} last={last} onFinish={onFinish} />;
  }
  return (
    <ChoiceStage
      question={question}
      word={word}
      selected={selected}
      last={last}
      onSelect={onSelect}
      onNext={onNext}
      onMiss={onMiss}
    />
  );
}

type QuizPhaseProps = {
  question: Question;
  word: Word;
  number: number;
  total: number;
  round: number;
  totalRounds: number;
  label: string;
  selected: string | null;
  onSelect: (option: string) => void;
  onNext: () => void;
  onFinish: (correct: boolean) => void;
};

function QuizPhase({
  question,
  word,
  number,
  total,
  round,
  totalRounds,
  label,
  ...stage
}: QuizPhaseProps) {
  const noteMiss = useLearner((s) => s.noteMiss);
  return (
    <div className="lesson">
      <LessonHeader
        label={label}
        count={`${number} / ${total}`}
        round={round}
        totalRounds={totalRounds}
      />
      <section className="quiz" aria-live="polite" data-mode={question.mode}>
        <QuizStage
          question={question}
          word={word}
          last={number === total}
          onMiss={(reason) => noteMiss(word.id, reason)}
          {...stage}
        />
      </section>
    </div>
  );
}

function SummaryStars({ stars }: { stars: number }) {
  return (
    <div className="summary__stars" aria-label={`${stars} de 3 estrellas`}>
      {[1, 2, 3].map((star) => (
        <Icon key={star} name="star" size={30} filled={star <= stars} />
      ))}
    </div>
  );
}

function MissedWords({ answers }: { answers: LessonAnswer[] }) {
  const missed = [
    ...new Set(answers.filter((answer) => !answer.correct).map((answer) => answer.wordId)),
  ]
    .map((wordId) => ALL_WORDS.find((word) => word.id === wordId))
    .filter((word): word is Word => Boolean(word));
  if (missed.length === 0) return null;
  return (
    <div className="summary__review">
      <p className="eyebrow">Merece otra mirada</p>
      <ul>
        {missed.map((word) => (
          <li key={word.id}>
            <span className="summary__hanzi" lang="zh-Hans">
              {word.hanzi}
            </span>
            <span>{word.meaning}</span>
            <AudioButton
              text={word.hanzi}
              label={word.hanzi}
              src={audioUrl('words', word.id)}
              compact
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryScore({
  correct,
  total,
  stars,
}: {
  correct: number;
  total: number;
  stars: number;
}) {
  return (
    <div className="summary__score">
      <ProgressRing
        value={correct}
        max={total}
        label="Aciertos"
        caption={`de ${total}`}
        size={132}
        stroke={11}
      />
      <div className="summary__score-copy">
        <h1 className="summary__title">Lección completada</h1>
        <SummaryStars stars={stars} />
      </div>
    </div>
  );
}

function LessonSummary({ unit, answers }: { unit: Unit; answers: LessonAnswer[] }) {
  const correct = answers.filter((answer) => answer.correct).length;
  const stars = starsForScore(correct, Math.max(answers.length, 1));
  return (
    <div className="lesson">
      <section className="summary" aria-live="polite">
        {stars === 3 && <Confetti />}
        <p className="eyebrow">
          {LEVEL_LABELS[unit.level]} · {unit.title}
        </p>
        <SummaryScore correct={correct} total={answers.length} stars={stars} />
        <p className="summary__xp">+{xpForLesson(correct)} XP</p>
        <p className="summary__text">
          {correct === answers.length
            ? 'Reconociste todas. El repaso volverá a traerlas cuando toque.'
            : 'El error es parte del proceso: estas palabras volverán antes.'}
        </p>
        <MissedWords answers={answers} />
        <div className="summary__actions">
          <SessionNext from="lesson" />
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/review')}
          >
            Repasar las {unit.words.length} palabras
          </button>
          <button type="button" className="button button--ghost" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </section>
    </div>
  );
}

function LessonMissing() {
  return (
    <section className="panel">
      <h1>Unidad no encontrada</h1>
      <button type="button" className="button button--primary" onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </section>
  );
}

type StageProps = {
  unit: Unit;
  plan: LessonStep[];
  progress: LessonProgress;
  next: () => void;
};

function LearnStage({ unit, plan, progress, next }: StageProps) {
  const step = plan[progress.index];
  if (!step || step.kind !== 'learn') return null;
  return (
    <LearnPhase
      unit={unit}
      wordId={step.wordId}
      part={step.part}
      nextKind={plan[progress.index + 1]?.kind}
      next={next}
    />
  );
}

type QuestionStageProps = StageProps & {
  choose: (option: string) => void;
  finish: (correct: boolean) => void;
};

function QuestionStage({ unit, plan, progress, next, choose, finish }: QuestionStageProps) {
  const step = plan[progress.index];
  if (!step || step.kind !== 'question') return null;
  const word = ALL_WORDS.find((candidate) => candidate.id === step.question.wordId);
  if (!word) return <LessonMissing />;
  const total = plan.filter((item) => item.kind === 'question').length;
  const number = plan
    .slice(0, progress.index + 1)
    .filter((item) => item.kind === 'question').length;
  return (
    <QuizPhase
      question={step.question}
      word={word}
      number={number}
      total={total}
      round={step.part}
      totalRounds={LESSON_PARTS}
      label={
        step.question.mode === 'order'
          ? `Aplica · ${LEVEL_LABELS[unit.level]}`
          : `Repaso · Parte ${step.part}`
      }
      selected={progress.selected}
      onSelect={choose}
      onNext={next}
      onFinish={finish}
    />
  );
}

function ReviewWords({ wordIds }: { wordIds: string[] }) {
  const words = wordIds
    .map((wordId) => ALL_WORDS.find((word) => word.id === wordId))
    .filter((word): word is Word => Boolean(word));
  return (
    <ul className="review-card__words">
      {words.map((word) => (
        <li key={word.id}>
          <span className="review-card__hanzi" lang="zh-Hans">
            {word.hanzi}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ReviewPhase({
  unit,
  part,
  wordIds,
  next,
}: {
  unit: Unit;
  part: number;
  wordIds: string[];
  next: () => void;
}) {
  return (
    <div className="lesson">
      <LessonHeader
        label={`Parte ${part} de ${LESSON_PARTS} · ${unit.title}`}
        count={`${part} / ${LESSON_PARTS}`}
        round={part}
        totalRounds={LESSON_PARTS}
      />
      <section className="review-card" aria-live="polite">
        <span className="review-card__badge" aria-hidden="true">
          <Icon name="check" size={22} />
        </span>
        <p className="eyebrow">Parte {part} completada</p>
        <h1>Repaso de lo aprendido</h1>
        <p className="review-card__lead">
          Vas a recuperar estas palabras sin mirar el significado. Es el momento de comprobar qué se
          quedó.
        </p>
        <ReviewWords wordIds={wordIds} />
        <button type="button" className="button button--primary" onClick={next}>
          Empezar el repaso
        </button>
      </section>
    </div>
  );
}

function LessonStage({
  unit,
  plan,
  progress,
  next,
  choose,
  finish,
}: StageProps & { choose: (option: string) => void; finish: (correct: boolean) => void }) {
  const step = plan[progress.index];
  if (!step) return <LessonSummary unit={unit} answers={progress.answers} />;
  if (step.kind === 'learn')
    return <LearnStage unit={unit} plan={plan} progress={progress} next={next} />;
  if (step.kind === 'review')
    return <ReviewPhase unit={unit} part={step.part} wordIds={step.wordIds} next={next} />;
  return (
    <QuestionStage
      unit={unit}
      plan={plan}
      progress={progress}
      next={next}
      choose={choose}
      finish={finish}
    />
  );
}

export function Lesson({ unitId }: { unitId: string }) {
  const unit = UNITS.find((u) => u.id === unitId);
  const introduceUnit = useLearner((s) => s.introduceUnit);
  const recordLesson = useLearner((s) => s.recordLesson);
  const noteMiss = useLearner((s) => s.noteMiss);
  const plan = useLessonPlan(unit);
  const progress = useLessonProgress();
  const done = Boolean(unit) && plan.length > 0 && progress.index >= plan.length;
  useIntroduceUnit(unit, introduceUnit);
  useLessonRecord(unit, done, progress.answers, recordLesson);
  useLessonFinish(done, progress.answers);
  const { next, choose, finish } = useLessonActions({ plan, progress, noteMiss });
  if (!unit) return <LessonMissing />;
  return (
    <LessonStage
      unit={unit}
      plan={plan}
      progress={progress}
      next={next}
      choose={choose}
      finish={finish}
    />
  );
}
