import { describe, expect, it } from 'vitest';
import { ALL_WORDS } from './curriculum';
import { SCENARIOS, type Scenario } from './scenarios';

const PUNCTUATION = new Set([...'，。！？、：；·—…“”‘’（）《》']);

/** Caracteres permitidos en una escena de nivel N: los de palabras de nivel ≤ N. */
function allowed(level: number): Set<string> {
  const chars = new Set<string>();
  for (const word of ALL_WORDS) {
    const unitLevel = word.id.startsWith('h1') ? 1 : word.id.startsWith('h2') ? 2 : 3;
    if (unitLevel <= level) for (const char of word.hanzi) chars.add(char);
  }
  return chars;
}

function texts(scenario: Scenario): string[] {
  return scenario.steps.flatMap((step) =>
    step.kind === 'line'
      ? [step.line.hanzi]
      : [step.prompt.hanzi, ...step.options.map((option) => option.hanzi)],
  );
}

function missingChars(scenario: Scenario, level: number): string[] {
  const vocabulary = allowed(level);
  return [
    ...new Set(
      texts(scenario).flatMap((text) =>
        [...text].filter(
          (char) => !vocabulary.has(char) && !PUNCTUATION.has(char) && char.trim() !== '',
        ),
      ),
    ),
  ];
}

function requiredLevel(scenario: Scenario): number {
  for (let level = 1; level <= 3; level += 1) {
    if (missingChars(scenario, level).length === 0) return level;
  }
  return 4;
}

function lines(scenario: Scenario) {
  return scenario.steps.flatMap((step) => (step.kind === 'line' ? [step.line] : [step.prompt]));
}

describe('graduación de las situaciones', () => {
  it('cada escena usa solo vocabulario de su nivel o inferior', () => {
    const problems = SCENARIOS.flatMap((scenario) => {
      const required = requiredLevel(scenario);
      if (required <= scenario.level) return [];
      const missing = missingChars(scenario, scenario.level).join(' ');
      return [`${scenario.id}: necesita HSK ${required}; faltan ${missing}`];
    });
    expect(problems).toEqual([]);
  });

  it('cada línea trae pinyin y traducción', () => {
    for (const scenario of SCENARIOS) {
      for (const line of lines(scenario)) {
        expect(line.pinyin.trim(), line.hanzi).not.toBe('');
        expect(line.translation.trim(), line.hanzi).not.toBe('');
      }
    }
  });
});

describe('estructura de las situaciones', () => {
  it('cada decisión tiene tres opciones y una sola correcta', () => {
    for (const scenario of SCENARIOS) {
      for (const step of scenario.steps) {
        if (step.kind !== 'choice') continue;
        expect(step.options.length, scenario.id).toBe(3);
        expect(
          step.options.filter((option) => option.correct).length,
          `${scenario.id}/${step.prompt.id}`,
        ).toBe(1);
      }
    }
  });

  it('los identificadores son únicos y cada escena tiene al menos dos decisiones', () => {
    const ids = SCENARIOS.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const scenario of SCENARIOS) {
      const lineIds = scenario.steps.flatMap((step) =>
        step.kind === 'line' ? [step.line.id] : [step.prompt.id],
      );
      expect(new Set(lineIds).size, scenario.id).toBe(lineIds.length);
      expect(
        scenario.steps.filter((step) => step.kind === 'choice').length,
        scenario.id,
      ).toBeGreaterThanOrEqual(2);
    }
  });
});
