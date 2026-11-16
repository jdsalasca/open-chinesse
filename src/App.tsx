import { useEffect } from 'react';
import { loginUrl, PROVIDER_LABELS } from './lib/api';
import { navigate, useRoute, type Route } from './lib/router';
import { Home } from './screens/Home';
import { Lesson } from './screens/Lesson';
import { Review } from './screens/Review';
import { Stats } from './screens/Stats';
import { useSession } from './store/session';
import './styles/main.scss';

function Account() {
  const status = useSession((s) => s.status);
  const user = useSession((s) => s.user);
  const providers = useSession((s) => s.providers);
  const signOutUser = useSession((s) => s.signOutUser);

  if (status === 'authenticated' && user) {
    const name = user.displayName ?? user.email ?? 'Tu cuenta';
    return (
      <div className="account">
        {user.pictureUrl ? (
          <img className="account__avatar" src={user.pictureUrl} alt="" width={28} height={28} />
        ) : (
          <span className="account__avatar account__avatar--empty" aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="account__name">{name}</span>
        <button type="button" className="link" onClick={() => void signOutUser()}>
          Salir
        </button>
      </div>
    );
  }

  if (providers.length === 0) return null;

  return (
    <div className="account">
      {providers.map((provider) => (
        <a
          key={provider}
          className="button button--ghost account__login"
          href={loginUrl(provider)}
        >
          Entrar con {PROVIDER_LABELS[provider] ?? provider}
        </a>
      ))}
    </div>
  );
}

function Header({ route }: { route: Route }) {
  const status = useSession((s) => s.status);
  const link = (path: string, label: string, active: boolean) => (
    <a
      href={`#${path}`}
      className={`nav__link${active ? ' is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </a>
  );
  return (
    <header className="chrome">
      <div className="chrome__inner">
        <a href="#/" className="brand" aria-label="Open Chinesse, ir al inicio">
          <span className="brand__mark" lang="zh-Hans">
            你好
          </span>
          <span className="brand__name">
            Open <strong>Chinesse</strong>
          </span>
        </a>
        <nav className="nav" aria-label="Principal">
          {link('/', 'Hoy', route.name === 'home')}
          {link('/review', 'Repasar', route.name === 'review')}
          {link('/stats', 'Progreso', route.name === 'stats')}
        </nav>
        {status !== 'loading' && <Account />}
      </div>
    </header>
  );
}

function RouteView({ route }: { route: Route }) {
  switch (route.name) {
    case 'lesson':
      return <Lesson key={route.unitId} unitId={route.unitId} />;
    case 'review':
      return <Review />;
    case 'stats':
      return <Stats />;
    default:
      return <Home />;
  }
}

export default function App() {
  const route = useRoute();
  const init = useSession((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <div className="app">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <Header route={route} />
      <main className="main" id="contenido">
        <RouteView route={route} />
      </main>
      <footer className="foot">
        <p>
          Progreso guardado en este navegador y, si entras con tu cuenta, sincronizado.
          Sin notificaciones ni rachas punitivas.
        </p>
        <button type="button" className="link" onClick={() => navigate('/stats')}>
          Ver progreso
        </button>
      </footer>
    </div>
  );
}
