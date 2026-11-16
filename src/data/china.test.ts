import { describe, expect, it } from 'vitest';
import { CHINA_TEXTS } from './china';
import { ALL_WORDS } from './curriculum';

const PUNCTUATION = new Set([...'，。！？、：；·—…“”‘’（）《》']);

function allowed(): Set<string> {
  const chars = new Set<string>();
  for (const word of ALL_WORDS) for (const char of word.hanzi) chars.add(char);
  return chars;
}

describe('lecturas de cultura china', () => {
  it('usa solo caracteres del vocabulario del curso', () => {
    const vocabulary = allowed();
    const problems = CHINA_TEXTS.flatMap((text) =>
      text.lines.flatMap((line) => {
        const missing = [...line.hanzi].filter(
          (char) => !vocabulary.has(char) && !PUNCTUATION.has(char) && char.trim() !== '',
        );
        return missing.length > 0 ? [`${text.id}: faltan ${missing.join(' ')}`] : [];
      }),
    );
    expect(problems).toEqual([]);
  });

  it('cada línea trae pinyin, traducción y explicación', () => {
    for (const text of CHINA_TEXTS) {
      expect(text.lines.length).toBeGreaterThanOrEqual(6);
      for (const line of text.lines) {
        expect(line.pinyin.trim(), line.hanzi).not.toBe('');
        expect(line.translation.trim(), line.hanzi).not.toBe('');
        expect(line.explain.trim(), line.hanzi).not.toBe('');
      }
    }
  });

  it('cada pregunta tiene una sola respuesta correcta', () => {
    for (const text of CHINA_TEXTS) {
      expect(text.question.options.filter((option) => option.correct)).toHaveLength(1);
    }
  });

  it('no repite identificadores', () => {
    const ids = CHINA_TEXTS.map((text) => text.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
