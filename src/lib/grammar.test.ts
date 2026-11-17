import { describe, expect, it } from 'vitest';
import { GRAMMAR_TOPICS, grammarTopic } from '../data/grammar';
import { afterCheck, afterPractice, failedItems, grammarStage } from './grammar';

const DAY = 86_400_000;
const NOW = new Date('2026-11-16T10:00:00Z').getTime();

describe('contenido de gramática', () => {
  it('tiene un tema HSK 1 con práctica y prueba separadas', () => {
    const topic = grammarTopic('bu-mei');
    expect(topic?.level).toBe(1);
    expect(topic?.practice).toHaveLength(7);
    expect(topic?.check).toHaveLength(5);
    const ids = [...topic!.practice, ...topic!.check].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(topic!.check.every((item) => !topic!.practice.some((p) => p.id === item.id))).toBe(true);
  });

  it('cada ítem tiene una sola respuesta y explica el porqué', () => {
    expect(GRAMMAR_TOPICS.length).toBeGreaterThanOrEqual(1);
    for (const topic of GRAMMAR_TOPICS) {
      for (const item of [...topic.practice, ...topic.check]) {
        expect(
          item.options.filter((option) => option.correct),
          item.id,
        ).toHaveLength(1);
        expect(item.explain.trim(), item.id).not.toBe('');
        expect(item.pinyin.trim(), item.id).not.toBe('');
        expect(item.translation.trim(), item.id).not.toBe('');
        expect(item.prompt.trim(), item.id).not.toBe('');
      }
    }
  });
});

describe('programación de la gramática', () => {
  it('programa repaso a 3 días y prueba a 7', () => {
    const progress = afterPractice(undefined, ['p1'], NOW);
    expect(progress.dueAt).toBe(NOW + 3 * DAY);
    expect(progress.checkAt).toBe(NOW + 7 * DAY);
    expect(progress.failed).toEqual(['p1']);
    expect(progress.check).toBeUndefined();
  });

  it('recorre las etapas', () => {
    expect(grammarStage(undefined, NOW)).toBe('new');
    const progress = afterPractice(undefined, [], NOW);
    expect(grammarStage(progress, NOW + DAY)).toBe('scheduled');
    expect(grammarStage(progress, NOW + 3 * DAY)).toBe('practice-due');
    expect(grammarStage(progress, NOW + 7 * DAY)).toBe('check-ready');
    const checked = afterCheck(progress, 4, 5, NOW + 7 * DAY);
    expect(grammarStage(checked, NOW + 8 * DAY)).toBe('checked');
  });

  it('no retrasa la prueba al repetir la práctica', () => {
    const first = afterPractice(undefined, [], NOW);
    const again = afterPractice(first, [], NOW + 2 * DAY);
    expect(again.checkAt).toBe(NOW + 7 * DAY);
    expect(again.dueAt).toBe(NOW + 5 * DAY);
  });

  it('conserva el resultado de la primera prueba', () => {
    const progress = afterPractice(undefined, [], NOW);
    const first = afterCheck(progress, 4, 5, NOW + 7 * DAY);
    const second = afterCheck(first, 5, 5, NOW + 8 * DAY);
    expect(second.check).toEqual({ score: 4, total: 5, at: NOW + 7 * DAY });
  });

  it('lista solo los fallos que siguen en el tema', () => {
    const topic = grammarTopic('bu-mei')!;
    const progress = afterPractice(undefined, [topic.practice[0].id, 'fantasma'], NOW);
    expect(failedItems(topic, progress).map((item) => item.id)).toEqual([topic.practice[0].id]);
  });
});
