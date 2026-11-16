import { useEffect, useState } from 'react';
import { hasChineseVoice, onVoicesReady, speak } from '../lib/speech';

type Props = {
  text: string;
  label: string;
  compact?: boolean;
};

export function AudioButton({ text, label, compact = false }: Props) {
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const check = () => setAvailable(hasChineseVoice());
    check();
    return onVoicesReady(check);
  }, []);

  const play = () => {
    speak(text);
    setPlaying(true);
    window.setTimeout(() => setPlaying(false), 600);
  };

  return (
    <button
      type="button"
      className={`audio-button${compact ? ' audio-button--compact' : ''}${playing ? ' is-playing' : ''}`}
      onClick={play}
      aria-label={`Escuchar ${label}`}
      title={available ? `Escuchar ${label}` : 'Sin voz china instalada: se usa la voz por defecto'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" width={compact ? 18 : 20} height={compact ? 18 : 20}>
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
    </button>
  );
}
