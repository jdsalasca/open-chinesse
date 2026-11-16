import { WORDS_BY_ID, type Word } from '../data/curriculum';
import { checkCloze, isClozeCorrect } from './cloze';
import { lcg, shuffle } from './random';

export type DictationQuestion = Pick<Word, 'id' | 'hanzi' | 'pinyin' | 'meaning'>;

/** Palabras ya estudiadas, sin repetir, en orden reproducible por semilla. */
export function makeDictation(wordIds: string[], seed = 1, limit = 10): DictationQuestion[] {
  const words = [...new Set(wordIds)]
    .map((id) => WORDS_BY_ID.get(id))
    .filter((word): word is Word => Boolean(word));
  return shuffle(words, lcg(seed))
    .slice(0, limit)
    .map(({ id, hanzi, pinyin, meaning }) => ({ id, hanzi, pinyin, meaning }));
}

/** Acepta el hanzi exacto o el pinyin, con tonos o sin ellos. */
export const checkDictation = checkCloze;
export const isDictationCorrect = isClozeCorrect;
