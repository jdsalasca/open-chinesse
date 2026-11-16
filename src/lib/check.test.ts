import { describe, expect, it } from 'vitest';
import { ALL_WORDS } from '../data/curriculum';
import { isDue, makeCheck, optionState } from './check';

describe('prueba de retención', () => {
  it('genera una pregunta por palabra, con cuatro opciones distintas y la respuesta dentro', () => {
    const ids = ALL_WORDS.slice(0, 10).map((word) => word.id);
    const questions = makeCheck(ids);
    expect(questions.map((question) => question.wordId)).toEqual(ids);
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options).toContain(question.answer);
    }
  });

  it('la respuesta no cae siempre en la primera posición', () => {
    const ids = ALL_WORDS.slice(0, 8).map((word) => word.id);
    const positions = makeCheck(ids).map((question) => question.options.indexOf(question.answer));
    expect(new Set(positions).size).toBeGreaterThan(1);
  });

  it('ignora palabras que no existen', () => {
    expect(makeCheck(['no-existe'])).toEqual([]);
  });
});

describe('fecha de la prueba', () => {
  it('no se abre antes de siete días ni dos veces', () => {
    const retention = { dueAt: 1_000 };
    expect(isDue(retention, 999)).toBe(false);
    expect(isDue(retention, 1_000)).toBe(true);
    expect(isDue({ ...retention, takenAt: 1_200 }, 1_300)).toBe(false);
  });
});

describe('estado visual de las opciones', () => {
  it('sin elegir no marca nada', () => {
    expect(optionState('a', null, 'a')).toBe('');
  });

  it('marca acierto, fallo y el resto apagado', () => {
    expect(optionState('a', 'b', 'a')).toBe(' is-correct');
    expect(optionState('b', 'b', 'a')).toBe(' is-wrong');
    expect(optionState('c', 'b', 'a')).toBe(' is-muted');
  });
});
