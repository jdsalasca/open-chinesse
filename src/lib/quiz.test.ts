import { describe, expect, it } from 'vitest';
import { UNITS, WORDS_BY_ID } from '../data/curriculum';
import { makeQuiz, segment } from './quiz';

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
        if (question.mode === 'order') continue;
        const meaning = WORDS_BY_ID.get(question.wordId)!.meaning;
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
        expect(question.options).toContain(meaning);
        expect(question.options.filter((o) => o === meaning)).toHaveLength(1);
        expect(question.answer).toBe(meaning);
      }
    }
  });

  it('es determinista para la misma unidad', () => {
    for (const unit of UNITS) {
      expect(makeQuiz(unit)).toEqual(makeQuiz(unit));
    }
  });
});

describe('segment', () => {
  it('corta por palabras del curso', () => {
    expect(segment('阿姨，你喝茶吗？')).toEqual(['阿姨，', '你', '喝', '茶', '吗？']);
  });

  it('prefiere la palabra más larga', () => {
    expect(segment('我在办公室工作。')).toEqual(['我', '在', '办公室', '工作。']);
  });

  it('pega la puntuación a la pieza anterior', () => {
    expect(segment('除了他，我们都去了。')).toEqual(['除了', '他，', '我们', '都', '去', '了。']);
  });
});

describe('ejercicio de ordenar', () => {
  it('incluye dos frases por unidad con piezas únicas', () => {
    for (const unit of UNITS) {
      const orders = makeQuiz(unit).filter((q) => q.mode === 'order');
      expect(orders).toHaveLength(2);
      for (const question of orders) {
        const word = WORDS_BY_ID.get(question.wordId)!;
        const chunks = segment(word.example.hanzi);
        expect(question.options).toHaveLength(chunks.length);
        expect([...question.options].sort()).toEqual([...chunks].sort());
        expect(new Set(question.options).size).toBe(question.options.length);
      }
    }
  });
});
