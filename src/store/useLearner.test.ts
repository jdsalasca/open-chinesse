import { beforeEach, describe, expect, it } from 'vitest';
import { Rating } from 'ts-fsrs';
import { UNITS } from '../data/curriculum';
import { newCard } from '../srs/scheduler';
import { completedUnits, exportPayload, requeuesSoon, useLearner } from './useLearner';

const NOW = new Date('2026-11-15T10:00:00Z').getTime();
const UNIT = UNITS[0];

beforeEach(() => {
  useLearner.getState().reset();
  localStorage.clear();
});

describe('introduceUnit', () => {
  it('crea una tarjeta por palabra', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    expect(Object.keys(useLearner.getState().cards)).toHaveLength(UNIT.words.length);
    expect(completedUnits(useLearner.getState().cards)).toContain(UNIT.id);
  });

  it('no duplica ni reinicia tarjetas existentes', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    useLearner.getState().gradeWord(UNIT.words[0].id, Rating.Good, NOW);
    const before = useLearner.getState().cards[UNIT.words[0].id];
    useLearner.getState().introduceUnit(UNIT.id, NOW + 1000);
    expect(Object.keys(useLearner.getState().cards)).toHaveLength(UNIT.words.length);
    expect(useLearner.getState().cards[UNIT.words[0].id]).toEqual(before);
  });

  it('ignora unidades inexistentes', () => {
    useLearner.getState().introduceUnit('nope', NOW);
    expect(useLearner.getState().cards).toEqual({});
  });
});

describe('gradeWord', () => {
  it('actualiza la tarjeta y registra el repaso', () => {
    const id = UNIT.words[0].id;
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    useLearner.getState().gradeWord(id, Rating.Good, NOW);
    const state = useLearner.getState();
    expect(state.cards[id].reps).toBe(1);
    expect(state.log).toHaveLength(1);
    expect(state.log[0]).toMatchObject({ wordId: id, rating: Rating.Good, at: NOW });
  });

  it('ignora palabras sin tarjeta', () => {
    useLearner.getState().gradeWord('u9-99', Rating.Good, NOW);
    expect(useLearner.getState().log).toHaveLength(0);
  });
});

describe('persistencia', () => {
  it('guarda el progreso en localStorage', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    const raw = localStorage.getItem('open-chinesse');
    expect(raw).toContain(UNIT.words[0].id);
  });
});

describe('sincronización', () => {
  it('exporta e hidrata el mismo progreso', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    useLearner.getState().gradeWord(UNIT.words[0].id, Rating.Good, NOW);
    const payload = exportPayload();
    useLearner.getState().reset();
    expect(Object.keys(useLearner.getState().cards)).toHaveLength(0);

    useLearner.getState().hydrate(payload);
    const restored = useLearner.getState();
    expect(Object.keys(restored.cards)).toHaveLength(UNIT.words.length);
    expect(restored.log).toHaveLength(1);
    expect(restored.cards[UNIT.words[0].id].reps).toBe(1);
    expect(restored.lastEditAt).toBe(NOW);
  });

  it('ignora un payload inválido sin borrar lo local', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    useLearner.getState().hydrate('{"no":"cards"}');
    expect(Object.keys(useLearner.getState().cards)).toHaveLength(UNIT.words.length);
  });

  it('marca lastEditAt en cada cambio', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    expect(useLearner.getState().lastEditAt).toBe(NOW);
    useLearner.getState().gradeWord(UNIT.words[0].id, Rating.Good, NOW + 1000);
    expect(useLearner.getState().lastEditAt).toBe(NOW + 1000);
  });
});

describe('prueba de retención', () => {
  it('se programa a los diez repasos y guarda el resultado', () => {
    const id = UNIT.words[0].id;
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    for (let step = 0; step < 10; step += 1) {
      useLearner.getState().gradeWord(id, Rating.Good, NOW + step);
    }
    const scheduled = useLearner.getState().retention;
    expect(scheduled?.wordIds).toEqual([id]);
    expect(scheduled?.dueAt).toBe(NOW + 9 + 7 * 86_400_000);

    useLearner.getState().recordRetention(1, NOW + 10);
    expect(useLearner.getState().retention).toMatchObject({ score: 1, takenAt: NOW + 10 });
  });

  it('viaja en el payload de sincronización', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    for (let step = 0; step < 10; step += 1) {
      useLearner.getState().gradeWord(UNIT.words[0].id, Rating.Good, NOW + step);
    }
    useLearner.getState().recordRetention(1, NOW + 20);
    const payload = exportPayload();

    useLearner.getState().reset();
    useLearner.getState().hydrate(payload);
    expect(useLearner.getState().retention).toMatchObject({ score: 1, takenAt: NOW + 20 });
  });

  it('un payload viejo sin prueba hidrata a null', () => {
    useLearner.getState().introduceUnit(UNIT.id, NOW);
    useLearner.getState().hydrate(JSON.stringify({ cards: {}, log: [] }));
    expect(useLearner.getState().retention).toBeNull();
  });
});

describe('requeuesSoon', () => {
  it('re-encola pasos de aprendizaje cortos', () => {
    expect(requeuesSoon(newCard(NOW), NOW)).toBe(true);
  });

  it('no re-encola tarjetas programadas para días', () => {
    const far = { ...newCard(NOW), due: new Date(NOW + 3 * 86_400_000).toISOString() };
    expect(requeuesSoon(far, NOW)).toBe(false);
  });
});
