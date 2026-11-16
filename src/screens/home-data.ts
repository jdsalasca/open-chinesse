import { useState } from 'react';
import {
  LEVELS,
  LEVEL_LABELS,
  UNITS,
  unitsForLevel,
  type Level,
  type Unit,
} from '../data/curriculum';
import { buildQueue, type Queue } from '../srs/queue';
import type { StoredCard } from '../srs/scheduler';
import { streakDays } from '../store/metrics';
import { useLearner } from '../store/useLearner';

const LAST_LEVEL = LEVELS[LEVELS.length - 1];

export type HomeData = {
  cards: Record<string, StoredCard>;
  xp: number;
  todayXp: number;
  dailyGoal: number;
  stars: Record<string, number>;
  onboarded: boolean;
  now: number;
  done: string[];
  level: Level;
  setLevel: (level: Level) => void;
  levelUnits: Unit[];
  nextUnit?: Unit;
  started: boolean;
  reviewed: Set<string>;
  allDone: boolean;
  range: string;
  queue: Queue;
  streak: number;
};

function initialLevel(done: string[]): Level {
  const pending = UNITS.find((unit) => !done.includes(unit.id));
  return pending?.level ?? LAST_LEVEL;
}

export function useHomeData(): HomeData {
  const cards = useLearner((s) => s.cards);
  const log = useLearner((s) => s.log);
  const xp = useLearner((s) => s.xp);
  const todayXp = useLearner((s) => s.todayXp);
  const dailyGoal = useLearner((s) => s.dailyGoal);
  const stars = useLearner((s) => s.stars);
  const onboarded = useLearner((s) => s.onboarded);
  const now = Date.now();
  const done = Object.keys(stars);
  const [level, setLevel] = useState<Level>(() => initialLevel(done));
  const reviewed = new Set(log.map((entry) => entry.wordId));
  const levelUnits = unitsForLevel(level);

  return {
    cards,
    xp,
    todayXp,
    dailyGoal,
    stars,
    onboarded,
    now,
    done,
    level,
    setLevel,
    levelUnits,
    nextUnit: levelUnits.find((unit) => !done.includes(unit.id)),
    started: Object.keys(cards).length > 0,
    reviewed,
    allDone: done.length === UNITS.length,
    range: `${LEVEL_LABELS[LEVELS[0]]}–${LEVEL_LABELS[LAST_LEVEL]}`,
    queue: buildQueue(cards, now),
    streak: streakDays(log, now),
  };
}
