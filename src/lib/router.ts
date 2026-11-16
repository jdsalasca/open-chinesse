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
  | { name: 'immersion' }
  | { name: 'tones' }
  | { name: 'check' }
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
  historias: { name: 'stories' },
  inmersion: { name: 'immersion' },
  tonos: { name: 'tones' },
  prueba: { name: 'check' },
};

export function parseHash(hash: string): Route {
  const [head, param] = hash.replace(/^#\/?/, '').split('?')[0].split('/');
  if (head === 'lesson' && param) return { name: 'lesson', unitId: param };
  if (head === 'historias') return { name: 'stories', storyId: param };
  if ((head === 'caracter' || head === 'character') && param) {
    return { name: 'character', char: decode(param) };
  }
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
