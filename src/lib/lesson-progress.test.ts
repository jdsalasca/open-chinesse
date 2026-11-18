import { beforeEach, describe, expect, it } from 'vitest';
import { clearLessonPart, loadLessonPart, saveLessonPart } from './lesson-progress';

describe('lesson-progress', () => {
  beforeEach(() => localStorage.clear());

  it('empieza en la parte 1 y guarda solo partes válidas', () => {
    expect(loadLessonPart('h1-01')).toBe(1);
    saveLessonPart('h1-01', 2);
    expect(loadLessonPart('h1-01')).toBe(2);
    saveLessonPart('h1-01', 9);
    expect(loadLessonPart('h1-01')).toBe(2);
    saveLessonPart('h1-01', 1);
    expect(loadLessonPart('h1-01')).toBe(2);
  });

  it('separa el progreso por unidad', () => {
    saveLessonPart('h1-01', 3);
    expect(loadLessonPart('h1-01')).toBe(3);
    expect(loadLessonPart('h1-02')).toBe(1);
  });

  it('limpia la parte al terminar', () => {
    saveLessonPart('h1-01', 2);
    clearLessonPart('h1-01');
    expect(loadLessonPart('h1-01')).toBe(1);
  });
});
