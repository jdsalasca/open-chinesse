import { HSK1_UNITS } from './hsk1';
import { HSK2_UNITS } from './hsk2';
import { HSK3_UNITS } from './hsk3';
import type { Unit, Word } from './types';

export type { Example, Unit, Word } from './types';

export const LEVELS = [1, 2, 3] as const;
export type Level = (typeof LEVELS)[number];

export const UNITS: Unit[] = [...HSK1_UNITS, ...HSK2_UNITS, ...HSK3_UNITS];

export const ALL_WORDS: Word[] = UNITS.flatMap((unit) => unit.words);

export const WORDS_BY_ID = new Map(ALL_WORDS.map((w) => [w.id, w]));

export const TOTAL_WORDS = ALL_WORDS.length;

export const LEVEL_LABELS: Record<Level, string> = {
  1: 'HSK 1',
  2: 'HSK 2',
  3: 'HSK 3',
};

export const LEVEL_TITLES: Record<Level, string> = {
  1: 'Fundamentos',
  2: 'Vida diaria',
  3: 'Intermedio',
};

export function unitsForLevel(level: Level): Unit[] {
  return UNITS.filter((u) => u.level === level);
}

export function wordsForLevel(level: Level): number {
  return unitsForLevel(level).reduce((total, unit) => total + unit.words.length, 0);
}

export function unitById(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function levelOfUnit(unitId: string): Level {
  return unitById(unitId)?.level ?? 1;
}

export function nextUnit(completed: string[], level?: Level): Unit | undefined {
  const pool = level ? unitsForLevel(level) : UNITS;
  return pool.find((u) => !completed.includes(u.id));
}
