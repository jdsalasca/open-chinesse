import { createEmptyCard, fsrs, Rating, State, type Card } from 'ts-fsrs';

/**
 * Tarjeta serializable: fechas en ISO (JSON-safe) y `state` numérico.
 * `ts-fsrs` acepta ISO como `DateInput`, así que no hace falta convertir al leer.
 */
export type StoredCard = {
  due: string;
  last_review?: string;
  stability: number;
  difficulty: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
};

// shortcut: API síncrona FSRS-6 de ts-fsrs (la nueva, DefaultScheduler, es async y
// FSRS-7). Migrar cuando necesitemos optimizar pesos por usuario.
const scheduler = fsrs({ request_retention: 0.9 });
const DAY_MS = 86_400_000;

export const GRADES = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as const;
export type Grade = (typeof GRADES)[number];

export const GRADE_LABELS: Record<Grade, string> = {
  [Rating.Again]: 'Otra vez',
  [Rating.Hard]: 'Difícil',
  [Rating.Good]: 'Bien',
  [Rating.Easy]: 'Fácil',
};

export function newCard(now: number): StoredCard {
  return toStored(createEmptyCard(new Date(now)));
}

/** ts-fsrs devuelve `Date` o ISO según el build: normalizamos siempre. */
const toISO = (value: Date | string | number): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

export function toStored(card: Card): StoredCard {
  return {
    due: toISO(card.due),
    last_review: card.last_review ? toISO(card.last_review) : undefined,
    stability: card.stability,
    difficulty: card.difficulty,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
  };
}

const VALID_STATES = new Set([State.New, State.Learning, State.Review, State.Relearning]);

/**
 * Una tarjeta persistida puede venir corrupta o de un esquema viejo. FSRS lanza
 * `FSRSValidationError` con un estado imposible, así que se valida antes de usarla.
 */
export function isUsableCard(stored: StoredCard): boolean {
  if (!Number.isFinite(Date.parse(stored.due))) return false;
  if (!VALID_STATES.has(stored.state as State)) return false;
  if (stored.state === State.New) return true;
  return (
    Number.isFinite(stored.stability) &&
    stored.stability > 0 &&
    Number.isFinite(stored.difficulty) &&
    stored.difficulty >= 1 &&
    stored.difficulty <= 10
  );
}

export function toCard(stored: StoredCard): Card {
  // Si el estado es imposible se reinicia la tarjeta: mejor perder el calendario
  // de una palabra que romper la sesión de repaso.
  if (!isUsableCard(stored)) return createEmptyCard(new Date());
  return {
    ...stored,
    due: new Date(stored.due),
    last_review: stored.last_review ? new Date(stored.last_review) : undefined,
    state: stored.state as State,
  };
}

export function dueAt(card: StoredCard): number {
  return new Date(card.due).getTime();
}

export function isDue(card: StoredCard, now: number): boolean {
  return dueAt(card) <= now;
}

export function review(card: StoredCard, grade: Grade, now: number): StoredCard {
  return toStored(scheduler.next(toCard(card), new Date(now), grade).card);
}

export type Preview = Record<Grade, { due: number; label: string }>;

/** Intervalo que resultaría de cada calificación, para mostrarlo en los botones. */
export function preview(card: StoredCard, now: number): Preview {
  const result = scheduler.repeat(toCard(card), new Date(now));
  const entries = GRADES.map((grade) => {
    const due = new Date(result[grade].card.due).getTime();
    return [grade, { due, label: formatInterval(due - now) }] as const;
  });
  return Object.fromEntries(entries) as Preview;
}

export function formatInterval(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 31) return `${days} d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} mes${months === 1 ? '' : 'es'}`;
  return `${Math.round(days / 365)} años`;
}

export function isNew(card: StoredCard): boolean {
  return card.state === State.New;
}

export function isMature(card: StoredCard): boolean {
  return card.state === State.Review && card.scheduled_days >= 21;
}

/** Tarjetas que ya pasaron por la lección y admiten producción escrita. */
export function needsProduction(card: StoredCard): boolean {
  return card.reps >= 2 || card.state === State.Review;
}

export const SESSION_REQUEUE_MS = 30 * 60_000;
export const DAY = DAY_MS;
