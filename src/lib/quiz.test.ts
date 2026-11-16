import { describe, expect, it } from 'vitest';
import { UNITS, WORDS_BY_ID, ALL_WORDS } from '../data/curriculum';
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
      }
    }
  });

  it('los distractores no repiten el significado correcto', () => {
    for (const unit of UNITS) {
      for (const question of makeQuiz(unit)) {
        const meaning = WORDS_BY_ID.get(question.wordId)!.meaning;
        const others = ALL_WORDS.filter((w) => w.id !== question.wordId && w.meaning === meaning);
        expect(others).toHaveLength(0);
      }
    }
  });

  it('es determinista para la misma unidad', () => {
    expect(makeQuiz(UNITS[0])).toEqual(makeQuiz(UNITS[0]));
  });
});
