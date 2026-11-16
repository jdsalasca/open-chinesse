import { useEffect, useRef, useState, type RefObject } from 'react';
import { AudioButton } from '../components/AudioButton';
import { CharacterLinks } from '../components/CharacterLinks';
import { ExampleBlock } from '../components/ExampleBlock';
import { SessionNext } from '../components/SessionNext';
import { SessionHeader } from '../components/SessionHeader';
import { Pinyin } from '../components/Pinyin';
import { UNITS, WORDS_BY_ID, type Word } from '../data/curriculum';
import { audioUrl } from '../lib/audio';
import { checkPinyin, type PinyinCheck } from '../lib/tone';
import { reasonLabel, type MissReason } from '../lib/miss';
import { navigate } from '../lib/router';
import { speak } from '../lib/speech';
import { buildQueue } from '../srs/queue';
import {
  GRADE_LABELS,
  GRADES,
  formatInterval,
  needsProduction,
  preview,
  type Grade,
  type Preview,
  type StoredCard,
} from '../srs/scheduler';
import { reviewStage } from '../lib/review-stage';
import { nextDueAt } from '../store/metrics';
import { requeuesSoon, useLearner } from '../store/useLearner';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
const NATIVE_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT']);
const KEY_GRADES: Record<string, Grade> = {
  '1': GRADES[0],
  '2': GRADES[1],
  '3': GRADES[2],
  '4': GRADES[3],
};

function useReviewQueue() {
  const gradeWord = useLearner((s) => s.gradeWord);
  const [queue, setQueue] = useState<string[]>(
    () => buildQueue(useLearner.getState().cards, Date.now()).due,
  );
  const [cursor, setCursor] = useState(0);
  const current = queue[cursor];

  const grade = (rating: Grade) => {
    if (!current) return;
    gradeWord(current, rating);
    const updated = useLearner.getState().cards[current];
    if (requeuesSoon(updated)) setQueue((items) => [...items, current]);
    setCursor((value) => value + 1);
  };

  return { queue, cursor, current, grade };
}

function useReviewTyping(wordId?: string) {
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState('');
  const [typedState, setTypedState] = useState<PinyinCheck | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRevealed(false);
    setTyped('');
    setTypedState(null);
  }, [wordId]);

  useEffect(() => {
    if (!revealed) inputRef.current?.focus({ preventScroll: true });
  }, [wordId, revealed]);

  return { revealed, setRevealed, typed, setTyped, typedState, setTypedState, inputRef };
}

type ReviewTyping = ReturnType<typeof useReviewTyping>;

type ReviewKeys = {
  word?: Word;
  revealed: boolean;
  typed: string;
  onTyped: () => void;
  onGrade: (grade: Grade) => void;
};

function targetTag(event: KeyboardEvent): string {
  return (event.target as HTMLElement | null)?.tagName ?? '';
}

function isSpeakKey(event: KeyboardEvent): boolean {
  return event.key === 'p' || event.key === 'P';
}

function isAdvanceKey(event: KeyboardEvent): boolean {
  return event.key === ' ' || event.key === 'Enter';
}

function handleRevealedKey(event: KeyboardEvent, keys: ReviewKeys): void {
  const grade = KEY_GRADES[event.key];
  if (!grade) return;
  event.preventDefault();
  keys.onGrade(grade);
}

function handleReviewKey(event: KeyboardEvent, keys: ReviewKeys): void {
  const tag = targetTag(event);
  if (TYPING_TAGS.has(tag) || !keys.word) return;
  if (isSpeakKey(event)) {
    event.preventDefault();
    speak(keys.word.hanzi);
    return;
  }
  if (keys.revealed) {
    handleRevealedKey(event, keys);
    return;
  }
  if (NATIVE_TAGS.has(tag) || !isAdvanceKey(event)) return;
  event.preventDefault();
  if (keys.typed.trim()) keys.onTyped();
}

function useReviewKeyboard(keys: ReviewKeys): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => handleReviewKey(event, keys);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
}

function ReviewSummary({ count, cards }: { count: number; cards: Record<string, StoredCard> }) {
  const now = Date.now();
  const upcoming = nextDueAt(cards, now);
  return (
    <section className="empty">
      <p className="eyebrow">Sesión terminada</p>
      <h1>
        {count} {count === 1 ? 'repaso' : 'repasos'}
      </h1>
      <p>
        {upcoming !== null
          ? `El calendario ya está actualizado. El próximo repaso toca en ${formatInterval(upcoming - now)}.`
          : 'El calendario ya está actualizado. Nada más por hoy.'}
      </p>
      <div className="empty__actions">
        <SessionNext from="review" />
        <button type="button" className="button button--primary" onClick={() => navigate('/stats')}>
          Ver progreso
        </button>
        <button type="button" className="button button--ghost" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </section>
  );
}

function ReviewEmpty({
  cards,
  stars,
}: {
  cards: Record<string, StoredCard>;
  stars: Record<string, number>;
}) {
  const hasCards = Object.keys(cards).length > 0;
  const nextUnit = UNITS.find((unit) => !Object.keys(stars).includes(unit.id));
  const upcoming = nextDueAt(cards, Date.now());
  const when = upcoming !== null ? formatInterval(upcoming - Date.now()) : null;
  return (
    <section className="empty">
      <p className="eyebrow">Repaso</p>
      <h1>{hasCards ? 'Estás al día' : 'Todavía no hay nada que repasar'}</h1>
      <p>
        {hasCards
          ? 'No hay tarjetas vencidas. Vuelve cuando toque o adelanta la siguiente unidad.'
          : 'Empieza una unidad: al terminarla, sus doce palabras entran al calendario de repaso.'}
      </p>
      {when && <p className="empty__when">Próximo repaso en {when}.</p>}
      <div className="empty__actions">
        <SessionNext from="review" />
        {nextUnit && (
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate(`/lesson/${nextUnit.id}`)}
          >
            Ir a {nextUnit.title}
          </button>
        )}
        <button type="button" className="button button--ghost" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </section>
  );
}

function PinyinInput({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="typed__row">
      <input
        id="pinyin-input"
        ref={inputRef}
        className="typed__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="ni hao"
      />
      <button type="submit" className="button button--ghost">
        Comprobar
      </button>
    </div>
  );
}

function TypedForm({
  value,
  onChange,
  onSubmit,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <form
      className="typed"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="pinyin-input" className="typed__label">
        Pinyin sin tonos
      </label>
      <PinyinInput value={value} onChange={onChange} inputRef={inputRef} />
    </form>
  );
}

function ReviewFront({
  word,
  production,
  typing,
  onSubmit,
}: {
  word: Word;
  production: boolean;
  typing: ReviewTyping;
  onSubmit: () => void;
}) {
  return (
    <>
      <div className="flashcard__hanzi" lang="zh-Hans">
        {word.hanzi}
      </div>
      <div className="flashcard__row">
        {typing.revealed ? (
          <Pinyin pinyin={word.pinyin} className="flashcard__pinyin" showToneNumber />
        ) : (
          <span className="flashcard__pinyin flashcard__pinyin--hidden">
            {production ? 'Escribe el pinyin' : 'Recuerda el significado'}
          </span>
        )}
        <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
      </div>
      {!typing.revealed && (
        <TypedForm
          value={typing.typed}
          onChange={typing.setTyped}
          onSubmit={onSubmit}
          inputRef={typing.inputRef}
        />
      )}
    </>
  );
}

function typedMessage(state: PinyinCheck, typed: string, pinyin: string): string {
  if (state === 'ok') return 'Pinyin y tonos correctos.';
  if (state === 'sin-tonos') return 'Sílabas correctas. Añade los tonos para practicarlos.';
  if (state === 'tonos') return `Sílabas bien, pero el tono es «${pinyin}».`;
  return `Tú escribiste “${typed}”.`;
}

function TypedResult({
  state,
  typed,
  pinyin,
}: {
  state: PinyinCheck;
  typed: string;
  pinyin: string;
}) {
  const tone = state === 'ok' ? 'ok' : state === 'mal' ? 'bad' : 'warn';
  return (
    <p className={`typed__result typed__result--${tone}`}>{typedMessage(state, typed, pinyin)}</p>
  );
}

function ReviewMiss({ miss }: { miss: { reason: MissReason } }) {
  return (
    <p className="review__miss">
      Fallaste por «{reasonLabel(miss.reason)}».
      {miss.reason === 'sound' && ' Escúchala antes de calificar.'}
    </p>
  );
}

function RevealPanel({
  word,
  typing,
  miss,
}: {
  word: Word;
  typing: ReviewTyping;
  miss?: { reason: MissReason };
}) {
  return (
    <div className="answer">
      {typing.typedState && (
        <TypedResult state={typing.typedState} typed={typing.typed} pinyin={word.pinyin} />
      )}
      <p className="flashcard__meaning">{word.meaning}</p>
      {miss && <ReviewMiss miss={miss} />}
      <ExampleBlock word={word} />
      <CharacterLinks hanzi={word.hanzi} />
    </div>
  );
}

function GradeButtons({
  intervals,
  onGrade,
}: {
  intervals: Preview;
  onGrade: (grade: Grade) => void;
}) {
  return (
    <div className="review__grades">
      {GRADES.map((grade, index) => (
        <button
          key={grade}
          type="button"
          className={`grade grade--${index + 1}`}
          onClick={() => onGrade(grade)}
        >
          <span className="grade__label">{GRADE_LABELS[grade]}</span>
          <span className="grade__interval">{intervals[grade].label}</span>
          <span className="grade__key" aria-hidden="true">
            {index + 1}
          </span>
        </button>
      ))}
      <span className="hint">Teclas 1–4 · vuelve cuando lo indica el intervalo</span>
    </div>
  );
}

function ReviewActions({ onUnknown }: { onUnknown: () => void }) {
  return (
    <div className="review__actions">
      <button type="button" className="button button--ghost" onClick={onUnknown}>
        No lo sé
      </button>
      <span className="hint">Escribe el pinyin o usa «No lo sé» · P para oír</span>
    </div>
  );
}

function ReviewHeader({ done, total }: { done: number; total: number }) {
  return (
    <>
      <SessionHeader
        label="Repaso"
        count={`${done + 1} de ${total}`}
        onExit={() => navigate('/')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${(done / Math.max(total, 1)) * 100}%` }} />
      </div>
    </>
  );
}

function ReviewCard({
  word,
  card,
  typing,
  miss,
  onSubmit,
}: {
  word: Word;
  card: StoredCard;
  typing: ReviewTyping;
  miss?: { reason: MissReason };
  onSubmit: () => void;
}) {
  return (
    <article className="flashcard flashcard--review" aria-live="polite">
      <ReviewFront
        word={word}
        production={needsProduction(card)}
        typing={typing}
        onSubmit={onSubmit}
      />
      {typing.revealed && <RevealPanel word={word} typing={typing} miss={miss} />}
    </article>
  );
}

function ReviewQuestion({
  word,
  card,
  miss,
  queue,
  typing,
  onGrade,
  onTyped,
  onUnknown,
}: {
  word: Word;
  card: StoredCard;
  miss?: { reason: MissReason };
  queue: ReturnType<typeof useReviewQueue>;
  typing: ReviewTyping;
  onGrade: (grade: Grade) => void;
  onTyped: () => void;
  onUnknown: () => void;
}) {
  const intervals = preview(card, Date.now());
  useReviewKeyboard({
    word,
    revealed: typing.revealed,
    typed: typing.typed,
    onTyped,
    onGrade,
  });
  return (
    <div className="review">
      <ReviewHeader done={queue.cursor} total={queue.queue.length} />
      <ReviewCard word={word} card={card} typing={typing} miss={miss} onSubmit={onTyped} />
      {typing.revealed ? (
        <GradeButtons intervals={intervals} onGrade={onGrade} />
      ) : (
        <ReviewActions onUnknown={onUnknown} />
      )}
    </div>
  );
}

export function Review() {
  const cards = useLearner((s) => s.cards);
  const stars = useLearner((s) => s.stars);
  const misses = useLearner((s) => s.misses);
  const noteMiss = useLearner((s) => s.noteMiss);
  const queue = useReviewQueue();
  const wordId = queue.current;
  const word = wordId ? WORDS_BY_ID.get(wordId) : undefined;
  const typing = useReviewTyping(wordId);
  const stage = reviewStage(queue.queue.length, queue.cursor);
  const card = wordId ? cards[wordId] : undefined;

  const revealTyped = () => {
    if (!word || !typing.typed.trim()) return;
    typing.setTypedState(checkPinyin(typing.typed, word.pinyin));
    typing.setRevealed(true);
  };

  const revealUnknown = () => {
    if (wordId) noteMiss(wordId, 'unknown', Date.now());
    typing.setRevealed(true);
  };

  if (stage === 'summary') return <ReviewSummary count={queue.cursor} cards={cards} />;
  if (stage === 'empty' || !word || !card) return <ReviewEmpty cards={cards} stars={stars} />;
  return (
    <ReviewQuestion
      word={word}
      card={card}
      miss={wordId ? misses[wordId] : undefined}
      queue={queue}
      typing={typing}
      onGrade={queue.grade}
      onTyped={revealTyped}
      onUnknown={revealUnknown}
    />
  );
}
