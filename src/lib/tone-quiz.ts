import type { Word } from '../data/curriculum';
import { type Tone } from './tone';

export type ToneQuestion = {
  wordId: string;
  answer: string;
  options: string[];
};

const MARKS: Record<string, Record<Exclude<Tone, 5>, string>> = {
  a: { 1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à' },
  e: { 1: 'ē', 2: 'é', 3: 'ě', 4: 'è' },
  i: { 1: 'ī', 2: 'í', 3: 'ǐ', 4: 'ì' },
  o: { 1: 'ō', 2: 'ó', 3: 'ǒ', 4: 'ò' },
  u: { 1: 'ū', 2: 'ú', 3: 'ǔ', 4: 'ù' },
  ü: { 1: 'ǖ', 2: 'ǘ', 3: 'ǚ', 4: 'ǜ' },
};

const INVERSE: Record<string, { vowel: string; tone: Exclude<Tone, 5> }> = {};
for (const [vowel, marks] of Object.entries(MARKS)) {
  for (const [tone, char] of Object.entries(marks)) {
    INVERSE[char] = { vowel, tone: Number(tone) as Exclude<Tone, 5> };
  }
}

function lcg(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Cambia solo la marca de la primera sílaba acentuada y deja el resto intacto. */
function variants(answer: string): string[] {
  const chars = [...answer];
  const index = chars.findIndex((char) => INVERSE[char]);
  if (index < 0) return [];

  const { vowel, tone } = INVERSE[chars[index]];
  const options = new Set([answer]);
  for (let step = 1; step < 5 && options.size < 4; step += 1) {
    const other = (((tone - 1 + step) % 4) + 1) as Exclude<Tone, 5>;
    const copy = [...chars];
    copy[index] = MARKS[vowel][other];
    options.add(copy.join(''));
  }
  return options.size === 4 ? [...options] : [];
}

/** Preguntas de discriminación de tono: se oye la palabra y se elige el pinyin. */
export function makeToneQuiz(words: Word[], size = 10, seed = 1): ToneQuestion[] {
  const random = lcg(seed);
  const candidates = shuffle(words, random)
    .map((word) => ({ word, options: variants(word.pinyin) }))
    .filter((entry) => entry.options.length === 4)
    .slice(0, size);

  return candidates.map(({ word, options }) => ({
    wordId: word.id,
    answer: word.pinyin,
    options: shuffle(options, random),
  }));
}
