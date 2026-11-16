import { describe, expect, it } from 'vitest';
import { Rating } from 'ts-fsrs';
import { UNITS } from '../data/curriculum';
import { newCard, review, type StoredCard } from './scheduler';
import { buildQueue, firstUnitWithContent, interleave, missingWords } from './queue';

const NOW = new Date('2026-11-15T10:00:00Z').getTime();
const UNIT = UNITS[0];
const OTHER = UNITS[1];
const THIRD = UNITS[2];

const cardsFor = (ids: string[], now = NOW): Record<string, StoredCard> =>
  Object.fromEntries(ids.map((id) => [id, newCard(now)]));

describe('buildQueue', () => {
  it('incluye solo las tarjetas vencidas', () => {
    const [first, second] = UNIT.words.map((w) => w.id);
    const cards = cardsFor([first, second]);
    const future = review(cards[second], Rating.Easy, NOW);
    const queue = buildQueue({ ...cards, [second]: future }, NOW);
    expect(queue.due).toContain(first);
    expect(queue.due).not.toContain(second);
  });

  it('mezcla unidades en lugar de agruparlas', () => {
    const ids = [UNIT.words[0].id, UNIT.words[1].id, OTHER.words[0].id, OTHER.words[1].id];
    const queue = buildQueue(cardsFor(ids), NOW);
    expect(queue.due).toEqual([ids[0], ids[2], ids[1], ids[3]]);
  });

  it('respeta el orden de vencimiento dentro de una unidad', () => {
    const [first, second] = UNIT.words.map((w) => w.id);
    const cards = cardsFor([first, second]);
    cards[second].due = new Date(NOW - 1000).toISOString();
    cards[first].due = new Date(NOW - 5000).toISOString();
    expect(buildQueue(cards, NOW).due.slice(0, 2)).toEqual([first, second]);
  });

  it('devuelve vacío sin tarjetas', () => {
    expect(buildQueue({}, NOW)).toEqual({ due: [], total: 0 });
  });
});

describe('interleave', () => {
  it('mantiene todos los elementos y alterna unidades', () => {
    const ids = [
      UNIT.words[0].id,
      UNIT.words[1].id,
      UNIT.words[2].id,
      OTHER.words[0].id,
      THIRD.words[0].id,
    ];
    const out = interleave(ids);
    expect(out).toHaveLength(5);
    expect(new Set(out).size).toBe(5);
    expect(out[0]).toBe(UNIT.words[0].id);
    expect(out[1]).toBe(OTHER.words[0].id);
    expect(out[2]).toBe(THIRD.words[0].id);
  });

  it('ignora palabras desconocidas sin perderlas', () => {
    expect(interleave(['fantasma'])).toEqual(['fantasma']);
  });
});

describe('missingWords', () => {
  it('devuelve solo las palabras sin tarjeta', () => {
    const cards = cardsFor([UNIT.words[0].id]);
    const missing = missingWords(cards, UNIT.id);
    expect(missing).toHaveLength(UNIT.words.length - 1);
    expect(missing).not.toContain(UNIT.words[0].id);
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
