import { PICTOGRAPHS, SENSES, STORY_NOTES } from '../data/character-notes';
import type { Unit, Word } from '../data/curriculum';
import { buildCharacterStory, type CharacterStory } from './character-story';
import { hashSeed, lcg, shuffle } from './random';

export type DailyCharacter = { char: string; word: Word; story: CharacterStory };

export type DailySentence = { word: Word; example: Word['example'] };

export type DailyPhrase = DailySentence & { options: string[] };

export type DailyPrompt = {
  words: Word[];
  model: string;
  pinyin: string;
  translation: string;
};

function pick<T>(items: T[], seed: string): T {
  return items[hashSeed(seed) % items.length];
}

function storyScore(char: string): number {
  if (PICTOGRAPHS[char]) return 4;
  const idea = STORY_NOTES[char]?.idea;
  if (idea) return idea.includes('(') ? 3 : 2;
  if (SENSES[char]) return 1;
  return 0;
}

export function dailyCharacter(unit: Unit, _dateKey: string): DailyCharacter {
  const chars = [...new Set(unit.words.flatMap((word) => [...word.hanzi]))];
  const ranked = chars
    .map((char) => ({ char, score: storyScore(char) }))
    .filter((entry) => entry.score > 0);
  const best = ranked.filter((entry) => entry.score === Math.max(...ranked.map((e) => e.score)));
  const char = (best.length > 0 ? best : chars.map((char) => ({ char })))[0].char;
  const word = unit.words.find((candidate) => candidate.hanzi.includes(char)) ?? unit.words[0];
  return { char, word, story: buildCharacterStory(char) };
}

export function dailySentence(unit: Unit, dateKey: string): DailySentence {
  const word = pick(unit.words, `${dateKey}:${unit.id}:sentence`);
  return { word, example: word.example };
}

export function dailyPhrase(unit: Unit, dateKey: string): DailyPhrase {
  const sentence = dailySentence(unit, dateKey);
  const random = lcg(hashSeed(`${dateKey}:${unit.id}:phrase`));
  const distractors = shuffle(
    unit.words.filter((word) => word.id !== sentence.word.id && word.hanzi !== sentence.word.hanzi),
    random,
  )
    .slice(0, 2)
    .map((word) => word.hanzi);
  return {
    ...sentence,
    options: shuffle([sentence.word.hanzi, ...distractors], lcg(hashSeed(`${dateKey}:options`))),
  };
}

export function dailyPrompt(unit: Unit, dateKey: string): DailyPrompt {
  const random = lcg(hashSeed(`${dateKey}:${unit.id}:prompt`));
  const words = shuffle(unit.words, random).slice(0, 2);
  const model = words[0]?.example ?? unit.words[0].example;
  return {
    words,
    model: model.hanzi,
    pinyin: model.pinyin,
    translation: model.translation,
  };
}
