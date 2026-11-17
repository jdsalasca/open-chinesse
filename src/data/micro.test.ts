import { describe, expect, it } from 'vitest';
import { UNITS } from './curriculum';
import { MICRO_STORIES } from './micro';

const HSK1 = UNITS.filter((unit) => unit.level === 1);

describe('micro-lecturas HSK 1', () => {
  it('hay una por unidad y en el mismo orden', () => {
    expect(MICRO_STORIES).toHaveLength(15);
    expect(MICRO_STORIES.map((story) => story.unitId)).toEqual(HSK1.map((unit) => unit.id));
  });

  it('cada una tiene 3 o 4 líneas y una sola respuesta correcta', () => {
    for (const story of MICRO_STORIES) {
      expect(story.level, story.id).toBe(1);
      expect(story.kind, story.id).toBe('micro-lectura');
      expect(story.lines.length, story.id).toBeGreaterThanOrEqual(3);
      expect(story.lines.length, story.id).toBeLessThanOrEqual(4);
      expect(story.question, story.id).toBeDefined();
      expect(
        story.question!.options.filter((option) => option.correct),
        story.id,
      ).toHaveLength(1);
      expect(story.question!.explain.trim(), story.id).not.toBe('');
    }
  });

  it('cada texto usa al menos dos palabras de su unidad', () => {
    const byId = new Map(HSK1.map((unit) => [unit.id, unit]));
    for (const story of MICRO_STORIES) {
      const unit = byId.get(story.unitId ?? '');
      expect(unit, story.id).toBeDefined();
      const used = unit!.words.filter((word) =>
        story.lines.some((line) => line.hanzi.includes(word.hanzi)),
      );
      expect(used.length, story.id).toBeGreaterThanOrEqual(2);
    }
  });
});
