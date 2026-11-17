import { Icon } from '../components/ui/Icon';
import { Onboarding } from '../components/Onboarding';
import { TOTAL_WORDS, type Unit } from '../data/curriculum';
import { navigate } from '../lib/router';
import { useDailySession } from '../store/daily-session';
import { ChallengeCard, ProgressSection, RouteSection, SessionSection } from './HomeSections';
import { useHomeData, type HomeData } from './home-data';

function startSession(home: HomeData): void {
  useDailySession.getState().start();
  if (home.queue.total > 0) return navigate('/review');
  if (home.nextUnit) return navigate(`/lesson/${home.nextUnit.id}`);
  navigate('/tonos');
}

function HeroTitle() {
  return (
    <h1 className="hero__title">
      <span className="hero__hanzi" lang="zh-Hans">
        你好
      </span>
      <span className="hero__note">hola</span>
    </h1>
  );
}

function HeroStats({ home }: { home: HomeData }) {
  return (
    <dl className="hero__stats">
      <div>
        <dt>Racha</dt>
        <dd>
          {home.streak}
          <small> {home.streak === 1 ? 'día' : 'días'}</small>
        </dd>
      </div>
      <div>
        <dt>Pendientes</dt>
        <dd>{home.queue.total}</dd>
      </div>
      <div>
        <dt>Estudiadas</dt>
        <dd>
          {home.reviewed.size}
          <small> / {TOTAL_WORDS}</small>
        </dd>
      </div>
    </dl>
  );
}

function RepasarButton({ due, onStart }: { due: number; onStart: () => void }) {
  return (
    <button type="button" className="hero__cta" onClick={onStart}>
      Repasar {due} {due === 1 ? 'palabra' : 'palabras'}
      <Icon name="arrow" size={18} />
    </button>
  );
}

function NextUnitButton({
  unit,
  primary,
  started,
}: {
  unit: Unit;
  primary: boolean;
  started: boolean;
}) {
  return (
    <button
      type="button"
      className={`hero__ghost${primary ? ' hero__cta' : ''}`}
      onClick={() => navigate(`/lesson/${unit.id}`)}
    >
      {started ? `Siguiente: ${unit.title}` : 'Empezar la primera lección'}
    </button>
  );
}

function HeroActions({ home }: { home: HomeData }) {
  const due = home.queue.total;
  if (due === 0 && !home.nextUnit) {
    return (
      <div className="hero__actions">
        <p className="hero__calm">
          {home.allDone
            ? `Terminaste ${home.range} sin repasos pendientes. Vuelve mañana.`
            : 'Esta parte está al día. Cambia de nivel para seguir avanzando.'}
        </p>
      </div>
    );
  }
  return (
    <div className="hero__actions">
      {due > 0 && <RepasarButton due={due} onStart={() => startSession(home)} />}
      {home.nextUnit && (
        <NextUnitButton unit={home.nextUnit} primary={due === 0} started={home.started} />
      )}
    </div>
  );
}

function Hero({ home }: { home: HomeData }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <p className="hero__eyebrow">Chino mandarín · {home.range}</p>
        <HeroTitle />
        <p className="hero__lead">
          {home.started
            ? 'Repasa lo que ya viste o sigue con la siguiente unidad. Cinco minutos cuentan.'
            : `Empieza por los saludos. ${TOTAL_WORDS} palabras con audio, pinyin y una frase real.`}
        </p>
        <HeroActions home={home} />
      </div>
      <span className="hero__watermark" lang="zh-Hans" aria-hidden="true">
        学
      </span>
      <HeroStats home={home} />
    </section>
  );
}

export function Home() {
  const home = useHomeData();
  if (!home.onboarded && !home.started) return <Onboarding />;

  return (
    <div className="home">
      <Hero home={home} />
      <SessionSection home={home} />
      <ChallengeCard now={home.now} />
      <ProgressSection home={home} />
      <RouteSection home={home} />
    </div>
  );
}
