import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { SCENARIOS, type Scenario } from '../data/scenarios';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';
import { ScenarioPlayer } from './ScenarioPlayer';

function ScenarioCard({ scenario, complete }: { scenario: Scenario; complete: boolean }) {
  const decisions = scenario.steps.filter((step) => step.kind === 'choice').length;
  return (
    <a
      className="scenario-card"
      href={`#/situaciones/${scenario.id}`}
      aria-label={`${scenario.title}: ${scenario.goal}${complete ? ', completada' : ''}`}
    >
      <span className="scenario-card__top">
        <span className="scenario-card__meta">
          HSK {scenario.level} · {scenario.place}
        </span>
        {complete && (
          <span className="scenario-card__done">
            <Icon name="check" size={13} /> Hecha
          </span>
        )}
      </span>
      <span className="scenario-card__title">{scenario.title}</span>
      <span className="scenario-card__goal">{scenario.goal}</span>
      <span className="scenario-card__meta">
        {scenario.minutes} min · {decisions} decisiones
      </span>
      <span className="scenario-card__cta">
        {complete ? 'Repetir' : 'Entrar'} <Icon name="arrow" size={14} />
      </span>
    </a>
  );
}

export function Scenarios() {
  const done = useLearner((state) => state.scenarios);
  return (
    <section className="scenarios">
      <PageHeader
        eyebrow="Situaciones"
        title="Habla antes de sentirte listo"
        lead="Diálogos cortos con una decisión en cada paso. Elige tu respuesta, escucha la reacción y vuelve a intentarlo sin castigo."
        aside={
          <Badge
            tone={done.length === SCENARIOS.length ? 'mint' : 'amber'}
            icon={<Icon name="check" size={14} />}
          >
            {done.length} de {SCENARIOS.length}
          </Badge>
        }
      />
      <div className="scenario-grid">
        {SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            complete={done.includes(scenario.id)}
          />
        ))}
      </div>
    </section>
  );
}

export function ScenarioView({ scenarioId }: { scenarioId: string }) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioId);
  if (!scenario) {
    return (
      <section className="empty">
        <h1>Situación no encontrada</h1>
        <div className="empty__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/situaciones')}
          >
            Ver situaciones
          </button>
        </div>
      </section>
    );
  }
  return <ScenarioPlayer key={scenario.id} scenario={scenario} />;
}
