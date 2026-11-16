import type { IdsNode } from '../lib/ids';
import { describeOp } from '../lib/ids';
import {
  charactersUsing,
  charInfo,
  componentTree,
  formationOf,
  meaningOf,
  readingOf,
  wordsWith,
  type CharInfo,
  type Formation,
} from './characters';
import { UNITS, type Word } from './curriculum';
import { COMPRESSED, glossOf } from './glosses';

export type SheetNode =
  | { kind: 'char'; char: string; label?: string; children: SheetNode[] }
  | { kind: 'op'; label: string; children: SheetNode[] };

export type SheetWord = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  position: string;
  unitId?: string;
  unitTitle?: string;
};

export type CharacterSheetData = {
  char: string;
  reading?: string;
  meaning?: string;
  radical?: string;
  radicalGloss?: string;
  strokes?: number;
  level: number;
  formation?: Formation;
  shuowen?: string;
  traditional?: string;
  pieces: SheetNode[];
  words: SheetWord[];
  inside: string[];
  family: string[];
};

const UNIT_BY_WORD = new Map(
  UNITS.flatMap((unit) => unit.words.map((word) => [word.id, unit] as const)),
);

function labelOf(char: string): string | undefined {
  return glossOf(char) ?? meaningOf(char) ?? readingOf(char);
}

function positionIn(word: Word, char: string): string {
  const chars = [...word.hanzi];
  if (chars.length === 1) return 'por sí sola';
  const index = chars.indexOf(char);
  if (index === 0) return 'al principio';
  return index === chars.length - 1 ? 'al final' : 'en medio';
}

function toSheet(nodes: IdsNode[], depth: number): SheetNode[] {
  return nodes.map((node) => {
    if (node.kind === 'op') {
      return {
        kind: 'op',
        label: describeOp(node.op),
        children: depth < 3 ? toSheet(node.parts, depth + 1) : [],
      };
    }
    const children = depth < 3 ? toSheet(componentTree(node.char), depth + 1) : [];
    return { kind: 'char', char: node.char, label: labelOf(node.char), children };
  });
}

function levelOf(words: Word[]): number {
  let level = 0;
  for (const word of words) {
    const unitLevel = UNIT_BY_WORD.get(word.id)?.level ?? 0;
    if (unitLevel > 0 && (level === 0 || unitLevel < level)) level = unitLevel;
  }
  return level;
}

const CACHE = new Map<string, CharacterSheetData>();

function toSheetWord(word: Word, char: string): SheetWord {
  const unit = UNIT_BY_WORD.get(word.id);
  return {
    id: word.id,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    meaning: word.meaning,
    position: positionIn(word, char),
    unitId: unit?.id,
    unitTitle: unit?.title,
  };
}

function baseFrom(char: string, info: CharInfo | undefined) {
  return {
    reading: readingOf(char),
    meaning: meaningOf(char),
    radical: info?.radical,
    strokes: info?.strokes,
    shuowen: info?.shuowen,
    traditional: info?.traditional,
  };
}

function radicalGlossOf(info: CharInfo | undefined): string | undefined {
  return info?.radical ? glossOf(info.radical) : undefined;
}

/** Muestra el radical en la forma que de verdad aparece en el carácter (讠 por 言). */
function displayRadical(info: CharInfo | undefined): string | undefined {
  const radical = info?.radical;
  if (!radical) return undefined;
  const compressed = Object.entries(COMPRESSED).find(
    ([short, full]) => full === radical && info?.ids?.includes(short),
  );
  return compressed ? compressed[0] : radical;
}

/** Todo lo que la ficha necesita, ya masticado y sin tocar la pantalla. */
export function getCharacterSheetData(char: string): CharacterSheetData {
  const cached = CACHE.get(char);
  if (cached) return cached;

  const info = charInfo(char);
  const words = wordsWith(char);
  const data: CharacterSheetData = {
    char,
    ...baseFrom(char, info),
    radical: displayRadical(info),
    radicalGloss: radicalGlossOf(info),
    family: info?.family ?? [],
    level: levelOf(words),
    formation: formationOf(char),
    pieces: toSheet(componentTree(char), 0),
    words: words.map((word) => toSheetWord(word, char)),
    inside: charactersUsing(char).slice(0, 12),
  };
  CACHE.set(char, data);
  return data;
}
