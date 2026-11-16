import type { CSSProperties } from 'react';

const COLORS = ['#00b86b', '#00a99d', '#ff5c7a', '#6b5bff', '#e8a008', '#2e9bff'];

/** Lluvia de confeti puramente decorativa; se desactiva con `reduced-motion`. */
export function Confetti({ pieces = 26 }: { pieces?: number }) {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: pieces }, (_, index) => (
        <span
          key={index}
          className="confetti__piece"
          style={
            {
              '--x': `${(index * 37) % 100}%`,
              '--delay': `${(index % 9) * 55}ms`,
              '--drift': `${((index % 5) - 2) * 34}px`,
              '--rot': `${(index * 53) % 360}deg`,
              '--color': COLORS[index % COLORS.length],
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
