import { unitsForLevel, type Level } from '../data/curriculum';

export const BOSS_QUESTIONS = 15;
export const BOSS_PASS_RATIO = 0.8;

export function bossWordIds(level: Level): string[] {
  return unitsForLevel(level).flatMap((unit) => unit.words.map((word) => word.id));
}

export function bossPassScore(total: number): number {
  return Math.ceil(total * BOSS_PASS_RATIO);
}

export function isBossPassed(score: number, total: number): boolean {
  return score >= bossPassScore(total);
}

/** El jefe se abre cuando todas las unidades del nivel tienen al menos una estrella. */
export function isLevelUnlocked(stars: Record<string, number>, level: Level): boolean {
  return unitsForLevel(level).every((unit) => (stars[unit.id] ?? 0) > 0);
}
