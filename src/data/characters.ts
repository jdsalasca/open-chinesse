import raw from './decomposition.json';
import { glossOf } from './glosses';
import { decompose, type IdsNode } from '../lib/ids';
import { ALL_WORDS, type Word } from './curriculum';

export type FormationType =
  'pictographic' | 'ideographic' | 'phono-semantic' | 'indicative' | 'phonetic-loan';

export type CharInfo = {
  ids?: string;
  radical?: string;
  strokes?: number;
  pinyin?: string;
  traditional?: string;
  simplified?: string;
  type?: FormationType;
  semantic?: string[];
  phonetic?: string[];
  shuowen?: string;
  family?: string[];
};

export const CHARACTERS = raw as Record<string, CharInfo>;

export function charactersOf(hanzi: string): string[] {
  return [...hanzi];
}

export function charInfo(char: string): CharInfo | undefined {
  return CHARACTERS[char];
}

/** Árbol de componentes del carácter; vacío si no hay datos o es una pieza simple. */
export function componentTree(char: string): IdsNode[] {
  const ids = charInfo(char)?.ids;
  return ids && ids !== char ? decompose(ids) : [];
}

export function wordsWith(char: string): Word[] {
  return ALL_WORDS.filter((word) => word.hanzi.includes(char));
}

/** Caracteres del curso que llevan esta pieza dentro. */
export function charactersUsing(char: string): string[] {
  return Object.entries(CHARACTERS)
    .filter(([other, info]) => other !== char && info.ids?.includes(char))
    .map(([other]) => other);
}

/** Primera lectura, sin las variantes que añade Unihan. */
export function readingOf(char: string): string | undefined {
  return charInfo(char)?.pinyin?.split(' ')[0];
}

/** Significado del carácter cuando es una palabra del curso. */
export function meaningOf(char: string): string | undefined {
  return ALL_WORDS.find((word) => word.hanzi === char)?.meaning;
}

function withGloss(char: string): string {
  const gloss = glossOf(char);
  return gloss ? `${char} (${gloss})` : char;
}

function withReading(char: string): string {
  const reading = readingOf(char);
  return reading ? `${char} (${reading})` : char;
}

export type Formation = { label: string; detail: string };

const BUILDERS: Record<FormationType, (info: CharInfo) => Formation> = {
  'phono-semantic': (info) => ({
    label: 'Semántico-fonético',
    detail: `${withGloss(info.semantic?.[0] ?? '?')} aporta el significado y ${withReading(
      info.phonetic?.[0] ?? '?',
    )} el sonido.`,
  }),
  ideographic: (info) => ({
    label: 'Compuesto asociativo',
    detail: `Suma de significados: ${[...(info.semantic ?? []), ...(info.phonetic ?? [])]
      .map(withGloss)
      .join(' + ')}.`,
  }),
  pictographic: () => ({
    label: 'Pictograma',
    detail: 'Dibuja el objeto o animal que nombra.',
  }),
  indicative: () => ({
    label: 'Indicativo',
    detail: 'Señala una idea abstracta con una marca.',
  }),
  'phonetic-loan': () => ({
    label: 'Préstamo fonético',
    detail: 'Se tomó prestado por su sonido.',
  }),
};

/** Explica cómo se construyó el carácter con la clasificación de la fuente. */
export function formationOf(char: string): Formation | undefined {
  const info = charInfo(char);
  return info?.type ? BUILDERS[info.type](info) : undefined;
}
