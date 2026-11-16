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

function PathStars({ earned }: { earned: number }) {
  return (
    <span className="roadmap__stars" aria-label={`${earned} de 3 estrellas`}>
      {[1, 2, 3].map((star) => (
        <Icon key={star} name="star" size={13} filled={star <= earned} />
      ))}
    </span>
  );
}

function PathTop({ unit, complete, earned }: { unit: Unit; complete: boolean; earned: number }) {
  return (
    <span className="roadmap__top">
      <span className="roadmap__index" aria-hidden="true">
        {complete ? <Icon name="check" size={18} /> : unit.index}
      </span>
      <PathStars earned={earned} />
    </span>
  );
}

function PathFooter({
  unit,
  learned,
  label,
  action,
}: {
  unit: Unit;
  learned: number;
  label: string;
  action: string;
}) {
  return (
    <>
      <span className="roadmap__bar" aria-hidden="true">
        <span style={{ width: `${(learned / unit.words.length) * 100}%` }} />
      </span>
      <span className="roadmap__meta">
        <span>
          {learned} de {unit.words.length} palabras · {label}
        </span>
        <span className="roadmap__go" aria-hidden="true">
          {action} <Icon name="arrow" size={14} />
        </span>
      </span>
    </>
  );
}

function PathCard({
  unit,
  learned,
  complete,
  earned,
}: {
  unit: Unit;
  learned: number;
  complete: boolean;
  earned: number;
}) {
  const started = learned > 0;
  const state = complete ? ' is-complete' : started ? ' is-current' : '';
  const label = complete ? 'Completada' : started ? 'En curso' : 'Sin empezar';
  return (
    <li className={`roadmap__item${state}`}>
      <a
        className="roadmap__card"
        href={`#/lesson/${unit.id}`}
        aria-label={`${unit.title}: ${learned} de ${unit.words.length} palabras, ${label}`}
      >
        <PathTop unit={unit} complete={complete} earned={earned} />
        <span className="roadmap__body">
          <span className="roadmap__title">{unit.title}</span>
          <span className="roadmap__subtitle">{unit.subtitle}</span>
        </span>
        <PathFooter
          unit={unit}
          learned={learned}
          label={label}
          action={actionLabel(complete, started)}
        />
      </a>
    </li>
  );
}

/** Rejilla de unidades: cada tarjeta entera abre la lección. */
export function HomePath({ units, cards, stars, done }: Props) {
  return (
    <ol className="roadmap">
      {units.map((unit) => (
        <PathCard
          key={unit.id}
          unit={unit}
          learned={unit.words.filter((word) => cards[word.id]).length}
          complete={done.includes(unit.id)}
          earned={stars[unit.id] ?? 0}
        />
      ))}
    </ol>
  );
}
