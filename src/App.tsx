import { useEffect } from 'react';
import { AccountLink } from './components/AccountLink';
import { navigate, useRoute, type Route } from './lib/router';
import { Home } from './screens/Home';
import { Character } from './screens/Character';
import { Lesson } from './screens/Lesson';
import { Login } from './screens/Login';
import { Profile } from './screens/Profile';
import { Review } from './screens/Review';
import { Stats } from './screens/Stats';
import { useSession } from './store/session';
import './styles/main.scss';

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
        {status !== 'loading' && <AccountLink />}
      </div>
    </header>
  );
}

function RouteView({ route }: { route: Route }) {
  switch (route.name) {
    case 'lesson':
      return <Lesson key={route.unitId} unitId={route.unitId} />;
    case 'character':
      return <Character key={route.char} char={route.char} />;
    case 'review':
      return <Review />;
    case 'stats':
      return <Stats />;
    case 'login':
      return <Login />;
    case 'profile':
      return <Profile />;
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
          Progreso guardado en este navegador y, si entras con tu cuenta, sincronizado. Sin
          notificaciones ni rachas punitivas.
        </p>
        <button type="button" className="link" onClick={() => navigate('/stats')}>
          Ver progreso
        </button>
      </footer>
    </div>
  );
}
