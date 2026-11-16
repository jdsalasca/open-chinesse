import { useEffect, useRef } from 'react';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
const NATIVE_ENTER_TAGS = new Set(['BUTTON', 'A']);

/**
 * Enter avanza cuando el foco no está en un control que ya responde a Enter.
 * Evita el `autoFocus` en botones y deja que los controles nativos hagan su trabajo.
 */
export function useEnterKey(action: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.defaultPrevented) return;
      const tag = (event.target as HTMLElement | null)?.tagName ?? '';
      if (TYPING_TAGS.has(tag) || NATIVE_ENTER_TAGS.has(tag)) return;
      event.preventDefault();
      action();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [action, enabled]);
}

/** Foco inicial en un campo de texto sin usar el atributo `autoFocus`. */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}
