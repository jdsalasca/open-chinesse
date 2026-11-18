import { ALL_WORDS, type Unit, type Word } from '../data/curriculum';
import { blankSentence } from './cloze';
import { meaningOptions, makeQuiz, type Question } from './quiz';
import { lcg, shuffle } from './random';
import { makeToneQuiz } from './tone-quiz';

/** Cada lección se divide en tres partes con un repaso entre ellas. */
export const LESSON_PARTS = 3;

const PART_SIZE = 3;

export type LessonStep =
  | { kind: 'learn'; wordId: string; part: number }
  | { kind: 'review'; part: number; wordIds: string[] }
  | { kind: 'question'; question: Question; part: number; review: boolean };

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

export type ReviewMode = 'recognize' | 'listen' | 'tone' | 'gap';

function reviewQuestion(word: Word, mode: ReviewMode, unit: Unit, random: () => number): Question {
  if (mode === 'tone') {
    return (
      toneQuestion(word, unit.index * 1000 + unit.words.indexOf(word) * 17 + 3) ??
      meaningQuestion(word, 'listen', random)
    );
  }
  if (mode === 'gap') {
    return gapQuestion(word, unit, random) ?? meaningQuestion(word, 'recognize', random);
  }
  return meaningQuestion(word, mode, random);
}

/**
 * Tres partes de tres o cuatro palabras. Cada parte se enseña, se cierra con
 * un repaso y solo entonces empieza la siguiente. La última añade dos frases.
 */
export function makeLessonPlan(unit: Unit, variant = 0): LessonStep[] {
  const random = lcg(unit.index * 7919 + variant * 104729 + 29);
  const steps: LessonStep[] = [];
  const parts = [
    unit.words.slice(0, PART_SIZE),
    unit.words.slice(PART_SIZE, PART_SIZE * 2),
    unit.words.slice(PART_SIZE * 2),
  ];
  const reviewModes: ReviewMode[][] = [
    ['recognize', 'recognize', 'recognize'],
    ['listen', 'recognize', 'gap'],
    ['tone', 'gap', 'recognize', 'listen'],
  ];

  parts.forEach((words, index) => {
    const part = index + 1;
    for (const word of words) steps.push({ kind: 'learn', wordId: word.id, part });
    steps.push({ kind: 'review', part, wordIds: words.map((word) => word.id) });
    words.forEach((word, position) => {
      steps.push({
        kind: 'question',
        question: reviewQuestion(word, reviewModes[index][position] ?? 'recognize', unit, random),
        part,
        review: true,
      });
    });
  });

  for (const question of makeQuiz(unit, variant).filter((item) => item.mode === 'order')) {
    steps.push({ kind: 'question', question, part: LESSON_PARTS, review: true });
  }
  return steps;
}
