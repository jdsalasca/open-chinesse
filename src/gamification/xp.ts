import type { IconName } from '../components/ui/Icon';

/** XP por calificación (1 Otra vez · 2 Difícil · 3 Bien · 4 Fácil). */
export const XP_BY_GRADE: Record<number, number> = { 1: 2, 2: 5, 3: 10, 4: 12 };

export const LESSON_XP = 20;
export const XP_PER_CORRECT = 5;
export const DAILY_GOAL = 30;
const LEVEL_BASE = 120;

export function xpForGrade(rating: number): number {
  return XP_BY_GRADE[rating] ?? 0;
}

export function xpForLesson(correct: number): number {
  return LESSON_XP + Math.max(0, correct) * XP_PER_CORRECT;
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / LEVEL_BASE)) + 1;
}

export type LevelProgress = {
  level: number;
  current: number;
  needed: number;
  ratio: number;
};

export function levelProgress(xp: number): LevelProgress {
  const safe = Math.max(0, xp);
  const level = levelFromXp(safe);
  const floor = LEVEL_BASE * (level - 1) ** 2;
  const ceiling = LEVEL_BASE * level ** 2;
  const needed = ceiling - floor;
  const current = safe - floor;
  return { level, current, needed, ratio: needed === 0 ? 1 : current / needed };
}

/** Estrellas de una unidad: 3 con ≥90 %, 2 con ≥70 %, 1 por completarla. */
export function starsForScore(correct: number, total: number): 1 | 2 | 3 {
  const ratio = total === 0 ? 1 : correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  return 1;
}

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'Primer paso', description: 'Completa una unidad', icon: 'book' },
  { id: 'ten-words', title: 'Diez palabras', description: 'Aprende 10 palabras', icon: 'sparkles' },
  { id: 'hundred-words', title: 'Centenario', description: 'Aprende 100 palabras', icon: 'target' },
  { id: 'five-hundred-reviews', title: 'Constancia', description: '500 repasos', icon: 'check' },
  { id: 'week-streak', title: 'Una semana', description: 'Siete días seguidos', icon: 'flame' },
  { id: 'level-5', title: 'Nivel 5', description: 'Alcanza el nivel 5', icon: 'trophy' },
];

export type AchievementStats = {
  units: number;
  learned: number;
  reviews: number;
  streak: number;
  xp: number;
};

export function earnedAchievements(stats: AchievementStats): string[] {
  const earned: Record<string, boolean> = {
    'first-lesson': stats.units >= 1,
    'ten-words': stats.learned >= 10,
    'hundred-words': stats.learned >= 100,
    'five-hundred-reviews': stats.reviews >= 500,
    'week-streak': stats.streak >= 7,
    'level-5': levelFromXp(stats.xp) >= 5,
  };
  return ACHIEVEMENTS.filter((achievement) => earned[achievement.id]).map((a) => a.id);
}
