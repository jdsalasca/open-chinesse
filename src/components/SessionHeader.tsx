import { Icon } from './ui/Icon';

type Props = {
  label: string;
  count?: string;
  onExit: () => void;
};

/** Cabecera de una sesión de estudio: salir, contexto y avance. */
export function SessionHeader({ label, count, onExit }: Props) {
  return (
    <div className="session-header">
      <button type="button" className="session-header__exit" onClick={onExit}>
        <Icon name="back" size={16} />
        Salir
      </button>
      <span className="session-header__label">{label}</span>
      {count && <span className="session-header__count">{count}</span>}
    </div>
  );
}
