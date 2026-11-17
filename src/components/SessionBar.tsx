import { useDailySession, type SessionStep } from '../store/daily-session';
import { navigate } from '../lib/router';

const LABEL: Record<SessionStep, string> = {
  review: 'Repaso',
  lesson: 'Lección',
  close: 'Cierre',
};

/** Barra discreta con el avance de la sesión guiada. */
export function SessionBar() {
  const active = useDailySession((state) => state.active);
  const steps = useDailySession((state) => state.steps);
  const done = useDailySession((state) => state.done);
  const end = useDailySession((state) => state.end);
  if (!active) return null;

  return (
    <div className="session-bar" role="status">
      <span className="session-bar__label">Sesión de hoy</span>
      <ol className="session-bar__steps">
        {steps.map((step) => (
          <li
            key={step}
            className={`session-bar__step${done.includes(step) ? ' is-done' : ''}`}
            title={LABEL[step]}
          >
            {done.includes(step) ? '✓' : '•'} {LABEL[step]}
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="link"
        onClick={() => {
          end();
          navigate('/');
        }}
      >
        Salir
      </button>
    </div>
  );
}
