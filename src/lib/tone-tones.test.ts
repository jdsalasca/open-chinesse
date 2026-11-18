import { describe, expect, it } from 'vitest';
import { checkPinyin, withTone } from './tone';

describe('withTone', () => {
  it('coloca la marca en la vocal correcta', () => {
    expect(withTone('ma', 3)).toBe('mǎ');
    expect(withTone('hao', 3)).toBe('hǎo');
    expect(withTone('ji', 1)).toBe('jī');
    expect(withTone('shui', 3)).toBe('shuǐ');
    expect(withTone('lv', 4)).toBe('lǜ');
    expect(withTone('er', 2)).toBe('ér');
  });

  it('devuelve el texto sin marca para el tono neutro', () => {
    expect(withTone('ma', 5)).toBe('ma');
  });
});

describe('checkPinyin', () => {
  it('acepta sin tonos y avisa de que faltan', () => {
    expect(checkPinyin('ni hao', 'nǐ hǎo')).toBe('sin-tonos');
    expect(checkPinyin('nihao', 'nǐ hǎo')).toBe('sin-tonos');
  });

  it('acepta tonos correctos con marcas o números', () => {
    expect(checkPinyin('nǐ hǎo', 'nǐ hǎo')).toBe('ok');
    expect(checkPinyin('ni3 hao3', 'nǐ hǎo')).toBe('ok');
  });

  it('señala el tono equivocado aunque las sílabas estén bien', () => {
    expect(checkPinyin('ni2 hao3', 'nǐ hǎo')).toBe('tonos');
    expect(checkPinyin('nǐ hào', 'nǐ hǎo')).toBe('tonos');
  });

  it('rechaza sílabas distintas', () => {
    expect(checkPinyin('wo hen hao', 'nǐ hǎo')).toBe('mal');
  });

  it('compara los tonos de palabras sin espacios', () => {
    expect(checkPinyin('bei3 jing1', 'Běijīng')).toBe('ok');
    expect(checkPinyin('bei3 jing2', 'Běijīng')).toBe('tonos');
    expect(checkPinyin('bei jing', 'Běijīng')).toBe('sin-tonos');
  });
});
