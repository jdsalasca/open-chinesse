import { describe, expect, it } from 'vitest';
import { getCharacterSheetData } from '../data/character-sheet';
import { describeRelation } from './character-relation';

describe('relación entre fichas', () => {
  it('reconoce el radical', () => {
    const relation = describeRelation(getCharacterSheetData('好'), '女');
    expect(relation.label).toBe('Radical de 好');
    expect(relation.hint).toBe('mujer');
  });

  it('reconoce la familia fonética', () => {
    const relation = describeRelation(getCharacterSheetData('青'), '请');
    expect(relation.label).toBe('Familia fonética de 青');
  });

  it('reconoce un componente con su glosa', () => {
    const relation = describeRelation(getCharacterSheetData('请'), '青');
    expect(relation.label).toBe('Componente de 请');
    expect(relation.hint).toBe('verde azul');
  });

  it('cae en pieza cuando no hay relación declarada', () => {
    const relation = describeRelation(getCharacterSheetData('好'), '月');
    expect(relation.label).toBe('Pieza de 好');
  });
});
