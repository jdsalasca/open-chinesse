import { Icon } from '../components/ui/Icon';
import type { Unit } from '../data/curriculum';

type Props = {
  units: Unit[];
  cards: Record<string, unknown>;
  stars: Record<string, number>;
  done: string[];
};

function actionLabel(complete: boolean, started: boolean): string {
  if (complete) return 'Repetir';
  return started ? 'Continuar' : 'Estudiar';
}

/** Rejilla de unidades: cada tarjeta entera abre la lección. */
export function HomePath({ units, cards, stars, done }: Props) {
  return (
    <ol className="roadmap">
      {units.map((unit) => {
        const learned = unit.words.filter((word) => cards[word.id]).length;
        const complete = done.includes(unit.id);
        const started = learned > 0;
        const earned = stars[unit.id] ?? 0;
        const state = complete ? ' is-complete' : started ? ' is-current' : '';
        const label = complete ? 'Completada' : started ? 'En curso' : 'Sin empezar';
        return (
          <li key={unit.id} className={`roadmap__item${state}`}>
            <a
              className="roadmap__card"
              href={`#/lesson/${unit.id}`}
              aria-label={`${unit.title}: ${learned} de ${unit.words.length} palabras, ${label}`}
            >
              <span className="roadmap__top">
                <span className="roadmap__index" aria-hidden="true">
                  {complete ? <Icon name="check" size={18} /> : unit.index}
                </span>
                <span className="roadmap__stars" aria-label={`${earned} de 3 estrellas`}>
                  {[1, 2, 3].map((star) => (
                    <Icon key={star} name="star" size={13} filled={star <= earned} />
                  ))}
                </span>
              </span>
              <span className="roadmap__body">
                <span className="roadmap__title">{unit.title}</span>
                <span className="roadmap__subtitle">{unit.subtitle}</span>
              </span>
              <span className="roadmap__bar" aria-hidden="true">
                <span style={{ width: `${(learned / unit.words.length) * 100}%` }} />
              </span>
              <span className="roadmap__meta">
                <span>
                  {learned} de {unit.words.length} palabras · {label}
                </span>
                <span className="roadmap__go" aria-hidden="true">
                  {actionLabel(complete, started)} <Icon name="arrow" size={14} />
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
