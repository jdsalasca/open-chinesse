import type { CharacterSheetData, SheetNode } from '../data/character-sheet';

export type CharacterRelation = {
  label: string;
  note: string;
  hint?: string;
};

function findNode(nodes: SheetNode[], char: string): SheetNode | undefined {
  for (const node of nodes) {
    if (node.kind === 'char' && node.char === char) return node;
    const inside = findNode(node.children, char);
    if (inside) return inside;
  }
  return undefined;
}

/** Explica por qué una ficha lleva a otra: radical, familia fonética o pieza. */
export function describeRelation(parent: CharacterSheetData, child: string): CharacterRelation {
  if (parent.radical === child) {
    return {
      label: `Radical de ${parent.char}`,
      hint: parent.radicalGloss,
      note: 'El radical suele orientar el significado; no garantiza el sonido.',
    };
  }
  if (parent.family.includes(child)) {
    return {
      label: `Familia fonética de ${parent.char}`,
      note: 'Comparten una pista de sonido; la pronunciación exacta puede cambiar.',
    };
  }
  const piece = findNode(parent.pieces, child);
  if (piece) {
    return {
      label: `Componente de ${parent.char}`,
      hint: piece.label,
      note: 'Esta pieza participa en la composición; compara forma y sonido.',
    };
  }
  return {
    label: `Pieza de ${parent.char}`,
    note: 'Compara las dos fichas y vuelve atrás cuando quieras.',
  };
}
