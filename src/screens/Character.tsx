import { useState } from 'react';
import { Pinyin } from '../components/Pinyin';
import { Card } from '../components/ui/Card';
import {
  charactersUsing,
  charInfo,
  componentTree,
  formationOf,
  meaningOf,
  readingOf,
  wordsWith,
  type CharInfo,
} from '../data/characters';
import { UNITS, type Word } from '../data/curriculum';
import { glossOf } from '../data/glosses';
import { describeOp, type IdsNode } from '../lib/ids';
import { navigate } from '../lib/router';

const UNIT_BY_WORD = new Map(
  UNITS.flatMap((unit) => unit.words.map((word) => [word.id, unit] as const)),
);

function labelOf(char: string): string | undefined {
  return glossOf(char) ?? meaningOf(char) ?? readingOf(char);
}

function Tile({ char, open, onToggle }: { char: string; open?: boolean; onToggle?: () => void }) {
  return (
    <button
      type="button"
      className={`piece__tile${onToggle ? ' is-expandable' : ''}`}
      onClick={onToggle}
      aria-expanded={onToggle ? open : undefined}
      aria-label={onToggle ? `Desplegar ${char}` : char}
      lang="zh-Hans"
    >
      {char}
    </button>
  );
}

function Piece({ char, depth }: { char: string; depth: number }) {
  const [open, setOpen] = useState(false);
  const children = componentTree(char);
  const expandable = children.length > 0 && depth < 3;

  return (
    <div className="piece">
      <Tile char={char} open={open} onToggle={expandable ? () => setOpen(!open) : undefined} />
      <span className="piece__label">{labelOf(char) ?? '—'}</span>
      {expandable && <span className="piece__inside">{open ? '− dentro' : '+ dentro'}</span>}
      {expandable && open && (
        <div className="piece__children">
          <IdsTree nodes={children} depth={depth + 1} />
          <a className="piece__sheet" href={`#/caracter/${encodeURIComponent(char)}`}>
            Ficha de {char} →
          </a>
        </div>
      )}
    </div>
  );
}

function IdsTree({ nodes, depth }: { nodes: IdsNode[]; depth: number }) {
  return (
    <ul className="ids">
      {nodes.map((node, index) => (
        <li key={index} className={`ids__item ids__item--${node.kind}`}>
          {node.kind === 'char' ? (
            <Piece char={node.char} depth={depth} />
          ) : (
            <>
              <span className="ids__label">{describeOp(node.op)}</span>
              <IdsTree nodes={node.parts} depth={depth} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function Facts({ info, level }: { info?: CharInfo; level: number }) {
  const radical = info?.radical;
  return (
    <dl className="character__facts">
      <div>
        <dt>Radical</dt>
        <dd>
          <span lang="zh-Hans">{radical ?? '—'}</span>
          {radical && <small>{glossOf(radical) ?? ''}</small>}
        </dd>
      </div>
      <div>
        <dt>Trazos</dt>
        <dd>{info?.strokes ?? '—'}</dd>
      </div>
      <div>
        <dt>Nivel</dt>
        <dd>{level > 0 ? `HSK ${level}` : '—'}</dd>
      </div>
    </dl>
  );
}

function History({ char, info }: { char: string; info?: CharInfo }) {
  const formation = formationOf(char);
  return (
    <Card>
      <h2 className="character__title">De dónde viene</h2>
      {formation ? (
        <>
          <p className="formation__label">{formation.label}</p>
          <p className="formation__detail">{formation.detail}</p>
        </>
      ) : (
        <p className="character__empty">La fuente no clasifica este carácter.</p>
      )}
      {info?.shuowen && (
        <blockquote className="shuowen">
          <p lang="zh-Hant">{info.shuowen}</p>
          <footer>Shuowen Jiezi, hacia el año 100 — describía la escritura de sello.</footer>
        </blockquote>
      )}
      {info?.traditional && (
        <p className="character__variant">
          Forma tradicional: <span lang="zh-Hant">{info.traditional}</span>
        </p>
      )}
    </Card>
  );
}

function positionIn(word: Word, char: string): string {
  const chars = [...word.hanzi];
  if (chars.length === 1) return 'palabra suelta';
  const index = chars.indexOf(char);
  if (index === 0) return 'al principio';
  return index === chars.length - 1 ? 'al final' : 'en medio';
}

function WordRow({ word, char }: { word: Word; char: string }) {
  const unit = UNIT_BY_WORD.get(word.id);
  return (
    <li className="character__word">
      <p className="character__word-head">
        <a className="character__word-hanzi" href={`#/lesson/${unit?.id ?? ''}`} lang="zh-Hans">
          {word.hanzi}
        </a>
        <Pinyin pinyin={word.pinyin} className="character__word-pinyin" />
        <span className="character__word-pos">{positionIn(word, char)}</span>
      </p>
      <p className="character__word-meaning">{word.meaning}</p>
      {unit && <p className="character__word-unit">{unit.title}</p>}
    </li>
  );
}

function InsideList({ inside }: { inside: string[] }) {
  if (inside.length === 0) return null;
  return (
    <div className="character__inside">
      <p className="character__subtitle">Está dentro de {inside.length} caracteres</p>
      <ul className="chips">
        {inside.slice(0, 12).map((other) => (
          <li key={other}>
            <a className="chip" href={`#/caracter/${encodeURIComponent(other)}`} lang="zh-Hans">
              {other}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FamilyCard({ char, family }: { char: string; family: string[] }) {
  return (
    <Card>
      <h2 className="character__title">Familia del sonido</h2>
      <p className="character__note">Caracteres que usan {char} como pista de pronunciación.</p>
      <ul className="chips">
        {family.map((other) => (
          <li key={other}>
            <a className="chip" href={`#/caracter/${encodeURIComponent(other)}`} lang="zh-Hans">
              {other}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Related({ char, words }: { char: string; words: Word[] }) {
  const family = charInfo(char)?.family ?? [];
  return (
    <>
      <Card>
        <h2 className="character__title">En el curso</h2>
        {words.length > 0 ? (
          <ul className="character__words">
            {words.map((word) => (
              <WordRow key={word.id} word={word} char={char} />
            ))}
          </ul>
        ) : (
          <p className="character__empty">No forma ninguna palabra del curso por sí solo.</p>
        )}
        <InsideList inside={charactersUsing(char)} />
      </Card>
      {family.length > 0 && <FamilyCard char={char} family={family} />}
    </>
  );
}

function levelOf(words: Word[]): number {
  let level = 0;
  for (const word of words) {
    const unitLevel = UNIT_BY_WORD.get(word.id)?.level ?? 0;
    if (unitLevel > 0 && (level === 0 || unitLevel < level)) level = unitLevel;
  }
  return level;
}

export function Character({ char }: { char: string }) {
  const info = charInfo(char);
  const words = wordsWith(char);
  const meaning = meaningOf(char);
  const reading = readingOf(char);

  return (
    <section className="character">
      <button type="button" className="link character__back" onClick={() => navigate('/')}>
        ← Volver
      </button>
      <header className="character__head">
        <div>
          <div className="character__hanzi" lang="zh-Hans">
            {char}
          </div>
          {reading && <p className="character__reading">{reading}</p>}
          {meaning && <p className="character__meaning">{meaning}</p>}
        </div>
        <Facts info={info} level={levelOf(words)} />
      </header>

      <History char={char} info={info} />

      <Card>
        <h2 className="character__title">Cómo se compone</h2>
        <p className="character__note">
          Cada pieza se puede abrir para ver qué lleva dentro. Toca el recuadro con «+ dentro».
        </p>
        {info?.ids ? (
          <IdsTree nodes={componentTree(char)} depth={0} />
        ) : (
          <p className="character__empty">No tenemos la descomposición de este carácter.</p>
        )}
      </Card>

      <Related char={char} words={words} />
    </section>
  );
}
