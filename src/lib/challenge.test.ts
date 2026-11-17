import { describe, expect, it } from 'vitest';
import { challengeFor } from './challenge';

describe('reto del día', () => {
  it('es estable para la misma fecha', () => {
    expect(challengeFor('2026-11-16').id).toBe(challengeFor('2026-11-16').id);
  });

  it('rota a lo largo de la semana', () => {
    const ids = Array.from({ length: 7 }, (_, day) => challengeFor(`2026-11-${10 + day}`).id);
    expect(new Set(ids).size).toBeGreaterThan(2);
  });

  it('cada reto enlaza a una pantalla de la app', () => {
    for (const day of ['2026-11-16', '2026-11-17', '2026-11-18']) {
      expect(challengeFor(day).href.startsWith('#/')).toBe(true);
    }
  });
});
