import { WORDS_BY_ID, type Word } from '../data/curriculum';
import { lcg, shuffle } from './random';
import { segment } from './quiz';
import { checkPinyin } from './tone';

export type ClozeQuestion = {
  wordId: string;
  prompt: string;
  translation: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  exampleHanzi: string;
  examplePinyin: string;
};

export type ClozeResult = 'hanzi' | 'ok' | 'sin-tonos' | 'tonos' | 'mal' | 'vacio';

const HAN = /[\u4e00-\u9fff]/;

/**
 * Hueco de una palabra del ejemplo. Solo vale si la palabra aparece una vez y
 * como pieza completa según el vocabulario del curso: nunca dentro de un compuesto.
 */
export function blankSentence(word: Word): string | null {
  const { hanzi } = word.example;
  const chunks = segment(hanzi);
  const index = chunks.indexOf(word.hanzi);
  if (index < 0) return null;
  if (hanzi.split(word.hanzi).length - 1 !== 1) return null;
  const chunk = chunks[index];
  const punctuation = chunk.match(/[，。！？、：；]+$/)?.[0] ?? '';
  return [...chunks.slice(0, index), `＿＿${punctuation}`, ...chunks.slice(index + 1)].join('');
}

export function makeCloze(wordIds: string[], seed = 1, limit = 6): ClozeQuestion[] {
  const words = wordIds
    .map((id) => WORDS_BY_ID.get(id))
    .filter((word): word is Word => Boolean(word));
  const questions: ClozeQuestion[] = [];
  const seen = new Set<string>();

  for (const word of shuffle(words, lcg(seed))) {
    if (questions.length >= limit) break;
    if (seen.has(word.id)) continue;
    const prompt = blankSentence(word);
    if (!prompt) continue;
    seen.add(word.id);
    questions.push({
      wordId: word.id,
      prompt,
      translation: word.example.translation,
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      meaning: word.meaning,
      exampleHanzi: word.example.hanzi,
      examplePinyin: word.example.pinyin,
    });
  }
  return questions;
}

/** Acepta el carácter exacto o el pinyin de la palabra que falta. */
export function checkCloze(input: string, word: Pick<Word, 'hanzi' | 'pinyin'>): ClozeResult {
  const value = input.trim();
  if (!value) return 'vacio';
  if (HAN.test(value)) return value === word.hanzi ? 'hanzi' : 'mal';
  return checkPinyin(value, word.pinyin);
}

export function isClozeCorrect(result: ClozeResult): boolean {
  return result === 'hanzi' || result === 'ok' || result === 'sin-tonos';
}
