import { Pinyin } from '../components/Pinyin';
import { Card } from '../components/ui/Card';
import { charInfo, componentTree, wordsWith, type CharInfo } from '../data/characters';
import { UNITS, type Word } from '../data/curriculum';
import { describeOp, type IdsNode } from '../lib/ids';
import { navigate } from '../lib/router';

const UNIT_BY_WORD = new Map(
  UNITS.flatMap((unit) => unit.words.map((word) => [word.id, unit] as const)),
);

function Char({ char }: { char: string }) {
  if (!charInfo(char)?.ids) {
    return (
      <span className="ids__char" lang="zh-Hans">
        {char}
      </span>
    );
  }
  return (
    <a
      className="ids__char"
      href={`#/caracter/${encodeURIComponent(char)}`}
      aria-label={`Ver el carácter ${char}`}
      lang="zh-Hans"
    >
      {char}
    </a>
  );
}

function IdsTree({ nodes }: { nodes: IdsNode[] }) {
  return (
    <ul className="ids">
      {nodes.map((node, index) => (
        <li key={index} className={`ids__item ids__item--${node.kind}`}>
          {node.kind === 'char' ? (
            <Char char={node.char} />
          ) : (
            <>
              <span className="ids__label">{describeOp(node.op)}</span>
              <IdsTree nodes={node.parts} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function CharacterHead({ char, info, level }: { char: string; info?: CharInfo; level: number }) {
  return (
    <header className="character__head">
      <div className="character__hanzi" lang="zh-Hans">
        {char}
      </div>
      <dl className="character__facts">
        <div>
          <dt>Radical</dt>
          <dd lang="zh-Hans">{info?.radical ?? '—'}</dd>
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
    </header>
  );
}

function WordRow({ word }: { word: Word }) {
  const unit = UNIT_BY_WORD.get(word.id);
  return (
    <li className="character__word">
      <p className="character__word-head">
        <a className="character__word-hanzi" href={`#/lesson/${unit?.id ?? ''}`} lang="zh-Hans">
          {word.hanzi}
        </a>
        <Pinyin pinyin={word.pinyin} className="character__word-pinyin" />
      </p>
      <p className="character__word-meaning">{word.meaning}</p>
      {unit && <p className="character__word-unit">{unit.title}</p>}
    </li>
  );
}

function CharacterWords({ words }: { words: Word[] }) {
  if (words.length === 0) {
    return <p className="character__empty">Este carácter no está en ninguna palabra del curso.</p>;
  }
  return (
    <ul className="character__words">
      {words.map((word) => (
        <WordRow key={word.id} word={word} />
      ))}
    </ul>
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

  return (
    <section className="character">
      <button type="button" className="link character__back" onClick={() => navigate('/')}>
        ← Volver
      </button>
      <CharacterHead char={char} info={info} level={levelOf(words)} />
      <Card>
        <h2 className="character__title">Cómo se compone</h2>
        {info?.ids ? (
          <IdsTree nodes={componentTree(char)} />
        ) : (
          <p className="character__empty">No tenemos la descomposición de este carácter.</p>
        )}
      </Card>
      <Card>
        <h2 className="character__title">Aparece en</h2>
        <CharacterWords words={words} />
      </Card>
    </section>
  );
}
