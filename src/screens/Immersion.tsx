import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { RESOURCES, type Resource } from '../data/resources';

const KIND_LABEL: Record<Resource['kind'], string> = {
  canal: 'Canal',
  video: 'Vídeo',
  playlist: 'Lista',
};

const TONES = ['mint', 'sky', 'lilac'] as const;

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  return (
    <Card tone={TONES[index % TONES.length]} className="resource">
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

export function Immersion() {
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const list = level === 0 ? RESOURCES : RESOURCES.filter((item) => item.level === level);

  return (
    <section className="immersion">
      <header className="immersion__head">
        <p className="eyebrow">Inmersión</p>
        <h1>Chino real, fuera de la app</h1>
        <p className="immersion__lead">
          Vídeos y canales gratuitos para oír chino de verdad. Se abren en YouTube: aquí no se
          guarda ni vídeo ni imagen, así el servidor sigue ligero.
        </p>
      </header>

      <div className="level-switch" role="tablist" aria-label="Filtrar por nivel">
        {([0, 1, 2, 3] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={level === item}
            className={`level-switch__tab${level === item ? ' is-active' : ''}`}
            onClick={() => setLevel(item)}
          >
            <span className="level-switch__name">{item === 0 ? 'Todos' : `HSK ${item}`}</span>
          </button>
        ))}
      </div>

      <div className="resource-grid">
        {list.map((resource, index) => (
          <ResourceCard key={resource.id} resource={resource} index={index} />
        ))}
      </div>

      <p className="immersion__note">
        ¿Un enlace ya no funciona? Se quita en el siguiente despliegue. Nada se descarga ni se
        redistribuye.
      </p>
    </section>
  );
}
