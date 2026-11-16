import { describe, expect, it } from 'vitest';
import { checkDictation, isDictationCorrect, makeDictation } from './dictation';

const WORD = { hanzi: '你好', pinyin: 'nǐ hǎo' };

describe('dictado', () => {
  it('genera preguntas solo con palabras conocidas y sin repetir', () => {
    const ids = ['h1-01-w01', 'h1-01-w02', 'h1-01-w01', 'nope'];
    const questions = makeDictation(ids, 7, 10);
    expect(questions).toHaveLength(2);
    expect(new Set(questions.map((question) => question.id)).size).toBe(2);
  });

  it('respeta el límite y la semilla', () => {
    const ids = ['h1-01-w01', 'h1-01-w02', 'h1-01-w03', 'h1-01-w04'];
    const first = makeDictation(ids, 3, 2);
    expect(first).toHaveLength(2);
    expect(makeDictation(ids, 3, 2)).toEqual(first);
  });

  it('acepta hanzi exacto y pinyin con o sin tonos', () => {
    expect(checkDictation('你好', WORD)).toBe('hanzi');
    expect(checkDictation('nǐ hǎo', WORD)).toBe('ok');
    expect(checkDictation('ni hao', WORD)).toBe('sin-tonos');
    expect(isDictationCorrect('sin-tonos')).toBe(true);
    expect(isDictationCorrect(checkDictation('nǐ hǎo', WORD))).toBe(true);
  });

  it('rechaza otra palabra o una respuesta vacía', () => {
    expect(isDictationCorrect(checkDictation('谢谢', WORD))).toBe(false);
    expect(checkDictation('   ', WORD)).toBe('vacio');
  });
});
