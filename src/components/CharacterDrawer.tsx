import { useEffect } from 'react';
import { CharacterSheet } from './CharacterSheet';
import { getCharacterSheetData } from '../data/character-sheet';
import { useCharacterView } from '../store/character-view';

function Pager({
  index,
  total,
  step,
}: {
  index: number;
  total: number;
  step: (delta: number) => void;
}) {
  return (
    <div className="drawer__pager">
      <button type="button" className="drawer__btn" onClick={() => step(-1)} aria-label="Anterior">
        ←
      </button>
      <span className="drawer__count">
        {index + 1} / {total}
      </span>
      <button type="button" className="drawer__btn" onClick={() => step(1)} aria-label="Siguiente">
        →
      </button>
    </div>
  );
}

function Head({
  char,
  chars,
  close,
  step,
}: {
  char: string;
  chars: string[];
  close: () => void;
  step: (delta: number) => void;
}) {
  const index = chars.indexOf(char);
  return (
    <header className="drawer__head">
      {chars.length > 1 && index >= 0 ? (
        <Pager index={index} total={chars.length} step={step} />
      ) : (
        <span />
      )}
      <div className="drawer__actions">
        <a className="link" href={`#/caracter/${encodeURIComponent(char)}`} onClick={close}>
          Página completa ↗
        </a>
        <button type="button" className="link" onClick={close}>
          Cerrar ✕
        </button>
      </div>
    </header>
  );
}

/** Panel lateral o inferior con la ficha; no desmonta la pantalla de fondo. */
export function CharacterDrawer() {
  const char = useCharacterView((state) => state.char);
  const chars = useCharacterView((state) => state.chars);
  const close = useCharacterView((state) => state.close);
  const step = useCharacterView((state) => state.step);
  const open = useCharacterView((state) => state.open);

  useEffect(() => {
    if (!char) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [char, close]);

  if (!char) return null;

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label={`Ficha de ${char}`}>
      <button
        type="button"
        className="drawer__scrim"
        aria-label="Cerrar la ficha"
        onClick={close}
      />
      <aside className="drawer__panel">
        <Head char={char} chars={chars} close={close} step={step} />
        <div className="drawer__body">
          <CharacterSheet
            data={getCharacterSheetData(char)}
            onOpenCharacter={(next) => open(next, chars)}
          />
        </div>
      </aside>
    </div>
  );
}
