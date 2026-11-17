import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { AudioButton } from '../components/AudioButton';
import { CharacterLinks } from '../components/CharacterLinks';
import { ExampleBlock } from '../components/ExampleBlock';
import { MissPicker } from '../components/MissPicker';
import { OrderExercise } from '../components/OrderExercise';
import { Pinyin } from '../components/Pinyin';
import { Confetti } from '../components/ui/Confetti';
import { Icon } from '../components/ui/Icon';
import { ALL_WORDS, LEVEL_LABELS, UNITS, type Unit, type Word } from '../data/curriculum';
import { starsForScore, xpForLesson } from '../gamification/xp';
import { makeQuiz, type Question } from '../lib/quiz';
import { audioUrl } from '../lib/audio';
import { playComplete, playCorrect, playWrong } from '../lib/sfx';
import { SessionNext } from '../components/SessionNext';
import { SessionHeader } from '../components/SessionHeader';
import { useDailySession } from '../store/daily-session';
import { useEnterKey } from '../lib/hooks';
import { navigate } from '../lib/router';
import type { MissReason } from '../lib/miss';
import { useLearner } from '../store/useLearner';

type Phase = 'learn' | 'quiz' | 'done';

type LessonProgress = {
  phase: Phase;
  setPhase: (phase: Phase) => void;
  index: number;
  setIndex: (index: number) => void;
  answers: boolean[];
  setAnswers: Dispatch<SetStateAction<boolean[]>>;
  selected: string | null;
  setSelected: (selected: string | null) => void;
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
};

function useLessonQuiz(unit: Unit | undefined): Question[] {
  const [variant] = useState(() => Math.floor(Date.now() / 86400000));
  return useMemo(() => (unit ? makeQuiz(unit, variant) : []), [unit, variant]);
}

function useLessonProgress(): LessonProgress {
  const [phase, setPhase] = useState<Phase>('learn');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  return {
    phase,
    setPhase,
    index,
    setIndex,
    answers,
    setAnswers,
    selected,
    setSelected,
    revealed,
    setRevealed,
  };
}

function useIntroduceUnit(unit: Unit | undefined, introduceUnit: (unitId: string) => void): void {
  useEffect(() => {
    if (unit) introduceUnit(unit.id);
  }, [unit, introduceUnit]);
}

function useLessonRecord(
  unit: Unit | undefined,
  phase: Phase,
  answers: boolean[],
  recordLesson: (unitId: string, correct: number, total: number) => void,
): void {
  const recorded = useRef(false);
  useEffect(() => {
    if (phase !== 'done' || !unit || recorded.current) return;
    recorded.current = true;
    recordLesson(unit.id, answers.filter(Boolean).length, Math.max(answers.length, 1));
  }, [phase, unit, answers, recordLesson]);
}

function useLessonFinish(phase: Phase, answers: boolean[]): void {
  useEffect(() => {
    if (phase !== 'done') return;
    const correct = answers.filter(Boolean).length;
    if (starsForScore(correct, Math.max(answers.length, 1)) === 3) playComplete();
    useDailySession.getState().finish('lesson');
  }, [phase, answers]);
}

function advanceLearn(params: {
  unit: Unit;
  index: number;
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
  setIndex: (index: number) => void;
  setPhase: (phase: Phase) => void;
}): void {
  const { unit, index, revealed, setRevealed, setIndex, setPhase } = params;
  if (!revealed) return setRevealed(true);
  if (index + 1 < unit.words.length) {
    setRevealed(false);
    setIndex(index + 1);
    return;
  }
  setRevealed(false);
  setIndex(0);
  setPhase('quiz');
}

type LessonActionsParams = {
  unit?: Unit;
  quiz: Question[];
  progress: LessonProgress;
  questionWord?: Word;
  noteMiss: (wordId: string, reason: MissReason) => void;
};

function useLessonActions(params: LessonActionsParams) {
  const { unit, quiz, progress, questionWord, noteMiss } = params;
  const {
    phase,
    setPhase,
    index,
    setIndex,
    selected,
    setSelected,
    setAnswers,
    revealed,
    setRevealed,
  } = progress;

  const finish = (correct: boolean) => {
    if (!correct && quiz[index]?.mode === 'order') noteMiss(quiz[index].wordId, 'order');
    setAnswers((prev) => [...prev, correct]);
    setSelected(null);
    if (index + 1 < quiz.length) return setIndex(index + 1);
    setPhase('done');
  };

  const next = () => {
    if (!unit) return;
    if (phase === 'learn') {
      return advanceLearn({ unit, index, revealed, setRevealed, setIndex, setPhase });
    }
    if (phase === 'quiz' && selected !== null) finish(selected === questionWord?.meaning);
  };

  const choose = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === questionWord?.meaning) playCorrect();
    else playWrong();
  };

  const orderMode = phase === 'quiz' && quiz[index]?.mode === 'order';
  useEnterKey(next, phase !== 'done' && !orderMode);
  return { next, choose, finish };
}

function LessonHeader({ label, count, ratio }: { label: string; count: string; ratio: number }) {
  return (
    <>
      <SessionHeader label={label} count={count} onExit={() => navigate('/')} />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${ratio * 100}%` }} />
      </div>
    </>
  );
}

function Flashcard({ word, revealed }: { word: Word; revealed: boolean }) {
  return (
    <article className="flashcard" aria-live="polite">
      <div className="flashcard__hanzi" lang="zh-Hans">
        {word.hanzi}
      </div>
      <div className="flashcard__row">
        <Pinyin pinyin={word.pinyin} className="flashcard__pinyin" showToneNumber />
        <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
      </div>
      {revealed ? (
        <>
          <p className="flashcard__meaning">{word.meaning}</p>
          <ExampleBlock word={word} />
          <CharacterLinks hanzi={word.hanzi} />
        </>
      ) : (
        <div className="flashcard__recall">
          <p className="flashcard__prompt">¿Qué significa? Intenta recordarlo antes de mirar.</p>
          <p className="flashcard__hint">Si es la primera vez, no pasa nada: mira y sigue.</p>
        </div>
      )}
    </article>
  );
}

function LearnActions({
  revealed,
  last,
  onReveal,
  next,
}: {
  revealed: boolean;
  last: boolean;
  onReveal: () => void;
  next: () => void;
}) {
  return (
    <div className="lesson__actions">
      {revealed && (
        <button type="button" className="button button--primary" onClick={next}>
          {last ? 'Pasar a la práctica' : 'Siguiente'}
        </button>
      )}
      {!revealed && (
        <>
          <button type="button" className="button button--primary" onClick={onReveal}>
            Mostrar significado
          </button>
          <button type="button" className="link" onClick={onReveal}>
            No lo recuerdo
          </button>
        </>
      )}
      <span className="hint">
        {revealed
          ? 'Lee el ejemplo y sigue cuando quieras.'
          : 'Intenta recordar; Enter también revela.'}
      </span>
    </div>
  );
}

function LearnPhase({
  unit,
  index,
  revealed,
  onReveal,
  next,
}: {
  unit: Unit;
  index: number;
  revealed: boolean;
  onReveal: () => void;
  next: () => void;
}) {
  const word = unit.words[index];
  const last = index + 1 === unit.words.length;
  return (
    <div className="lesson">
      <LessonHeader
        label={`${LEVEL_LABELS[unit.level]} · ${unit.title}`}
        count={`${index + 1} / ${unit.words.length}`}
        ratio={(index + 1) / unit.words.length}
      />
      <Flashcard word={word} revealed={revealed} />
      <LearnActions revealed={revealed} last={last} onReveal={onReveal} next={next} />
    </div>
  );
}

function QuizPrompt({ question, word }: { question: Question; word: Word }) {
  if (question.mode === 'order') {
    return (
      <div className="quiz__prompt">
        <span className="quiz__prompt-label">Ordena la frase</span>
      </div>
    );
  }
  return (
    <div className="quiz__prompt">
      <span className="quiz__prompt-label">
        {question.mode === 'listen' ? 'Escucha y elige' : '¿Qué significa?'}
      </span>
      {question.mode === 'listen' ? (
        <div className="quiz__prompt-audio">
          <AudioButton text={word.hanzi} label="la palabra" src={audioUrl('words', word.id)} />
          <span className="quiz__dots" aria-hidden="true">
            ••••
          </span>
        </div>
      ) : (
        <>
          <div className="quiz__hanzi" lang="zh-Hans">
            {word.hanzi}
          </div>
          <div className="quiz__audio">
            <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
            <Pinyin pinyin={word.pinyin} />
          </div>
        </>
      )}
    </div>
  );
}

function QuizOptions({
  options,
  meaning,
  selected,
  onPick,
}: {
  options: string[];
  meaning: string;
  selected: string | null;
  onPick: (option: string) => void;
}) {
  return (
    <div className="quiz__options" role="group" aria-label="Opciones">
      {options.map((option) => {
        const state =
          selected === null
            ? ''
            : option === meaning
              ? ' is-correct'
              : option === selected
                ? ' is-wrong'
                : ' is-muted';
        return (
          <button
            key={option}
            type="button"
            className={`option${state}`}
            onClick={() => onPick(option)}
            disabled={selected !== null}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function QuizContrast({ word, selected }: { word: Word; selected: string | null }) {
  const correct = selected === word.meaning;
  return (
    <div className="quiz__contrast">
      {!correct && (
        <div className="quiz__contrast-row is-wrong">
          <span>Elegiste</span>
          <strong>{selected}</strong>
        </div>
      )}
      <div className="quiz__contrast-row is-correct">
        <span>{correct ? 'Correcto' : 'Respuesta'}</span>
        <strong>{word.meaning}</strong>
      </div>
    </div>
  );
}

function QuizFeedback({
  word,
  selected,
  onNext,
  onMiss,
  last,
}: {
  word: Word;
  selected: string | null;
  onNext: () => void;
  onMiss: (reason: MissReason) => void;
  last: boolean;
}) {
  const correct = selected === word.meaning;
  return (
    <div className="quiz__feedback">
      <p className="quiz__verdict" role="status">
        {correct ? `Correcto: ${word.hanzi} significa ${word.meaning}.` : `Era ${word.meaning}.`}
      </p>
      <QuizContrast word={word} selected={selected} />
      <ExampleBlock word={word} />
      {!correct && <MissPicker key={word.id} onPick={onMiss} />}
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
        meaning={word.meaning}
        selected={selected}
        onPick={onSelect}
      />
      {selected !== null && (
        <QuizFeedback word={word} selected={selected} onNext={onNext} onMiss={onMiss} last={last} />
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
  unit: Unit;
  quiz: Question[];
  index: number;
  question: Question;
  questionWord: Word;
  selected: string | null;
  onSelect: (option: string) => void;
  onNext: () => void;
  onFinish: (correct: boolean) => void;
};

function QuizPhase({ unit, quiz, index, question, questionWord, ...stage }: QuizPhaseProps) {
  const last = index + 1 === quiz.length;
  const noteMiss = useLearner((s) => s.noteMiss);
  return (
    <div className="lesson">
      <LessonHeader
        label={`Práctica · ${LEVEL_LABELS[unit.level]}`}
        count={`${index + 1} / ${quiz.length}`}
        ratio={(index + 1) / quiz.length}
      />
      <section className="quiz" aria-live="polite">
        <QuizStage
          question={question}
          word={questionWord}
          last={last}
          onMiss={(reason) => noteMiss(questionWord.id, reason)}
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

function LessonSummary({ unit, answers }: { unit: Unit; answers: boolean[] }) {
  const correct = answers.filter(Boolean).length;
  const stars = starsForScore(correct, Math.max(answers.length, 1));
  return (
    <div className="lesson">
      <section className="summary" aria-live="polite">
        {stars === 3 && <Confetti />}
        <p className="eyebrow">
          {LEVEL_LABELS[unit.level]} · {unit.title}
        </p>
        <SummaryStars stars={stars} />
        <h1 className="summary__title">
          {correct} de {answers.length} correctas
        </h1>
        <p className="summary__xp">+{xpForLesson(correct)} XP</p>
        <p className="summary__text">
          {correct === answers.length
            ? 'Reconociste todas. El repaso volverá a traerlas cuando toque.'
            : 'El error es parte del proceso: esas palabras volverán antes.'}
        </p>
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

type LessonStageProps = {
  unit?: Unit;
  quiz: Question[];
  progress: LessonProgress;
  question?: Question;
  questionWord?: Word;
  next: () => void;
  choose: (option: string) => void;
  finish: (correct: boolean) => void;
};

function LessonStage({
  unit,
  quiz,
  progress,
  question,
  questionWord,
  next,
  choose,
  finish,
}: LessonStageProps) {
  if (!unit || !unit.words[progress.index]) return <LessonMissing />;
  if (progress.phase === 'learn') {
    return (
      <LearnPhase
        unit={unit}
        index={progress.index}
        revealed={progress.revealed}
        onReveal={() => progress.setRevealed(true)}
        next={next}
      />
    );
  }
  if (progress.phase === 'quiz' && question && questionWord) {
    return (
      <QuizPhase
        unit={unit}
        quiz={quiz}
        index={progress.index}
        question={question}
        questionWord={questionWord}
        selected={progress.selected}
        onSelect={choose}
        onNext={next}
        onFinish={finish}
      />
    );
  }
  return <LessonSummary unit={unit} answers={progress.answers} />;
}

export function Lesson({ unitId }: { unitId: string }) {
  const unit = UNITS.find((u) => u.id === unitId);
  const introduceUnit = useLearner((s) => s.introduceUnit);
  const recordLesson = useLearner((s) => s.recordLesson);
  const noteMiss = useLearner((s) => s.noteMiss);
  const quiz = useLessonQuiz(unit);
  const progress = useLessonProgress();
  useIntroduceUnit(unit, introduceUnit);
  useLessonRecord(unit, progress.phase, progress.answers, recordLesson);
  useLessonFinish(progress.phase, progress.answers);
  const question = quiz[progress.index];
  const questionWord = question ? ALL_WORDS.find((w) => w.id === question.wordId) : undefined;
  const { next, choose, finish } = useLessonActions({
    unit,
    quiz,
    progress,
    questionWord,
    noteMiss,
  });
  return (
    <LessonStage
      unit={unit}
      quiz={quiz}
      progress={progress}
      question={question}
      questionWord={questionWord}
      next={next}
      choose={choose}
      finish={finish}
    />
  );
}
