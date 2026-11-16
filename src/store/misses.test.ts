import { afterEach, describe, expect, it } from 'vitest';
import { reasonLabel } from '../lib/miss';
import { missBreakdown } from './metrics';
import { useLearner } from './useLearner';

describe('motivo del fallo', () => {
  afterEach(() => useLearner.getState().reset());

  it('nombra los motivos en español', () => {
    expect(reasonLabel('sound')).toBe('No la reconocí de oído');
    expect(reasonLabel('order')).toBe('No supe ordenar la frase');
    expect(reasonLabel('otro')).toBe('Sin motivo');
  });

  it('guarda el último motivo por palabra', () => {
    useLearner.getState().noteMiss('h1-01-w01', 'meaning', 1000);
    useLearner.getState().noteMiss('h1-01-w01', 'sound', 2000);
    expect(useLearner.getState().misses['h1-01-w01']).toEqual({ reason: 'sound', at: 2000 });
  });

  it('cuenta los motivos de más a menos frecuente', () => {
    useLearner.getState().noteMiss('a', 'sound', 1);
    useLearner.getState().noteMiss('b', 'sound', 1);
    useLearner.getState().noteMiss('c', 'meaning', 1);
    expect(missBreakdown(useLearner.getState().misses)).toEqual([
      { reason: 'sound', count: 2 },
      { reason: 'meaning', count: 1 },
    ]);
  });
});
