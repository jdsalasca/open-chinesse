import { navigate } from '../lib/router';
import { useSession } from '../store/session';

export function AccountLink() {
  const status = useSession((s) => s.status);
  const user = useSession((s) => s.user);

  if (status === 'authenticated' && user) {
    const name = user.displayName ?? user.email ?? 'Tu cuenta';
    return (
      <a className="account" href="#/perfil" aria-label="Ver perfil">
        {user.pictureUrl ? (
          <img className="account__avatar" src={user.pictureUrl} alt="" width={28} height={28} />
        ) : (
          <span className="account__avatar account__avatar--empty" aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="account__name">{name}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      className="button button--ghost account__login"
      onClick={() => navigate('/login')}
    >
      Entrar
    </button>
  );
}
