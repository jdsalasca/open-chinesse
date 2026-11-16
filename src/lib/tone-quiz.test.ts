import { describe, expect, it } from 'vitest';
import { ALL_WORDS, WORDS_BY_ID } from '../data/curriculum';
import { makeToneQuiz } from './tone-quiz';
import { stripTones } from './tone';

describe('makeToneQuiz', () => {
  const quiz = makeToneQuiz(ALL_WORDS, 8, 3);

  it('genera las preguntas pedidas con cuatro opciones únicas', () => {
    expect(quiz).toHaveLength(8);
    for (const question of quiz) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options).toContain(question.answer);
    }
  });

  it('los distractores cambian solo el tono', () => {
    for (const question of quiz) {
      for (const option of question.options) {
        expect(stripTones(option), option).toBe(stripTones(question.answer));
      }
    }
  });

  it('mantiene intactas las demás sílabas', () => {
    const base = WORDS_BY_ID.get('h3-18-w10');
    if (!base) throw new Error('falta 一直 en el currículo');
    const [joined] = makeToneQuiz([base], 1, 2);
    for (const option of joined.options) expect(option.endsWith('zhí')).toBe(true);
    const [spaced] = makeToneQuiz([{ ...base, pinyin: 'yì zhí' }], 1, 2);
    for (const option of spaced.options) expect(option.split(' ')[1]).toBe('zhí');
  });

  it('es determinista con la misma semilla', () => {
    expect(makeToneQuiz(ALL_WORDS, 8, 3)).toEqual(quiz);
  });
});
