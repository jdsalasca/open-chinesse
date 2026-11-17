import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'lesson'; unitId: string }
  | { name: 'review' }
  | { name: 'stats' }
  | { name: 'login' }
  | { name: 'profile' }
  | { name: 'practice' }
  | { name: 'stories'; storyId?: string }
  | { name: 'scenarios' }
  | { name: 'scenario'; scenarioId: string }
  | { name: 'immersion' }
  | { name: 'tones' }
  | { name: 'check' }
  | { name: 'cloze' }
  | { name: 'dictation' }
  | { name: 'bedtime'; storyId?: string }
  | { name: 'china'; textId?: string }
  | { name: 'mixed' }
  | { name: 'character'; char: string };

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const SIMPLE: Record<string, Route> = {
  review: { name: 'review' },
  stats: { name: 'stats' },
  login: { name: 'login' },
  perfil: { name: 'profile' },
  profile: { name: 'profile' },
  practicar: { name: 'practice' },
  situaciones: { name: 'scenarios' },
  historias: { name: 'stories' },
  inmersion: { name: 'immersion' },
  tonos: { name: 'tones' },
  prueba: { name: 'check' },
  contexto: { name: 'cloze' },
  dictado: { name: 'dictation' },
  dormir: { name: 'bedtime' },
  china: { name: 'china' },
  mixta: { name: 'mixed' },
};

const PARAM: Record<string, (value: string) => Route> = {
  lesson: (unitId) => ({ name: 'lesson', unitId }),
  historias: (storyId) => ({ name: 'stories', storyId }),
  situaciones: (scenarioId) => ({ name: 'scenario', scenarioId }),
  dormir: (storyId) => ({ name: 'bedtime', storyId }),
  china: (textId) => ({ name: 'china', textId }),
  caracter: (char) => ({ name: 'character', char: decode(char) }),
  character: (char) => ({ name: 'character', char: decode(char) }),
};

export function parseHash(hash: string): Route {
  const [head, param] = hash.replace(/^#\/?/, '').split('?')[0].split('/');
  if (param && PARAM[head]) return PARAM[head](param);
  return SIMPLE[head] ?? { name: 'home' };
}

export function navigate(path: string): void {
  window.location.hash = path.startsWith('#') ? path : `#${path}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      const hash = window.location.hash;
      // Los anclajes internos (#contenido) no son rutas: no cambian de pantalla.
      if (hash && !hash.startsWith('#/')) return;
      setRoute(parseHash(hash));
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
