import { describe, expect, it } from 'vitest';
import { TRANSFORMATIONS } from '../data/transformations';
import { pickTransformations } from './transformation-quiz';

describe('cambia la intención', () => {
  it('tiene veinte transformaciones con una sola respuesta correcta', () => {
    expect(TRANSFORMATIONS).toHaveLength(20);
    expect(new Set(TRANSFORMATIONS.map((item) => item.id)).size).toBe(TRANSFORMATIONS.length);
    for (const item of TRANSFORMATIONS) {
      expect(item.base.hanzi.trim(), item.id).not.toBe('');
      expect(item.base.translation.trim(), item.id).not.toBe('');
      expect(item.intent.trim(), item.id).not.toBe('');
      expect(item.explain.trim(), item.id).not.toBe('');
      expect(item.options, item.id).toHaveLength(3);
      expect(
        item.options.filter((option) => option.correct),
        item.id,
      ).toHaveLength(1);
      const answer = item.options.find((option) => option.correct)!;
      expect(answer.hanzi, item.id).not.toBe(item.base.hanzi);
      for (const option of item.options) {
        expect(option.pinyin.trim(), item.id).not.toBe('');
        expect(option.translation.trim(), item.id).not.toBe('');
      }
    }
  });

  it('elige diez transformaciones distintas y estables', () => {
    const first = pickTransformations('2026-11-17');
    expect(first).toHaveLength(10);
    expect(new Set(first.map((item) => item.id)).size).toBe(10);
    expect(pickTransformations('2026-11-17').map((item) => item.id)).toEqual(
      first.map((item) => item.id),
    );
    const positions = first.map((item) => item.options.findIndex((option) => option.correct));
    expect(new Set(positions).size).toBeGreaterThan(1);
  });
});
