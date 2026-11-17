import { Certificate } from '../components/Certificate';
import type { Level } from '../data/curriculum';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

export function CertificateView({ level }: { level: Level }) {
  const certificate = useLearner((s) => s.certificates[String(level)]);
  if (!certificate) {
    return (
      <section className="empty">
        <p className="eyebrow">Certificado HSK {level}</p>
        <h1>Todavía no hay certificado</h1>
        <p>Aprueba el jefe del nivel para conseguirlo.</p>
        <div className="empty__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate(`/jefes/${level}`)}
          >
            Ir al jefe
          </button>
        </div>
      </section>
    );
  }
  return (
    <div className="certificate-page">
      <button type="button" className="link" onClick={() => navigate('/jefes')}>
        ← Jefes de nivel
      </button>
      <Certificate
        level={level}
        score={certificate.score}
        total={certificate.total}
        at={certificate.at}
      />
    </div>
  );
}
