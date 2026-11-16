import { ALL_WORDS, type Unit, type Word } from '../data/curriculum';

export type Question = {
  wordId: string;
  options: string[];
  mode: 'recognize' | 'listen' | 'order';
};

const DICTIONARY = new Set(ALL_WORDS.map((word) => word.hanzi));
const PUNCTUATION = new Set(['，', '。', '！', '？', '、', '：']);

/** Corta una frase en piezas que son palabras del curso (o caracteres sueltos). */
export function segment(sentence: string): string[] {
  const chars = [...sentence];
  const chunks: string[] = [];
  let index = 0;
  while (index < chars.length) {
    const char = chars[index];
    if (PUNCTUATION.has(char)) {
      chunks[chunks.length - 1] = (chunks.at(-1) ?? '') + char;
      index += 1;
      continue;
    }
    const piece = longestWord(chars, index);
    chunks.push(piece);
    index += [...piece].length;
  }
  return chunks;
}

function longestWord(chars: string[], from: number): string {
  for (const size of [3, 2, 1]) {
    if (from + size > chars.length) continue;
    const candidate = chars.slice(from, from + size).join('');
    if (size === 1 || DICTIONARY.has(candidate)) return candidate;
  }
  return chars[from];
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

function meaningOptions(word: Word, random: () => number): string[] {
  const pool = shuffle(
    ALL_WORDS.filter((candidate) => candidate.id !== word.id && candidate.meaning !== word.meaning),
    random,
  );
  const options = [word.meaning];
  for (const candidate of pool) {
    if (options.length === 4) break;
    if (!options.includes(candidate.meaning)) options.push(candidate.meaning);
  }
  return shuffle(options, random);
}

function canOrder(sentence: string): string[] | undefined {
  const chunks = segment(sentence);
  if (chunks.length < 3) return undefined;
  return new Set(chunks).size === chunks.length ? chunks : undefined;
}

/** Seis preguntas por unidad: reconocer, escuchar y ordenar la frase. */
export function makeQuiz(unit: Unit): Question[] {
  const random = lcg(unit.index * 7919);
  const shuffled = shuffle(unit.words, random);
  const orderable = shuffled.filter((word) => canOrder(word.example.hanzi)).slice(0, 2);
  const picked = [...orderable, ...shuffled.filter((word) => !orderable.includes(word))].slice(
    0,
    6,
  );

  return picked.map((word, index) => {
    const chunks = orderable.includes(word) ? (canOrder(word.example.hanzi) ?? []) : [];
    if (chunks.length > 0) {
      return { wordId: word.id, options: shuffle(chunks, random), mode: 'order' };
    }
    return {
      wordId: word.id,
      options: meaningOptions(word, random),
      mode: index % 2 === 1 ? 'listen' : 'recognize',
    };
  });
}
