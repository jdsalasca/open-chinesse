import { describe, expect, it } from 'vitest';
import {
  ACHIEVEMENTS,
  DAILY_GOAL,
  earnedAchievements,
  levelFromXp,
  levelProgress,
  starsForScore,
  xpForGrade,
  xpForLesson,
} from './xp';

describe('xp', () => {
  it('paga más por respuestas mejores', () => {
    expect(xpForGrade(1)).toBeLessThan(xpForGrade(2));
    expect(xpForGrade(2)).toBeLessThan(xpForGrade(3));
    expect(xpForGrade(3)).toBeLessThan(xpForGrade(4));
    expect(xpForGrade(99)).toBe(0);
  });

  it('una lección suma base y aciertos', () => {
    expect(xpForLesson(0)).toBe(20);
    expect(xpForLesson(6)).toBe(50);
  });
});

describe('niveles', () => {
  it('empieza en 1 y crece por raíz', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(119)).toBe(1);
    expect(levelFromXp(120)).toBe(2);
    expect(levelFromXp(480)).toBe(3);
    expect(levelFromXp(-5)).toBe(1);
  });

  it('el progreso del nivel está entre 0 y 1', () => {
    for (const xp of [0, 30, 119, 120, 200, 480, 5000]) {
      const progress = levelProgress(xp);
      expect(progress.ratio).toBeGreaterThanOrEqual(0);
      expect(progress.ratio).toBeLessThanOrEqual(1);
      expect(progress.needed).toBeGreaterThan(0);
    }
    expect(levelProgress(0).level).toBe(1);
    expect(levelProgress(0).current).toBe(0);
  });
});

describe('estrellas', () => {
  it('premia la precisión', () => {
    expect(starsForScore(9, 10)).toBe(3);
    expect(starsForScore(7, 10)).toBe(2);
    expect(starsForScore(4, 10)).toBe(1);
    expect(starsForScore(6, 6)).toBe(3);
  });
});

describe('logros', () => {
  it('hay seis y con descripción', () => {
    expect(ACHIEVEMENTS).toHaveLength(6);
    for (const achievement of ACHIEVEMENTS) {
      expect(achievement.title.length).toBeGreaterThan(2);
      expect(achievement.description.length).toBeGreaterThan(5);
    }
  });

  it('no desbloquea nada al empezar', () => {
    expect(earnedAchievements({ units: 0, learned: 0, reviews: 0, streak: 0, xp: 0 })).toEqual([]);
  });

  it('desbloquea hitos alcanzados', () => {
    const ids = earnedAchievements({ units: 3, learned: 120, reviews: 600, streak: 8, xp: 2000 });
    expect(ids).toEqual([
      'first-lesson',
      'ten-words',
      'hundred-words',
      'five-hundred-reviews',
      'week-streak',
      'level-5',
    ]);
    expect(DAILY_GOAL).toBe(30);
  });
});
