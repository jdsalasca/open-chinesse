import { describe, expect, it } from 'vitest';
import { UNITS, WORDS_BY_ID } from '../data/curriculum';
import { makeQuiz } from './quiz';

describe('makeQuiz', () => {
  it('genera seis preguntas de la unidad', () => {
    for (const unit of UNITS) {
      const quiz = makeQuiz(unit);
      expect(quiz).toHaveLength(6);
      for (const question of quiz) {
        expect(unit.words.some((w) => w.id === question.wordId)).toBe(true);
      }
    }
  });

  it('cada pregunta tiene cuatro opciones únicas con su respuesta', () => {
    for (const unit of UNITS) {
      for (const question of makeQuiz(unit)) {
        const meaning = WORDS_BY_ID.get(question.wordId)!.meaning;
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
        expect(question.options).toContain(meaning);
        expect(question.options.filter((o) => o === meaning)).toHaveLength(1);
      }
    }
  });

  it('es determinista para la misma unidad', () => {
    for (const unit of UNITS) {
      expect(makeQuiz(unit)).toEqual(makeQuiz(unit));
    }
  });
});
