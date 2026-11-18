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

const INITIALS = [
  '',
  'b',
  'p',
  'm',
  'f',
  'd',
  't',
  'n',
  'l',
  'g',
  'k',
  'h',
  'j',
  'q',
  'x',
  'zh',
  'ch',
  'sh',
  'r',
  'z',
  'c',
  's',
  'y',
  'w',
];

const FINALS = [
  'a',
  'o',
  'e',
  'i',
  'u',
  'ü',
  'ai',
  'ei',
  'ui',
  'ao',
  'ou',
  'iu',
  'ie',
  'üe',
  'er',
  'an',
  'en',
  'in',
  'un',
  'ün',
  'ang',
  'eng',
  'ing',
  'ong',
  'ia',
  'iao',
  'ian',
  'iang',
  'iong',
  'ua',
  'uo',
  'uai',
  'uan',
  'uang',
  'ueng',
  'üan',
];

const SYLLABLES = new Set<string>();
for (const initial of INITIALS) {
  for (const final of FINALS) SYLLABLES.add(initial + final);
}
for (const final of ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er']) {
  SYLLABLES.add(final);
}
for (const syllable of [
  'yi',
  'ya',
  'ye',
  'yao',
  'you',
  'yan',
  'yin',
  'yang',
  'ying',
  'yong',
  'yu',
  'yue',
  'yuan',
  'yun',
  'wu',
  'wa',
  'wo',
  'wai',
  'wei',
  'wan',
  'wen',
  'wang',
  'weng',
  'ju',
  'jue',
  'juan',
  'jun',
  'qu',
  'que',
  'quan',
  'qun',
  'xu',
  'xue',
  'xuan',
  'xun',
]) {
  SYLLABLES.add(syllable);
}

const TONE_MARK = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

/** Divide una palabra sin espacios en sílabas pinyin válidas. */
function splitSyllables(base: string): string[] {
  const memo = new Map<number, string[] | null>();
  const solve = (index: number): string[] | null => {
    if (index === base.length) return [];
    const cached = memo.get(index);
    if (cached !== undefined) return cached;
    for (let end = base.length; end > index; end -= 1) {
      const part = base.slice(index, end);
      if (!SYLLABLES.has(part)) continue;
      const rest = solve(end);
      if (rest) {
        const result = [part, ...rest];
        memo.set(index, result);
        return result;
      }
    }
    memo.set(index, null);
    return null;
  };
  return solve(0) ?? [base];
}

function pushChunk(tokens: { text: string; tone: Tone }[], text: string): void {
  if (!TONE_MARK.test(text)) {
    tokens.push({ text, tone: toneOf(text) });
    return;
  }
  const parts = splitSyllables(stripTones(text));
  let offset = 0;
  for (const part of parts) {
    const piece = text.slice(offset, offset + part.length);
    tokens.push({ text: piece, tone: toneOf(piece) });
    offset += part.length;
  }
  if (offset < text.length) {
    const tail = text.slice(offset);
    const last = tokens.at(-1);
    if (last) last.text += tail;
    else tokens.push({ text: tail, tone: 5 });
  }
}

/** Separa el pinyin en sílabas, aunque la palabra venga sin espacios. */
export function pinyinTokens(pinyin: string): { text: string; tone: Tone }[] {
  const tokens: { text: string; tone: Tone }[] = [];
  for (const raw of pinyin.trim().split(/\s+/)) {
    for (const chunk of raw.split("'")) {
      if (chunk) pushChunk(tokens, chunk.normalize('NFC'));
    }
  }
  return tokens;
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

const VOWELS = 'aeiouü' as const;
type Vowel = (typeof VOWELS)[number];

const MARKS: Record<Vowel, Record<Exclude<Tone, 5>, string>> = {
  a: { 1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à' },
  e: { 1: 'ē', 2: 'é', 3: 'ě', 4: 'è' },
  i: { 1: 'ī', 2: 'í', 3: 'ǐ', 4: 'ì' },
  o: { 1: 'ō', 2: 'ó', 3: 'ǒ', 4: 'ò' },
  u: { 1: 'ū', 2: 'ú', 3: 'ǔ', 4: 'ù' },
  ü: { 1: 'ǖ', 2: 'ǘ', 3: 'ǚ', 4: 'ǜ' },
};

function mainVowel(base: string): Vowel | undefined {
  if (base.includes('a')) return 'a';
  if (base.includes('e')) return 'e';
  if (base.includes('ou')) return 'o';
  const found = [...base].filter((char): char is Vowel => VOWELS.includes(char as Vowel));
  return found.at(-1);
}

/** Escribe una sílaba sin tonos con la marca del tono pedido. */
export function withTone(syllable: string, tone: Tone): string {
  const base = syllable.toLowerCase().replace(/v/g, 'ü');
  if (tone === 5) return base;
  const vowel = mainVowel(base);
  if (!vowel) return base;
  return base.replace(vowel, MARKS[vowel][tone]);
}

/** Tonos declarados por el usuario: números (ni3) o marcas (nǐ). */
export function typedTones(typed: string): Tone[] | null {
  const digits = typed.match(/[1-5]/g);
  if (digits) return digits.map((digit) => Number(digit) as Tone);
  const tones = pinyinTokens(typed).map((token) => token.tone);
  return tones.length > 0 && tones.some((tone) => tone !== 5) ? tones : null;
}

/** Secuencia de tonos de un pinyin de referencia. */
export function toneSequence(pinyin: string): Tone[] {
  return pinyinTokens(pinyin).map((token) => token.tone);
}

export type PinyinCheck = 'ok' | 'sin-tonos' | 'tonos' | 'mal';

/** Distingue «sílabas mal», «bien sin tonos», «tono equivocado» y «todo bien». */
export function checkPinyin(typed: string, expected: string): PinyinCheck {
  if (stripTones(typed) !== stripTones(expected)) return 'mal';
  const typedSeq = typedTones(typed);
  if (!typedSeq) return 'sin-tonos';
  return typedSeq.join('-') === toneSequence(expected).join('-') ? 'ok' : 'tonos';
}
