import { describe, expect, it } from 'vitest';
import {
  charactersOf,
  charactersUsing,
  charInfo,
  componentTree,
  CHARACTERS,
  formationOf,
  meaningOf,
  readingOf,
  wordsWith,
} from './characters';
import { ALL_WORDS } from './curriculum';
import { glossOf } from './glosses';

describe('datos de descomposición', () => {
  it('cubre todos los caracteres de las palabras del currículo', () => {
    const missing = new Set<string>();
    for (const word of ALL_WORDS) {
      for (const char of charactersOf(word.hanzi)) {
        if (!charInfo(char)?.ids) missing.add(char);
      }
    }
    expect([...missing]).toEqual([]);
  });

  it('trae un radical de un solo carácter', () => {
    for (const [char, info] of Object.entries(CHARACTERS)) {
      if (info.radical) expect([...info.radical], char).toHaveLength(1);
    }
  });

  it('convierte cada IDS en un árbol no vacío', () => {
    for (const [char, info] of Object.entries(CHARACTERS)) {
      if (!info.ids || info.ids === char) continue;
      expect(componentTree(char).length, char).toBeGreaterThan(0);
    }
  });

  it('encuentra las palabras que usan un carácter', () => {
    const words = wordsWith('你');
    expect(words.length).toBeGreaterThan(0);
    for (const word of words) expect(word.hanzi).toContain('你');
  });
});

describe('explicación del origen', () => {
  it('clasifica la formación del carácter', () => {
    expect(formationOf('好')?.label).toBe('Compuesto asociativo');
    expect(formationOf('妈')?.detail).toContain('mǎ');
    expect(formationOf('马')?.label).toBe('Pictograma');
  });

  it('usa la glosa del radical y de las formas comprimidas', () => {
    expect(glossOf('女')).toBe('mujer');
    expect(glossOf('讠')).toBe('palabra');
    expect(glossOf('青')).toBe('verde azul');
  });

  it('conoce la lectura y el significado de una palabra suelta', () => {
    expect(readingOf('妈')).toBe('mā');
    expect(meaningOf('好')).toBe('bueno, bien');
  });

  it('sitúa la pieza dentro de otros caracteres', () => {
    expect(charactersUsing('青')).toContain('请');
    expect(charInfo('青')?.family).toContain('清');
  });

  it('devuelve vacío para un carácter sin datos', () => {
    expect(charInfo('龘')).toBeUndefined();
    expect(componentTree('龘')).toEqual([]);
  });
});
