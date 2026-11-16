import { useEffect, useState } from 'react';
import { readingOf } from '../data/characters';
import { useCharacterView } from '../store/character-view';
import { speak } from '../lib/speech';

type Target = { char: string; x: number; y: number };

function charAtPoint(x: number, y: number): string | undefined {
  const range = document.caretRangeFromPoint?.(x, y);
  const char = range ? (range.startContainer.textContent ?? '').charAt(range.startOffset) : '';
  return /\p{Script=Han}/u.test(char) ? char : undefined;
}

function useClose(target: Target | null, close: () => void) {
  useEffect(() => {
    if (!target) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [target, close]);
}

export function CharacterMenu() {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    const onContext = (event: MouseEvent) => {
      const element = event.target as HTMLElement | null;
      if (!element?.closest('[lang="zh-Hans"]')) return;
      const char = charAtPoint(event.clientX, event.clientY);
      if (!char) return;
      event.preventDefault();
      setTarget({ char, x: event.clientX, y: event.clientY });
    };
    window.addEventListener('contextmenu', onContext);
    return () => window.removeEventListener('contextmenu', onContext);
  }, []);

  useClose(target, () => setTarget(null));

  return target ? <Menu target={target} onClose={() => setTarget(null)} /> : null;
}

function Menu({ target, onClose }: { target: Target; onClose: () => void }) {
  const openChar = useCharacterView((state) => state.open);
  const open = () => {
    openChar(target.char, [target.char]);
    onClose();
  };

  return (
    <div
      className="char-menu"
      role="menu"
      aria-label={`Carácter ${target.char}`}
      style={{
        left: Math.min(target.x, window.innerWidth - 220),
        top: Math.min(target.y, window.innerHeight - 140),
      }}
    >
      <p className="char-menu__head">
        <span lang="zh-Hans">{target.char}</span>
        <small>{readingOf(target.char) ?? ''}</small>
      </p>
      <button type="button" role="menuitem" onClick={open}>
        Ver su origen
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          speak(target.char);
          onClose();
        }}
      >
        Escuchar
      </button>{' '}
    </div>
  );
}
