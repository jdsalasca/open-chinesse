import { useEffect, useState } from 'react';

export type Route =
  { name: 'home' } | { name: 'lesson'; unitId: string } | { name: 'review' } | { name: 'stats' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').split('?')[0];
  const [head, param] = path.split('/');
  if (head === 'lesson' && param) return { name: 'lesson', unitId: param };
  if (head === 'review') return { name: 'review' };
  if (head === 'stats') return { name: 'stats' };
  return { name: 'home' };
}

export function navigate(path: string): void {
  window.location.hash = path.startsWith('#') ? path : `#${path}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
