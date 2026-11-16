import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'soft' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: ReactNode;
};

/** Botón único de la app: variante, tamaño e icono opcional. */
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  className = '',
  children,
  ...rest
}: Props) {
  const classes = [
    'button',
    `button--${variant}`,
    size !== 'md' ? `button--${size}` : '',
    block ? 'is-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={rest.type ?? 'button'} className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}
