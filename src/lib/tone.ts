export type Tone = 1 | 2 | 3 | 4 | 5;

const TONE_MARKS: Record<string, Tone> = {
  ā: 1,
  á: 2,
  ǎ: 3,
  à: 4,
  ē: 1,
  é: 2,
  ě: 3,
  è: 4,
  ī: 1,
  í: 2,
  ǐ: 3,
  ì: 4,
  ō: 1,
  ó: 2,
  ǒ: 3,
  ò: 4,
  ū: 1,
  ú: 2,
  ǔ: 3,
  ù: 4,
  ǖ: 1,
  ǘ: 2,
  ǚ: 3,
  ǜ: 4,
};

/** Tono de la primera vocal acentuada del token; 5 (neutro) si no hay marca. */
export function toneOf(token: string): Tone {
  for (const char of token.normalize('NFC')) {
    const tone = TONE_MARKS[char];
    if (tone) return tone;
  }
  return 5;
}

/** Separa el pinyin en tokens (grupos separados por espacio). */
export function pinyinTokens(pinyin: string): { text: string; tone: Tone }[] {
  return pinyin
    .trim()
    .split(/\s+/)
    .map((text) => ({ text, tone: toneOf(text) }));
}

/** Pinyin sin marcas ni espacios, para comparar lo que teclea el usuario. */
export function stripTones(pinyin: string): string {
  return (
    pinyin
      .normalize('NFD')
      // ü se descompone en u + diéresis: se admite tanto "v" como "u".
      .replace(/u\u0308/g, 'u')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/’/g, '')
      .replace(/[^a-z]/gi, '')
      .toLowerCase()
  );
}

export function matchesPinyin(typed: string, expected: string): boolean {
  return stripTones(typed) === stripTones(expected);
}
