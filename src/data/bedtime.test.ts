import { describe, expect, it } from 'vitest';
import { BEDTIME_STORIES } from './bedtime';
import { ALL_WORDS } from './curriculum';

const PUNCTUATION = new Set([...'，。！？、：；·—…“”‘’（）《》']);

function allowed(level: number): Set<string> {
  const chars = new Set<string>();
  for (const word of ALL_WORDS) {
    const unitLevel = word.id.startsWith('h1') ? 1 : word.id.startsWith('h2') ? 2 : 3;
    if (unitLevel <= level) for (const char of word.hanzi) chars.add(char);
  }
  return chars;
}

describe('cuentos para dormir', () => {
  it('usa solo vocabulario del nivel del cuento', () => {
    const problems = BEDTIME_STORIES.flatMap((story) => {
      const vocabulary = allowed(story.level);
      return story.lines.flatMap((line) => {
        const missing = [...line.hanzi].filter(
          (char) => !vocabulary.has(char) && !PUNCTUATION.has(char) && char.trim() !== '',
        );
        return missing.length > 0 ? [`${story.id}: faltan ${missing.join(' ')}`] : [];
      });
    });
    expect(problems).toEqual([]);
  });

  it('cada línea trae pinyin, traducción y explicación', () => {
    for (const story of BEDTIME_STORIES) {
      expect(story.lines.length).toBeGreaterThanOrEqual(6);
      for (const line of story.lines) {
        expect(line.pinyin.trim(), line.hanzi).not.toBe('');
        expect(line.translation.trim(), line.hanzi).not.toBe('');
        expect(line.explain.trim(), line.hanzi).not.toBe('');
      }
    }
  });

  it('no repite identificadores', () => {
    const ids = BEDTIME_STORIES.map((story) => story.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
