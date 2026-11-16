import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/ui/Icon';
import { buildQueue } from '../srs/queue';
import { useLearner } from '../store/useLearner';

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
        <a className="practice__card practice__card--mint" href="#/review">
          <span className="practice__icon" aria-hidden="true">
            <Icon name="target" size={20} />
          </span>
          <span className="practice__meta">{pending > 0 ? `${pending} pendientes` : 'Al día'}</span>
          <h2 className="practice__title">Repaso espaciado</h2>
          <p className="practice__text">Las tarjetas que tocan hoy, con notas de 1 a 4.</p>
          <span className="practice__cta">
            Empezar <Icon name="arrow" size={14} />
          </span>
        </a>
        <a className="practice__card practice__card--violet" href="#/tonos">
          <span className="practice__icon" aria-hidden="true">
            <Icon name="speaker" size={20} />
          </span>
          <span className="practice__meta">Diez por tanda</span>
          <h2 className="practice__title">Tonos</h2>
          <p className="practice__text">
            Escucha la palabra y elige el pinyin con sus tonos. La diferencia está en la marca.
          </p>
          <span className="practice__cta">
            Entrenar el oído <Icon name="arrow" size={14} />
          </span>
        </a>
        <a className="practice__card practice__card--amber" href="#/prueba">
          <span className="practice__icon" aria-hidden="true">
            <Icon name="clock" size={20} />
          </span>
          <span className="practice__meta">A siete días</span>
          <h2 className="practice__title">Prueba de retención</h2>
          <p className="practice__text">
            Hasta diez palabras sin pistas. Mide lo que recuerdas, no lo que repites.
          </p>
          <span className="practice__cta">
            Ver la prueba <Icon name="arrow" size={14} />
          </span>
        </a>
        <a className="practice__card practice__card--sky" href="#/">
          <span className="practice__icon" aria-hidden="true">
            <Icon name="book" size={20} />
          </span>
          <span className="practice__meta">En cada unidad</span>
          <h2 className="practice__title">Escucha</h2>
          <p className="practice__text">
            La práctica de cada unidad te hace reconocer la palabra solo de oído.
          </p>
          <span className="practice__cta">
            Ver unidades <Icon name="arrow" size={14} />
          </span>
        </a>
      </div>
    </section>
  );
}
