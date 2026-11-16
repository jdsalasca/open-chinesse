import { useState } from 'react';
import { navigate } from '../lib/router';
import { reasonLabel } from '../lib/miss';
import {
  accuracy,
  formatAccuracy,
  forecast,
  masteredCount,
  missBreakdown,
  reviewsToday,
  streakDays,
  type ReviewRecord,
} from '../store/metrics';
import type { StoredCard } from '../srs/scheduler';
import { useLearner } from '../store/useLearner';
import { WeeklyRecap } from '../components/WeeklyRecap';

const dayLabel = (key: string): string => {
  const [y, m, d] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('es', { weekday: 'short' }).format(new Date(y, m - 1, d));
};

function StatsHeader() {
  return (
    <header className="stats__head">
      <p className="eyebrow">Progreso</p>
      <h1>Tu memoria, en números</h1>
      <p className="stats__lead">
        Datos calculados solo con tu historial local. Nada se envía a ningún servidor.
      </p>
    </header>
  );
}

function StatGrid({
  cards,
  log,
  now,
}: {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  now: number;
}) {
  const total = Object.keys(cards).length;
  const learned = total === 0 ? '—' : `${masteredCount(cards)} / ${total}`;
  return (
    <dl className="stat-grid">
      <div className="stat">
        <dt>Racha</dt>
        <dd>{streakDays(log, now)}</dd>
        <small>días consecutivos</small>
      </div>
      <div className="stat">
        <dt>Repasos hoy</dt>
        <dd>{reviewsToday(log, now)}</dd>
        <small>de un total de {log.length}</small>
      </div>
      <div className="stat">
        <dt>Dominadas</dt>
        <dd>{learned}</dd>
        <small>con intervalo ≥ 21 días</small>
      </div>
      <div className="stat">
        <dt>Precisión</dt>
        <dd>{formatAccuracy(accuracy(log, now, 30))}</dd>
        <small>últimos 30 días</small>
      </div>
    </dl>
  );
}

function Forecast({ days, peak }: { days: ReturnType<typeof forecast>; peak: number }) {
  return (
    <section className="forecast" aria-labelledby="forecast-title">
      <h2 id="forecast-title">Próximos siete días</h2>
      <div className="forecast__chart" role="img" aria-label="Repasos programados por día">
        {days.map((day, index) => (
          <div key={day.key} className="forecast__col">
            <span className="forecast__value">{day.count}</span>
            <span
              className={`forecast__bar${index === 0 ? ' is-today' : ''}`}
              style={{ height: `${Math.max(4, (day.count / peak) * 100)}%` }}
            />
            <span className="forecast__day">{index === 0 ? 'hoy' : dayLabel(day.key)}</span>
          </div>
        ))}
      </div>
      <p className="forecast__note">
        Cada barra son las tarjetas que FSRS prevé que estén a punto de olvidarse ese día.
      </p>
    </section>
  );
}

function MissCards({ misses }: { misses: Parameters<typeof missBreakdown>[0] }) {
  const reasons = missBreakdown(misses);
  return (
    <section className="method method--stats" aria-labelledby="how-title">
      <h2 id="how-title">Por qué fallas</h2>
      {reasons.length === 0 ? (
        <p className="stats__lead">
          Todavía no has anotado ningún motivo. Cuando falles una palabra en una lección, te
          pregunto qué te confundió.
        </p>
      ) : (
        <ul className="miss-list">
          {reasons.map((item) => (
            <li key={item.reason} className="miss-list__row">
              <span>{reasonLabel(item.reason)}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      )}
      <p className="forecast__note">
        El motivo no cambia el intervalo de FSRS: sirve para avisarte en el repaso y elegir qué
        practicar.
      </p>
    </section>
  );
}

function MethodCard() {
  return (
    <section className="method method--stats" aria-labelledby="how-title-2">
      <h2 id="how-title-2">Qué hay detrás</h2>
      <ul className="method__list">
        <li>FSRS-6 con retención objetivo del 90%.</li>
        <li>Cuatro calificaciones con intervalo visible antes de elegir.</li>
        <li>Práctica de recuperación: primero el intento, después la respuesta.</li>
        <li>
          Investigación completa en <code>resources/investigation-education/</code>.
        </li>
      </ul>
    </section>
  );
}

function DangerZone() {
  const reset = useLearner((s) => s.reset);
  const [confirming, setConfirming] = useState(false);
  return (
    <section className="danger" aria-labelledby="reset-title">
      <h2 id="reset-title">Empezar de cero</h2>
      <p>Borra tarjetas, historial y racha de este navegador. No se puede deshacer.</p>
      {confirming ? (
        <div className="danger__actions">
          <button
            type="button"
            className="button button--danger"
            onClick={() => {
              reset();
              setConfirming(false);
              navigate('/');
            }}
          >
            Sí, borrar todo
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setConfirming(false)}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button type="button" className="button button--ghost" onClick={() => setConfirming(true)}>
          Borrar progreso
        </button>
      )}
    </section>
  );
}

export function Stats() {
  const cards = useLearner((s) => s.cards);
  const log = useLearner((s) => s.log);
  const misses = useLearner((s) => s.misses);
  const now = Date.now();
  const days = forecast(cards, now);
  const peak = Math.max(1, ...days.map((day) => day.count));

  return (
    <div className="stats">
      <StatsHeader />
      <WeeklyRecap now={now} />
      <StatGrid cards={cards} log={log} now={now} />
      <Forecast days={days} peak={peak} />
      <MissCards misses={misses} />
      <MethodCard />
      <DangerZone />
    </div>
  );
}
