import { describe, expect, it } from 'vitest';
import { Rating, State } from 'ts-fsrs';
import { newCard, type StoredCard } from '../srs/scheduler';
import {
  accuracy,
  dayKey,
  forecast,
  formatAccuracy,
  masteredCount,
  nextDueAt,
  reviewsToday,
  streakDays,
  type ReviewRecord,
} from './metrics';

const DAY = 86_400_000;
const NOW = new Date(2026, 10, 15, 12).getTime(); // 15 nov 2026, hora local

const rec = (at: number, rating: number = Rating.Good): ReviewRecord => ({
  wordId: 'u1-01',
  rating,
  at,
});

describe('dayKey', () => {
  it('usa fecha local', () => {
    expect(dayKey(NOW)).toBe('2026-11-15');
  });
});

describe('streakDays', () => {
  it('cuenta días consecutivos incluyendo hoy', () => {
    const log = [rec(NOW), rec(NOW - DAY), rec(NOW - 2 * DAY)];
    expect(streakDays(log, NOW)).toBe(3);
  });

  it('no castiga si hoy aún no se repasó', () => {
    const log = [rec(NOW - DAY), rec(NOW - 2 * DAY)];
    expect(streakDays(log, NOW)).toBe(2);
  });

  it('se corta con un hueco', () => {
    const log = [rec(NOW), rec(NOW - 2 * DAY), rec(NOW - 3 * DAY)];
    expect(streakDays(log, NOW)).toBe(1);
  });

  it('es 0 sin repasos o con racha vieja', () => {
    expect(streakDays([], NOW)).toBe(0);
    expect(streakDays([rec(NOW - 3 * DAY)], NOW)).toBe(0);
  });

  it('no duplica varios repasos del mismo día', () => {
    const log = [rec(NOW), rec(NOW - 60_000), rec(NOW - 120_000)];
    expect(streakDays(log, NOW)).toBe(1);
  });
});

describe('reviewsToday', () => {
  it('cuenta solo los de hoy', () => {
    expect(reviewsToday([rec(NOW), rec(NOW - DAY)], NOW)).toBe(1);
  });
});

describe('accuracy', () => {
  it('considera correctas Difícil, Bien y Fácil', () => {
    const log = [
      rec(NOW, Rating.Again),
      rec(NOW, Rating.Hard),
      rec(NOW, Rating.Good),
      rec(NOW, Rating.Easy),
    ];
    expect(accuracy(log, NOW)).toBe(0.75);
  });

  it('ignora lo anterior a la ventana', () => {
    const log = [rec(NOW, Rating.Good), rec(NOW - 40 * DAY, Rating.Again)];
    expect(accuracy(log, NOW)).toBe(1);
  });

  it('devuelve null sin datos', () => {
    expect(accuracy([], NOW)).toBeNull();
    expect(formatAccuracy(null)).toBe('—');
  });
});

describe('masteredCount', () => {
  it('solo cuenta tarjetas maduras', () => {
    const base = newCard(NOW);
    const cards: Record<string, StoredCard> = {
      a: { ...base, state: State.Review, scheduled_days: 30 },
      b: { ...base, state: State.Review, scheduled_days: 5 },
      c: base,
    };
    expect(masteredCount(cards)).toBe(1);
  });
});

describe('nextDueAt', () => {
  it('devuelve el vencimiento futuro más cercano', () => {
    const base = newCard(NOW);
    const cards: Record<string, StoredCard> = {
      a: { ...base, due: new Date(NOW - 1000).toISOString() },
      b: { ...base, due: new Date(NOW + 5000).toISOString() },
      c: { ...base, due: new Date(NOW + 9000).toISOString() },
    };
    expect(nextDueAt(cards, NOW)).toBe(NOW + 5000);
  });

  it('devuelve null sin vencimientos futuros', () => {
    expect(nextDueAt({}, NOW)).toBeNull();
    expect(nextDueAt({ a: newCard(NOW) }, NOW)).toBeNull();
  });
});

describe('forecast', () => {
  it('agrupa vencimientos en 7 días desde hoy', () => {
    const base = newCard(NOW);
    const cards: Record<string, StoredCard> = {
      a: { ...base, due: new Date(NOW).toISOString() },
      b: { ...base, due: new Date(NOW + DAY).toISOString() },
      c: { ...base, due: new Date(NOW + DAY + 3600_000).toISOString() },
      d: { ...base, due: new Date(NOW + 30 * DAY).toISOString() },
    };
    const result = forecast(cards, NOW);
    expect(result).toHaveLength(7);
    expect(result[0].count).toBe(1);
    expect(result[1].count).toBe(2);
    expect(result.reduce((sum, d) => sum + d.count, 0)).toBe(3);
  });
});
