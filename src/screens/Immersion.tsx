import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { RESOURCES, type Resource } from '../data/resources';

const KIND_LABEL: Record<Resource['kind'], string> = {
  canal: 'Canal',
  video: 'Vídeo',
  playlist: 'Lista',
};

const TONE: Record<Resource['level'], 'mint' | 'sky' | 'lilac'> = {
  1: 'mint',
  2: 'sky',
  3: 'lilac',
};

type Filter = 0 | 1 | 2 | 3;

function countOf(level: Filter): number {
  return level === 0 ? RESOURCES.length : RESOURCES.filter((item) => item.level === level).length;
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card tone={TONE[resource.level]} className="resource">
      <p className="resource__meta">
        <span className="resource__kind">{KIND_LABEL[resource.kind]}</span>
        <span>HSK {resource.level}</span>
        <span>~{resource.minutes} min</span>
      </p>
      <h3 className="resource__title">{resource.title}</h3>
      <p className="resource__channel">{resource.channel}</p>
      <p className="resource__why">{resource.why}</p>
      <a
        className="resource__link"
        href={resource.url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Abrir en YouTube: ${resource.title}`}
      >
        Abrir en YouTube ↗
      </a>
    </Card>
  );
}

function LevelFilter({ level, onChange }: { level: Filter; onChange: (level: Filter) => void }) {
  return (
    <div className="level-switch" role="tablist" aria-label="Filtrar por nivel">
      {([0, 1, 2, 3] as const).map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={level === item}
          className={`level-switch__tab${level === item ? ' is-active' : ''}`}
          onClick={() => onChange(item)}
        >
          <span className="level-switch__name">{item === 0 ? 'Todos' : `HSK ${item}`}</span>
          <span className="level-switch__meta">{countOf(item)} recursos</span>
        </button>
      ))}
    </div>
  );
}

export function Immersion() {
  const [level, setLevel] = useState<Filter>(0);
  const list = level === 0 ? RESOURCES : RESOURCES.filter((item) => item.level === level);

  return (
    <section className="immersion">
      <PageHeader
        eyebrow="Inmersión"
        title="Chino real, fuera de la app"
        lead="Vídeos y canales gratuitos para oír chino de verdad. Se abren en YouTube: aquí no se guarda ni vídeo ni imagen, así el servidor sigue ligero."
      />

      <LevelFilter level={level} onChange={setLevel} />

      {list.length === 0 ? (
        <p className="immersion__note">Todavía no hay recursos de este nivel.</p>
      ) : (
        <div className="resource-grid">
          {list.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <p className="immersion__note">
        ¿Un enlace ya no funciona? Se quita en el siguiente despliegue. Nada se descarga ni se
        redistribuye.
      </p>
    </section>
  );
}
