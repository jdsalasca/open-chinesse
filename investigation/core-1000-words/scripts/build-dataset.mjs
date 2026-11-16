#!/usr/bin/env node
/**
 * Construye el dataset de las 1000 palabras más frecuentes del chino mandarín.
 *
 * Fuentes:
 *  - FrequencyWords (hermitdave), corpus OpenSubtitles 2018 zh_cn.
 *  - CC-CEDICT (MDBG) para pinyin y glosa en inglés.
 *
 * Uso: node build-dataset.mjs
 * Descarga las fuentes en ./raw si no existen y escribe ./data.
 */
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createInterface } from 'node:readline';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = join(HERE, 'raw');
const DATA = join(HERE, '..', 'data');
const FREQ_URL =
  'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/zh_cn/zh_cn_50k.txt';
const CEDICT_URL = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz';
const HAN = /^[\u4e00-\u9fff]{1,4}$/;
const LIMIT = 1000;

const TONE_MAP = {
  a: 'āáǎà',
  e: 'ēéěè',
  i: 'īíǐì',
  o: 'ōóǒò',
  u: 'ūúǔù',
  v: 'ǖǘǚǜ',
};

/** Convierte "ni3 hao3" a "nǐ hǎo". */
function toToneMarks(numeric) {
  return numeric
    .split(/\s+/)
    .map((syllable) => {
      const match = syllable.match(/^([a-züv]+)([1-5])?$/i);
      if (!match) return syllable;
      const [, letters, tone] = match;
      if (!tone || tone === '5') return letters.replace(/v/g, 'ü');
      const index = [...letters].findIndex((c) => 'aeiou'.includes(c.toLowerCase()));
      const at = index === -1 ? 0 : index;
      const chars = [...letters];
      const vowel = chars[at].toLowerCase().replace('v', 'u');
      const marked = TONE_MAP[vowel]?.[Number(tone) - 1] ?? chars[at];
      chars[at] = marked;
      return chars.join('').replace(/v/g, 'ü');
    })
    .join(' ');
}

async function download(url, target) {
  if (existsSync(target)) return;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} → ${response.status}`);
  writeFileSync(target, Buffer.from(await response.arrayBuffer()));
}

function readCedict() {
  const gz = readFileSync(join(RAW, 'cedict.gz'));
  const text = gunzipSync(gz).toString('utf8');
  const map = new Map();
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(\S+) (\S+) \[([^\]]+)\] \/(.+)\/$/);
    if (!match) continue;
    const [, , simplified, pinyin, gloss] = match;
    if (!map.has(simplified)) {
      map.set(simplified, {
        pinyin: toToneMarks(pinyin),
        gloss: gloss.split('/').filter(Boolean).slice(0, 2).join('; '),
      });
    }
  }
  return map;
}

async function readFrequency() {
  const lines = [];
  const stream = createInterface({
    input: createReadStream(join(RAW, 'zh_cn_50k.txt'), 'utf8'),
    crlfDelay: Infinity,
  });
  for await (const line of stream) {
    const [word, count] = line.split(' ');
    if (!word || !HAN.test(word)) continue;
    lines.push({ word, count: Number(count) });
  }
  return lines;
}

function collectWords(frequency, cedict) {
  const words = [];
  let covered = 0;
  for (const item of frequency) {
    const entry = cedict.get(item.word);
    if (!entry) continue;
    covered += item.count;
    words.push({
      rank: words.length + 1,
      hanzi: item.word,
      pinyin: entry.pinyin,
      gloss: entry.gloss,
      count: item.count,
    });
    if (words.length === LIMIT) break;
  }
  return { words, covered };
}

function writeOutputs(words, coverage) {
  writeFileSync(join(DATA, 'top-1000.json'), JSON.stringify({ coverage, words }, null, 2));
  const csv = [
    'rank,hanzi,pinyin,gloss,count',
    ...words.map(
      (w) => `${w.rank},"${w.hanzi}","${w.pinyin}","${w.gloss.replace(/"/g, "'")}",${w.count}`,
    ),
  ].join('\n');
  writeFileSync(join(DATA, 'top-1000.csv'), `${csv}\n`);
  writeFileSync(join(DATA, 'coverage.json'), JSON.stringify(coverage, null, 2));
}

async function main() {
  mkdirSync(RAW, { recursive: true });
  mkdirSync(DATA, { recursive: true });
  await download(FREQ_URL, join(RAW, 'zh_cn_50k.txt'));
  await download(CEDICT_URL, join(RAW, 'cedict.gz'));

  const cedict = readCedict();
  const frequency = await readFrequency();
  const totalTokens = frequency.reduce((sum, item) => sum + item.count, 0);
  const { words, covered } = collectWords(frequency, cedict);

  const coverage = {
    corpus: 'OpenSubtitles 2018 zh_cn (FrequencyWords)',
    tokens: totalTokens,
    words: words.length,
    tokenCoverage: Number((covered / totalTokens).toFixed(4)),
    highestCount: words[0].count,
    lowestCount: words.at(-1).count,
  };

  writeOutputs(words, coverage);
  console.log(JSON.stringify(coverage, null, 2));
}

await main();
