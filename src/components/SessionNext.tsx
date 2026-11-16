import { useEffect } from 'react';
import { SESSION_STEPS, useDailySession, type SessionStep } from '../store/daily-session';
import { navigate } from '../lib/router';

const NEXT_ROUTE: Record<SessionStep, string> = {
  review: '/review',
  lesson: '/',
  tones: '/tonos',
};

/** Marca el paso y ofrece seguir con lo que falta de la sesión. */
export function SessionNext({ from }: { from: SessionStep }) {
  const active = useDailySession((state) => state.active);
  const done = useDailySession((state) => state.done);
  const finish = useDailySession((state) => state.finish);
  const end = useDailySession((state) => state.end);

  useEffect(() => {
    if (active) finish(from);
  }, [active, from, finish]);

  if (!active) return null;
  const next = SESSION_STEPS.find((step) => step !== from && !done.includes(step));

  if (!next) {
    return (
      <button
        type="button"
        className="button button--primary"
        onClick={() => {
          end();
          navigate('/');
        }}
      >
        Sesión completada ✓
      </button>
    );
  }

  return (
    <button
      type="button"
      className="button button--primary"
      onClick={() => navigate(NEXT_ROUTE[next])}
    >
      Seguir con {next === 'review' ? 'el repaso' : next === 'lesson' ? 'la lección' : 'los tonos'}
    </button>
  );
}
