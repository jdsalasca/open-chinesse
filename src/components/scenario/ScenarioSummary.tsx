import { Icon } from '../ui/Icon';
import { navigate } from '../../lib/router';
import { scenarioResult } from '../../lib/scenario';
import type { Scenario } from '../../data/scenarios';

export function ScenarioSummary({
  scenario,
  mistakes,
  onRetry,
}: {
  scenario: Scenario;
  mistakes: number;
  onRetry: () => void;
}) {
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="check" size={28} />
      </span>
      <p className="eyebrow">Situación completada</p>
      <h1>{scenario.title}</h1>
      <p className="scenario-done__lead">
        Has practicado: {scenario.goal.toLowerCase()}. Vuelve cuando quieras: la conversación no se
        agota en una pasada.
      </p>
      <p className="scenario-done__result">{scenarioResult(mistakes)}</p>
      <div className="scenario-done__actions">
        <button type="button" className="button button--primary" onClick={onRetry}>
          Repetir la escena
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => navigate('/situaciones')}
        >
          Otras situaciones
        </button>
      </div>
    </section>
  );
}
