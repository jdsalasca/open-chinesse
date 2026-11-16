import { Rating } from 'ts-fsrs';
import { isMature, type StoredCard } from '../srs/scheduler';

export type ReviewRecord = {
  wordId: string;
  rating: number;
  at: number;
};

export function dayKey(at: number): string {
  const d = new Date(at);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return dayKey(date.getTime());
}

/**
 * Días consecutivos con al menos un repaso. Si hoy aún no hay repasos pero ayer
 * sí, la racha sigue viva (no se castiga haber empezado tarde).
 */
export function streakDays(log: ReviewRecord[], now: number): number {
  if (log.length === 0) return 0;
  const days = new Set(log.map((r) => dayKey(r.at)));
  const today = dayKey(now);
  let cursor = days.has(today) ? today : shiftDay(today, -1);
  if (!days.has(cursor)) return 0;
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor = shiftDay(cursor, -1);
  }
  return count;
}

export function reviewsToday(log: ReviewRecord[], now: number): number {
  const today = dayKey(now);
  return log.filter((r) => dayKey(r.at) === today).length;
}

/** Proporción de respuestas "recordadas" (Difícil, Bien o Fácil) en la ventana. */
export function accuracy(log: ReviewRecord[], now: number, days = 30): number | null {
  const since = now - days * 86_400_000;
  const window = log.filter((r) => r.at >= since);
  if (window.length === 0) return null;
  const good = window.filter((r) => r.rating >= Rating.Hard).length;
  return good / window.length;
}

export function masteredCount(cards: Record<string, StoredCard>): number {
  return Object.values(cards).filter(isMature).length;
}

export function forecast(
  cards: Record<string, StoredCard>,
  now: number,
  days = 7,
): { key: string; count: number }[] {
  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i += 1) buckets.set(shiftDay(dayKey(now), i), 0);
  for (const card of Object.values(cards)) {
    const key = dayKey(new Date(card.due).getTime());
    const current = buckets.get(key);
    if (current !== undefined) buckets.set(key, current + 1);
  }
  return [...buckets.entries()].map(([key, count]) => ({ key, count }));
}

export function formatAccuracy(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`;
}

/** Momento del próximo repaso futuro, si queda alguna tarjeta programada. */
export function nextDueAt(cards: Record<string, StoredCard>, now: number): number | null {
  const future = Object.values(cards)
    .map((card) => new Date(card.due).getTime())
    .filter((time) => time > now);
  return future.length > 0 ? Math.min(...future) : null;
}
