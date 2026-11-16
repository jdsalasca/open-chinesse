import { Icon } from '../components/ui/Icon';
import type { Unit } from '../data/curriculum';
import { navigate } from '../lib/router';

type Props = {
  units: Unit[];
  cards: Record<string, unknown>;
  stars: Record<string, number>;
  done: string[];
};

/** Camino serpenteante de unidades, al estilo de una ruta de aprendizaje. */
export function HomePath({ units, cards, stars, done }: Props) {
  return (
    <ol className="roadmap">
      {units.map((unit) => {
        const learned = unit.words.filter((word) => cards[word.id]).length;
        const complete = done.includes(unit.id);
        const started = learned > 0;
        const earned = stars[unit.id] ?? 0;
        const state = complete ? 'is-complete' : started ? 'is-current' : '';
        return (
          <li key={unit.id} className={`roadmap__step ${state}`}>
            <button
              type="button"
              className="roadmap__node"
              onClick={() => navigate(`/lesson/${unit.id}`)}
              aria-label={`${unit.title}: ${learned} de ${unit.words.length} palabras`}
            >
              {complete ? <Icon name="check" size={22} /> : unit.index}
            </button>
            <div className="roadmap__card">
              <div className="roadmap__head">
                <h3 className="roadmap__title">{unit.title}</h3>
                {earned > 0 && (
                  <span className="roadmap__stars" aria-label={`${earned} de 3 estrellas`}>
                    {[1, 2, 3].map((star) => (
                      <Icon key={star} name="star" size={12} filled={star <= earned} />
                    ))}
                  </span>
                )}
              </div>
              <p className="roadmap__subtitle">{unit.subtitle}</p>
              <div className="roadmap__bar" aria-hidden="true">
                <span style={{ width: `${(learned / unit.words.length) * 100}%` }} />
              </div>
              <p className="roadmap__meta">
                {learned} de {unit.words.length}
                {complete ? ' · completada' : ''}
              </p>
              <button
                type="button"
                className="button button--ghost button--sm roadmap__cta"
                onClick={() => navigate(`/lesson/${unit.id}`)}
              >
                {complete ? 'Repetir' : started ? 'Continuar' : 'Estudiar'}
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
