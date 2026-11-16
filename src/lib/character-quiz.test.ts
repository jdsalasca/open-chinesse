import { describe, expect, it } from 'vitest';
import { getCharacterSheetData } from '../data/character-sheet';
import { makeCharacterQuiz } from './character-quiz';

describe('pregunta del carácter', () => {
  it('pregunta por la pieza fonética en un compuesto semántico-fonético', () => {
    const quiz = makeCharacterQuiz(getCharacterSheetData('请'));
    expect(quiz?.prompt).toContain('sonido');
    expect(quiz?.answer).toBe('青');
    expect(quiz?.options).toHaveLength(4);
    expect(new Set(quiz?.options).size).toBe(4);
  });

  it('cae al radical cuando no hay pieza fonética clara', () => {
    const quiz = makeCharacterQuiz(getCharacterSheetData('好'));
    expect(quiz?.prompt).toContain('radical');
    expect(quiz?.answer).toBe('女');
    expect(quiz?.options).toHaveLength(4);
  });

  it('es determinista para el mismo carácter', () => {
    expect(makeCharacterQuiz(getCharacterSheetData('请'))).toEqual(
      makeCharacterQuiz(getCharacterSheetData('请')),
    );
  });
});
