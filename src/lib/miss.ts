export type MissReason = 'unknown' | 'meaning' | 'sound' | 'order';

export const MISS_REASONS: { id: MissReason; label: string }[] = [
  { id: 'unknown', label: 'No conocía la palabra' },
  { id: 'meaning', label: 'Confundí el significado' },
  { id: 'sound', label: 'No la reconocí de oído' },
  { id: 'order', label: 'No supe ordenar la frase' },
];

export function reasonLabel(reason: string): string {
  return MISS_REASONS.find((item) => item.id === reason)?.label ?? 'Sin motivo';
}
