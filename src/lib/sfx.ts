const KEY = 'open-chinesse-sfx';

let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (context) {
    if (context.state === 'suspended') void context.resume();
    return context;
  }
  const Ctor = globalThis.AudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(KEY) === 'off';
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  try {
    localStorage.setItem(KEY, muted ? 'off' : 'on');
  } catch {
    /* sin almacenamiento: se queda en el valor por defecto */
  }
}

type Note = { freq: number; at: number; duration: number; type?: OscillatorType };

/** Tono corto sintetizado; sin archivos ni descargas. */
function play(notes: Note[]): void {
  if (isMuted()) return;
  const ctx = audio();
  if (!ctx) return;
  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + note.at;
    osc.type = note.type ?? 'sine';
    osc.frequency.setValueAtTime(note.freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.07, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + note.duration + 0.02);
  }
}

export function playCorrect(): void {
  play([
    { freq: 660, at: 0, duration: 0.12 },
    { freq: 880, at: 0.09, duration: 0.18 },
  ]);
}

export function playWrong(): void {
  play([
    { freq: 233, at: 0, duration: 0.16, type: 'triangle' },
    { freq: 175, at: 0.1, duration: 0.22, type: 'triangle' },
  ]);
}

export function playComplete(): void {
  play([
    { freq: 523, at: 0, duration: 0.16 },
    { freq: 659, at: 0.12, duration: 0.16 },
    { freq: 784, at: 0.24, duration: 0.18 },
    { freq: 1046, at: 0.4, duration: 0.3 },
  ]);
}
