#!/usr/bin/env node
/**
 * Genera src/data/decomposition.json para los caracteres del currículo.
 *
 * Fuentes (se descargan a mano en .tmp/, no las baja este script):
 *   - IDS: https://raw.githubusercontent.com/cjkvi/cjkvi-ids/master/ids.txt
 *   - Radical y trazos: Unihan.zip de unicode.org -> Unihan_IRGSources.txt
 *   - Pinyin y variantes: Unihan_IRGSources.txt / Unihan_Variants.txt
 *   - Formación y Shuowen: docs/data.json.gz de lbm364dl/hanzi-etymology-dict
 *
 * Uso: node scripts/build-decomposition.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

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
  ids.set(char, idsText.replace(/\[[^\]]*\]/g, ''));
}

// Las piezas de un carácter también necesitan ficha: se añaden al conjunto.
const OPERATORS = new Set([...'⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻'].map((op) => op.codePointAt(0)));
const pieces = [...chars].flatMap((char) => [...(ids.get(char) ?? '')]);
for (const piece of pieces) {
  if (/\p{Script=Han}/u.test(piece) && !OPERATORS.has(piece.codePointAt(0))) chars.add(piece);
}

const radicalChar = (number) => String.fromCodePoint(0x2f00 + number - 1).normalize('NFKC');
const strokes = new Map();
const radicals = new Map();
const pinyins = new Map();
const fields = new Map();
const simplification = new Map();
for (const line of readFileSync(join(ROOT, '.tmp/unihan/Unihan_Variants.txt'), 'utf8').split(
  /\r?\n/,
)) {
  const [code, field, value] = line.split('\t');
  if (field !== 'kSimplifiedVariant' || !code?.startsWith('U+')) continue;
  const char = String.fromCodePoint(Number.parseInt(code.slice(2), 16));
  const ref = (value ?? '').split(/[ ,]/).find((item) => /^U\+[0-9A-F]+$/i.test(item));
  if (ref) simplification.set(char, String.fromCodePoint(Number.parseInt(ref.slice(2), 16)));
}
const radicalFrom = (value) => {
  const number = Number.parseInt(value.split(' ')[0].split('.')[0].replace("'", ''), 10);
  return number >= 1 && number <= 214 ? radicalChar(number) : undefined;
};

const HANDLERS = {
  kTotalStrokes: (char, value) => strokes.set(char, Number.parseInt(value, 10)),
  kRSUnicode: (char, value) => {
    const radical = radicalFrom(value);
    if (radical) radicals.set(char, radical);
  },
  kMandarin: (char, value) => pinyins.set(char, value),
};

for (const file of ['Unihan_IRGSources.txt', 'Unihan_Readings.txt']) {
  for (const line of readFileSync(join(ROOT, '.tmp/unihan', file), 'utf8').split(/\r?\n/)) {
    const [code, field, value] = line.split('\t');
    if (!code?.startsWith('U+')) continue;
    const char = String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    if (!chars.has(char)) continue;
    if (!fields.has(char)) fields.set(char, new Map());
    fields.get(char).set(field, value);
    HANDLERS[field]?.(char, value);
  }
}

const etymology = new Map();
const records = JSON.parse(gunzipSync(readFileSync(join(ROOT, '.tmp/hanzi-data.json.gz'))));
for (const record of records) {
  if (chars.has(record.c)) etymology.set(record.c, record);
}

const single = (value) => {
  const ref = (value ?? '').split(/[ ,]/).find((item) => /^U\+[0-9A-F]+$/i.test(item));
  return ref ? String.fromCodePoint(Number.parseInt(ref.slice(2), 16)) : undefined;
};

const out = {};
let withIds = 0;
let withRadical = 0;
let withHistory = 0;
for (const char of [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0))) {
  const entry = {};
  if (ids.has(char)) {
    entry.ids = ids.get(char);
    withIds += 1;
  }
  if (radicals.has(char)) {
    const radical = radicals.get(char);
    entry.radical = radical === char ? char : (simplification.get(radical) ?? radical);
    withRadical += 1;
  }
  if (strokes.has(char)) entry.strokes = strokes.get(char);
  if (pinyins.has(char)) entry.pinyin = pinyins.get(char);
  const media = fields.get(char);
  const traditional = single(media?.get('kTraditionalVariant'));
  if (traditional && traditional !== char) entry.traditional = traditional;
  const simplified = single(media?.get('kSimplifiedVariant'));
  if (simplified && simplified !== char) entry.simplified = simplified;
  const record = etymology.get(char);
  if (record) {
    if (record.ft) entry.type = record.ft;
    if (record.sem) entry.semantic = [...record.sem];
    if (record.phon) entry.phonetic = [...record.phon];
    if (record.sw) {
      entry.shuowen = record.sw;
      withHistory += 1;
    }
  }
  out[char] = entry;
}

// Familia fonética: caracteres del curso que usan este como pieza de sonido.
for (const char of Object.keys(out)) {
  const family = Object.keys(out).filter((other) => out[other].phonetic?.includes(char));
  if (family.length > 0) out[char].family = family.slice(0, 8);
}

writeFileSync(join(DATA, 'decomposition.json'), `${JSON.stringify(out, null, 2)}\n`, 'utf8');
console.log(
  `caracteres=${chars.size} conIds=${withIds} conRadical=${withRadical} conShuowen=${withHistory}`,
);
