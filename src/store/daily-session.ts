import { create } from 'zustand';

export type SessionStep = 'review' | 'lesson' | 'tones';

export type DailySessionState = {
  active: boolean;
  done: SessionStep[];
  start: () => void;
  finish: (step: SessionStep) => void;
  end: () => void;
};

export const SESSION_STEPS: SessionStep[] = ['review', 'lesson', 'tones'];

/** Sesión guiada del día: repaso, lección y tonos, en ese orden. */
export const useDailySession = create<DailySessionState>((set, get) => ({
  active: false,
  done: [],
  start: () => set({ active: true, done: [] }),
  finish: (step) => {
    const { done } = get();
    if (done.includes(step)) return;
    set({ done: [...done, step] });
  },
  end: () => set({ active: false, done: [] }),
}));
