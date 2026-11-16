#!/usr/bin/env node
/**
 * Genera el audio de palabras y frases del currículo con Piper (local, offline).
 *
 * Salida: public/audio/words/<id>.mp3 y public/audio/examples/<id>.mp3
 * Idempotente: si el mp3 ya existe con contenido, no se regenera.
 *
 * Requisitos (globales, no del proyecto):
 *   uv tool install piper-tts
 *   modelo: %LOCALAPPDATA%\piper\zh_CN-huayan-medium.onnx (env PIPER_MODEL)
 *   ffmpeg en el PATH
 *
 * Uso:
 *   node scripts/build-audio.mjs             # lo que falte
 *   node scripts/build-audio.mjs --limit 5   # prueba
 *   node scripts/build-audio.mjs --force     # todo otra vez
 */
import { execFile, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DATA = join(ROOT, 'src/data');
const OUT = join(ROOT, 'public/audio');
const TMP = join(ROOT, '.tmp/tts');
const MODEL =
  process.env.PIPER_MODEL ??
  join(
    process.env.LOCALAPPDATA ?? join(homedir(), 'AppData/Local'),
    'piper/zh_CN-huayan-medium.onnx',
  );

const args = process.argv.slice(2);
const force = args.includes('--force');
const limitAt = args.indexOf('--limit');
const limit = limitAt >= 0 ? Number.parseInt(args[limitAt + 1], 10) : 0;

const jobs = [];
for (const file of readdirSync(DATA).filter((name) => /^hsk\d-part\d\.ts$/.test(name))) {
  const source = readFileSync(join(DATA, file), 'utf8');
  const pattern =
    /id: '(h\d-\d\d-w\d\d)',\s*\n\s*hanzi: '([^']+)',[\s\S]*?example: \{\s*\n\s*hanzi: '([^']+)'/g;
  for (const match of source.matchAll(pattern)) {
    jobs.push({ kind: 'words', id: match[1], text: match[2] });
    jobs.push({ kind: 'examples', id: match[1], text: match[3] });
  }
}

// Un mp3 por carácter del curso (el nombre es su punto de código).
const characters = JSON.parse(readFileSync(join(DATA, 'decomposition.json'), 'utf8'));
for (const char of Object.keys(characters)) {
  jobs.push({ kind: 'chars', id: `u${(char.codePointAt(0) ?? 0).toString(16)}`, text: char });
}

mkdirSync(join(OUT, 'words'), { recursive: true });
mkdirSync(join(OUT, 'examples'), { recursive: true });
mkdirSync(join(OUT, 'chars'), { recursive: true });
mkdirSync(TMP, { recursive: true });

const isDone = (job) => {
  const mp3 = join(OUT, job.kind, `${job.id}.mp3`);
  return !force && existsSync(mp3) && statSync(mp3).size > 0;
};
const pending = jobs.filter((job) => !isDone(job));
const queue = (limit > 0 ? pending.slice(0, limit) : pending).map((job) => ({
  ...job,
  wav: join(TMP, `${job.kind}-${job.id}.wav`),
  mp3: join(OUT, job.kind, `${job.id}.mp3`),
}));

console.log(`total=${jobs.length} pendientes=${pending.length} enEstaPasada=${queue.length}`);
if (queue.length === 0) process.exit(0);
if (!existsSync(MODEL)) {
  console.error(`Falta el modelo de Piper: ${MODEL}`);
  process.exit(1);
}

const python = spawn(
  'uv',
  ['run', '--with', 'piper-tts', 'python', join(ROOT, 'scripts/tts-worker.py'), MODEL],
  { stdio: ['pipe', 'pipe', 'inherit'], env: { ...process.env, PYTHONIOENCODING: 'utf-8' } },
);

let index = 0;
let failed = 0;
const toMp3 = (job) =>
  new Promise((resolve) => {
    execFile(
      'ffmpeg',
      ['-v', 'error', '-y', '-i', job.wav, '-ac', '1', '-b:a', '48k', job.mp3],
      (error) => {
        if (error) {
          failed += 1;
          console.error(`FALLO ffmpeg ${job.mp3}: ${error.message.split('\n')[0]}`);
        } else {
          index += 1;
          if (index % 50 === 0) console.log(`  ${index}/${queue.length}…`);
        }
        rmSync(job.wav, { force: true });
        resolve();
      },
    );
  });

const conversions = [];
python.stdout.on('data', (chunk) => {
  for (const line of chunk.toString().split('\n')) {
    const wav = line.trim();
    if (!wav) continue;
    const job = queue.find((item) => item.wav === wav);
    if (job) conversions.push(toMp3(job));
  }
});

for (const job of queue)
  python.stdin.write(`${JSON.stringify({ text: job.text, wav: job.wav })}\n`);
python.stdin.end();

python.on('close', async (code) => {
  await Promise.all(conversions);
  console.log(`generados=${index} fallos=${failed} code=${code}`);
  if (failed > 0 || code !== 0) process.exitCode = 1;
});

python.on('error', (error) => {
  console.error(`No se pudo lanzar Piper: ${error.message}`);
  process.exitCode = 1;
});
