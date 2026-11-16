import { describe, expect, it } from 'vitest';
import { scenarioResult } from './scenario';

describe('cierre de una situación', () => {
  it('reconoce una escena sin fallos', () => {
    expect(scenarioResult(0)).toContain('Sin fallos');
  });

  it('distingue un intento extra de varios', () => {
    expect(scenarioResult(1)).toContain('Un intento extra');
    expect(scenarioResult(3)).toContain('3 intentos extra');
  });
});
