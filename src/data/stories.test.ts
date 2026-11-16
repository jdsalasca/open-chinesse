import { describe, expect, it } from 'vitest';
import { ALL_WORDS } from './curriculum';
import { STORIES } from './stories';

const PUNCTUATION = new Set([...'，。！？、：；·—…“”‘’（）《》']);

/** Caracteres permitidos en una historia de nivel N: los de palabras de nivel ≤ N. */
function allowed(level: number): Set<string> {
  const chars = new Set<string>();
  for (const word of ALL_WORDS) {
    const unitLevel = word.id.startsWith('h1') ? 1 : word.id.startsWith('h2') ? 2 : 3;
    if (unitLevel <= level) for (const char of word.hanzi) chars.add(char);
  }
  return chars;
}

function requiredLevel(story: (typeof STORIES)[number]): number {
  for (let level = 1; level <= 3; level += 1) {
    const vocabulary = allowed(level);
    const missing = story.lines.some((line) =>
      [...line.hanzi].some(
        (char) => !vocabulary.has(char) && !PUNCTUATION.has(char) && char.trim() !== '',
      ),
    );
    if (!missing) return level;
  }
  return 4;
}

describe('graduación de las lecturas', () => {
  it('cada historia usa solo vocabulario de su nivel o inferior', () => {
    const problems = STORIES.flatMap((story) => {
      const required = requiredLevel(story);
      return required > story.level
        ? [`${story.id}: etiqueta HSK ${story.level}, necesita HSK ${required}`]
        : [];
    });
    expect(problems).toEqual([]);
  });

  it('cada línea trae pinyin y traducción', () => {
    for (const story of STORIES) {
      for (const line of story.lines) {
        expect(line.pinyin.trim(), line.hanzi).not.toBe('');
        expect(line.translation.trim(), line.hanzi).not.toBe('');
      }
    }
  });
});
