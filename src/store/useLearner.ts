import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UNITS } from '../data/curriculum';
import {
  dueAt,
  newCard,
  review,
  SESSION_REQUEUE_MS,
  type Grade,
  type StoredCard,
} from '../srs/scheduler';
import type { ReviewRecord } from './metrics';

const LOG_LIMIT = 3000;

export type LearnerPayload = {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  lastEditAt: number;
};

export type LearnerState = {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  createdAt: number;
  lastEditAt: number;
  introduceUnit: (unitId: string, now?: number) => void;
  gradeWord: (wordId: string, grade: Grade, now?: number) => void;
  hydrate: (payload: string) => void;
  reset: () => void;
};

const emptyState = () => {
  const now = Date.now();
  return { cards: {}, log: [] as ReviewRecord[], createdAt: now, lastEditAt: now };
};

export const useLearner = create<LearnerState>()(
  persist(
    (set, get) => ({
      ...emptyState(),
      introduceUnit: (unitId, now = Date.now()) => {
        const unit = UNITS.find((u) => u.id === unitId);
        if (!unit) return;
        const { cards } = get();
        const additions: Record<string, StoredCard> = {};
        for (const word of unit.words) {
          if (!cards[word.id]) additions[word.id] = newCard(now);
        }
        if (Object.keys(additions).length === 0) return;
        set({ cards: { ...cards, ...additions }, lastEditAt: now });
      },
      gradeWord: (wordId, rating, now = Date.now()) => {
        const state = get();
        const card = state.cards[wordId];
        if (!card) return;
        const next = review(card, rating, now);
        const log = [...state.log, { wordId, rating, at: now }].slice(-LOG_LIMIT);
        set({ cards: { ...state.cards, [wordId]: next }, log, lastEditAt: now });
      },
      hydrate: (payload) => {
        const parsed = JSON.parse(payload) as Partial<LearnerPayload>;
        if (!parsed.cards || typeof parsed.cards !== 'object') return;
        set({
          cards: parsed.cards,
          log: Array.isArray(parsed.log) ? parsed.log : [],
          createdAt: get().createdAt,
          lastEditAt: typeof parsed.lastEditAt === 'number' ? parsed.lastEditAt : Date.now(),
        });
      },
      reset: () => set(emptyState()),
    }),
    {
      name: 'open-chinesse',
      version: 2,
      migrate: (persisted, version) => {
        if (version === 1) {
          const old = persisted as Partial<LearnerState>;
          return { ...old, lastEditAt: old.createdAt ?? Date.now() };
        }
        return version === 2 ? persisted : emptyState();
      },
      partialize: (state) => ({
        cards: state.cards,
        log: state.log,
        createdAt: state.createdAt,
        lastEditAt: state.lastEditAt,
      }),
    },
  ),
);

/** Debe llamarse justo después de calificar: ¿la tarjeta vuelve en esta sesión? */
export function requeuesSoon(card: StoredCard, now = Date.now()): boolean {
  return dueAt(card) - now <= SESSION_REQUEUE_MS;
}

export function completedUnits(cards: Record<string, StoredCard>): string[] {
  return UNITS.filter((unit) => unit.words.every((w) => cards[w.id])).map((u) => u.id);
}

export function exportPayload(): string {
  const { cards, log, lastEditAt } = useLearner.getState();
  return JSON.stringify({ cards, log, lastEditAt });
}
