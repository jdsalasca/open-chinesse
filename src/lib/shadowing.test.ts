import { describe, expect, it } from 'vitest';
import { shadowingTexts } from './shadowing';

describe('repite en voz alta', () => {
  it('incluye historias y lecturas con audio', () => {
    const texts = shadowingTexts();
    expect(texts.length).toBeGreaterThanOrEqual(10);
    expect(new Set(texts.map((text) => text.id)).size).toBe(texts.length);
    expect(texts.some((text) => text.id.startsWith('story-'))).toBe(true);
    expect(texts.some((text) => text.id.startsWith('china-'))).toBe(true);
    expect(texts.filter((text) => text.level === 1).length).toBeGreaterThanOrEqual(15);
  });

  it('cada texto tiene líneas y prefijo de audio', () => {
    for (const text of shadowingTexts()) {
      expect(text.lines.length, text.id).toBeGreaterThan(0);
      expect(text.prefix.trim(), text.id).not.toBe('');
      expect(
        text.lines.every((line) => line.hanzi.trim() !== ''),
        text.id,
      ).toBe(true);
    }
  });
});
