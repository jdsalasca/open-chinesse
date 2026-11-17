import { describe, expect, it } from 'vitest';
import { UNITS, unitsForLevel } from '../data/curriculum';
import { BOSS_QUESTIONS, bossPassScore, bossWordIds, isBossPassed, isLevelUnlocked } from './boss';

describe('jefes de nivel', () => {
  it('usa las palabras del nivel', () => {
    const ids = bossWordIds(1);
    expect(ids).toHaveLength(
      unitsForLevel(1).reduce((total, unit) => total + unit.words.length, 0),
    );
    expect(ids.every((id) => UNITS.some((unit) => unit.words.some((word) => word.id === id)))).toBe(
      true,
    );
    expect(BOSS_QUESTIONS).toBeLessThanOrEqual(ids.length);
  });

  it('aprueba con el 80%', () => {
    expect(bossPassScore(15)).toBe(12);
    expect(isBossPassed(12, 15)).toBe(true);
    expect(isBossPassed(11, 15)).toBe(false);
  });

  it('solo desbloquea con todas las unidades del nivel empezadas', () => {
    const levelUnits = unitsForLevel(1);
    const stars: Record<string, number> = {};
    for (const unit of levelUnits.slice(0, -1)) stars[unit.id] = 1;
    expect(isLevelUnlocked(stars, 1)).toBe(false);
    stars[levelUnits.at(-1)!.id] = 1;
    expect(isLevelUnlocked(stars, 1)).toBe(true);
  });
});
