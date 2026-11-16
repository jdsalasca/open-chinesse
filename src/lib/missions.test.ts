import { describe, expect, it } from 'vitest';
import { dayKey } from '../store/metrics';
import {
  allMissionsDone,
  makeMissions,
  missionProgress,
  missionStreak,
  weekActivity,
} from './missions';
const NOW = new Date(2026, 10, 15, 10, 0, 0).getTime();
const KEY = dayKey(NOW);
const YESTERDAY = NOW - 86_400_000;

describe('generación de misiones', () => {
  it('siempre trae tres misiones, con repaso y sin duplicados', () => {
    for (const date of ['2026-11-15', '2026-11-16', '2026-11-17', '2026-12-01']) {
      const missions = makeMissions(date);
      expect(missions).toHaveLength(3);
      expect(missions[0].id).toBe('reviews');
      expect(new Set(missions.map((mission) => mission.id)).size).toBe(3);
    }
  });

  it('es determinista para la misma fecha', () => {
    expect(makeMissions(KEY).map((mission) => mission.id)).toEqual(
      makeMissions(KEY).map((mission) => mission.id),
    );
  });
});

describe('progreso de misiones', () => {
  it('solo cuenta la actividad de hoy y del tipo correcto', () => {
    const missions = makeMissions(KEY);
    const reviews = missions[0];
    const activity = [
      { kind: 'review' as const, at: NOW },
      { kind: 'review' as const, at: NOW - 1000 },
      { kind: 'review' as const, at: YESTERDAY },
      { kind: 'tones' as const, at: NOW },
    ];
    expect(missionProgress(activity, reviews, KEY)).toBe(2);
  });

  it('la misión de contexto solo cuenta aciertos', () => {
    const context = makeMissions(KEY).find((mission) => mission.kind === 'cloze');
    if (!context) return;
    const activity = [
      { kind: 'cloze' as const, at: NOW, correct: true },
      { kind: 'cloze' as const, at: NOW, correct: false },
      { kind: 'cloze' as const, at: NOW, correct: true },
    ];
    expect(missionProgress(activity, context, KEY)).toBe(2);
  });

  it('completa las tres solo con todo el progreso', () => {
    const missions = makeMissions(KEY);
    expect(allMissionsDone([], missions, KEY)).toBe(false);
    const activity = missions.flatMap((mission) =>
      Array.from({ length: mission.target }, () => ({
        kind: mission.kind,
        at: NOW,
        correct: mission.correctOnly ? true : undefined,
      })),
    );
    expect(allMissionsDone(activity, missions, KEY)).toBe(true);
  });
});

describe('racha y resumen semanal', () => {
  it('cuenta días consecutivos y acepta hoy pendiente', () => {
    const days = ['2026-11-15', '2026-11-14', '2026-11-13'];
    expect(missionStreak(days, '2026-11-16')).toBe(3);
    expect(missionStreak([...days, '2026-11-16'], '2026-11-16')).toBe(4);
    expect(missionStreak(['2026-11-14', '2026-11-16'], '2026-11-16')).toBe(1);
  });

  it('la semana trae siete días, incluidos los vacíos', () => {
    const activity = [
      { kind: 'review' as const, at: NOW, correct: true },
      { kind: 'tones' as const, at: NOW, correct: false },
      { kind: 'lesson' as const, at: YESTERDAY, correct: true },
    ];
    const week = weekActivity(activity, KEY);
    expect(week).toHaveLength(7);
    expect(week.at(-1)).toMatchObject({ key: KEY, count: 2, correct: 1 });
    expect(week.at(-2)).toMatchObject({ key: dayKey(YESTERDAY), count: 1, correct: 1 });
    expect(week.some((day) => day.count === 0)).toBe(true);
  });
});
