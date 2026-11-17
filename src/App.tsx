import { useEffect, type ReactNode } from 'react';
import { SoundToggle } from './components/SoundToggle';
import { CharacterMenu } from './components/CharacterMenu';
import { AccountLink } from './components/AccountLink';
import { BottomNav } from './components/BottomNav';
import { CharacterDrawer } from './components/CharacterDrawer';
import { SessionBar } from './components/SessionBar';
import { navigate, useRoute, type Route } from './lib/router';
import { Home } from './screens/Home';
import { Character } from './screens/Character';
import { Stories } from './screens/Stories';
import { Scenarios, ScenarioView } from './screens/Scenarios';
import { Check } from './screens/Check';
import { Cloze } from './screens/Cloze';
import { Dictation } from './screens/Dictation';
import { Bedtime } from './screens/Bedtime';
import { China } from './screens/China';
import { Mixed } from './screens/Mixed';
import { Immersion } from './screens/Immersion';
import { Tones } from './screens/Tones';
import { Lesson } from './screens/Lesson';
import { Login } from './screens/Login';
import { Practice } from './screens/Practice';
import { Profile } from './screens/Profile';
import { Review } from './screens/Review';
import { Stats } from './screens/Stats';
import { useSession } from './store/session';
import { useLearner } from './store/useLearner';
import './styles/main.scss';

const SECTION: Partial<Record<Route['name'], string>> = {
  home: 'home',
  practice: 'practicar',
  stories: 'historias',
  immersion: 'inmersion',
  profile: 'perfil',
  stats: 'progreso',
};

const FOCUS = new Set<Route['name']>([
  'lesson',
  'review',
  'tones',
  'scenario',
  'cloze',
  'dictation',
  'mixed',
  'errors',
]);

const VIEWS: Partial<Record<Route['name'], () => ReactNode>> = {
  review: () => <Review />,
  stats: () => <Stats />,
  login: () => <Login />,
  profile: () => <Profile />,
  practice: () => <Practice />,
  scenarios: () => <Scenarios />,
  immersion: () => <Immersion />,
  tones: () => <Tones />,
  check: () => <Check />,
  cloze: () => <Cloze />,
  dictation: () => <Dictation />,
  mixed: () => <Mixed />,
  errors: () => <Mixed errors />,
};

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
          {link('/', 'Aprender', route.name === 'home')}
          {link('/practicar', 'Practicar', route.name === 'practice')}
          {link('/historias', 'Historias', route.name === 'stories')}
          {link('/inmersion', 'Inmersión', route.name === 'immersion')}
          {link('/stats', 'Progreso', route.name === 'stats')}
        </nav>
        {status !== 'loading' && <AccountLink />}
      </div>
    </header>
  );
}

function RouteView({ route }: { route: Route }) {
  if (route.name === 'lesson') return <Lesson key={route.unitId} unitId={route.unitId} />;
  if (route.name === 'character') return <Character key={route.char} char={route.char} />;
  if (route.name === 'stories') return <Stories storyId={route.storyId} />;
  if (route.name === 'bedtime') return <Bedtime storyId={route.storyId} />;
  if (route.name === 'china') return <China textId={route.textId} />;
  if (route.name === 'scenario') {
    return <ScenarioView key={route.scenarioId} scenarioId={route.scenarioId} />;
  }
  const view = VIEWS[route.name];
  return view ? view() : <Home />;
}

function useDayRefresh() {
  const refreshDay = useLearner((s) => s.refreshDay);
  useEffect(() => {
    const refresh = () => refreshDay();
    refresh();
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, [refreshDay]);
}

export default function App() {
  const route = useRoute();
  const init = useSession((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  useDayRefresh();

  const section = SECTION[route.name];
  const focus = FOCUS.has(route.name);

  return (
    <div className={`app${focus ? ' app--focus' : ''}`}>
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      {!focus && <Header route={route} />}
      <main className="main" id="contenido">
        <SessionBar />
        <RouteView route={route} />
      </main>
      {!focus && section && <BottomNav current={section} />}
      <CharacterDrawer />
      <CharacterMenu />
      {!focus && (
        <footer className="foot">
          <p>
            Progreso guardado en este navegador y, si entras con tu cuenta, sincronizado. Sin
            notificaciones ni rachas punitivas.
          </p>
          <button type="button" className="link" onClick={() => navigate('/stats')}>
            Ver progreso
          </button>
          <SoundToggle />
        </footer>
      )}
    </div>
  );
}
