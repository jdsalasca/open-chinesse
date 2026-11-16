import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Rating } from 'ts-fsrs';
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
import type { MissReason } from '../lib/miss';
import {
  allMissionsDone,
  makeMissions,
  MISSION_REWARD,
  type ActivityEntry,
  type ActivityKind,
} from '../lib/missions';

const LOG_LIMIT = 3000;
const ACTIVITY_LIMIT = 600;

const appendActivity = (activity: ActivityEntry[], entry: ActivityEntry): ActivityEntry[] =>
  [...activity, entry].slice(-ACTIVITY_LIMIT);

export type Miss = { reason: MissReason; at: number };

export type Retention = { wordIds: string[]; dueAt: number; score?: number; takenAt?: number };

export type LearnerPayload = {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  misses: Record<string, Miss>;
  retention: Retention | null;
  scenarios: string[];
  activity: ActivityEntry[];
  missionDays: string[];
  lastEditAt: number;
  xp: number;
  stars: Record<string, number>;
  achievements: string[];
};

export type LearnerState = {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  misses: Record<string, Miss>;
  retention: Retention | null;
  scenarios: string[];
  activity: ActivityEntry[];
  missionDays: string[];
  createdAt: number;
  lastEditAt: number;
  xp: number;
  todayKey: string;
  todayXp: number;
  dailyGoal: number;
  onboarded: boolean;
  stars: Record<string, number>;
  achievements: string[];
  introduceUnit: (unitId: string, now?: number) => void;
  gradeWord: (wordId: string, grade: Grade, now?: number) => void;
  noteMiss: (wordId: string, reason: MissReason, now?: number) => void;
  recordRetention: (score: number, now?: number) => void;
  completeScenario: (id: string, now?: number) => void;
  logActivity: (kind: ActivityKind, correct?: boolean, now?: number) => void;
  claimMissions: (now?: number) => void;
  recordLesson: (unitId: string, correct: number, total: number, now?: number) => void;
  completeOnboarding: (goalXp: number, now?: number) => void;
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
    misses: {} as Record<string, Miss>,
    retention: null as Retention | null,
    scenarios: [] as string[],
    activity: [] as ActivityEntry[],
    missionDays: [] as string[],
    createdAt: now,
    lastEditAt: now,
    xp: 0,
    todayKey: dayKey(now),
    todayXp: 0,
    dailyGoal: DAILY_GOAL,
    onboarded: false,
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
  const log = [...state.log, { wordId, rating, at: now }].slice(-LOG_LIMIT);
  const retention =
    state.retention ??
    (log.length >= 10
      ? {
          wordIds: [...new Set(log.map((entry) => entry.wordId))].slice(0, 10),
          dueAt: now + 7 * 24 * 60 * 60 * 1000,
        }
      : null);
  store.set({
    cards: { ...state.cards, [wordId]: review(card, rating, now) },
    log,
    retention,
    activity: appendActivity(state.activity, {
      kind: 'review',
      at: now,
      correct: rating !== Rating.Again,
    }),
    xp: state.xp + gained,
    todayXp: state.todayXp + gained,
    lastEditAt: now,
  });
}

function noteMiss(store: Store, wordId: string, reason: MissReason, now: number): void {
  const { misses } = store.get();
  store.set({ misses: { ...misses, [wordId]: { reason, at: now } }, lastEditAt: now });
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
    activity: appendActivity(state.activity, {
      kind: 'lesson',
      at: now,
      correct: score.correct === score.total,
    }),
    achievements: [...new Set([...state.achievements, ...unlocked])],
    lastEditAt: now,
  });
}

function asRetention(value: unknown): Retention | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<Retention>;
  if (!Array.isArray(item.wordIds) || typeof item.dueAt !== 'number') return null;
  return {
    wordIds: item.wordIds.filter((id): id is string => typeof id === 'string').slice(0, 10),
    dueAt: item.dueAt,
    ...(typeof item.score === 'number' ? { score: item.score } : {}),
    ...(typeof item.takenAt === 'number' ? { takenAt: item.takenAt } : {}),
  };
}

function normalizePayload(parsed: Partial<LearnerPayload>): Partial<LearnerPayload> | null {
  if (!parsed.cards) return null;
  return {
    cards: asRecord<StoredCard>(parsed.cards),
    log: asArray<ReviewRecord>(parsed.log, []),
    misses: asRecord<Miss>(parsed.misses),
    retention: asRetention(parsed.retention),
    scenarios: asArray<string>(parsed.scenarios, []),
    activity: asArray<ActivityEntry>(parsed.activity, []),
    missionDays: asArray<string>(parsed.missionDays, []),
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

/** v3 estrenó el sistema de XP y estrellas: lo anterior no era comparable. */
function applyV3Defaults(payload: Partial<LearnerState>, version: number): void {
  if (version >= 3) return;
  payload.xp = 0;
  payload.todayKey = dayKey(Date.now());
  payload.todayXp = 0;
  payload.dailyGoal = DAILY_GOAL;
  payload.stars = {};
  payload.achievements = [];
}

/** v4–v7: campos que se estrenaron después y no existían en esquemas viejos. */
function applyContentDefaults(payload: Partial<LearnerState>, version: number): void {
  if (version < 4) payload.misses = {};
  if (version < 5) payload.onboarded = Object.keys(payload.cards ?? {}).length > 0;
  if (version < 6) payload.retention = null;
  if (version < 7) payload.scenarios = [];
}

/** v8–v9: actividad diaria y días con las misiones reclamadas. */
function applyActivityDefaults(payload: Partial<LearnerState>, version: number): void {
  if (version < 8) payload.activity = [];
  if (version < 9) {
    const legacy = (payload as { missionsClaimed?: string | null }).missionsClaimed;
    payload.missionDays = legacy ? [legacy] : [];
  }
}

function completeScenario(store: Store, id: string, now: number): void {
  const { scenarios, activity } = store.get();
  const next = scenarios.includes(id) ? scenarios : [...scenarios, id];
  store.set({
    scenarios: next,
    activity: appendActivity(activity, { kind: 'scenario', at: now }),
    lastEditAt: now,
  });
}

function logActivity(
  store: Store,
  kind: ActivityKind,
  correct: boolean | undefined,
  now: number,
): void {
  const entry: ActivityEntry =
    correct === undefined ? { kind, at: now } : { kind, at: now, correct };
  store.set({ activity: appendActivity(store.get().activity, entry), lastEditAt: now });
}

function claimMissions(store: Store, now: number): void {
  refreshDay(store, now);
  const state = store.get();
  const key = dayKey(now);
  if (state.missionDays.includes(key)) return;
  const missions = makeMissions(key);
  if (!allMissionsDone(state.activity, missions, key)) return;
  const xp = state.xp + MISSION_REWARD;
  const unlocked = earnedAchievements({
    units: Object.keys(state.stars).length,
    learned: Object.keys(state.cards).length,
    reviews: state.log.length,
    streak: streakDays(state.log, now),
    xp,
  });
  store.set({
    xp,
    todayXp: state.todayXp + MISSION_REWARD,
    missionDays: [...state.missionDays, key].slice(-400),
    achievements: [...new Set([...state.achievements, ...unlocked])],
    lastEditAt: now,
  });
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
        noteMiss: (wordId, reason, now = Date.now()) => noteMiss(store, wordId, reason, now),
        recordRetention: (score, now = Date.now()) => {
          const { retention } = get();
          if (!retention) return;
          set({ retention: { ...retention, score, takenAt: now }, lastEditAt: now });
        },
        completeScenario: (id, now = Date.now()) => completeScenario(store, id, now),
        logActivity: (kind, correct, now = Date.now()) => logActivity(store, kind, correct, now),
        claimMissions: (now = Date.now()) => claimMissions(store, now),
        completeOnboarding: (goalXp, now = Date.now()) =>
          set({ dailyGoal: goalXp, onboarded: true, lastEditAt: now }),
        recordLesson: (unitId, correct, total, now = Date.now()) =>
          recordLesson(store, unitId, { correct, total }, now),
        hydrate: (payload) => hydrate(store, payload),
        reset: () => set(emptyState()),
      };
    },
    {
      name: 'open-chinesse',
      version: 9,
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<LearnerState>;
        if (version < 2) old.lastEditAt = old.createdAt ?? Date.now();
        applyV3Defaults(old, version);
        applyContentDefaults(old, version);
        applyActivityDefaults(old, version);
        return old as LearnerState;
      },
      partialize: (state) => ({
        cards: state.cards,
        log: state.log,
        misses: state.misses,
        retention: state.retention,
        scenarios: state.scenarios,
        activity: state.activity,
        missionDays: state.missionDays,
        createdAt: state.createdAt,
        lastEditAt: state.lastEditAt,
        xp: state.xp,
        todayKey: state.todayKey,
        todayXp: state.todayXp,
        dailyGoal: state.dailyGoal,
        onboarded: state.onboarded,
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

export function exportPayload(): string {
  const {
    cards,
    log,
    misses,
    retention,
    scenarios,
    activity,
    missionDays,
    lastEditAt,
    xp,
    stars,
    achievements,
  } = useLearner.getState();
  return JSON.stringify({
    cards,
    log,
    misses,
    retention,
    scenarios,
    activity,
    missionDays,
    lastEditAt,
    xp,
    stars,
    achievements,
  });
}
