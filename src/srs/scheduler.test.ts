import { describe, expect, it } from 'vitest';
import { Rating, State } from 'ts-fsrs';
import {
  GRADES,
  dueAt,
  formatInterval,
  isDue,
  isMature,
  isUsableCard,
  needsProduction,
  newCard,
  preview,
  review,
  toStored,
  toCard,
  type StoredCard,
} from './scheduler';

const NOW = new Date('2026-11-15T10:00:00Z').getTime();

describe('newCard', () => {
  it('nace vencida y en estado New', () => {
    const card = newCard(NOW);
    expect(card.state).toBe(State.New);
    expect(dueAt(card)).toBe(NOW);
    expect(isDue(card, NOW)).toBe(true);
  });

  it('sobrevive a JSON sin perder fechas', () => {
    const card = newCard(NOW);
    const copy: StoredCard = JSON.parse(JSON.stringify(card));
    expect(dueAt(copy)).toBe(NOW);
    expect(JSON.stringify(toStored(toCard(copy)))).toBe(JSON.stringify(card));
  });
});

describe('review', () => {
  it('"Bien" en tarjeta nueva programa un paso de aprendizaje corto', () => {
    const card = review(newCard(NOW), Rating.Good, NOW);
    expect(dueAt(card) - NOW).toBeLessThan(86_400_000);
    expect(card.reps).toBe(1);
  });

  it('los intervalos crecen con respuestas correctas sucesivas', () => {
    let card = newCard(NOW);
    let at = NOW;
    const intervals: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      card = review(card, Rating.Good, at);
      intervals.push(dueAt(card) - at);
      at = dueAt(card);
    }
    for (let i = 1; i < intervals.length; i += 1) {
      expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
    }
  });

  it('"Otra vez" produce un intervalo menor que "Bien"', () => {
    let card = newCard(NOW);
    card = review(card, Rating.Good, NOW);
    const later = dueAt(card);
    const again = review(card, Rating.Again, later);
    const good = review(card, Rating.Good, later);
    expect(dueAt(again) - later).toBeLessThan(dueAt(good) - later);
  });

  it('"Fácil" separa más que "Difícil"', () => {
    const base = review(newCard(NOW), Rating.Good, NOW);
    const at = dueAt(base);
    expect(dueAt(review(base, Rating.Easy, at))).toBeGreaterThan(dueAt(review(base, Rating.Hard, at)));
  });
});

describe('preview', () => {
  it('ofrece las cuatro calificaciones con etiqueta', () => {
    const result = preview(newCard(NOW), NOW);
    for (const grade of GRADES) {
      expect(result[grade].label).toMatch(/\d/);
      expect(result[grade].due).toBeGreaterThanOrEqual(NOW);
    }
  });
});

describe('estados', () => {
  it('distingue nueva, madura y producción', () => {
    const card = newCard(NOW);
    expect(isMature(card)).toBe(false);
    expect(needsProduction(card)).toBe(false);
    // La primera pasada sigue siendo reconocimiento; la segunda exige producir.
    const first = review(card, Rating.Good, NOW);
    expect(needsProduction(first)).toBe(false);
    expect(needsProduction(review(first, Rating.Good, dueAt(first)))).toBe(true);
    expect(isMature({ ...card, state: State.Review, scheduled_days: 30 })).toBe(true);
  });
});

describe('tarjetas corruptas', () => {
  const corrupt: StoredCard = {
    due: new Date(NOW - 1000).toISOString(),
    stability: 6,
    difficulty: 0,
    scheduled_days: 3,
    learning_steps: 0,
    reps: 4,
    lapses: 1,
    state: State.Review,
  };

  it('detecta un estado imposible', () => {
    expect(isUsableCard(corrupt)).toBe(false);
    expect(isUsableCard(newCard(NOW))).toBe(true);
  });

  it('no rompe la previsualización', () => {
    expect(() => preview(corrupt, NOW)).not.toThrow();
    expect(preview(corrupt, NOW)[Rating.Good].label).toMatch(/\d/);
  });

  it('calificar repara la tarjeta', () => {
    const repaired = review(corrupt, Rating.Good, NOW);
    expect(isUsableCard(repaired)).toBe(true);
    expect(repaired.due).toBeTruthy();
  });
});

describe('formatInterval', () => {  it('usa unidades legibles', () => {
    expect(formatInterval(60_000)).toBe('1 min');
    expect(formatInterval(3 * 60 * 60_000)).toBe('3 h');
    expect(formatInterval(3 * 86_400_000)).toBe('3 d');
    expect(formatInterval(60 * 86_400_000)).toBe('2 meses');
    expect(formatInterval(400 * 86_400_000)).toBe('1 años');
  });
});
