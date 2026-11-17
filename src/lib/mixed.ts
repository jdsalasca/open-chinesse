import { ALL_WORDS, WORDS_BY_ID, type Word } from '../data/curriculum';
import { blankSentence } from './cloze';
import { meaningOptions } from './quiz';
import { lcg, shuffle } from './random';
import { makeToneQuiz } from './tone-quiz';

export type MixedKind = 'meaning' | 'listen' | 'context' | 'tone';

export type MixedQuestion = {
  id: string;
  kind: MixedKind;
  /** Hanzi o frase con hueco; vacío cuando la pregunta es solo audio. */
  prompt: string;
  translation?: string;
  audioWordId?: string;
  options: string[];
  answer: string;
  explanation: string;
};

const KINDS: MixedKind[] = [
  'meaning',
  'listen',
  'context',
  'meaning',
  'tone',
  'listen',
  'context',
  'listen',
  'meaning',
  'context',
];

function hanziOptions(word: Word, random: () => number): string[] {
  const pool = shuffle(
    ALL_WORDS.filter((candidate) => candidate.hanzi !== word.hanzi),
    random,
  );
  const options = [word.hanzi];
  for (const candidate of pool) {
    if (options.length === 4) break;
    if (!options.includes(candidate.hanzi)) options.push(candidate.hanzi);
  }
  return shuffle(options, random);
}

function contextQuestion(word: Word, random: () => number): MixedQuestion | null {
  const prompt = blankSentence(word);
  if (!prompt) return null;
  return {
    id: `${word.id}-context`,
    kind: 'context',
    prompt,
    translation: word.example.translation,
    options: hanziOptions(word, random),
    answer: word.hanzi,
    explanation: `«${word.hanzi}» significa «${word.meaning}».`,
  };
}

function toneQuestion(word: Word, seed: number): MixedQuestion | null {
  const [tone] = makeToneQuiz([word], seed);
  if (!tone) return null;
  return {
    id: `${word.id}-tone`,
    kind: 'tone',
    prompt: '',
    audioWordId: word.id,
    options: tone.options,
    answer: tone.answer,
    explanation: `${word.hanzi} · ${word.meaning}`,
  };
}

function choiceQuestion(
  kind: 'meaning' | 'listen',
  word: Word,
  random: () => number,
): MixedQuestion {
  return {
    id: `${word.id}-${kind}`,
    kind,
    prompt: kind === 'meaning' ? word.hanzi : '',
    audioWordId: kind === 'listen' ? word.id : undefined,
    options: meaningOptions(word, random),
    answer: word.meaning,
    explanation: `${word.hanzi} · ${word.pinyin} · ${word.meaning}`,
  };
}

function buildQuestion(
  kind: MixedKind,
  word: Word,
  random: () => number,
  seed: number,
): MixedQuestion {
  if (kind === 'context') {
    return contextQuestion(word, random) ?? choiceQuestion('meaning', word, random);
  }
  if (kind === 'tone') return toneQuestion(word, seed) ?? choiceQuestion('listen', word, random);
  return choiceQuestion(kind, word, random);
}

function takeWord(pending: Word[], kind: MixedKind): Word | undefined {
  if (kind !== 'context') return pending.shift();
  const index = pending.findIndex((candidate) => blankSentence(candidate));
  if (index < 0) return pending.shift();
  return pending.splice(index, 1)[0];
}

/** Tanda intercalada de significado, escucha, contexto y tonos. */
export function makeMixed(wordIds: string[], seed = 1, limit = 10): MixedQuestion[] {
  const words = [...new Set(wordIds)]
    .map((id) => WORDS_BY_ID.get(id))
    .filter((word): word is Word => Boolean(word));
  const random = lcg(seed);
  const pending = shuffle(words, random);
  const questions: MixedQuestion[] = [];
  while (pending.length > 0 && questions.length < limit) {
    const kind = KINDS[questions.length % KINDS.length];
    const word = takeWord(pending, kind);
    if (!word) break;
    questions.push(buildQuestion(kind, word, random, seed + questions.length));
  }
  return questions;
}
