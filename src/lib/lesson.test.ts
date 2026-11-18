import { describe, expect, it } from 'vitest';
import { UNITS } from '../data/curriculum';
import { CLOZE_BLANK } from './cloze';
import { makeLessonPlan } from './lesson';

describe('makeLessonPlan', () => {
  it('presenta cada palabra y después la recupera', () => {
    for (const unit of UNITS) {
      const plan = makeLessonPlan(unit);
      const learned = plan.filter((step) => step.kind === 'learn').map((step) => step.wordId);
      const asked = plan
        .filter((step) => step.kind === 'question')
        .map((step) => step.question.wordId);
      expect(learned, unit.id).toEqual(unit.words.map((word) => word.id));
      for (const word of unit.words) expect(asked, unit.id).toContain(word.id);
      expect(asked.length, unit.id).toBe(unit.words.length + 2);
    }
  });

  it('cada pregunta tiene una respuesta entre sus opciones', () => {
    for (const unit of UNITS) {
      for (const step of makeLessonPlan(unit)) {
        if (step.kind !== 'question' || step.question.mode === 'order') continue;
        const { question } = step;
        expect(question.options, question.wordId).toContain(question.answer);
        expect(new Set(question.options).size, question.wordId).toBe(question.options.length);
        if (question.mode === 'gap')
          expect(question.prompt, question.wordId).toContain(CLOZE_BLANK);
      }
    }
  });

  it('mezcla significado, escucha, tono y frase con hueco', () => {
    const modes = new Set(
      UNITS.flatMap((unit) =>
        makeLessonPlan(unit)
          .filter((step) => step.kind === 'question')
          .map((step) => step.question.mode),
      ),
    );
    expect(modes).toContain('recognize');
    expect(modes).toContain('listen');
    expect(modes).toContain('tone');
    expect(modes).toContain('gap');
    expect(modes).toContain('order');
  });

  it('empieza reconociendo y deja tono y hueco para después', () => {
    for (const unit of UNITS) {
      const first = makeLessonPlan(unit)
        .filter((step) => step.kind === 'question')
        .slice(0, 2);
      expect(first, unit.id).toHaveLength(2);
      for (const step of first) {
        expect(step.kind === 'question' && step.question.mode, unit.id).toBe('recognize');
      }
    }
  });

  it('es determinista para la misma unidad', () => {
    for (const unit of UNITS) {
      expect(makeLessonPlan(unit)).toEqual(makeLessonPlan(unit));
    }
  });
});
