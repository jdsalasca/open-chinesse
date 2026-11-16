import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
};

/** Cabecera común de las pantallas de biblioteca. */
export function PageHeader({ eyebrow, title, lead, aside }: Props) {
  return (
    <header className="page-head">
      <div className="page-head__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="page-head__lead">{lead}</p>}
      </div>
      {aside && <div className="page-head__aside">{aside}</div>}
    </header>
  );
}
