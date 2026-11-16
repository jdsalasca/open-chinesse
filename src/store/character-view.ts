import { create } from 'zustand';

export type CharacterLayer = {
  char: string;
  /** Caracteres de la palabra desde la que se abrió; el paginador se mueve entre ellos. */
  chars: string[];
  /** De qué ficha y por qué se abrió esta capa. */
  from?: string;
  relation?: string;
  note?: string;
  hint?: string;
};

export type DrillMeta = {
  from: string;
  relation: string;
  note: string;
  hint?: string;
};

const MAX_LAYERS = 6;

export type CharacterViewState = {
  char: string | null;
  chars: string[];
  /** Pila de fichas: la primera es el origen y cada clic en una pieza añade una capa. */
  layers: CharacterLayer[];
  open: (char: string, chars?: string[]) => void;
  drill: (char: string, meta?: DrillMeta) => void;
  pop: () => void;
  jump: (index: number) => void;
  close: () => void;
  step: (delta: number) => void;
};

const top = (layers: CharacterLayer[]): CharacterLayer | undefined => layers.at(-1);

function viewOf(layers: CharacterLayer[]) {
  const layer = top(layers);
  return layer
    ? { layers, char: layer.char, chars: layer.chars }
    : { layers: [], char: null, chars: [] };
}

function drillLayers(layers: CharacterLayer[], char: string, meta?: DrillMeta): CharacterLayer[] {
  if (layers.length >= MAX_LAYERS) return layers;
  const existing = layers.findIndex((layer) => layer.char === char);
  if (existing >= 0) return layers.slice(0, existing + 1);
  return [...layers, { char, chars: [char], ...meta }];
}

function stepLayers(layers: CharacterLayer[], delta: number): CharacterLayer[] {
  const current = top(layers);
  if (!current || current.chars.length < 2) return layers;
  const index = current.chars.indexOf(current.char);
  if (index < 0) return layers;
  const char = current.chars[(index + delta + current.chars.length) % current.chars.length];
  const next = [...layers];
  next[next.length - 1] = { ...current, char };
  return next;
}

export const useCharacterView = create<CharacterViewState>((set, get) => ({
  char: null,
  chars: [],
  layers: [],
  open: (char, chars) => {
    const entry = { char, chars: chars && chars.length > 0 ? chars : [char] };
    set(viewOf([entry]));
  },
  drill: (char, meta) => set(viewOf(drillLayers(get().layers, char, meta))),
  pop: () => set(viewOf(get().layers.slice(0, -1))),
  jump: (index) => {
    const { layers } = get();
    if (index < 0 || index >= layers.length) return;
    set(viewOf(layers.slice(0, index + 1)));
  },
  close: () => set({ char: null, chars: [], layers: [] }),
  step: (delta) => set(viewOf(stepLayers(get().layers, delta))),
}));
