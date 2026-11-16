import { useEffect, useRef, useState } from 'react';
import { speak } from '../lib/speech';

type Props = {
  text: string;
  label: string;
  /** MP3 ya generado; si falta o falla se usa la voz del navegador. */
  src?: string;
  compact?: boolean;
};

function SpeakerGlyph({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width={size} height={size}>
      <path
        d="M4 9.5v5h3.2L12 18.6V5.4L7.2 9.5H4Zm10.4 1.1a3.2 3.2 0 0 1 0 2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7.4a7 7 0 0 1 0 9.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Carga el MP3 y devuelve una función de reproducción con caída a la voz. */
function useClip(src: string | undefined, onStart: () => void, onStop: () => void) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const handlers = useRef({ onStart, onStop });

  useEffect(() => {
    handlers.current = { onStart, onStop };
  });

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.preload = 'none';
    const stop = () => handlers.current.onStop();
    audio.addEventListener('ended', stop);
    audio.addEventListener('pause', stop);
    audio.addEventListener('error', stop);
    ref.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener('ended', stop);
      audio.removeEventListener('pause', stop);
      audio.removeEventListener('error', stop);
      ref.current = null;
    };
  }, [src]);

  return (fallback: () => void) => {
    const audio = ref.current;
    if (!audio) return fallback();
    audio.currentTime = 0;
    audio.play().then(
      () => handlers.current.onStart(),
      () => {
        handlers.current.onStop();
        fallback();
      },
    );
  };
}

/** Botón de audio: usa el MP3 si existe y cae a la voz del sistema. */
export function AudioButton({ text, label, src, compact = false }: Props) {
  const [playing, setPlaying] = useState(false);
  const play = useClip(
    src,
    () => setPlaying(true),
    () => setPlaying(false),
  );

  const fallback = () =>
    speak(text, 0.85, {
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
    });

  return (
    <button
      type="button"
      className={`audio-button${compact ? ' audio-button--compact' : ''}${playing ? ' is-playing' : ''}`}
      onClick={() => play(fallback)}
      aria-label={`Escuchar ${label}`}
      title={`Escuchar ${label}`}
    >
      <SpeakerGlyph size={compact ? 18 : 20} />
    </button>
  );
}
