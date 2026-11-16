import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Icon, type IconName } from '../components/ui/Icon';
import { SCENARIOS } from '../data/scenarios';
import { buildQueue } from '../srs/queue';
import { useLearner } from '../store/useLearner';

type Action = {
  href: string;
  tone: 'mint' | 'violet' | 'amber' | 'sky' | 'teal';
  icon: IconName;
  meta: string;
  title: string;
  text: string;
  cta: string;
};

const BASE_ACTIONS: Action[] = [
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
    href: '#/dictado',
    tone: 'violet',
    icon: 'name',
    meta: 'Diez palabras',
    title: 'Dictado',
    text: 'Escucha una palabra y escríbela en hanzi o pinyin. El oído también se entrena escribiendo.',
    cta: 'Escuchar y escribir',
  },
  {
    href: '#/contexto',
    tone: 'teal',
    icon: 'book',
    meta: 'Seis frases',
    title: 'En contexto',
    text: 'Completa frases reales con la palabra que falta. Vale pinyin con tonos o el carácter.',
    cta: 'Practicar',
  },
  {
    href: '#/dormir',
    tone: 'violet',
    icon: 'sparkles',
    meta: 'Tres cuentos',
    title: 'Cuentos para dormir',
    text: 'Historias cortas con voz lenta, traducción y una explicación de cada línea. Sin prisa.',
    cta: 'Escuchar',
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
    meta: `${SCENARIOS.length} escenas`,
    title: 'Situaciones',
    text: 'Pide, compra y pregunta cómo llegar en diálogos con una decisión en cada paso.',
    cta: 'Entrar',
  },
];

function actions(pending: number, scenesDone: number): Action[] {
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
    ...BASE_ACTIONS.map((action) =>
      action.href === '#/situaciones'
        ? { ...action, meta: `${scenesDone} de ${SCENARIOS.length} hechas` }
        : action,
    ),
  ];
}

export function Practice() {
  const cards = useLearner((s) => s.cards);
  const scenes = useLearner((s) => s.scenarios);
  const [now] = useState(Date.now);
  const pending = buildQueue(cards, now).total;

  return (
    <section className="practice">
      <PageHeader
        eyebrow="Practicar"
        title="Entrena lo que ya viste"
        lead="Formas distintas de mover el conocimiento de la memoria a corto plazo a la de largo plazo."
      />
      <div className="practice__grid">
        {actions(pending, scenes.length).map((action) => (
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
