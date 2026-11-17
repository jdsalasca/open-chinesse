import { getCharacterSheetData, type SheetNode } from '../data/character-sheet';
import { UNITS } from '../data/curriculum';
import type { CharacterStory } from './character-story';
import { hashSeed, lcg, shuffle } from './random';

export type PieceChoice = 'meaning' | 'sound';

export type PieceComponent = { char: string; label: string; role: PieceChoice };

export type PieceRound = {
  char: string;
  reading?: string;
  meaning?: string;
  story: CharacterStory;
  components: PieceComponent[];
  explain: string;
};

const COURSE_CHARS = [
  ...new Set(UNITS.flatMap((unit) => unit.words.flatMap((word) => [...word.hanzi]))),
];

function flatten(nodes: SheetNode[]): SheetNode[] {
  return nodes.flatMap((node) =>
    node.kind === 'char' ? [node, ...flatten(node.children)] : flatten(node.children),
  );
}

function componentsOf(char: string): PieceComponent[] {
  const data = getCharacterSheetData(char);
  const seen = new Set<string>();
  const components: PieceComponent[] = [];
  for (const node of flatten(data.pieces)) {
    if (node.kind !== 'char' || !node.role || !node.label || seen.has(node.char)) continue;
    seen.add(node.char);
    components.push({
      char: node.char,
      label: node.label,
      role: node.role === 'phonetic' ? 'sound' : 'meaning',
    });
  }
  return components;
}

function roundOf(char: string): PieceRound | null {
  const data = getCharacterSheetData(char);
  const components = componentsOf(char);
  if (components.length < 2) return null;
  const roles = components
    .map(
      (component) => `${component.char} → ${component.role === 'sound' ? 'sonido' : 'significado'}`,
    )
    .join('; ');
  return {
    char,
    reading: data.reading,
    meaning: data.meaning,
    story: data.story,
    components,
    explain: `${roles}. ${data.story.mnemonic}`,
  };
}

/** Ocho caracteres con piezas clasificables, estables por fecha. */
export function pieceRounds(seed: string, count = 8): PieceRound[] {
  const rounds: PieceRound[] = [];
  for (const char of shuffle(COURSE_CHARS, lcg(hashSeed(seed)))) {
    if (rounds.length === count) break;
    const round = roundOf(char);
    if (round) rounds.push(round);
  }
  return rounds;
}
