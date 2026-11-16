import { useState } from 'react';
import { MISS_REASONS, type MissReason } from '../lib/miss';

/** Micro-pregunta opcional tras un fallo: cierra el motivo, no pide texto libre. */
export function MissPicker({ onPick }: { onPick: (reason: MissReason) => void }) {
  const [closed, setClosed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  if (closed) {
    return picked ? (
      <p className="miss__done">Anotado: {picked}. El repaso lo tendrá en cuenta.</p>
    ) : null;
  }

  const choose = (id: MissReason, label?: string) => {
    if (label) onPick(id);
    setPicked(label ?? null);
    setClosed(true);
  };

  return (
    <div className="miss">
      <p className="miss__question">¿Qué te falló? (opcional)</p>
      <div className="miss__options">
        {MISS_REASONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className="miss__option"
            onClick={() => choose(option.id, option.label)}
          >
            {option.label}
          </button>
        ))}
        <button type="button" className="miss__skip" onClick={() => choose('unknown')}>
          No lo sé
        </button>
      </div>
    </div>
  );
}
