import { WORDS_BY_ID, type Word } from '../data/curriculum';
import { checkCloze, isClozeCorrect, type ClozeResult } from './cloze';
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

/** En modo estricto, el pinyin sin tonos no cuenta como acierto. */
export function isDictationAccepted(result: ClozeResult, strictTones: boolean): boolean {
  if (result === 'hanzi' || result === 'ok') return true;
  return !strictTones && result === 'sin-tonos';
}
