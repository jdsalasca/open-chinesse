import { describe, expect, it } from 'vitest';
import { SKILLS, skillLabel } from '../lib/practice';
import { BASE_ACTIONS } from './Practice';

describe('habilidades de práctica', () => {
  it('define las cinco destrezas con etiquetas únicas', () => {
    const ids = SKILLS.map((skill) => skill.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(['oido', 'habla', 'lectura', 'escritura', 'memoria']);
    for (const skill of SKILLS) expect(skillLabel(skill.id)).toBe(skill.label);
  });

  it('asigna una destreza válida a cada actividad y no repite rutas', () => {
    const valid = new Set(SKILLS.map((skill) => skill.id));
    const hrefs = BASE_ACTIONS.map((action) => action.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const action of BASE_ACTIONS) {
      expect(valid.has(action.skill), action.href).toBe(true);
      expect(action.title.trim(), action.href).not.toBe('');
    }
  });

  it('cubre oído, habla, lectura, escritura y memoria', () => {
    const covered = new Set(BASE_ACTIONS.map((action) => action.skill));
    expect([...covered].sort()).toEqual(SKILLS.map((skill) => skill.id).sort());
  });
});
