import { describe, expect, it } from 'vitest';
import { ALL_WORDS, LEVELS, TOTAL_WORDS, UNITS, unitsForLevel, wordsForLevel } from './curriculum';
import { makeQuiz } from '../lib/quiz';

function expectStudiable(word: (typeof ALL_WORDS)[number]): void {
  expect(word.hanzi.trim()).not.toBe('');
  expect(word.meaning.trim()).not.toBe('');
  expect(word.pinyin).toMatch(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü’' ]+$/i);
  expect(word.example.hanzi).toContain(word.hanzi[0]);
  expect(word.example.pinyin.trim()).not.toBe('');
  expect(word.example.translation.trim()).not.toBe('');
}

function expectValidQuiz(unit: (typeof UNITS)[number]): void {
  const quiz = makeQuiz(unit);
  expect(quiz).toHaveLength(6);
  for (const question of quiz) {
    expect(question.options).toHaveLength(4);
    expect(new Set(question.options).size).toBe(4);
  }
}

describe('currículo', () => {
  it('cubre HSK 1 y HSK 2 completos', () => {
    expect(TOTAL_WORDS).toBe(301);
    expect(wordsForLevel(1)).toBe(151);
    expect(wordsForLevel(2)).toBe(150);
    expect(unitsForLevel(1)).toHaveLength(15);
    expect(unitsForLevel(2)).toHaveLength(15);
  });

  it('no repite identificadores', () => {
    const ids = ALL_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(UNITS.map((u) => u.id)).size).toBe(UNITS.length);
  });

  it('cada unidad tiene nivel válido y al menos nueve palabras', () => {
    for (const unit of UNITS) {
      expect(LEVELS).toContain(unit.level);
      expect(unit.words.length).toBeGreaterThanOrEqual(9);
    }
  });
});

describe('contenido de cada palabra', () => {
  it('trae todo lo necesario para estudiarse', () => {
    for (const word of ALL_WORDS) expectStudiable(word);
  });

  it('no repite frases de ejemplo', () => {
    const examples = ALL_WORDS.map((w) => w.example.hanzi);
    expect(examples.filter((h, i) => examples.indexOf(h) !== i)).toEqual([]);
  });

  it('genera un quiz válido para las treinta unidades', () => {
    for (const unit of UNITS) expectValidQuiz(unit);
  });
});
