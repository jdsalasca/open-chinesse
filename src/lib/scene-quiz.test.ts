import { describe, expect, it } from 'vitest';
import { MICRO_STORIES } from '../data/micro';
import { SCENE_QUESTIONS } from '../data/scenes';
import { pickSceneQuestions } from './scene-quiz';

describe('¿qué pasó en la escena?', () => {
  it('cada pregunta apunta a una micro-lectura y a una evidencia válida', () => {
    expect(SCENE_QUESTIONS.length).toBeGreaterThanOrEqual(12);
    expect(new Set(SCENE_QUESTIONS.map((item) => item.id)).size).toBe(SCENE_QUESTIONS.length);
    for (const item of SCENE_QUESTIONS) {
      const story = MICRO_STORIES.find((candidate) => candidate.id === item.storyId);
      expect(story, item.id).toBeDefined();
      expect(item.options, item.id).toHaveLength(2);
      expect(
        item.options.filter((option) => option.correct),
        item.id,
      ).toHaveLength(1);
      expect(item.evidence, item.id).toBeGreaterThanOrEqual(0);
      expect(item.evidence, item.id).toBeLessThan(story!.lines.length);
      expect(item.explain.trim(), item.id).not.toBe('');
    }
  });

  it('elige ocho escenas distintas y estables', () => {
    const first = pickSceneQuestions('2026-11-17');
    expect(first).toHaveLength(8);
    expect(new Set(first.map((item) => item.id)).size).toBe(8);
    expect(pickSceneQuestions('2026-11-17').map((item) => item.id)).toEqual(
      first.map((item) => item.id),
    );
    const positions = first.map((item) => item.options.findIndex((option) => option.correct));
    expect(new Set(positions).size).toBeGreaterThan(1);
  });
});
