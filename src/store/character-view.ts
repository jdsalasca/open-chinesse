import { create } from 'zustand';

export type CharacterViewState = {
  char: string | null;
  /** Caracteres entre los que se puede navegar (la palabra desde la que se abrió). */
  chars: string[];
  open: (char: string, chars?: string[]) => void;
  close: () => void;
  step: (delta: number) => void;
};

export const useCharacterView = create<CharacterViewState>((set, get) => ({
  char: null,
  chars: [],
  open: (char, chars) => set({ char, chars: chars && chars.length > 0 ? chars : [char] }),
  close: () => set({ char: null, chars: [] }),
  step: (delta) => {
    const { char, chars } = get();
    const index = char ? chars.indexOf(char) : -1;
    if (index < 0 || chars.length < 2) return;
    set({ char: chars[(index + delta + chars.length) % chars.length] });
  },
}));
