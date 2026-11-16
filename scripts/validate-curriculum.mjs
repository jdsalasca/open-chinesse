#!/usr/bin/env node
/**
 * Valida el contenido del currículo antes de publicarlo.
 *
 * Uso:
 *   node scripts/validate-curriculum.mjs            # HSK 1 y 2
 *   node scripts/validate-curriculum.mjs hsk3       # cualquier prefijo hsk*
 *
 * Comprueba: conteo por archivo, ejemplo que contenga la palabra, frases
 * repetidas, pinyin con caracteres válidos y significado no vacío.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DATA = join(ROOT, 'src/data');
const PINYIN = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü’' ]+$/i;

const filter = process.argv[2] ?? 'hsk';
const files = readdirSync(DATA)
  .filter((name) => name.startsWith(filter) && name.endsWith('.ts') && !name.includes('test'))
  .filter((name) => name.includes('part'));

const problems = [];
const seen = new Map();

for (const file of files) {
  const source = readFileSync(join(DATA, file), 'utf8');
  const words = [
    ...source.matchAll(
      /hanzi: '([^']+)'[\s\S]{0,80}?pinyin: '([^']+)'[\s\S]{0,200}?meaning: '([^']+)'[\s\S]{0,260}?hanzi: '([^']+)'/g,
    ),
  ];
  const entries = source.match(/^        hanzi: '/gm)?.length ?? 0;
  if (entries === 0) {
    problems.push(`${file}: no se encontraron palabras`);
    continue;
  }
  if (words.length !== entries) {
    problems.push(`${file}: ${entries} palabras pero ${words.length} bloques completos`);
  }
  for (const [, hanzi, pinyin, meaning, example] of words) {
    if (!PINYIN.test(pinyin)) problems.push(`${hanzi}: pinyin inválido «${pinyin}»`);
    if (!meaning.trim()) problems.push(`${hanzi}: significado vacío`);
    if (!example.includes(hanzi)) problems.push(`${hanzi}: el ejemplo no contiene la palabra`);
    const previous = seen.get(example);
    if (previous) problems.push(`ejemplo repetido entre ${previous} y ${hanzi}: ${example}`);
    else seen.set(example, hanzi);
  }
  console.log(`${file}: ${entries} palabras`);
}

if (problems.length > 0) {
  console.log('\nPROBLEMAS:');
  for (const problem of problems) console.log(`  - ${problem}`);
  process.exit(1);
}
console.log(`\nOK: ${seen.size} ejemplos únicos, sin duplicados ni pinyin inválido.`);
