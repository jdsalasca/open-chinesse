import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Icon, type IconName } from '../components/ui/Icon';
import { buildQueue } from '../srs/queue';
import { useLearner } from '../store/useLearner';

type Action = {
  href: string;
  tone: 'mint' | 'violet' | 'amber' | 'sky';
  icon: IconName;
  meta: string;
  title: string;
  text: string;
  cta: string;
};

function actions(pending: number): Action[] {
  return [
    {
      href: '#/review',
      tone: 'mint',
      icon: 'target',
      meta: pending > 0 ? `${pending} pendientes` : 'Al día',
      title: 'Repaso espaciado',
      text: 'Las tarjetas que tocan hoy, con notas de 1 a 4.',
      cta: 'Empezar',
    },
    {
      href: '#/tonos',
      tone: 'violet',
      icon: 'speaker',
      meta: 'Diez por tanda',
      title: 'Tonos',
      text: 'Escucha la palabra y elige el pinyin con sus tonos. La diferencia está en la marca.',
      cta: 'Entrenar el oído',
    },
    {
      href: '#/prueba',
      tone: 'amber',
      icon: 'clock',
      meta: 'A siete días',
      title: 'Prueba de retención',
      text: 'Hasta diez palabras sin pistas. Mide lo que recuerdas, no lo que repites.',
      cta: 'Ver la prueba',
    },
    {
      href: '#/situaciones',
      tone: 'sky',
      icon: 'chat',
      meta: 'Cuatro escenas',
      title: 'Situaciones',
      text: 'Pide, compra y pregunta cómo llegar en diálogos con una decisión en cada paso.',
      cta: 'Entrar',
    },
  ];
}

export function Practice() {
  const cards = useLearner((s) => s.cards);
  const [now] = useState(Date.now);
  const pending = buildQueue(cards, now).total;

  return (
    <section className="practice">
      <PageHeader
        eyebrow="Practicar"
        title="Entrena lo que ya viste"
        lead="Cuatro formas de mover el conocimiento de la memoria a corto plazo a la de largo plazo."
      />
      <div className="practice__grid">
        {actions(pending).map((action) => (
          <a
            key={action.href}
            className={`practice__card practice__card--${action.tone}`}
            href={action.href}
          >
            <span className="practice__icon" aria-hidden="true">
              <Icon name={action.icon} size={20} />
            </span>
            <span className="practice__meta">{action.meta}</span>
            <h2 className="practice__title">{action.title}</h2>
            <p className="practice__text">{action.text}</p>
            <span className="practice__cta">
              {action.cta} <Icon name="arrow" size={14} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
