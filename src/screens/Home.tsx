import { UNITS } from '../data/curriculum';
import { navigate } from '../lib/router';
import { buildQueue } from '../srs/queue';
import { reviewsToday, streakDays } from '../store/metrics';
import { masteredCount } from '../store/metrics';
import { completedUnits, useLearner } from '../store/useLearner';

export function Home() {
  const cards = useLearner((s) => s.cards);
  const log = useLearner((s) => s.log);
  const now = Date.now();

  const queue = buildQueue(cards, now);
  const streak = streakDays(log, now);
  const done = completedUnits(cards);
  const nextUnit = UNITS.find((u) => !done.includes(u.id));
  const started = Object.keys(cards).length > 0;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__text">
          <p className="eyebrow">Chino mandarín · HSK 1</p>
          <h1 className="hero__title">
            <span lang="zh-Hans">你好</span>
            <span className="hero__title-note">hola</span>
          </h1>
          <p className="hero__lead">
            {started
              ? 'Repasa lo que ya viste o sigue con la siguiente unidad. Cinco minutos cuentan.'
              : 'Empieza por los saludos. Cada palabra viene con audio, pinyin y una frase real.'}
          </p>
          <div className="hero__actions">
            {queue.total > 0 && (
              <button type="button" className="button button--primary" onClick={() => navigate('/review')}>
                Repasar {queue.total} {queue.total === 1 ? 'palabra' : 'palabras'}
              </button>
            )}
            {nextUnit && (
              <button
                type="button"
                className={`button ${queue.total > 0 ? 'button--ghost' : 'button--primary'}`}
                onClick={() => navigate(`/lesson/${nextUnit.id}`)}
              >
                {started ? `Siguiente: ${nextUnit.title}` : 'Empezar la primera lección'}
              </button>
            )}
            {!nextUnit && queue.total === 0 && (
              <p className="hero__calm">
                Terminaste las seis unidades y no hay repasos pendientes. Vuelve mañana.
              </p>
            )}
          </div>
        </div>
        <dl className="hero__stats">
          <div>
            <dt>Racha</dt>
            <dd>
              {streak}
              <small> {streak === 1 ? 'día' : 'días'}</small>
            </dd>
          </div>
          <div>
            <dt>Pendientes</dt>
            <dd>{queue.total}</dd>
          </div>
          <div>
            <dt>Dominadas</dt>
            <dd>{masteredCount(cards)}</dd>
          </div>
          <div>
            <dt>Repasos hoy</dt>
            <dd>{reviewsToday(log, now)}</dd>
          </div>
        </dl>
      </section>

      <section className="units" aria-labelledby="units-title">
        <div className="section-head">
          <h2 id="units-title">Tu ruta</h2>
          <p>Seis unidades, doce palabras cada una. Sin orden obligatorio.</p>
        </div>
        <ol className="unit-list">
          {UNITS.map((unit) => {
            const learned = unit.words.filter((w) => cards[w.id]).length;
            const complete = learned === unit.words.length;
            return (
              <li key={unit.id} className={`unit${complete ? ' is-complete' : ''}`}>
                <span className="unit__index" aria-hidden="true">
                  {String(unit.index).padStart(2, '0')}
                </span>
                <div className="unit__body">
                  <h3 className="unit__title">{unit.title}</h3>
                  <p className="unit__subtitle">{unit.subtitle}</p>
                  <div className="unit__progress" aria-hidden="true">
                    <span style={{ width: `${(learned / unit.words.length) * 100}%` }} />
                  </div>
                  <p className="unit__meta">
                    {learned} de {unit.words.length} palabras
                    {complete ? ' · completada' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="button button--ghost unit__cta"
                  onClick={() => navigate(`/lesson/${unit.id}`)}
                >
                  {complete ? 'Repetir' : learned > 0 ? 'Continuar' : 'Estudiar'}
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="method" aria-labelledby="method-title">
        <h2 id="method-title">Cómo está diseñado</h2>
        <ul className="method__list">
          <li>
            <strong>Recuperación activa.</strong> Primero intentas recordar; la respuesta
            aparece después.
          </li>
          <li>
            <strong>Repaso espaciado FSRS.</strong> Cada palabra vuelve justo antes de que
            la olvides.
          </li>
          <li>
            <strong>Audio en todo.</strong> El tono es parte de la palabra, no un adorno.
          </li>
          <li>
            <strong>Sin presión.</strong> La racha informa, no castiga. No hay ligas ni
            notificaciones.
          </li>
        </ul>
      </section>
    </div>
  );
}
