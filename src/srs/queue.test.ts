import { describe, expect, it } from 'vitest';
import { Rating } from 'ts-fsrs';
import { UNITS } from '../data/curriculum';
import { newCard, review, type StoredCard } from './scheduler';
import { buildQueue, firstUnitWithContent, interleave, missingWords } from './queue';

const NOW = new Date('2026-11-15T10:00:00Z').getTime();

const cardsFor = (ids: string[], now = NOW): Record<string, StoredCard> =>
  Object.fromEntries(ids.map((id) => [id, newCard(now)]));

describe('buildQueue', () => {
  it('incluye solo las tarjetas vencidas', () => {
    const cards = cardsFor(['u1-01', 'u1-02']);
    const future = review(cards['u1-02'], Rating.Easy, NOW);
    const queue = buildQueue({ ...cards, 'u1-02': future }, NOW);
    expect(queue.due).toContain('u1-01');
    expect(queue.due).not.toContain('u1-02');
  });

  it('mezcla unidades en lugar de agruparlas', () => {
    const cards = cardsFor(['u1-01', 'u1-02', 'u2-01', 'u2-02']);
    const queue = buildQueue(cards, NOW);
    expect(queue.due).toEqual(['u1-01', 'u2-01', 'u1-02', 'u2-02']);
  });

  it('respeta el orden de vencimiento dentro de una unidad', () => {
    const cards = cardsFor(['u1-01', 'u1-02']);
    cards['u1-02'].due = new Date(NOW - 1000).toISOString();
    cards['u1-01'].due = new Date(NOW - 5000).toISOString();
    expect(buildQueue(cards, NOW).due.slice(0, 2)).toEqual(['u1-01', 'u1-02']);
  });

  it('devuelve vacío sin tarjetas', () => {
    expect(buildQueue({}, NOW)).toEqual({ due: [], total: 0 });
  });
});

describe('interleave', () => {
  it('mantiene todos los elementos y alterna unidades', () => {
    const out = interleave(['u1-01', 'u1-02', 'u1-03', 'u2-01', 'u3-01']);
    expect(out).toHaveLength(5);
    expect(new Set(out).size).toBe(5);
    expect(out[0]).toBe('u1-01');
    expect(out[1]).toBe('u2-01');
    expect(out[2]).toBe('u3-01');
  });
});

describe('missingWords', () => {
  it('devuelve solo las palabras sin tarjeta', () => {
    const unit = UNITS[0];
    const cards = cardsFor([unit.words[0].id]);
    const missing = missingWords(cards, unit.id);
    expect(missing).toHaveLength(unit.words.length - 1);
    expect(missing).not.toContain(unit.words[0].id);
  });

  it('devuelve vacío para unidad inexistente', () => {
    expect(missingWords({}, 'nope')).toEqual([]);
  });
});

describe('firstUnitWithContent', () => {
  it('salta unidades completadas', () => {
    expect(firstUnitWithContent([])).toBe(UNITS[0].id);
    expect(firstUnitWithContent([UNITS[0].id])).toBe(UNITS[1].id);
  });
});
