import type { IconName } from '../components/ui/Icon';

export type Challenge = {
  id: string;
  title: string;
  detail: string;
  href: string;
  icon: IconName;
};

const CHALLENGES: Challenge[] = [
  {
    id: 'cafe',
    title: 'Pide un café',
    detail: 'Entra en la cafetería y completa el pedido.',
    href: '#/situaciones/cafeteria',
    icon: 'chat',
  },
  {
    id: 'presentate',
    title: 'Preséntate',
    detail: 'Di tu nombre y responde si eres estudiante.',
    href: '#/situaciones/primer-contacto',
    icon: 'chat',
  },
  {
    id: 'fruta',
    title: 'Compra fruta',
    detail: 'Pregunta el precio y elige una fruta.',
    href: '#/situaciones/fruteria',
    icon: 'chat',
  },
  {
    id: 'metro',
    title: 'Pregunta cómo llegar',
    detail: 'Encuentra el metro y despídete.',
    href: '#/situaciones/metro',
    icon: 'chat',
  },
  {
    id: 'cuento',
    title: 'Escucha un cuento',
    detail: 'Cierra el día con una historia lenta.',
    href: '#/dormir',
    icon: 'sparkles',
  },
  {
    id: 'te',
    title: 'Lee sobre el té',
    detail: 'Descubre por qué acompaña casi todas las conversaciones.',
    href: '#/china/te',
    icon: 'book',
  },
  {
    id: 'dictado',
    title: 'Una ronda de dictado',
    detail: 'Escucha cinco palabras y escríbelas.',
    href: '#/dictado',
    icon: 'name',
  },
];

/** Reto del día: rota de forma determinista con la fecha. */
export function challengeFor(dateKey: string): Challenge {
  const seed = [...dateKey].reduce(
    (total, char) => (total * 31 + (char.codePointAt(0) ?? 0)) % 2147483647,
    7,
  );
  return CHALLENGES[seed % CHALLENGES.length];
}
