import { create } from 'zustand';

export type SessionStep = 'review' | 'lesson' | 'close';

export type SessionStart = { steps?: SessionStep[]; unitId?: string };

export type DailySessionState = {
  active: boolean;
  steps: SessionStep[];
  done: SessionStep[];
  unitId?: string;
  start: (options?: SessionStart) => void;
  finish: (step: SessionStep) => void;
  end: () => void;
};

export const SESSION_STEPS: SessionStep[] = ['review', 'lesson', 'close'];

/** Sesión guiada del día: recuperar, aprender y cerrar produciendo. */
export const useDailySession = create<DailySessionState>((set, get) => ({
  active: false,
  steps: SESSION_STEPS,
  done: [],
  unitId: undefined,
  start: (options = {}) =>
    set({
      active: true,
      steps: options.steps ?? SESSION_STEPS,
      done: [],
      unitId: options.unitId,
    }),
  finish: (step) => {
    const { done } = get();
    if (done.includes(step)) return;
    set({ done: [...done, step] });
  },
  end: () => set({ active: false, steps: SESSION_STEPS, done: [], unitId: undefined }),
}));
