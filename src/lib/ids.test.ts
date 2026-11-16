import { describe, expect, it } from 'vitest';
import { decompose, describeOp } from './ids';

describe('estructura IDS', () => {
  it('separa los componentes de un operador binario', () => {
    expect(decompose('⿰女子')).toEqual([
      {
        kind: 'op',
        op: '⿰',
        parts: [
          { kind: 'char', char: '女' },
          { kind: 'char', char: '子' },
        ],
      },
    ]);
  });

  it('respeta los operadores de tres partes', () => {
    const [node] = decompose('⿲彳圭亍');
    expect(node.kind).toBe('op');
    if (node.kind !== 'op') throw new Error('se esperaba un operador');
    expect(node.op).toBe('⿲');
    expect(node.parts).toHaveLength(3);
  });

  it('anida los operadores', () => {
    const [node] = decompose('⿱丷⿻二丨');
    if (node.kind !== 'op') throw new Error('se esperaba un operador');
    const inner = node.parts[1];
    expect(inner.kind).toBe('op');
    if (inner.kind !== 'op') throw new Error('se esperaba un operador anidado');
    expect(inner.parts.map((part) => part.kind === 'char' && part.char)).toEqual(['二', '丨']);
  });

  it('trata un carácter suelto como hoja', () => {
    expect(decompose('一')).toEqual([{ kind: 'char', char: '一' }]);
  });

  it('ignora las marcas de variante', () => {
    expect(decompose('〾⿰女子')).toEqual(decompose('⿰女子'));
  });
});

describe('casos límite', () => {
  it('no revienta con datos incompletos', () => {
    expect(() => decompose('⿰女')).not.toThrow();
    expect(() => decompose('')).not.toThrow();
  });

  it('trata un carácter fuera del plano básico como una sola pieza', () => {
    const [node] = decompose('⿰𠮷子');
    if (node.kind !== 'op') throw new Error('se esperaba un operador');
    expect(node.parts).toEqual([
      { kind: 'char', char: '𠮷' },
      { kind: 'char', char: '子' },
    ]);
  });
});

describe('etiquetas de operador', () => {
  it('nombra cada operador en español', () => {
    expect(describeOp('⿰')).toBe('izquierda + derecha');
    expect(describeOp('⿱')).toBe('arriba + abajo');
    expect(describeOp('⿲')).toBe('izquierda + centro + derecha');
    expect(describeOp('⿳')).toBe('arriba + medio + abajo');
    expect(describeOp('⿴')).toBe('uno dentro de otro');
    expect(describeOp('⿵')).toBe('marco superior');
    expect(describeOp('⿶')).toBe('marco inferior');
    expect(describeOp('⿷')).toBe('marco izquierdo');
    expect(describeOp('⿸')).toBe('diagonal noroeste');
    expect(describeOp('⿹')).toBe('diagonal noreste');
    expect(describeOp('⿺')).toBe('diagonal suroeste');
    expect(describeOp('⿻')).toBe('superpuesto');
  });
});
