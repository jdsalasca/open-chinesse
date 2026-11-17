export type Skill = 'oido' | 'habla' | 'lectura' | 'escritura' | 'memoria';

export const SKILLS: { id: Skill; label: string }[] = [
  { id: 'oido', label: 'Oído' },
  { id: 'habla', label: 'Habla' },
  { id: 'lectura', label: 'Lectura' },
  { id: 'escritura', label: 'Escritura' },
  { id: 'memoria', label: 'Memoria' },
];

export function skillLabel(skill: Skill): string {
  return SKILLS.find((item) => item.id === skill)?.label ?? 'Práctica';
}
