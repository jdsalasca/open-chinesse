import type { IdsNode } from '../lib/ids';
import { describeOp } from '../lib/ids';
import { buildCharacterStory, confusablesFor, type CharacterStory } from '../lib/character-story';
import { SENSES } from './character-notes';
import {
  charactersUsing,
  charInfo,
  componentTree,
  formationOf,
  meaningOf,
  readingOf,
  wordsWith,
  CHARACTERS,
  type CharInfo,
  type Formation,
  type FormationType,
} from './characters';
import { UNITS, type Word } from './curriculum';
import { COMPRESSED, glossOf } from './glosses';

export type PieceRole = 'semantic' | 'phonetic' | 'meaning';

export type SheetNode =
  | {
      kind: 'char';
      char: string;
      label?: string;
      role?: PieceRole;
      children: SheetNode[];
    }
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

export type SheetExample = {
  wordId: string;
  hanzi: string;
  pinyin: string;
  translation: string;
};

export type SheetUsage = { hanzi: string; pinyin: string; meaning: string };

export type CharacterSheetData = {
  char: string;
  reading?: string;
  meaning?: string;
  usage?: SheetUsage;
  radical?: string;
  radicalGloss?: string;
  strokes?: number;
  level: number;
  formation?: Formation;
  story: CharacterStory;
  shuowen?: string;
  traditional?: string;
  pieces: SheetNode[];
  hasRoles: boolean;
  confusables: string[];
  radicalFamily: string[];
  words: SheetWord[];
  examples: SheetExample[];
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

const ROLE_RULES: Partial<
  Record<FormationType, (semantic: boolean, phonetic: boolean) => PieceRole | undefined>
> = {
  'phono-semantic': (semantic, phonetic) =>
    semantic ? 'semantic' : phonetic ? 'phonetic' : undefined,
  ideographic: (semantic, phonetic) => (semantic || phonetic ? 'meaning' : undefined),
};

function roleOf(char: string, info: CharInfo | undefined): PieceRole | undefined {
  if (!info) return undefined;
  const semantic = Boolean(info.semantic?.includes(char));
  const phonetic = Boolean(info.phonetic?.includes(char));
  return info.type ? ROLE_RULES[info.type]?.(semantic, phonetic) : undefined;
}

function toSheet(nodes: IdsNode[], depth: number, info?: CharInfo): SheetNode[] {
  return nodes.map((node) => {
    if (node.kind === 'op') {
      return {
        kind: 'op',
        label: describeOp(node.op),
        children: depth < 3 ? toSheet(node.parts, depth + 1, info) : [],
      };
    }
    const children = depth < 3 ? toSheet(componentTree(node.char), depth + 1) : [];
    return {
      kind: 'char',
      char: node.char,
      label: labelOf(node.char),
      role: roleOf(node.char, info),
      children,
    };
  });
}

function anyRole(nodes: SheetNode[]): boolean {
  return nodes.some(
    (node) => (node.kind === 'char' && Boolean(node.role)) || anyRole(node.children),
  );
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
const COURSE_CHARS = new Set(
  UNITS.flatMap((unit) => unit.words.flatMap((word) => [...word.hanzi])),
);

function radicalFamilyOf(char: string, info: CharInfo | undefined): string[] {
  if (!info?.radical) return [];
  return Object.entries(CHARACTERS)
    .filter(
      ([other, candidate]) =>
        other !== char && candidate.radical === info.radical && COURSE_CHARS.has(other),
    )
    .map(([other]) => other)
    .slice(0, 16);
}

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
    meaning: meaningOf(char) ?? SENSES[char] ?? glossOf(char),
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
  const usageWord = !meaningOf(char) ? words.find((word) => word.hanzi !== char) : undefined;
  const pieces = info?.type === 'pictographic' ? [] : toSheet(componentTree(char), 0, info);
  const data: CharacterSheetData = {
    char,
    ...baseFrom(char, info),
    usage: usageWord
      ? { hanzi: usageWord.hanzi, pinyin: usageWord.pinyin, meaning: usageWord.meaning }
      : undefined,
    radical: displayRadical(info),
    radicalGloss: radicalGlossOf(info),
    family: info?.family ?? [],
    level: levelOf(words),
    formation: formationOf(char),
    story: buildCharacterStory(char),
    pieces,
    hasRoles: anyRole(pieces),
    confusables: confusablesFor(char),
    radicalFamily: radicalFamilyOf(char, info),
    words: words.map((word) => toSheetWord(word, char)),
    examples: words
      .filter((word) => word.example.hanzi.includes(char))
      .slice(0, 3)
      .map((word) => ({ wordId: word.id, ...word.example })),
    inside: charactersUsing(char).slice(0, 12),
  };
  CACHE.set(char, data);
  return data;
}
