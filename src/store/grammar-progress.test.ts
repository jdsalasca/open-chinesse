import { beforeEach, describe, expect, it } from 'vitest';
import { exportPayload, useLearner } from './useLearner';

const NOW = new Date('2026-11-16T10:00:00Z').getTime();
const DAY = 86_400_000;

beforeEach(() => {
  useLearner.getState().reset();
  localStorage.clear();
});

describe('progreso de gramática', () => {
  it('guarda la práctica con su repaso y su prueba', () => {
    useLearner.getState().saveGrammarPractice('bu-mei', ['bu-mei-p2'], NOW);
    const progress = useLearner.getState().grammar['bu-mei'];
    expect(progress.failed).toEqual(['bu-mei-p2']);
    expect(progress.dueAt).toBe(NOW + 3 * DAY);
    expect(progress.checkAt).toBe(NOW + 7 * DAY);
  });

  it('conserva el resultado de la primera prueba diferida', () => {
    useLearner.getState().saveGrammarPractice('bu-mei', [], NOW);
    useLearner.getState().saveGrammarCheck('bu-mei', 3, 5, NOW + 7 * DAY);
    useLearner.getState().saveGrammarCheck('bu-mei', 5, 5, NOW + 8 * DAY);
    expect(useLearner.getState().grammar['bu-mei'].check).toEqual({
      score: 3,
      total: 5,
      at: NOW + 7 * DAY,
    });
  });

  it('exporta e hidrata el progreso de gramática', () => {
    useLearner.getState().saveGrammarPractice('bu-mei', ['bu-mei-p1'], NOW);
    const payload = exportPayload();
    useLearner.getState().reset();
    expect(useLearner.getState().grammar).toEqual({});
    useLearner.getState().hydrate(payload);
    expect(useLearner.getState().grammar['bu-mei'].failed).toEqual(['bu-mei-p1']);
  });
});
