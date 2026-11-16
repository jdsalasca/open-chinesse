import { UNITS, WORDS_BY_ID } from '../data/curriculum';
import { dueAt, isDue, type StoredCard } from './scheduler';

export type Queue = {
  /** Palabras vencidas, mezcladas entre unidades. */
  due: string[];
  total: number;
};

const unitOf = (wordId: string): number => UNITS.find((u) => u.words.some((w) => w.id === wordId))?.index ?? 0;

/**
 * Mezcla round-robin por unidad para que el repaso no bloquee una sola unidad
 * (interleaving). Dentro de cada unidad respeta el orden de vencimiento.
 */
export function interleave(wordIds: string[]): string[] {
  const buckets = new Map<number, string[]>();
  for (const id of wordIds) {
    const unit = unitOf(id);
    const bucket = buckets.get(unit);
    if (bucket) bucket.push(id);
    else buckets.set(unit, [id]);
  }
  const keys = [...buckets.keys()].sort((a, b) => a - b);
  const out: string[] = [];
  let pending = keys.length;
  while (pending > 0) {
    pending = 0;
    for (const key of keys) {
      const bucket = buckets.get(key)!;
      const next = bucket.shift();
      if (next) out.push(next);
      if (bucket.length > 0) pending += 1;
    }
  }
  return out;
}

export function buildQueue(cards: Record<string, StoredCard>, now: number): Queue {
  const due = Object.entries(cards)
    .filter(([, card]) => isDue(card, now))
    .sort((a, b) => dueAt(a[1]) - dueAt(b[1]))
    .map(([wordId]) => wordId);
  return { due: interleave(due), total: due.length };
}

/** Palabras de la unidad que aún no existen como tarjeta. */
export function missingWords(cards: Record<string, StoredCard>, unitId: string): string[] {
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) return [];
  return unit.words.filter((w) => !cards[w.id]).map((w) => w.id);
}

export function firstUnitWithContent(completed: string[]): string | undefined {
  return UNITS.find((u) => !completed.includes(u.id))?.id;
}

export function wordOf(wordId: string) {
  return WORDS_BY_ID.get(wordId);
}
