#!/usr/bin/env node
/**
 * Genera src/data/decomposition.json para los caracteres del currículo.
 *
 * Fuentes (se descargan a mano en .tmp/, no las baja este script):
 *   - IDS: https://raw.githubusercontent.com/cjkvi/cjkvi-ids/master/ids.txt
 *   - Radical y trazos: Unihan.zip de unicode.org -> Unihan_IRGSources.txt
 *
 * Uso: node scripts/build-decomposition.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DATA = join(ROOT, 'src/data');

const chars = new Set();
for (const file of readdirSync(DATA).filter((name) => /^hsk\d-part\d\.ts$/.test(name))) {
  const source = readFileSync(join(DATA, file), 'utf8');
  for (const match of source.matchAll(/^        hanzi: '([^']+)'/gm)) {
    for (const char of match[1]) chars.add(char);
  }
}

const ids = new Map();
for (const line of readFileSync(join(ROOT, '.tmp/ids.txt'), 'utf8').split(/\r?\n/)) {
  const [code, char, idsText] = line.split('\t');
  if (!char || !idsText || !code.startsWith('U+')) continue;
  ids.set(char, idsText);
}

const radicalChar = (number) => String.fromCodePoint(0x2f00 + number - 1).normalize('NFKC');
const strokes = new Map();
const radicals = new Map();
for (const line of readFileSync(join(ROOT, '.tmp/unihan/Unihan_IRGSources.txt'), 'utf8').split(
  /\r?\n/,
)) {
  const [code, field, value] = line.split('\t');
  if (!code?.startsWith('U+')) continue;
  const char = String.fromCodePoint(Number.parseInt(code.slice(2), 16));
  if (!chars.has(char)) continue;
  if (field === 'kTotalStrokes') strokes.set(char, Number.parseInt(value, 10));
  if (field === 'kRSUnicode') {
    const number = Number.parseInt(value.split(' ')[0].split('.')[0].replace("'", ''), 10);
    if (number >= 1 && number <= 214) radicals.set(char, radicalChar(number));
  }
}

const out = {};
let withIds = 0;
let withRadical = 0;
for (const char of [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0))) {
  const entry = {};
  if (ids.has(char)) {
    // CHISE marca variantes regionales al final: ⿱冃目[GTKV]
    entry.ids = ids.get(char).replace(/\[[^\]]*\]/g, '');
    withIds += 1;
  }
  if (radicals.has(char)) entry.radical = radicals.get(char);
  if (strokes.has(char)) entry.strokes = strokes.get(char);
  if (radicals.has(char)) withRadical += 1;
  out[char] = entry;
}

writeFileSync(join(DATA, 'decomposition.json'), `${JSON.stringify(out, null, 2)}\n`, 'utf8');
console.log(
  `caracteres=${chars.size} conIds=${withIds} conRadical=${withRadical} sinNada=${
    Object.values(out).filter((entry) => !entry.ids && !entry.radical).length
  }`,
);
