import type { CharacterSheetData, SheetNode } from '../data/character-sheet';
import { charInfo, formationOf } from '../data/characters';

export type CharacterQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explain: string;
};

const RADICALS = [
  '人',
  '水',
  '木',
  '火',
  '土',
  '心',
  '手',
  '口',
  '日',
  '月',
  '目',
  '言',
  '女',
  '山',
];

function seedOf(text: string): number {
  let seed = 7;
  for (const char of text) seed = (seed * 31 + (char.codePointAt(0) ?? 0)) % 2147483647;
  return seed || 11;
}

function shuffle<T>(items: T[], seed: number): T[] {
  let state = seed;
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    state = (state * 16807) % 2147483647;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function charsIn(nodes: SheetNode[]): string[] {
  return nodes.flatMap((node) =>
    node.kind === 'char' ? [node.char, ...charsIn(node.children)] : charsIn(node.children),
  );
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function phoneticQuestion(
  data: CharacterSheetData,
  info: NonNullable<ReturnType<typeof charInfo>>,
  explain: string,
  seed: number,
): CharacterQuestion | null {
  const phonetic = info.phonetic?.[0];
  const semantic = info.semantic?.[0];
  if (info.type !== 'phono-semantic' || !phonetic || !semantic) return null;
  const distractors = unique([semantic, ...charsIn(data.pieces), data.radical ?? ''])
    .filter((char) => char !== phonetic)
    .slice(0, 3);
  if (distractors.length < 3) return null;
  return {
    prompt: `En ${data.char}, ¿qué pieza aporta el sonido?`,
    options: shuffle([phonetic, ...distractors], seed),
    answer: phonetic,
    explain,
  };
}

function radicalQuestion(data: CharacterSheetData, seed: number): CharacterQuestion | null {
  if (!data.radical) return null;
  const distractors = RADICALS.filter((radical) => radical !== data.radical).slice(0, 3);
  return {
    prompt: `¿Cuál es el radical de ${data.char}?`,
    options: shuffle([data.radical, ...distractors], seed),
    answer: data.radical,
    explain: data.radicalGloss
      ? `El radical ${data.radical} significa «${data.radicalGloss}».`
      : 'El radical organiza el carácter por su parte principal.',
  };
}

/** Una pregunta corta y verificable sobre el carácter, hecha con sus propios datos. */
export function makeCharacterQuiz(data: CharacterSheetData): CharacterQuestion | null {
  const info = charInfo(data.char);
  const formation = formationOf(data.char);
  if (!info || !formation) return null;
  const seed = seedOf(data.char);
  return phoneticQuestion(data, info, formation.detail, seed) ?? radicalQuestion(data, seed);
}
