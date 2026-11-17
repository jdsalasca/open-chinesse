import { beforeEach, describe, expect, it } from 'vitest';
import { SESSION_STEPS, useDailySession } from './daily-session';

beforeEach(() => useDailySession.getState().end());

describe('sesión diaria', () => {
  it('arranca con los tres pasos y la unidad de foco', () => {
    useDailySession.getState().start({ unitId: 'h1-01' });
    const state = useDailySession.getState();
    expect(state.active).toBe(true);
    expect(state.steps).toEqual(SESSION_STEPS);
    expect(state.unitId).toBe('h1-01');
    expect(state.done).toEqual([]);
  });

  it('permite saltar el repaso cuando no hay tarjetas', () => {
    useDailySession.getState().start({ steps: ['lesson', 'close'], unitId: 'h1-02' });
    expect(useDailySession.getState().steps).toEqual(['lesson', 'close']);
  });

  it('marca cada paso una sola vez y cierra la sesión', () => {
    const store = useDailySession.getState();
    store.start();
    useDailySession.getState().finish('review');
    useDailySession.getState().finish('review');
    expect(useDailySession.getState().done).toEqual(['review']);
    useDailySession.getState().end();
    expect(useDailySession.getState().active).toBe(false);
    expect(useDailySession.getState().done).toEqual([]);
    expect(useDailySession.getState().unitId).toBeUndefined();
  });
});
