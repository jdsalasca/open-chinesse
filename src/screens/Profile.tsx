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
import { useLearner } from '../store/useLearner';
import { useSession } from '../store/session';

export function Profile() {
  const user = useSession((s) => s.user);
  const signOutUser = useSession((s) => s.signOutUser);
  const cards = useLearner((s) => s.cards);
  const log = useLearner((s) => s.log);
  const xp = useLearner((s) => s.xp);
  const stars = useLearner((s) => s.stars);
  const achievements = useLearner((s) => s.achievements);
  const now = Date.now();
  const level = levelFromXp(xp);
  const progress = levelProgress(xp);
  const studied = new Set(log.map((entry) => entry.wordId)).size;

  if (!user) {
    return (
      <section className="empty">
        <p className="eyebrow">Perfil</p>
        <h1>Entra para ver tu perfil</h1>
        <p>Con una cuenta tu progreso se guarda y se sincroniza entre dispositivos.</p>
        <div className="empty__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/login')}
          >
            Entrar o crear cuenta
          </button>
        </div>
      </section>
    );
  }

  const name = user.displayName ?? user.email ?? 'Tu cuenta';

  return (
    <div className="profile">
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
        <button type="button" className="button button--ghost" onClick={() => void signOutUser()}>
          Salir
        </button>
      </header>

      <div className="mini-bar" aria-hidden="true">
        <span style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
      </div>

      <dl className="stat-grid">
        <div className="stat">
          <dt>Racha</dt>
          <dd>{streakDays(log, now)}</dd>
          <small>días seguidos</small>
        </div>
        <div className="stat">
          <dt>Estudiadas</dt>
          <dd>{studied}</dd>
          <small>de {TOTAL_WORDS} palabras</small>
        </div>
        <div className="stat">
          <dt>Dominadas</dt>
          <dd>{masteredCount(cards)}</dd>
          <small>intervalo ≥ 21 días</small>
        </div>
        <div className="stat">
          <dt>Precisión</dt>
          <dd>{formatAccuracy(accuracy(log, now, 30))}</dd>
          <small>últimos 30 días</small>
        </div>
        <div className="stat">
          <dt>Repasos hoy</dt>
          <dd>{reviewsToday(log, now)}</dd>
          <small>de {log.length} totales</small>
        </div>
        <div className="stat">
          <dt>Unidades</dt>
          <dd>{Object.keys(stars).length}</dd>
          <small>con estrellas</small>
        </div>
      </dl>

      <section className="card">
        <h2>Logros</h2>
        <ul className="achievement-grid">
          {ACHIEVEMENTS.map((achievement) => {
            const earned = achievements.includes(achievement.id);
            return (
              <li
                key={achievement.id}
                className={`achievement-tile${earned ? ' is-earned' : ' is-locked'}`}
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
    </div>
  );
}
