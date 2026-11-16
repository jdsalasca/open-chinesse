import type { IconName } from '../components/ui/Icon';
import { dayKey } from '../store/metrics';

export type ActivityKind = 'review' | 'lesson' | 'tones' | 'scenario' | 'cloze';

export type ActivityEntry = {
  kind: ActivityKind;
  at: number;
  correct?: boolean;
};

export type Mission = {
  id: string;
  title: string;
  detail: string;
  kind: ActivityKind;
  target: number;
  correctOnly: boolean;
  href: string;
  icon: IconName;
};

export const MISSION_REWARD = 30;

const REVIEWS: Mission = {
  id: 'reviews',
  title: 'Calentamiento',
  detail: 'Repasa 10 palabras',
  kind: 'review',
  target: 10,
  correctOnly: false,
  href: '#/review',
  icon: 'target',
};

const ROTATING: Mission[] = [
  {
    id: 'tones',
    title: 'Oído fino',
    detail: 'Responde 8 de tonos',
    kind: 'tones',
    target: 8,
    correctOnly: false,
    href: '#/tonos',
    icon: 'speaker',
  },
  {
    id: 'scenario',
    title: 'Una escena',
    detail: 'Completa una situación',
    kind: 'scenario',
    target: 1,
    correctOnly: false,
    href: '#/situaciones',
    icon: 'chat',
  },
  {
    id: 'context',
    title: 'En contexto',
    detail: 'Acierta 4 huecos',
    kind: 'cloze',
    target: 4,
    correctOnly: true,
    href: '#/contexto',
    icon: 'book',
  },
  {
    id: 'lesson',
    title: 'Una lección',
    detail: 'Completa una unidad',
    kind: 'lesson',
    target: 1,
    correctOnly: false,
    href: '#/',
    icon: 'sparkles',
  },
];

/** Tres misiones por día: repaso fijo y dos rotatorias según la fecha. */
export function makeMissions(dateKey: string): Mission[] {
  const seed = [...dateKey].reduce(
    (total, char) => (total * 31 + (char.codePointAt(0) ?? 0)) % 2147483647,
    7,
  );
  const start = seed % ROTATING.length;
  return [REVIEWS, ROTATING[start], ROTATING[(start + 1) % ROTATING.length]];
}

export function missionProgress(
  activity: ActivityEntry[],
  mission: Mission,
  dateKey: string,
): number {
  const count = activity.filter(
    (entry) =>
      dayKey(entry.at) === dateKey &&
      entry.kind === mission.kind &&
      (!mission.correctOnly || entry.correct === true),
  ).length;
  return Math.min(count, mission.target);
}

export function allMissionsDone(
  activity: ActivityEntry[],
  missions: Mission[],
  dateKey: string,
): boolean {
  return missions.every((mission) => missionProgress(activity, mission, dateKey) >= mission.target);
}
