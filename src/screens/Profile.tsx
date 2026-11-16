import type { ReactNode } from 'react';
import { ACHIEVEMENTS, levelFromXp, levelProgress } from '../gamification/xp';
import { Icon } from '../components/ui/Icon';
import { TOTAL_WORDS } from '../data/curriculum';
import { navigate } from '../lib/router';
import {
  accuracy,
  formatAccuracy,
  masteredCount,
  reviewsToday,
  streakDays,
} from '../store/metrics';
import type { ReviewRecord } from '../store/metrics';
import type { StoredCard } from '../srs/scheduler';
import { useLearner } from '../store/useLearner';
import { useSession } from '../store/session';

type SessionUser = NonNullable<ReturnType<typeof useSession.getState>['user']>;

function ProfileGuest() {
  return (
    <section className="empty">
      <p className="eyebrow">Perfil</p>
      <h1>Entra para ver tu perfil</h1>
      <p>Con una cuenta tu progreso se guarda y se sincroniza entre dispositivos.</p>
      <div className="empty__actions">
        <button type="button" className="button button--primary" onClick={() => navigate('/login')}>
          Entrar o crear cuenta
        </button>
      </div>
    </section>
  );
}

function ProfileHead({
  user,
  xp,
  onSignOut,
}: {
  user: SessionUser;
  xp: number;
  onSignOut: () => void;
}) {
  const name = user.displayName ?? user.email ?? 'Tu cuenta';
  const level = levelFromXp(xp);
  const progress = levelProgress(xp);
  return (
    <>
      <header className="profile__head">
        {user.pictureUrl ? (
          <img className="profile__avatar" src={user.pictureUrl} alt="" width={72} height={72} />
        ) : (
          <span className="profile__avatar profile__avatar--empty" aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div>
          <h1 className="profile__name">{name}</h1>
          <p className="profile__email">{user.email}</p>
          <p className="profile__level">
            Nivel {level} · {xp} XP
          </p>
        </div>
        <button type="button" className="button button--ghost" onClick={onSignOut}>
          Salir
        </button>
      </header>
      <div className="mini-bar" aria-hidden="true">
        <span style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
      </div>
    </>
  );
}

function Stat({ label, value, detail }: { label: string; value: ReactNode; detail: string }) {
  return (
    <div className="stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
      <small>{detail}</small>
    </div>
  );
}

function ProfileStats({
  cards,
  log,
  stars,
  now,
}: {
  cards: Record<string, StoredCard>;
  log: ReviewRecord[];
  stars: Record<string, number>;
  now: number;
}) {
  const studied = new Set(log.map((entry) => entry.wordId)).size;
  return (
    <dl className="stat-grid">
      <Stat label="Racha" value={streakDays(log, now)} detail="días seguidos" />
      <Stat label="Estudiadas" value={studied} detail={`de ${TOTAL_WORDS} palabras`} />
      <Stat label="Dominadas" value={masteredCount(cards)} detail="intervalo ≥ 21 días" />
      <Stat
        label="Precisión"
        value={formatAccuracy(accuracy(log, now, 30))}
        detail="últimos 30 días"
      />
      <Stat
        label="Repasos hoy"
        value={reviewsToday(log, now)}
        detail={`de ${log.length} totales`}
      />
      <Stat label="Unidades" value={Object.keys(stars).length} detail="con estrellas" />
    </dl>
  );
}

function Achievements({ earned }: { earned: string[] }) {
  return (
    <section className="card">
      <h2>Logros</h2>
      <ul className="achievement-grid">
        {ACHIEVEMENTS.map((achievement) => {
          const has = earned.includes(achievement.id);
          return (
            <li
              key={achievement.id}
              className={`achievement-tile${has ? ' is-earned' : ' is-locked'}`}
            >
              <span className="achievement__icon" aria-hidden="true">
                <Icon name={achievement.icon} size={16} />
              </span>
              <span className="achievement__text">
                <strong>{achievement.title}</strong>
                <small>{achievement.description}</small>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SyncCard() {
  return (
    <section className="card card--mint">
      <h2>Tu progreso se sincroniza</h2>
      <p>
        Se guarda en este navegador y en tu cuenta. Puedes seguir en otro dispositivo con el mismo
        correo.
      </p>
      <button type="button" className="button button--ghost" onClick={() => navigate('/stats')}>
        Ver estadísticas completas
      </button>
    </section>
  );
}

export function Profile() {
  const user = useSession((s) => s.user);
  const signOutUser = useSession((s) => s.signOutUser);
  const cards = useLearner((s) => s.cards);
  const log = useLearner((s) => s.log);
  const xp = useLearner((s) => s.xp);
  const stars = useLearner((s) => s.stars);
  const achievements = useLearner((s) => s.achievements);

  if (!user) return <ProfileGuest />;

  return (
    <div className="profile">
      <ProfileHead user={user} xp={xp} onSignOut={() => void signOutUser()} />
      <ProfileStats cards={cards} log={log} stars={stars} now={Date.now()} />
      <Achievements earned={achievements} />
      <SyncCard />
    </div>
  );
}
