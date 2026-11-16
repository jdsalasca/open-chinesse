import type { ReactNode } from 'react';

export type IconName =
  | 'flame'
  | 'star'
  | 'trophy'
  | 'target'
  | 'check'
  | 'speaker'
  | 'arrow'
  | 'sparkles'
  | 'book'
  | 'clock'
  | 'back'
  | 'chat'
  | 'name';

const PATHS: Record<IconName, string> = {
  flame: 'M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1 0-2 1-3 1 2 3 4 3 7a6 6 0 0 1-12 0c0-4 3-6 6-11Z',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0V4Zm-3 2h3M19 6h-3M12 13v5m-3 2h6',
  target:
    'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  check: 'm4 12 5 5L20 6',
  speaker: 'M4 10v4h3l5 4V6L7 10H4Zm12 0a5 5 0 0 1 0 4',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  sparkles: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2 2m8 8 2 2M18 6l-2 2M8 16l-2 2',
  book: 'M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 1-2-2V5Zm9-2h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5V3Z',
  clock: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4v5l3 2',
  back: 'M19 12H5m6-6-6 6 6 6',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  name: 'M12 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM5 21a7 7 0 0 1 14 0',
};

type Props = {
  name: IconName;
  size?: number;
  filled?: boolean;
};

/** Icono decorativo de 24×24; el texto acompaña siempre. */
export function Icon({ name, size = 18, filled = false }: Props): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
