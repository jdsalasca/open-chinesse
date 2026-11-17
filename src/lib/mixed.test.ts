import { describe, expect, it } from 'vitest';
import { makeMixed } from './mixed';

const IDS = Array.from(
  { length: 10 },
  (_, index) => `h1-01-w${String(index + 1).padStart(2, '0')}`,
);

describe('sesión mixta', () => {
  it('genera hasta diez preguntas sin repetir identificadores', () => {
    const questions = makeMixed(IDS, 5, 10);
    expect(questions.length).toBe(10);
    expect(new Set(questions.map((question) => question.id)).size).toBe(10);
  });

  it('cada pregunta tiene cuatro opciones únicas y la respuesta está entre ellas', () => {
    for (const question of makeMixed(IDS, 5, 10)) {
      expect(question.options, question.id).toHaveLength(4);
      expect(new Set(question.options).size, question.id).toBe(4);
      expect(question.options, question.id).toContain(question.answer);
      expect(question.explanation.trim(), question.id).not.toBe('');
    }
  });

  it('mezcla más de un tipo de recuperación', () => {
    const kinds = new Set(makeMixed(IDS, 5, 10).map((question) => question.kind));
    expect(kinds.size).toBeGreaterThan(1);
    expect(kinds.has('context')).toBe(true);
  });

  it('es reproducible con la misma semilla', () => {
    expect(makeMixed(IDS, 9, 10)).toEqual(makeMixed(IDS, 9, 10));
  });
});
