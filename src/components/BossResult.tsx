import { LEVEL_LABELS, type Level } from '../data/curriculum';
import { bossPassScore } from '../lib/boss';
import { navigate } from '../lib/router';
import { Certificate } from './Certificate';
import { Icon } from './ui/Icon';

function BossActions({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="scenario-done__actions">
      <button type="button" className="button button--primary" onClick={onRetry}>
        Repetir jefe
      </button>
      <button type="button" className="button button--ghost" onClick={() => navigate('/jefes')}>
        Volver a jefes
      </button>
    </div>
  );
}

function PassedResult({
  level,
  score,
  total,
  at,
  onRetry,
}: {
  level: Level;
  score: number;
  total: number;
  at: number;
  onRetry: () => void;
}) {
  return (
    <div className="boss-result">
      <Certificate level={level} score={score} total={total} at={at} />
      <BossActions onRetry={onRetry} />
    </div>
  );
}

function FailedResult({
  level,
  score,
  total,
  onRetry,
}: {
  level: Level;
  score: number;
  total: number;
  onRetry: () => void;
}) {
  const needed = bossPassScore(total);
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="trophy" size={28} />
      </span>
      <p className="eyebrow">Jefe HSK {level}</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="scenario-done__lead">
        Necesitas {needed} aciertos para el certificado de {LEVEL_LABELS[level]}. Te faltaron{' '}
        {needed - score}. El examen no bloquea nada: puedes repetirlo cuando quieras.
      </p>
      <BossActions onRetry={onRetry} />
    </section>
  );
}

export function BossResult({
  level,
  score,
  total,
  at,
  passed,
  onRetry,
}: {
  level: Level;
  score: number;
  total: number;
  at: number;
  passed: boolean;
  onRetry: () => void;
}) {
  return passed ? (
    <PassedResult level={level} score={score} total={total} at={at} onRetry={onRetry} />
  ) : (
    <FailedResult level={level} score={score} total={total} onRetry={onRetry} />
  );
}
