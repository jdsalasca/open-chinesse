import { describe, expect, it } from 'vitest';
import { getCharacterSheetData } from './character-sheet';

describe('ficha masticada del carácter', () => {
  it('junta lectura, significado, radical y nivel', () => {
    const data = getCharacterSheetData('好');
    expect(data.reading).toBe('hǎo');
    expect(data.meaning).toBe('bueno, bien');
    expect(data.radical).toBe('女');
    expect(data.radicalGloss).toBe('mujer');
    expect(data.strokes).toBe(6);
    expect(data.level).toBe(1);
  });

  it('explica la formación y la cita clásica', () => {
    const data = getCharacterSheetData('好');
    expect(data.formation?.label).toBe('Compuesto asociativo');
    expect(data.shuowen).toContain('从女');
  });
});

describe('piezas y palabras de la ficha', () => {
  it('deja las piezas listas para abrir, con hijos en 青', () => {
    const data = getCharacterSheetData('请');
    const all = (nodes: typeof data.pieces): (typeof nodes)[number][] =>
      nodes.flatMap((node) => [node, ...all(node.children)]);
    const chars = all(data.pieces);
    const names = chars.map((node) => (node.kind === 'char' ? node.char : 'op'));
    expect(names).toContain('讠');
    expect(names).toContain('青');
    const qing = chars.find((node) => node.kind === 'char' && node.char === '青');
    expect(qing?.children.length).toBeGreaterThan(0);
    expect(qing && 'label' in qing ? qing.label : undefined).toBe('verde azul');
  });

  it('calcula la posición de la palabra en la frase', () => {
    const data = getCharacterSheetData('好');
    const positions = Object.fromEntries(data.words.map((word) => [word.hanzi, word.position]));
    expect(positions['好吃']).toBe('al principio');
    expect(positions['你好']).toBe('al final');
    expect(positions['好']).toBe('por sí sola');
  });

  it('trae frases de ejemplo con el carácter', () => {
    const data = getCharacterSheetData('好');
    expect(data.examples.length).toBeGreaterThan(0);
    for (const example of data.examples) expect(example.hanzi).toContain('好');
  });

  it('cachea el resultado para no recalcular al navegar', () => {
    expect(getCharacterSheetData('明')).toBe(getCharacterSheetData('明'));
  });

  it('no revienta con un carácter fuera del curso', () => {
    const data = getCharacterSheetData('龘');
    expect(data.pieces).toEqual([]);
    expect(data.words).toEqual([]);
    expect(data.level).toBe(0);
  });
});

describe('historia y piezas con sentido', () => {
  it('incluye una historia legible y un gancho de memoria', () => {
    const data = getCharacterSheetData('好');
    expect(data.story.idea).toMatch(/mujer/i);
    expect(data.story.mnemonic).not.toBe('');
  });

  it('marca el papel de las piezas en un semántico-fonético', () => {
    const data = getCharacterSheetData('你');
    const all = (nodes: typeof data.pieces): (typeof nodes)[number][] =>
      nodes.flatMap((node) => [node, ...all(node.children)]);
    const chars = all(data.pieces);
    const person = chars.find((node) => node.kind === 'char' && node.char === '亻');
    const er = chars.find((node) => node.kind === 'char' && node.char === '尔');
    expect(person && 'role' in person ? person.role : undefined).toBe('semantic');
    expect(er && 'role' in er ? er.role : undefined).toBe('phonetic');
    expect(data.hasRoles).toBe(true);
  });

  it('no inventa piezas para un pictograma', () => {
    const data = getCharacterSheetData('火');
    expect(data.pieces).toEqual([]);
    expect(data.story.idea).toMatch(/fuego|llama/i);
  });

  it('da el uso en palabra cuando el carácter no va solo', () => {
    const data = getCharacterSheetData('苹');
    expect(data.usage?.hanzi).toBe('苹果');
    expect(data.usage?.meaning).toBe('manzana');
  });

  it('da sentido propio y uso en palabra a un carácter dependiente', () => {
    const data = getCharacterSheetData('明');
    expect(data.meaning).toBe('claro, brillante');
    expect(data.usage?.hanzi).toBe('明天');
  });

  it('no confunde el sentido del radical con el del carácter', () => {
    expect(getCharacterSheetData('自').meaning).toBe('uno mismo');
    expect(getCharacterSheetData('儿').meaning).toBe('niño; hijo');
  });

  it('lista confundibles que sí están en el curso', () => {
    expect(getCharacterSheetData('人').confusables).toContain('八');
  });

  it('agrupa caracteres del curso por radical', () => {
    expect(getCharacterSheetData('你').radicalFamily).toContain('他');
  });
});
