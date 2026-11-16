import { describe, expect, it } from 'vitest';
import { charactersOf, charInfo, componentTree, CHARACTERS, wordsWith } from './characters';
import { ALL_WORDS } from './curriculum';

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
      if (!info.ids) continue;
      expect(componentTree(char).length, char).toBeGreaterThan(0);
    }
  });

  it('encuentra las palabras que usan un carácter', () => {
    const words = wordsWith('你');
    expect(words.length).toBeGreaterThan(0);
    for (const word of words) expect(word.hanzi).toContain('你');
  });

  it('devuelve vacío para un carácter sin datos', () => {
    expect(charInfo('林')).toBeUndefined();
    expect(componentTree('林')).toEqual([]);
  });
});
