import type { ReactNode } from 'react';
import { LEVEL_TITLES, type Level } from '../data/curriculum';
import { useSession } from '../store/session';
import { Icon } from './ui/Icon';

export function Certificate({
  level,
  score,
  total,
  at,
}: {
  level: Level;
  score: number;
  total: number;
  at: number;
}): ReactNode {
  const user = useSession((state) => state.user);
  const name = user?.displayName ?? user?.email ?? 'Aprendiz';
  const date = new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(at));
  return (
    <section className="certificate" aria-label={`Certificado de HSK ${level}`}>
      <span className="certificate__seal" aria-hidden="true">
        <Icon name="trophy" size={32} />
      </span>
      <p className="eyebrow">Certificado de práctica</p>
      <h1 className="certificate__name">{name}</h1>
      <p className="certificate__text">
        ha superado el jefe de <strong>HSK {level}</strong> · {LEVEL_TITLES[level]}
      </p>
      <p className="certificate__score">
        {score} de {total} aciertos · {date}
      </p>
      <p className="certificate__note">
        Documento de práctica de Open Chinesse. No es un certificado oficial HSK.
      </p>
      <button
        type="button"
        className="button button--primary certificate__print"
        onClick={() => window.print()}
      >
        Imprimir o guardar PDF
      </button>
    </section>
  );
}
