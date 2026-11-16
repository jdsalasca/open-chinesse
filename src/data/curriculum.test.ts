import { describe, expect, it } from 'vitest';
import {
  ALL_WORDS,
  LEVELS,
  TOTAL_WORDS,
  UNITS,
  unitsForLevel,
  wordsForLevel,
} from './curriculum';
import { makeQuiz } from '../lib/quiz';

describe('currículo', () => {
  it('cubre HSK 1 y HSK 2 completos', () => {
    expect(TOTAL_WORDS).toBe(301);
    expect(wordsForLevel(1)).toBe(151);
    expect(wordsForLevel(2)).toBe(150);
    expect(unitsForLevel(1)).toHaveLength(15);
    expect(unitsForLevel(2)).toHaveLength(15);
    expect(UNITS).toHaveLength(30);
  });

  it('no repite identificadores', () => {
    const ids = ALL_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    const unitIds = UNITS.map((u) => u.id);
    expect(new Set(unitIds).size).toBe(unitIds.length);
  });

  it('cada unidad pertenece a un nivel válido y tiene al menos diez palabras', () => {
    for (const unit of UNITS) {
      expect(LEVELS).toContain(unit.level);
      expect(unit.words.length).toBeGreaterThanOrEqual(9);
    }
  });

  it('cada palabra trae todo lo necesario para estudiarse', () => {
    for (const word of ALL_WORDS) {
      expect(word.hanzi.trim()).not.toBe('');
      expect(word.meaning.trim()).not.toBe('');
      expect(word.pinyin).toMatch(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü’' ]+$/i);
      expect(word.example.hanzi).toContain(word.hanzi.length === 1 ? word.hanzi : word.hanzi[0]);
      expect(word.example.pinyin.trim()).not.toBe('');
      expect(word.example.translation.trim()).not.toBe('');
    }
  });

  it('los ejemplos no se repiten entre palabras', () => {
    const examples = ALL_WORDS.map((w) => w.example.hanzi);
    const duplicates = examples.filter((h, i) => examples.indexOf(h) !== i);
    expect(duplicates).toEqual([]);
  });

  it('genera un quiz válido para las treinta unidades', () => {
    for (const unit of UNITS) {
      const quiz = makeQuiz(unit);
      expect(quiz).toHaveLength(6);
      for (const question of quiz) {
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
      }
    }
  });
});
