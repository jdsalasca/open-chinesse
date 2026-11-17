import { describe, expect, it } from 'vitest';
import { detectiveRounds } from './detective';

describe('detective de confusables', () => {
  it('prepara diez rondas con dos opciones y una respuesta', () => {
    const rounds = detectiveRounds('2026-11-17');
    expect(rounds).toHaveLength(10);
    expect(new Set(rounds.map((round) => round.char)).size).toBe(10);
    for (const round of rounds) {
      expect(round.options).toHaveLength(2);
      expect(round.options).toContain(round.answer);
      expect(round.options.filter((option) => option === round.answer)).toHaveLength(1);
      expect(round.meaning.trim(), round.answer).not.toBe('');
      expect(round.explain.trim(), round.answer).not.toBe('');
    }
  });

  it('es estable para la misma fecha', () => {
    expect(detectiveRounds('2026-11-17').map((round) => round.answer)).toEqual(
      detectiveRounds('2026-11-17').map((round) => round.answer),
    );
    const positions = detectiveRounds('2026-11-17').map((round) =>
      round.options.indexOf(round.answer),
    );
    expect(new Set(positions).size).toBeGreaterThan(1);
  });
});
