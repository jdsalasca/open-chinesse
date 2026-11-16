import { ALL_WORDS, type Unit } from '../data/curriculum';

export type Question = { wordId: string; options: string[] };

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

/** Seis preguntas de reconocimiento con distractores de todo el vocabulario. */
export function makeQuiz(unit: Unit): Question[] {
  const random = lcg(unit.index * 7919);
  return shuffle(unit.words, random)
    .slice(0, 6)
    .map((word) => {
      const pool = shuffle(
        ALL_WORDS.filter((w) => w.id !== word.id && w.meaning !== word.meaning),
        random,
      );
      const options = [word.meaning];
      for (const candidate of pool) {
        if (options.length === 4) break;
        if (!options.includes(candidate.meaning)) options.push(candidate.meaning);
      }
      return { wordId: word.id, options: shuffle(options, random) };
    });
}
