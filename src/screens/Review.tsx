import { useEffect, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { CharacterLinks } from '../components/CharacterLinks';
import { SessionNext } from '../components/SessionNext';
import { Pinyin } from '../components/Pinyin';
import { UNITS, WORDS_BY_ID } from '../data/curriculum';
import { audioUrl } from '../lib/audio';
import { checkPinyin, type PinyinCheck } from '../lib/tone';
import { reasonLabel } from '../lib/miss';
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
} from '../srs/scheduler';
import { completedUnits, requeuesSoon, useLearner } from '../store/useLearner';
import { nextDueAt } from '../store/metrics';

const KEY_HINTS: Record<string, string> = { '1': '1', '2': '2', '3': '3', '4': '4' };

export function Review() {
  const cards = useLearner((s) => s.cards);
  const gradeWord = useLearner((s) => s.gradeWord);
  const misses = useLearner((s) => s.misses);
  const noteMiss = useLearner((s) => s.noteMiss);

  const [queue, setQueue] = useState<string[]>(
    () => buildQueue(useLearner.getState().cards, Date.now()).due,
  );
  const [cursor, setCursor] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState('');
  const [typedState, setTypedState] = useState<PinyinCheck | null>(null);
  const [graded, setGraded] = useState(0);

  const wordId = queue[cursor];
  const card = wordId ? cards[wordId] : undefined;
  const word = wordId ? WORDS_BY_ID.get(wordId) : undefined;
  const miss = wordId ? misses[wordId] : undefined;
  const now = Date.now();

  useEffect(() => {
    setRevealed(false);
    setTyped('');
    setTypedState(null);
  }, [wordId]);

  const reveal = () => setRevealed(true);

  const submitTyped = () => {
    if (!word || !typed.trim()) return;
    setTypedState(checkPinyin(typed, word.pinyin));
    setRevealed(true);
  };

  const submitGrade = (rating: Grade) => {
    if (!wordId) return;
    gradeWord(wordId, rating, now);
    const updated = useLearner.getState().cards[wordId];
    if (requeuesSoon(updated, now)) setQueue((q) => [...q, wordId]);
    setGraded((g) => g + 1);
    setCursor((c) => c + 1);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!word) return;
      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        speak(word.hanzi);
        return;
      }
      if (!revealed && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        reveal();
        return;
      }
      if (revealed && KEY_HINTS[event.key]) {
        event.preventDefault();
        submitGrade(GRADES[Number(event.key) - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!word || !card) {
    const hasCards = Object.keys(cards).length > 0;
    const nextUnit = UNITS.find((u) => !completedUnits(cards).includes(u.id));
    const upcoming = nextDueAt(cards, now);
    const when = upcoming !== null ? formatInterval(upcoming - now) : null;
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

  if (cursor >= queue.length) {
    const upcoming = nextDueAt(cards, now);
    return (
      <section className="empty">
        <p className="eyebrow">Sesión terminada</p>
        <h1>
          {graded} {graded === 1 ? 'repaso' : 'repasos'}
        </h1>
        <p>
          {upcoming !== null
            ? `El calendario ya está actualizado. El próximo repaso toca en ${formatInterval(upcoming - now)}.`
            : 'El calendario ya está actualizado. Nada más por hoy.'}
        </p>
        <div className="empty__actions">
          <SessionNext from="review" />
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/stats')}
          >
            Ver progreso
          </button>
          <button type="button" className="button button--ghost" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  const intervals = preview(card, now);
  const production = needsProduction(card);
  const done = cursor;

  return (
    <div className="review">
      <div className="review__bar">
        <span className="review__label">
          Repaso · {done + 1} de {queue.length}
        </span>
        <button type="button" className="link" onClick={() => navigate('/')}>
          Salir
        </button>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${(done / Math.max(queue.length, 1)) * 100}%` }} />
      </div>

      <article className="flashcard flashcard--review" aria-live="polite">
        <div className="flashcard__hanzi" lang="zh-Hans">
          {word.hanzi}
        </div>
        <div className="flashcard__row">
          {revealed ? (
            <Pinyin pinyin={word.pinyin} className="flashcard__pinyin" showToneNumber />
          ) : (
            <span className="flashcard__pinyin flashcard__pinyin--hidden">
              {production ? 'Escribe el pinyin' : 'Recuerda el significado'}
            </span>
          )}
          <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
        </div>

        {!revealed && (
          <form
            className="typed"
            onSubmit={(event) => {
              event.preventDefault();
              submitTyped();
            }}
          >
            <label htmlFor="pinyin-input" className="typed__label">
              Pinyin sin tonos
            </label>
            <div className="typed__row">
              <input
                id="pinyin-input"
                className="typed__input"
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="ni hao"
                autoFocus
              />
              <button type="submit" className="button button--ghost">
                Comprobar
              </button>
            </div>
          </form>
        )}

        {revealed && (
          <div className="answer">
            {typedState && (
              <p
                className={`typed__result typed__result--${typedState === 'ok' ? 'ok' : typedState === 'mal' ? 'bad' : 'warn'}`}
              >
                {typedState === 'ok' && 'Pinyin y tonos correctos.'}
                {typedState === 'sin-tonos' &&
                  'Sílabas correctas. Añade los tonos para practicarlos.'}
                {typedState === 'tonos' && `Sílabas bien, pero el tono es «${word.pinyin}».`}
                {typedState === 'mal' && `Tú escribiste “${typed}”.`}
              </p>
            )}
            <p className="flashcard__meaning">{word.meaning}</p>
            {miss && (
              <p className="review__miss">
                La última vez falló por «{reasonLabel(miss.reason)}».
                {miss.reason === 'sound' && ' Escúchala antes de calificar.'}
              </p>
            )}
            <div className="example">
              <div className="example__head">
                <span className="example__label">En contexto</span>
                <AudioButton
                  text={word.example.hanzi}
                  label="la frase de ejemplo"
                  src={audioUrl('examples', word.id)}
                  compact
                />
              </div>
              <p className="example__hanzi" lang="zh-Hans">
                {word.example.hanzi}
              </p>
              <p className="example__pinyin">
                <Pinyin pinyin={word.example.pinyin} />
              </p>
              <p className="example__translation">{word.example.translation}</p>
            </div>
            <CharacterLinks hanzi={word.hanzi} />
          </div>
        )}
      </article>

      {!revealed ? (
        <div className="review__actions">
          <button
            type="button"
            className="button button--ghost"
            onClick={() => {
              if (wordId) noteMiss(wordId, 'unknown', now);
              reveal();
            }}
          >
            No lo sé
          </button>
          <span className="hint">Escribe el pinyin o usa «No lo sé» · P para oír</span>
        </div>
      ) : (
        <div className="review__grades">
          {GRADES.map((grade, index) => (
            <button
              key={grade}
              type="button"
              className={`grade grade--${index + 1}`}
              onClick={() => submitGrade(grade)}
              autoFocus={index === 0}
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
      )}
    </div>
  );
}
