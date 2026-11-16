import { useEffect, type CSSProperties } from 'react';
import { CharacterSheet } from './CharacterSheet';
import { getCharacterSheetData, type CharacterSheetData } from '../data/character-sheet';
import { describeRelation } from '../lib/character-relation';
import { useCharacterView, type CharacterLayer, type DrillMeta } from '../store/character-view';

/** Offsets de Fibonacci: centro, +34, +55, +89, +144 y +233 px. */
const OFFSETS = [0, 34, 55, 89, 144, 233];
const RISES = [0, 8, 13, 21, 34, 55];
const SCALES = [1, 0.97, 0.94, 0.91, 0.88, 0.85];

function layerStyle(index: number): CSSProperties {
  return {
    '--layer-x': `${OFFSETS[index] ?? 0}px`,
    '--layer-y': `${RISES[index] ?? 0}px`,
    '--layer-scale': SCALES[index] ?? 0.85,
    zIndex: 10 + index,
  } as CSSProperties;
}

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

function Breadcrumb({
  chars,
  active,
  jump,
}: {
  chars: string[];
  active: number;
  jump: (index: number) => void;
}) {
  return (
    <div className="drawer__crumb" aria-label="Recorrido del origen">
      {chars.map((char, index) => (
        <span key={`${char}-${index}`} className="drawer__crumb-item">
          {index > 0 && (
            <span className="drawer__crumb-sep" aria-hidden="true">
              ›
            </span>
          )}
          <button
            type="button"
            className={`drawer__crumb-btn${index === active ? ' is-current' : ''}`}
            onClick={() => jump(index)}
            aria-current={index === active ? 'step' : undefined}
            lang="zh-Hans"
          >
            {char}
          </button>
        </span>
      ))}
    </div>
  );
}

function HeadActions({
  active,
  char,
  close,
  pop,
}: {
  active: number;
  char: string;
  close: () => void;
  pop: () => void;
}) {
  return (
    <div className="drawer__actions">
      {active > 0 && (
        <button type="button" className="drawer__action" onClick={pop}>
          ← Atrás
        </button>
      )}
      <a className="drawer__action" href={`#/caracter/${encodeURIComponent(char)}`} onClick={close}>
        Página completa ↗
      </a>
      <button type="button" className="drawer__action" onClick={close}>
        Cerrar ✕
      </button>
    </div>
  );
}

function Head({
  char,
  chars,
  layers,
  active,
  close,
  step,
  pop,
  jump,
}: {
  char: string;
  chars: string[];
  layers: string[];
  active: number;
  close: () => void;
  step: (delta: number) => void;
  pop: () => void;
  jump: (index: number) => void;
}) {
  const index = chars.indexOf(char);
  const hasTrail = chars.length > 1 || layers.length > 1;
  return (
    <header className="drawer__head">
      <div className={`drawer__head-left${hasTrail ? ' has-trail' : ''}`}>
        {chars.length > 1 && index >= 0 && <Pager index={index} total={chars.length} step={step} />}
        {layers.length > 1 && <Breadcrumb chars={layers} active={active} jump={jump} />}
      </div>
      <HeadActions active={active} char={char} close={close} pop={pop} />
    </header>
  );
}

function Compare({
  layer,
  parent,
  reading,
}: {
  layer: CharacterLayer;
  parent: CharacterSheetData;
  reading?: string;
}) {
  return (
    <div className="drawer__compare">
      <p className="drawer__relation">
        {layer.relation}
        {layer.hint ? ` · ${layer.hint}` : ''}
      </p>
      <p className="drawer__pair" lang="zh-Hans">
        <span>{layer.from}</span>
        <small>{parent.reading}</small>
        <span aria-hidden="true">→</span>
        <span>{layer.char}</span>
        <small>{reading}</small>
      </p>
      {layer.note && <p className="drawer__note">{layer.note}</p>}
    </div>
  );
}

function openRelated(
  parent: CharacterSheetData,
  parentChar: string,
  next: string,
  drill: (char: string, meta?: DrillMeta) => void,
) {
  const relation = describeRelation(parent, next);
  drill(next, {
    from: parentChar,
    relation: relation.label,
    note: relation.note,
    hint: relation.hint,
  });
}

type LayerProps = {
  layer: CharacterLayer;
  index: number;
  active: boolean;
  layers: CharacterLayer[];
  close: () => void;
  step: (delta: number) => void;
  drill: (char: string, meta?: DrillMeta) => void;
  pop: () => void;
  jump: (index: number) => void;
};

function LayerPanel({ layer, index, active, layers, close, step, drill, pop, jump }: LayerProps) {
  const data = getCharacterSheetData(layer.char);
  const parent = layer.from ? getCharacterSheetData(layer.from) : null;
  return (
    <aside
      className={`drawer__panel${active ? ' is-active' : ''}`}
      style={layerStyle(index)}
      aria-hidden={!active}
      inert={!active}
      tabIndex={active ? -1 : undefined}
    >
      {active && (
        <Head
          char={layer.char}
          chars={layer.chars}
          layers={layers.map((item) => item.char)}
          active={index}
          close={close}
          step={step}
          pop={pop}
          jump={jump}
        />
      )}
      <div className="drawer__body">
        {layer.from && parent && <Compare layer={layer} parent={parent} reading={data.reading} />}
        <CharacterSheet
          data={data}
          onOpenCharacter={(next) => openRelated(data, layer.char, next, drill)}
        />
      </div>
    </aside>
  );
}

function useDrawerEffects(layers: CharacterLayer[], close: () => void) {
  const activeChar = layers.at(-1)?.char;

  useEffect(() => {
    if (layers.length === 0) return;
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
  }, [layers.length, close]);

  useEffect(() => {
    const panel = document.querySelector<HTMLElement>('.drawer__panel.is-active');
    if (!panel) return;
    panel.focus({ preventScroll: true });
    panel.querySelector<HTMLElement>('.drawer__body')?.scrollTo({ top: 0 });
  }, [layers.length, activeChar]);
}

/** Fichas encadenadas: centro, derecha y siguientes con offsets de Fibonacci. */
export function CharacterDrawer() {
  const layers = useCharacterView((state) => state.layers);
  const close = useCharacterView((state) => state.close);
  const step = useCharacterView((state) => state.step);
  const drill = useCharacterView((state) => state.drill);
  const pop = useCharacterView((state) => state.pop);
  const jump = useCharacterView((state) => state.jump);
  const active = layers.length - 1;

  useDrawerEffects(layers, close);

  if (layers.length === 0) return null;

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Ficha de carácter">
      <button
        type="button"
        className="drawer__scrim"
        aria-label="Cerrar la ficha"
        onClick={close}
      />
      {layers.map((layer, index) => (
        <LayerPanel
          key={`${layer.char}-${index}`}
          layer={layer}
          index={index}
          active={index === active}
          layers={layers}
          close={close}
          step={step}
          drill={drill}
          pop={pop}
          jump={jump}
        />
      ))}
    </div>
  );
}
