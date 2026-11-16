import type { ReactNode } from 'react';

type Tone = 'neutral' | 'mint' | 'amber' | 'violet' | 'pink';

type Props = {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
};

/** Etiqueta corta con color de apoyo; el texto nunca depende del color. */
export function Badge({ tone = 'neutral', icon, children }: Props) {
  const classes = ['badge', tone !== 'neutral' ? `badge--${tone}` : ''].filter(Boolean).join(' ');
  return (
    <span className={classes}>
      {icon}
      {children}
    </span>
  );
}
