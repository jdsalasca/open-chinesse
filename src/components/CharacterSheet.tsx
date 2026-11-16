import { useState } from 'react';
import type { CharacterSheetData, SheetNode, SheetWord } from '../data/character-sheet';
import { audioUrl, charAudioUrl } from '../lib/audio';
import { makeCharacterQuiz } from '../lib/character-quiz';
import { playCorrect, playWrong } from '../lib/sfx';
import { AudioButton } from './AudioButton';
import { Pinyin } from './Pinyin';
import { Card } from './ui/Card';

function Facts({ data }: { data: CharacterSheetData }) {
  return (
    <dl className="character__facts">
      <div>
        <dt>Radical</dt>
        <dd>
          <span lang="zh-Hans">{data.radical ?? '—'}</span>
          {data.radicalGloss && <small>{data.radicalGloss}</small>}
        </dd>
      </div>
      <div>
        <dt>Trazos</dt>
        <dd>{data.strokes ?? '—'}</dd>
      </div>
      <div>
        <dt>Nivel</dt>
        <dd>{data.level > 0 ? `HSK ${data.level}` : '—'}</dd>
      </div>
    </dl>
  );
}

function History({ data }: { data: CharacterSheetData }) {
  return (
    <Card>
      <h2 className="character__title">De dónde viene</h2>
      {data.formation ? (
        <>
          <p className="formation__label">{data.formation.label}</p>
          <p className="formation__detail">{data.formation.detail}</p>
        </>
      ) : (
        <p className="character__empty">La fuente no clasifica este carácter.</p>
      )}
      {data.shuowen && (
        <blockquote className="shuowen">
          <p lang="zh-Hant">{data.shuowen}</p>
          <footer>Shuowen Jiezi, hacia el año 100 — describía la escritura de sello.</footer>
        </blockquote>
      )}
      {data.traditional && (
        <p className="character__variant">
          Forma tradicional: <span lang="zh-Hant">{data.traditional}</span>
        </p>
      )}
    </Card>
  );
}

function ToggleTile({
  char,
  open,
  onToggle,
}: {
  char: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="piece__tile is-expandable"
      aria-expanded={open}
      aria-label={`${open ? 'Contraer' : 'Desplegar'} ${char}`}
      onClick={onToggle}
      lang="zh-Hans"
    >
      {char}
    </button>
  );
}

function CharTile({ char, onOpen }: { char: string; onOpen?: (char: string) => void }) {
  if (onOpen) {
    return (
      <button
        type="button"
        className="piece__tile"
        onClick={() => onOpen(char)}
        aria-label={`Ver el carácter ${char}`}
        lang="zh-Hans"
      >
        {char}
      </button>
    );
  }
  return (
    <a
      className="piece__tile"
      href={`#/caracter/${encodeURIComponent(char)}`}
      aria-label={`Ver el carácter ${char}`}
      lang="zh-Hans"
    >
      {char}
    </a>
  );
}

function Piece({ node, onOpen }: { node: SheetNode; onOpen?: (char: string) => void }) {
  const [open, setOpen] = useState(false);
  if (node.kind === 'op') {
    return (
      <li className="ids__item ids__item--op">
        <span className="ids__label">{node.label}</span>
        <Tree nodes={node.children} onOpen={onOpen} />
      </li>
    );
  }

  const expandable = node.children.length > 0;
  return (
    <li className="ids__item ids__item--char">
      <div className="piece">
        {expandable ? (
          <ToggleTile char={node.char} open={open} onToggle={() => setOpen(!open)} />
        ) : (
          <CharTile char={node.char} onOpen={onOpen} />
        )}
        <span className="piece__label">{node.label ?? '—'}</span>
        {expandable && (
          <button
            type="button"
            className="piece__inside"
            onClick={() => setOpen(!open)}
            aria-label={`${open ? 'Contraer' : 'Desplegar'} ${node.char}`}
          >
            {open ? '− dentro' : '+ dentro'}
          </button>
        )}
        {open && (
          <div className="piece__children">
            <Tree nodes={node.children} onOpen={onOpen} />
          </div>
        )}
      </div>
    </li>
  );
}

function Tree({ nodes, onOpen }: { nodes: SheetNode[]; onOpen?: (char: string) => void }) {
  return (
    <ul className="ids">
      {nodes.map((node, index) => (
        <Piece key={`${node.kind}-${index}`} node={node} onOpen={onOpen} />
      ))}
    </ul>
  );
}

function Composition({
  data,
  onOpen,
}: {
  data: CharacterSheetData;
  onOpen?: (char: string) => void;
}) {
  return (
    <Card>
      <h2 className="character__title">Cómo se compone</h2>
      <p className="character__note">
        Las piezas con «+ dentro» se abren aquí; las demás llevan a su ficha.
      </p>
      {data.pieces.length > 0 ? (
        <Tree nodes={data.pieces} onOpen={onOpen} />
      ) : (
        <p className="character__empty">No tenemos la descomposición de este carácter.</p>
      )}
    </Card>
  );
}

function WordRow({ word }: { word: SheetWord }) {
  const body = (
    <>
      <p className="character__word-head">
        <span className="character__word-hanzi" lang="zh-Hans">
          {word.hanzi}
        </span>
        <Pinyin pinyin={word.pinyin} className="character__word-pinyin" />
        <span className="character__word-pos">{word.position}</span>
        <AudioButton
          text={word.hanzi}
          label={word.hanzi}
          src={audioUrl('words', word.id)}
          compact
        />
      </p>
      <p className="character__word-meaning">{word.meaning}</p>
      {word.unitTitle && <p className="character__word-unit">{word.unitTitle}</p>}
    </>
  );

  return (
    <li className="character__word">
      {word.unitId ? (
        <a
          className="character__word-link"
          href={`#/lesson/${word.unitId}`}
          aria-label={word.hanzi}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

function WordList({ words }: { words: SheetWord[] }) {
  if (words.length === 0) {
    return <p className="character__empty">No forma ninguna palabra del curso por sí solo.</p>;
  }
  return (
    <ul className="character__words">
      {words.map((word) => (
        <WordRow key={word.id} word={word} />
      ))}
    </ul>
  );
}

function InsideList({ inside }: { inside: string[] }) {
  if (inside.length === 0) return null;
  return (
    <div className="character__inside">
      <p className="character__subtitle">Está dentro de {inside.length} caracteres</p>
      <ul className="chips">
        {inside.map((other) => (
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
  if (family.length === 0) return null;
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

function Words({ data }: { data: CharacterSheetData }) {
  return (
    <>
      <Card>
        <h2 className="character__title">En el curso</h2>
        <WordList words={data.words} />
        <InsideList inside={data.inside} />
      </Card>
      <FamilyCard char={data.char} family={data.family} />
    </>
  );
}

function Examples({ data }: { data: CharacterSheetData }) {
  if (data.examples.length === 0) return null;
  return (
    <Card>
      <h2 className="character__title">Ejemplos con {data.char}</h2>
      <p className="character__note">Frases del curso donde aparece. Suena cada una.</p>
      <ul className="character__examples">
        {data.examples.map((example) => (
          <li key={example.wordId} className="character__example">
            <p className="character__example-hanzi" lang="zh-Hans">
              {example.hanzi}
            </p>
            <Pinyin pinyin={example.pinyin} className="character__example-pinyin" />
            <p className="character__example-translation">{example.translation}</p>
            <AudioButton
              text={example.hanzi}
              label="la frase de ejemplo"
              src={audioUrl('examples', example.wordId)}
              compact
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Check({ data }: { data: CharacterSheetData }) {
  const [picked, setPicked] = useState<string | null>(null);
  const quiz = makeCharacterQuiz(data);
  if (!quiz) return null;
  const correct = picked === quiz.answer;

  const choose = (option: string) => {
    if (picked) return;
    setPicked(option);
    if (option === quiz.answer) playCorrect();
    else playWrong();
  };

  return (
    <Card>
      <h2 className="character__title">Comprueba que lo entiendes</h2>
      <p className="character__note">{quiz.prompt}</p>
      <div className="quiz__options">
        {quiz.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`option${picked ? (option === quiz.answer ? ' is-correct' : option === picked ? ' is-wrong' : ' is-muted') : ''}`}
            onClick={() => choose(option)}
            disabled={picked !== null}
            lang="zh-Hans"
          >
            {option}
          </button>
        ))}
      </div>
      {picked && (
        <p className="character__note">
          {correct ? 'Correcto. ' : 'Casi. '}
          {quiz.explain}
        </p>
      )}
    </Card>
  );
}

export function CharacterSheet({
  data,
  onOpenCharacter,
}: {
  data: CharacterSheetData;
  onOpenCharacter?: (char: string) => void;
}) {
  return (
    <>
      <header className="character__head">
        <div>
          <h1 className="character__hanzi" lang="zh-Hans">
            {data.char}
          </h1>
          <div className="character__speak">
            <AudioButton text={data.char} label={data.char} src={charAudioUrl(data.char)} compact />
            {data.reading && <span className="character__reading">{data.reading}</span>}
          </div>
          {data.meaning && <p className="character__meaning">{data.meaning}</p>}
        </div>
        <Facts data={data} />
      </header>
      <History data={data} />
      <Composition data={data} onOpen={onOpenCharacter} />
      <Examples data={data} />
      <Check data={data} />
      <Words data={data} />
    </>
  );
}
