import { ALL_WORDS, type Unit, type Word } from '../data/curriculum';
import { blankSentence } from './cloze';
import { meaningOptions, makeQuiz, type Question } from './quiz';
import { lcg, shuffle } from './random';
import { makeToneQuiz } from './tone-quiz';

/** Palabras nuevas por ronda antes de comprobarlas. */
export const LESSON_CHUNK = 2;

export type LessonStep =
  { kind: 'learn'; wordId: string } | { kind: 'question'; question: Question };

function meaningQuestion(word: Word, mode: 'recognize' | 'listen', random: () => number): Question {
  return {
    wordId: word.id,
    options: meaningOptions(word, random),
    mode,
    answer: word.meaning,
  };
}

function toneQuestion(word: Word, seed: number): Question | null {
  const [tone] = makeToneQuiz([word], 1, seed);
  if (!tone) return null;
  return {
    wordId: word.id,
    options: tone.options,
    mode: 'tone',
    answer: tone.answer,
  };
}

function gapQuestion(word: Word, unit: Unit, random: () => number): Question | null {
  const prompt = blankSentence(word);
  if (!prompt) return null;
  const seen = new Set([word.hanzi]);
  const distractors: string[] = [];
  const candidates = [...shuffle(unit.words, random), ...shuffle(ALL_WORDS, random)];
  for (const candidate of candidates) {
    if (seen.has(candidate.hanzi)) continue;
    seen.add(candidate.hanzi);
    distractors.push(candidate.hanzi);
    if (distractors.length === 3) break;
  }
  if (distractors.length < 3) return null;
  return {
    wordId: word.id,
    options: shuffle([word.hanzi, ...distractors], random),
    mode: 'gap',
    answer: word.hanzi,
    prompt,
    translation: word.example.translation,
  };
}

type CheckContext = {
  unit: Unit;
  chunk: number;
  position: number;
  random: () => number;
};

function checkQuestion(word: Word, { unit, chunk, position, random }: CheckContext): Question {
  const wantsTone = chunk % 2 === 0 && position === 0;
  const wantsGap = chunk % 2 === 0 && position === 1;
  const tone = wantsTone
    ? toneQuestion(word, unit.index * 1000 + unit.words.indexOf(word) * 17 + 3)
    : null;
  if (tone) return tone;
  const gap = wantsGap ? gapQuestion(word, unit, random) : null;
  if (gap) return gap;
  return meaningQuestion(word, position % 2 === 0 ? 'listen' : 'recognize', random);
}

/**
 * Alterna dos palabras nuevas con dos comprobaciones y cierra con dos frases.
 * La recuperación llega después de un breve intervalo, no al instante.
 */
export function makeLessonPlan(unit: Unit, variant = 0): LessonStep[] {
  const random = lcg(unit.index * 7919 + variant * 104729 + 29);
  const steps: LessonStep[] = [];
  const chunks: Word[][] = [];
  for (let index = 0; index < unit.words.length; index += LESSON_CHUNK) {
    chunks.push(unit.words.slice(index, index + LESSON_CHUNK));
  }

  chunks.forEach((chunk, chunkIndex) => {
    for (const word of chunk) steps.push({ kind: 'learn', wordId: word.id });
    [...chunk].reverse().forEach((word, position) => {
      steps.push({
        kind: 'question',
        question: checkQuestion(word, { unit, chunk: chunkIndex, position, random }),
      });
    });
  });

  for (const question of makeQuiz(unit, variant).filter((item) => item.mode === 'order')) {
    steps.push({ kind: 'question', question });
  }
  return steps;
}
