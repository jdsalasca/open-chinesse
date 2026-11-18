import { describe, expect, it } from 'vitest';
import { matchesPinyin, pinyinTokens, stripTones, toneOf } from './tone';

describe('toneOf', () => {
  it('detecta los cuatro tonos y el neutro', () => {
    expect(toneOf('mā')).toBe(1);
    expect(toneOf('má')).toBe(2);
    expect(toneOf('mǎ')).toBe(3);
    expect(toneOf('mà')).toBe(4);
    expect(toneOf('ma')).toBe(5);
  });

  it('funciona con diéresis y mayúsculas', () => {
    expect(toneOf('lǜ')).toBe(4);
    expect(toneOf('Nǐ')).toBe(3);
  });
});

describe('pinyinTokens', () => {
  it('separa por espacios', () => {
    expect(pinyinTokens('nǐ hǎo')).toEqual([
      { text: 'nǐ', tone: 3 },
      { text: 'hǎo', tone: 3 },
    ]);
  });
});

describe('pinyinTokens sin espacios', () => {
  it('separa cada sílaba y le asigna su tono', () => {
    expect(pinyinTokens('Běijīng')).toEqual([
      { text: 'Běi', tone: 3 },
      { text: 'jīng', tone: 1 },
    ]);
    expect(pinyinTokens('Zhōngguó')).toEqual([
      { text: 'Zhōng', tone: 1 },
      { text: 'guó', tone: 2 },
    ]);
    expect(pinyinTokens('bàba')).toEqual([
      { text: 'bà', tone: 4 },
      { text: 'ba', tone: 5 },
    ]);
    expect(pinyinTokens('xièxie')).toEqual([
      { text: 'xiè', tone: 4 },
      { text: 'xie', tone: 5 },
    ]);
  });
});

describe('stripTones', () => {
  it('quita marcas, espacios y mayúsculas', () => {
    expect(stripTones('Zhōngguó')).toBe('zhongguo');
    expect(stripTones('nǐ hǎo')).toBe('nihao');
  });

  it('trata ü como u', () => {
    expect(stripTones('nǚ’ér')).toBe('nuer');
  });
});

describe('matchesPinyin', () => {
  it('acepta sin tonos ni espacios', () => {
    expect(matchesPinyin('ni hao', 'nǐ hǎo')).toBe(true);
    expect(matchesPinyin('nihao', 'nǐ hǎo')).toBe(true);
    expect(matchesPinyin('NI HAO', 'nǐ hǎo')).toBe(true);
  });

  it('acepta u en lugar de ü', () => {
    expect(matchesPinyin('nu er', 'nǚ’ér')).toBe(true);
  });

  it('rechaza pinyin distinto', () => {
    expect(matchesPinyin('ni hao', 'wǒ')).toBe(false);
  });
});
