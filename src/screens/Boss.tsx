import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { PageHeader } from '../components/PageHeader';
import { LEVELS, LEVEL_LABELS, LEVEL_TITLES, unitsForLevel, type Level } from '../data/curriculum';
import { isLevelUnlocked } from '../lib/boss';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';
import { Mixed } from './Mixed';

function BossActions({
  level,
  cta,
  locked,
  showCertificate,
}: {
  level: Level;
  cta: string;
  locked: boolean;
  showCertificate: boolean;
}) {
  return (
    <div className="boss-card__actions">
      <button
        type="button"
        className="button button--primary"
        onClick={() => navigate(`/jefes/${level}`)}
        disabled={locked}
      >
        {cta}
      </button>
      {showCertificate && (
        <button
          type="button"
          className="button button--ghost"
          onClick={() => navigate(`/certificado/${level}`)}
        >
          Ver certificado
        </button>
      )}
    </div>
  );
}

function BossCard({ level }: { level: Level }) {
  const stars = useLearner((s) => s.stars);
  const certificate = useLearner((s) => s.certificates[String(level)]);
  const unlocked = isLevelUnlocked(stars, level);
  const units = unitsForLevel(level);
  const cta = certificate
    ? 'Repetir jefe'
    : unlocked
      ? 'Empezar el examen'
      : `Completa ${units.length} unidades`;
  return (
    <div className={`boss-card${unlocked ? '' : ' is-locked'}`}>
      <span className="boss-card__meta">
        HSK {level} · {units.length} unidades
      </span>
      <span className="boss-card__title">
        {LEVEL_LABELS[level]} · {LEVEL_TITLES[level]}
      </span>
      <span className="boss-card__status">
        {certificate
          ? `Aprobado · ${certificate.score}/${certificate.total}`
          : unlocked
            ? 'Disponible'
            : 'Bloqueado'}
      </span>
      <BossActions
        level={level}
        cta={cta}
        locked={!unlocked}
        showCertificate={Boolean(certificate)}
      />
    </div>
  );
}

function BossList() {
  const certificates = useLearner((s) => s.certificates);
  const passed = LEVELS.filter((level) => certificates[String(level)]).length;
  return (
    <section className="boss">
      <PageHeader
        eyebrow="Jefes de nivel"
        title="Un examen al cerrar cada nivel"
        lead="Quince preguntas mezcladas, sin pistas. Necesitas el 80% para el certificado de práctica. Se puede repetir sin perder nada."
        aside={
          <Badge
            tone={passed === LEVELS.length ? 'mint' : 'amber'}
            icon={<Icon name="trophy" size={14} />}
          >
            {passed} de {LEVELS.length}
          </Badge>
        }
      />
      <div className="boss-grid">
        {LEVELS.map((level) => (
          <BossCard key={level} level={level} />
        ))}
      </div>
      <p className="boss__note">
        El jefe se abre cuando todas las unidades del nivel tienen al menos una estrella.
      </p>
    </section>
  );
}

function Locked({ level }: { level: Level }) {
  const units = unitsForLevel(level);
  return (
    <section className="empty">
      <p className="eyebrow">Jefe HSK {level}</p>
      <h1>Todavía está bloqueado</h1>
      <p>
        Completa las {units.length} unidades de {LEVEL_LABELS[level]} para desbloquear el examen del
        nivel.
      </p>
      <div className="empty__actions">
        <button type="button" className="button button--primary" onClick={() => navigate('/')}>
          Ir a las unidades
        </button>
        <button type="button" className="button button--ghost" onClick={() => navigate('/jefes')}>
          Volver a jefes
        </button>
      </div>
    </section>
  );
}

export function Boss({ level }: { level?: Level }) {
  const stars = useLearner((s) => s.stars);
  if (!level || !LEVELS.includes(level)) return <BossList />;
  if (!isLevelUnlocked(stars, level)) return <Locked level={level} />;
  return <Mixed bossLevel={level} />;
}
