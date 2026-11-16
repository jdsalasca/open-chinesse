export type IdsNode = { kind: 'char'; char: string } | { kind: 'op'; op: string; parts: IdsNode[] };

const TERNARY = new Set(['⿲', '⿳']);
const VARIANT = '〾';
const UNKNOWN = '?';

const LABELS: Record<string, string> = {
  '⿰': 'izquierda + derecha',
  '⿱': 'arriba + abajo',
  '⿲': 'izquierda + centro + derecha',
  '⿳': 'arriba + medio + abajo',
  '⿴': 'uno dentro de otro',
  '⿵': 'marco superior',
  '⿶': 'marco inferior',
  '⿷': 'marco izquierdo',
  '⿸': 'diagonal noroeste',
  '⿹': 'diagonal noreste',
  '⿺': 'diagonal suroeste',
  '⿻': 'superpuesto',
};

export function describeOp(op: string): string {
  return LABELS[op] ?? 'composición';
}

/** Convierte la notación IDS (⿰女子) en un árbol de componentes. */
export function decompose(ids: string): IdsNode[] {
  const chars = [...ids];
  const nodes: IdsNode[] = [];
  let cursor = 0;
  while (cursor < chars.length) {
    const [node, next] = read(chars, cursor);
    nodes.push(node);
    cursor = next;
  }
  return nodes;
}

type Read = [IdsNode, number];

function arityOf(char: string): number {
  if (TERNARY.has(char)) return 3;
  const code = char.codePointAt(0) ?? 0;
  return code >= 0x2ff0 && code <= 0x2fff ? 2 : 0;
}

const UNKNOWN_NODE: IdsNode = { kind: 'char', char: UNKNOWN };

function read(chars: string[], start: number): Read {
  let index = start;
  while (chars[index] === VARIANT) index += 1;
  const char = chars[index];
  if (char === undefined) return [UNKNOWN_NODE, chars.length + 1];
  const arity = arityOf(char);
  if (arity === 0) return [{ kind: 'char', char }, index + 1];
  const parts: IdsNode[] = [];
  let cursor = index + 1;
  for (let count = 0; count < arity; count += 1) {
    const [part, next] = read(chars, cursor);
    parts.push(part);
    cursor = next;
  }
  return [{ kind: 'op', op: char, parts }, cursor];
}
