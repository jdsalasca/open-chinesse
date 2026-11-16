import { describe, expect, it } from 'vitest';
import { ALL_WORDS, WORDS_BY_ID } from '../data/curriculum';
import { blankSentence, checkCloze, isClozeCorrect, makeCloze } from './cloze';

describe('generación de huecos', () => {
  it('solo usa ejemplos que se reconstruyen exactamente', () => {
    const questions = makeCloze(
      ALL_WORDS.map((word) => word.id),
      7,
      500,
    );
    expect(questions.length).toBeGreaterThan(200);
    for (const question of questions) {
      expect(question.prompt).toContain('＿＿');
      expect(question.prompt).not.toContain(question.hanzi);
      expect(question.prompt.replace('＿＿', question.hanzi)).toBe(question.exampleHanzi);
    }
  });

  it('respeta la puntuación al abrir el hueco', () => {
    const word = WORDS_BY_ID.get('h1-01-w07');
    expect(word).toBeDefined();
    expect(blankSentence(word!)).toBe('＿＿坐。');
  });
});

describe('respuesta en contexto', () => {
  it('acepta el carácter o el pinyin, con o sin tonos', () => {
    const word = { hanzi: '是', pinyin: 'shì' };
    expect(checkCloze('是', word)).toBe('hanzi');
    expect(checkCloze('shì', word)).toBe('ok');
    expect(checkCloze('shi4', word)).toBe('ok');
    expect(checkCloze('shi', word)).toBe('sin-tonos');
    expect(checkCloze('shí', word)).toBe('tonos');
    expect(checkCloze('no', word)).toBe('mal');
    expect(checkCloze('   ', word)).toBe('vacio');
  });

  it('el pinyin sin tonos cuenta como acierto', () => {
    expect(isClozeCorrect('hanzi')).toBe(true);
    expect(isClozeCorrect('ok')).toBe(true);
    expect(isClozeCorrect('sin-tonos')).toBe(true);
    expect(isClozeCorrect('tonos')).toBe(false);
    expect(isClozeCorrect('mal')).toBe(false);
  });

  it('es determinista con la misma semilla', () => {
    const ids = ALL_WORDS.slice(0, 60).map((word) => word.id);
    const first = makeCloze(ids, 3, 6).map((question) => question.wordId);
    const second = makeCloze(ids, 3, 6).map((question) => question.wordId);
    expect(first).toEqual(second);
  });
});
