import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UNITS } from '../data/curriculum';
import {
  DAILY_GOAL,
  earnedAchievements,
  starsForScore,
  xpForGrade,
  xpForLesson,
} from '../gamification/xp';
import {
  dueAt,
  newCard,
  review,
  SESSION_REQUEUE_MS,
  type Grade,
  type StoredCard,
} from '../srs/scheduler';
import { dayKey, streakDays, type ReviewRecord } from './metrics';

const LOG_LIMIT = 3000;

export type LearnerPayload = {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  lastEditAt: number;
  xp: number;
  stars: Record<string, number>;
  achievements: string[];
};

export type LearnerState = {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  createdAt: number;
  lastEditAt: number;
  xp: number;
  todayKey: string;
  todayXp: number;
  dailyGoal: number;
  stars: Record<string, number>;
  achievements: string[];
  introduceUnit: (unitId: string, now?: number) => void;
  gradeWord: (wordId: string, grade: Grade, now?: number) => void;
  recordLesson: (unitId: string, correct: number, total: number, now?: number) => void;
  refreshDay: (now?: number) => void;
  hydrate: (payload: string) => void;
  reset: () => void;
};

type SetState = (partial: Partial<LearnerState>) => void;
type GetState = () => LearnerState;
type Store = { set: SetState; get: GetState };

const asArray = <T>(value: unknown, fallback: T[]): T[] =>
  Array.isArray(value) ? (value as T[]) : fallback;
const asNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' ? value : fallback;
const asRecord = <T>(value: unknown): Record<string, T> =>
  value && typeof value === 'object' ? (value as Record<string, T>) : {};

const emptyState = () => {
  const now = Date.now();
  return {
    cards: {} as Record<string, StoredCard>,
    log: [] as ReviewRecord[],
    createdAt: now,
    lastEditAt: now,
    xp: 0,
    todayKey: dayKey(now),
    todayXp: 0,
    dailyGoal: DAILY_GOAL,
    stars: {} as Record<string, number>,
    achievements: [] as string[],
  };
};

function refreshDay(store: Store, now = Date.now()): void {
  const key = dayKey(now);
  if (store.get().todayKey === key) return;
  store.set({ todayKey: key, todayXp: 0 });
}

function introduceUnit(store: Store, unitId: string, now: number): void {
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) return;
  const { cards } = store.get();
  const additions: Record<string, StoredCard> = {};
  for (const word of unit.words) {
    if (!cards[word.id]) additions[word.id] = newCard(now);
  }
  if (Object.keys(additions).length === 0) return;
  store.set({ cards: { ...cards, ...additions }, lastEditAt: now });
}

function gradeWord(store: Store, wordId: string, rating: Grade, now: number): void {
  refreshDay(store, now);
  const state = store.get();
  const card = state.cards[wordId];
  if (!card) return;
  const gained = xpForGrade(rating);
  store.set({
    cards: { ...state.cards, [wordId]: review(card, rating, now) },
    log: [...state.log, { wordId, rating, at: now }].slice(-LOG_LIMIT),
    xp: state.xp + gained,
    todayXp: state.todayXp + gained,
    lastEditAt: now,
  });
}

function recordLesson(
  store: Store,
  unitId: string,
  score: { correct: number; total: number },
  now: number,
): void {
  refreshDay(store, now);
  const state = store.get();
  const gained = xpForLesson(score.correct);
  const stars = { ...state.stars };
  stars[unitId] = Math.max(stars[unitId] ?? 0, starsForScore(score.correct, score.total));
  const xp = state.xp + gained;
  const unlocked = earnedAchievements({
    units: Object.keys(stars).length,
    learned: Object.keys(state.cards).length,
    reviews: state.log.length,
    streak: streakDays(state.log, now),
    xp,
  });
  store.set({
    stars,
    xp,
    todayXp: state.todayXp + gained,
    achievements: [...new Set([...state.achievements, ...unlocked])],
    lastEditAt: now,
  });
}

function normalizePayload(parsed: Partial<LearnerPayload>): Partial<LearnerPayload> | null {
  if (!parsed.cards) return null;
  return {
    cards: asRecord<StoredCard>(parsed.cards),
    log: asArray<ReviewRecord>(parsed.log, []),
    xp: asNumber(parsed.xp, 0),
    stars: asRecord<number>(parsed.stars),
    achievements: asArray<string>(parsed.achievements, []),
    lastEditAt: asNumber(parsed.lastEditAt, Date.now()),
  };
}

function hydrate(store: Store, payload: string): void {
  const normalized = normalizePayload(JSON.parse(payload) as Partial<LearnerPayload>);
  if (!normalized) return;
  store.set(normalized as Partial<LearnerState>);
}

export const useLearner = create<LearnerState>()(
  persist(
    (set, get) => {
      const store: Store = { set, get };
      return {
        ...emptyState(),
        refreshDay: (now) => refreshDay(store, now),
        introduceUnit: (unitId, now = Date.now()) => introduceUnit(store, unitId, now),
        gradeWord: (wordId, rating, now = Date.now()) => gradeWord(store, wordId, rating, now),
        recordLesson: (unitId, correct, total, now = Date.now()) =>
          recordLesson(store, unitId, { correct, total }, now),
        hydrate: (payload) => hydrate(store, payload),
        reset: () => set(emptyState()),
      };
    },
    {
      name: 'open-chinesse',
      version: 3,
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<LearnerState>;
        if (version < 2) old.lastEditAt = old.createdAt ?? Date.now();
        if (version < 3) {
          old.xp = 0;
          old.todayKey = dayKey(Date.now());
          old.todayXp = 0;
          old.dailyGoal = DAILY_GOAL;
          old.stars = {};
          old.achievements = [];
        }
        return old as LearnerState;
      },
      partialize: (state) => ({
        cards: state.cards,
        log: state.log,
        createdAt: state.createdAt,
        lastEditAt: state.lastEditAt,
        xp: state.xp,
        todayKey: state.todayKey,
        todayXp: state.todayXp,
        dailyGoal: state.dailyGoal,
        stars: state.stars,
        achievements: state.achievements,
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
  const { cards, log, lastEditAt, xp, stars, achievements } = useLearner.getState();
  return JSON.stringify({ cards, log, lastEditAt, xp, stars, achievements });
}
