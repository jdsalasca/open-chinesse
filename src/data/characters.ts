import raw from './decomposition.json';
import { decompose, type IdsNode } from '../lib/ids';
import { ALL_WORDS, type Word } from './curriculum';

export type CharInfo = { ids?: string; radical?: string; strokes?: number };

export const CHARACTERS = raw as Record<string, CharInfo>;

export function charactersOf(hanzi: string): string[] {
  return [...hanzi];
}

export function charInfo(char: string): CharInfo | undefined {
  return CHARACTERS[char];
}

/** Árbol de componentes del carácter; vacío si no hay datos. */
export function componentTree(char: string): IdsNode[] {
  const ids = charInfo(char)?.ids;
  return ids ? decompose(ids) : [];
}

export function wordsWith(char: string): Word[] {
  return ALL_WORDS.filter((word) => word.hanzi.includes(char));
}
