import type { ReactNode } from 'react';

export type CardTone = 'surface' | 'mint' | 'cream' | 'lilac' | 'pink' | 'sky';

type Props = {
  tone?: CardTone;
  flat?: boolean;
  className?: string;
  children: ReactNode;
};

/** Superficie base de la app; el tono solo cambia el fondo pastel. */
export function Card({ tone = 'surface', flat = false, className = '', children }: Props) {
  const classes = [
    'card',
    tone !== 'surface' ? `card--${tone}` : '',
    flat ? 'card--flat' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <div className={classes}>{children}</div>;
}
