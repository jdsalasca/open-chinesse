import { beforeEach, describe, expect, it } from 'vitest';
import { useDailySession } from './daily-session';

describe('sesión diaria', () => {
  beforeEach(() => useDailySession.getState().end());

  it('empieza sin pasos hechos', () => {
    useDailySession.getState().start();
    expect(useDailySession.getState().active).toBe(true);
    expect(useDailySession.getState().done).toEqual([]);
  });

  it('marca cada paso una sola vez', () => {
    useDailySession.getState().start();
    useDailySession.getState().finish('review');
    useDailySession.getState().finish('review');
    useDailySession.getState().finish('lesson');
    expect(useDailySession.getState().done).toEqual(['review', 'lesson']);
  });

  it('terminar limpia la sesión', () => {
    useDailySession.getState().start();
    useDailySession.getState().finish('review');
    useDailySession.getState().end();
    expect(useDailySession.getState().active).toBe(false);
    expect(useDailySession.getState().done).toEqual([]);
  });
});
