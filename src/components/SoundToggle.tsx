import { useState } from 'react';
import { isMuted, playCorrect, setMuted } from '../lib/sfx';

/** Interruptor de sonido; vive en el pie para no cargar la cabecera. */
export function SoundToggle() {
  const [muted, setState] = useState(isMuted);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setState(next);
    if (!next) playCorrect();
  };

  return (
    <button
      type="button"
      className="link"
      onClick={toggle}
      aria-pressed={!muted}
      title={muted ? 'Activar los sonidos de la app' : 'Silenciar los sonidos de la app'}
    >
      {muted ? 'Sonido: apagado' : 'Sonido: encendido'}
    </button>
  );
}
