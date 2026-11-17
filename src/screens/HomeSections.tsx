import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Icon, type IconName } from '../components/ui/Icon';
import { ProgressRing } from '../components/ui/ProgressRing';
import { MissionsCard } from '../components/MissionsCard';
import {
  LEVELS,
  LEVEL_LABELS,
  LEVEL_TITLES,
  TOTAL_WORDS,
  UNITS,
  unitsForLevel,
  wordsForLevel,
  type Level,
} from '../data/curriculum';
import { levelFromXp, levelProgress } from '../gamification/xp';
import { challengeFor } from '../lib/challenge';
import { dayKey, masteredCount } from '../store/metrics';
import type { StoredCard } from '../srs/scheduler';
import { HomePath } from './HomePath';
import type { HomeData } from './home-data';

const LAST_LEVEL = LEVELS[LEVELS.length - 1];

function SessionStep({
  href,
  icon,
  label,
  detail,
  next = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  detail: string;
  next?: boolean;
}) {
  return (
    <li className="session__item">
      <a className={`session__step${next ? ' is-next' : ''}`} href={href}>
        <span className="session__icon" aria-hidden="true">
          <Icon name={icon} size={18} />
        </span>
        <div>
          <strong>{label}</strong>
          <span>{detail}</span>
        </div>
      </a>
    </li>
  );
}

function SessionSteps({ due, nextUnit }: { due: number; nextUnit?: HomeData['nextUnit'] }) {
  return (
    <ol className="session__steps">
      <SessionStep
        href="#/review"
        icon="target"
        label="Repaso"
        detail={due > 0 ? `${due} palabras pendientes` : 'al día'}
        next={due > 0}
      />
      <SessionStep
        href={nextUnit ? `#/lesson/${nextUnit.id}` : '#/'}
        icon="book"
        label="Lección"
        detail={nextUnit ? nextUnit.title : 'nivel completo'}
        next={due === 0 && Boolean(nextUnit)}
      />
      <SessionStep
        href="#/cierre"
        icon="check"
        label="Cierre"
        detail="carácter, frase y tu frase"
        next={due === 0 && !nextUnit}
      />
    </ol>
  );
}

export function ChallengeCard({ now }: { now: number }) {
  const challenge = challengeFor(dayKey(now));
  return (
    <a className="challenge" href={challenge.href}>
      <span className="challenge__icon" aria-hidden="true">
        <Icon name={challenge.icon} size={18} />
      </span>
      <span className="challenge__copy">
        <span className="challenge__eyebrow">Reto de hoy</span>
        <strong>{challenge.title}</strong>
        <span>{challenge.detail}</span>
      </span>
      <Icon name="arrow" size={16} />
    </a>
  );
}

export function SessionSection({ home, onStart }: { home: HomeData; onStart: () => void }) {
  return (
    <section className="session" aria-labelledby="session-title">
      <div className="session__head">
        <div>
          <p className="eyebrow">Tu sesión de hoy</p>
          <h2 id="session-title" className="session__title">
            Recupera, aprende, produce
          </h2>
        </div>
        <span className="session__goal">
          {home.todayXp} <span>/ {home.dailyGoal} XP</span>
        </span>
      </div>
      <SessionSteps due={home.queue.total} nextUnit={home.nextUnit} />
      <button type="button" className="button button--primary" onClick={onStart}>
        Empezar la sesión de hoy
      </button>
    </section>
  );
}

function LevelMeter({ xp }: { xp: number }) {
  const level = levelFromXp(xp);
  const progress = levelProgress(xp);
  return (
    <div className="progress-card__level">
      <p className="progress-card__level-name">Nivel {level}</p>
      <div className="mini-bar" aria-hidden="true">
        <span style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
      </div>
      <p className="progress-card__meta">
        {progress.current} / {progress.needed} XP para el nivel {level + 1}
      </p>
      <p className="progress-card__total">{xp} XP en total</p>
    </div>
  );
}

function ProgressStats({ cards }: { cards: Record<string, StoredCard> }) {
  return (
    <dl className="progress-card__stats">
      <div>
        <dt>Dominadas</dt>
        <dd>{masteredCount(cards)}</dd>
      </div>
      <div>
        <dt>En repaso</dt>
        <dd>{Object.keys(cards).length}</dd>
      </div>
    </dl>
  );
}

function ProgressCard({ home }: { home: HomeData }) {
  const goalMet = home.todayXp >= home.dailyGoal;
  return (
    <Card className="progress-card">
      <div className="progress-card__head">
        <div>
          <p className="eyebrow">Meta de hoy</p>
          <h2 className="progress-card__title">
            {home.todayXp} de {home.dailyGoal} XP
          </h2>
        </div>
        <Badge tone={goalMet ? 'mint' : 'amber'} icon={<Icon name="flame" size={14} />}>
          {goalMet ? 'Meta cumplida' : `${home.streak} ${home.streak === 1 ? 'día' : 'días'}`}
        </Badge>
      </div>
      <div className="progress-card__body">
        <ProgressRing
          value={home.todayXp}
          max={Math.max(home.dailyGoal, home.todayXp)}
          label="XP de hoy"
          caption="XP hoy"
        />
        <LevelMeter xp={home.xp} />
      </div>
      <ProgressStats cards={home.cards} />
    </Card>
  );
}

export function ProgressSection({ home }: { home: HomeData }) {
  return (
    <section className="panel-grid" aria-label="Tu progreso">
      <ProgressCard home={home} />
      <MissionsCard now={home.now} />
    </section>
  );
}

function learnedIn(level: Level, reviewed: Set<string>): number {
  return unitsForLevel(level)
    .flatMap((unit) => unit.words)
    .filter((word) => reviewed.has(word.id)).length;
}

function LevelSwitch({ home }: { home: HomeData }) {
  return (
    <div className="level-switch" role="tablist" aria-label="Nivel">
      {LEVELS.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={home.level === item}
          className={`level-switch__tab${home.level === item ? ' is-active' : ''}`}
          onClick={() => home.setLevel(item)}
        >
          <span className="level-switch__name">{LEVEL_LABELS[item]}</span>
          <span className="level-switch__meta">
            {LEVEL_TITLES[item]} · {learnedIn(item, home.reviewed)}/{wordsForLevel(item)}
          </span>
        </button>
      ))}
    </div>
  );
}

export function RouteSection({ home }: { home: HomeData }) {
  return (
    <section className="units" aria-labelledby="units-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">Curso</p>
          <h2 id="units-title">Tu ruta</h2>
          <p>
            {TOTAL_WORDS} palabras en {UNITS.length} unidades: de {LEVEL_LABELS[LEVELS[0]]} a{' '}
            {LEVEL_LABELS[LAST_LEVEL]}. Sin orden obligatorio.
          </p>
        </div>
        <LevelSwitch home={home} />
      </div>
      <HomePath units={home.levelUnits} cards={home.cards} stars={home.stars} done={home.done} />
    </section>
  );
}
