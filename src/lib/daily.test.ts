import { describe, expect, it } from 'vitest';
import { UNITS } from '../data/curriculum';
import { dailyCharacter, dailyPhrase, dailyPrompt, dailySentence } from './daily';

const UNIT = UNITS[0];
const DATE = '2026-11-17';

describe('ritual diario', () => {
  it('elige un carácter de la unidad, con historia', () => {
    const daily = dailyCharacter(UNIT, DATE);
    expect(UNIT.words.some((word) => word.hanzi.includes(daily.char))).toBe(true);
    expect(daily.story.idea.length).toBeGreaterThan(15);
    expect(dailyCharacter(UNIT, DATE).char).toBe(daily.char);
  });

  it('elige una frase con audio de la unidad', () => {
    const daily = dailySentence(UNIT, DATE);
    expect(UNIT.words.some((word) => word.id === daily.word.id)).toBe(true);
    expect(daily.example.hanzi.trim()).not.toBe('');
    expect(daily.example.pinyin.trim()).not.toBe('');
  });

  it('prepara tres opciones de palabra para la frase', () => {
    const daily = dailyPhrase(UNIT, DATE);
    expect(daily.options).toHaveLength(3);
    expect(new Set(daily.options).size).toBe(3);
    expect(daily.options).toContain(daily.word.hanzi);
  });

  it('elige dos palabras y una frase modelo para producir', () => {
    const daily = dailyPrompt(UNIT, DATE);
    expect(daily.words).toHaveLength(2);
    expect(new Set(daily.words.map((word) => word.id)).size).toBe(2);
    expect(daily.model.trim()).not.toBe('');
    expect(daily.translation.trim()).not.toBe('');
  });
});
