import { describe, expect, it } from 'vitest';
import { reviewStage } from './review-stage';

describe('etapa del repaso', () => {
  it('sin cola está vacío', () => {
    expect(reviewStage(0, 0)).toBe('empty');
  });

  it('con cola pendiente muestra la pregunta', () => {
    expect(reviewStage(5, 0)).toBe('question');
    expect(reviewStage(5, 4)).toBe('question');
  });

  it('al agotar la cola muestra el resumen, no «vacío»', () => {
    expect(reviewStage(5, 5)).toBe('summary');
    expect(reviewStage(5, 6)).toBe('summary');
  });
});
