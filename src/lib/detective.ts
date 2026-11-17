import { CONFUSABLES } from '../data/character-notes';
import { getCharacterSheetData } from '../data/character-sheet';
import { UNITS } from '../data/curriculum';
import { hashSeed, lcg, shuffle } from './random';

export type DetectiveRound = {
  char: string;
  other: string;
  meaning: string;
  options: string[];
  answer: string;
  explain: string;
};

const COURSE_CHARS = new Set(
  UNITS.flatMap((unit) => unit.words.flatMap((word) => [...word.hanzi])),
);

function pairs(): [string, string][] {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const [char, others] of Object.entries(CONFUSABLES)) {
    if (!COURSE_CHARS.has(char)) continue;
    for (const other of others) {
      if (!COURSE_CHARS.has(other) || other === char) continue;
      const key = [char, other].sort().join(':');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([char, other]);
    }
  }
  return out;
}

function bothMeanings(
  first: ReturnType<typeof getCharacterSheetData>,
  second: ReturnType<typeof getCharacterSheetData>,
): boolean {
  if (!first.meaning || !second.meaning) return false;
  return first.meaning !== second.meaning;
}

function roundFrom(a: string, b: string, seed: string): DetectiveRound | null {
  const first = getCharacterSheetData(a);
  const second = getCharacterSheetData(b);
  if (!bothMeanings(first, second)) return null;
  const targetFirst = hashSeed(`${seed}:${a}:${b}`) % 2 === 0;
  const [target, other] = targetFirst ? [a, b] : [b, a];
  const datas = new Map([
    [a, first],
    [b, second],
  ]);
  const targetData = datas.get(target)!;
  const otherData = datas.get(other)!;
  const radical = targetData.radicalGloss
    ? ` El radical de ${target} es ${targetData.radical} (${targetData.radicalGloss}).`
    : '';
  return {
    char: target,
    other,
    meaning: targetData.meaning ?? '',
    answer: target,
    options: hashSeed(`${seed}:${a}:${b}:options`) % 2 === 0 ? [target, other] : [other, target],
    explain: `Se parecen. ${target} (${targetData.reading ?? '?'}) = ${targetData.meaning}; ${other} (${otherData.reading ?? '?'}) = ${otherData.meaning}.${radical}`,
  };
}

export function detectiveRounds(seed: string, count = 10): DetectiveRound[] {
  const random = lcg(hashSeed(seed));
  const rounds: DetectiveRound[] = [];
  const used = new Set<string>();
  for (const [a, b] of shuffle(pairs(), random)) {
    if (rounds.length === count) break;
    const round = roundFrom(a, b, seed);
    if (!round || used.has(round.answer)) continue;
    used.add(round.answer);
    rounds.push(round);
  }
  return rounds;
}
