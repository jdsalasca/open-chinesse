import type { GrammarItem, GrammarTopic } from '../data/grammar';

const DAY_MS = 86_400_000;

export const PRACTICE_DAYS = 3;
export const CHECK_DAYS = 7;

export type GrammarCheck = { score: number; total: number; at: number };

export type GrammarProgress = {
  practicedAt?: number;
  dueAt?: number;
  checkAt?: number;
  failed: string[];
  check?: GrammarCheck;
};

export type GrammarStage = 'new' | 'scheduled' | 'practice-due' | 'check-ready' | 'checked';

/** Tras practicar: repaso a 3 días y primera prueba diferida a 7. */
export function afterPractice(
  previous: GrammarProgress | undefined,
  failed: string[],
  now: number,
): GrammarProgress {
  return {
    ...previous,
    practicedAt: now,
    dueAt: now + PRACTICE_DAYS * DAY_MS,
    checkAt: previous?.checkAt ?? now + CHECK_DAYS * DAY_MS,
    failed,
  };
}

/** La prueba se guarda una sola vez: mide el primer intento, no el mejor. */
export function afterCheck(
  progress: GrammarProgress,
  score: number,
  total: number,
  now: number,
): GrammarProgress {
  if (progress.check) return progress;
  return { ...progress, check: { score, total, at: now } };
}

export function grammarStage(progress: GrammarProgress | undefined, now: number): GrammarStage {
  if (!progress?.practicedAt) return 'new';
  if (progress.check) return 'checked';
  if (progress.checkAt !== undefined && now >= progress.checkAt) return 'check-ready';
  if (progress.dueAt !== undefined && now >= progress.dueAt) return 'practice-due';
  return 'scheduled';
}

export function failedItems(
  topic: GrammarTopic,
  progress: GrammarProgress | undefined,
): GrammarItem[] {
  if (!progress) return [];
  return topic.practice.filter((item) => progress.failed.includes(item.id));
}
