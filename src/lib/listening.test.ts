import { describe, expect, it } from 'vitest';
import { listeningExercises } from './listening';

describe('comprensión auditiva', () => {
  it('incluye historias y lecturas de China con pregunta', () => {
    const exercises = listeningExercises();
    expect(exercises.length).toBeGreaterThanOrEqual(6);
    expect(new Set(exercises.map((exercise) => exercise.id)).size).toBe(exercises.length);
    expect(exercises.some((exercise) => exercise.id.startsWith('story-'))).toBe(true);
    expect(exercises.some((exercise) => exercise.id.startsWith('china-'))).toBe(true);
  });

  it('cada audio tiene líneas y una sola respuesta correcta', () => {
    for (const exercise of listeningExercises()) {
      expect(exercise.lines.length, exercise.id).toBeGreaterThan(0);
      expect(exercise.prefix.trim(), exercise.id).not.toBe('');
      expect(
        exercise.question.options.filter((option) => option.correct),
        exercise.id,
      ).toHaveLength(1);
      expect(exercise.question.explain.trim(), exercise.id).not.toBe('');
    }
  });
});
