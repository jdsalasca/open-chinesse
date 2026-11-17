import { describe, expect, it } from 'vitest';
import { ALL_WORDS } from '../data/curriculum';
import { buildCharacterStory } from './character-story';

const COURSE_CHARS = [...new Set(ALL_WORDS.flatMap((word) => [...word.hanzi]))];

describe('historia del carácter', () => {
  it('todo carácter del curso tiene historia y gancho de memoria', () => {
    for (const char of COURSE_CHARS) {
      const story = buildCharacterStory(char);
      expect(story.idea.trim(), char).not.toBe('');
      expect(story.mnemonic.trim(), char).not.toBe('');
      expect(story.idea.length, char).toBeGreaterThan(15);
    }
  });

  it('explica pictogramas con una imagen concreta', () => {
    expect(buildCharacterStory('火').idea).toMatch(/fuego|llama/i);
    expect(buildCharacterStory('水').idea).toMatch(/agua|río/i);
    expect(buildCharacterStory('人').idea).toMatch(/persona/i);
  });

  it('explica compuestos con sus piezas', () => {
    const good = buildCharacterStory('好');
    expect(good.idea).toMatch(/mujer/i);
    expect(good.idea).toMatch(/hijo/i);
    const bright = buildCharacterStory('明');
    expect(bright.idea).toMatch(/sol/i);
    expect(bright.idea).toMatch(/luna/i);
  });

  it('explica el sonido de los semántico-fonéticos', () => {
    const you = buildCharacterStory('你');
    expect(you.sound).toContain('尔');
    expect(you.sound).toContain('nǐ');
  });

  it('usa la palabra del curso cuando el carácter no va solo', () => {
    expect(buildCharacterStory('苹').idea).toMatch(/manzana/i);
  });

  it('resuelve partículas y verbos opacos con una historia', () => {
    expect(buildCharacterStory('有').idea).toMatch(/mano/i);
    expect(buildCharacterStory('是').idea).toMatch(/sol/i);
    expect(buildCharacterStory('的').idea).toMatch(/posesión/i);
  });
});
