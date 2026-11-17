import { describe, expect, it } from 'vitest';
import { getCharacterSheetData } from '../data/character-sheet';
import { pieceRounds } from './piece-quiz';

describe('laboratorio de piezas', () => {
  it('prepara ocho caracteres con al menos dos piezas clasificables', () => {
    const rounds = pieceRounds('2026-11-17');
    expect(rounds).toHaveLength(8);
    expect(new Set(rounds.map((round) => round.char)).size).toBe(8);
    for (const round of rounds) {
      expect(round.components.length, round.char).toBeGreaterThanOrEqual(2);
      for (const component of round.components) {
        expect(['meaning', 'sound'], round.char).toContain(component.role);
        expect(component.label.trim(), round.char).not.toBe('');
      }
      expect(round.explain.trim(), round.char).not.toBe('');
    }
  });

  it('marca las piezas de 你 como significado y sonido', () => {
    const data = getCharacterSheetData('你');
    expect(data.hasRoles).toBe(true);
    const roles = data.pieces
      .flatMap(function all(node): typeof data.pieces {
        return node.kind === 'char'
          ? [node, ...node.children.flatMap(all)]
          : node.children.flatMap(all);
      })
      .filter((node) => node.kind === 'char' && node.role)
      .map((node) => node.kind === 'char' && node.char);
    expect(roles).toContain('亻');
    expect(roles).toContain('尔');
  });

  it('es estable para la misma fecha', () => {
    expect(pieceRounds('2026-11-17').map((round) => round.char)).toEqual(
      pieceRounds('2026-11-17').map((round) => round.char),
    );
  });
});
