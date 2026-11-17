import { AudioButton } from './AudioButton';
import { Pinyin } from './Pinyin';
import { audioUrl } from '../lib/audio';
import type { Word } from '../data/curriculum';

function Highlighted({ text, word }: { text: string; word: string }) {
  const index = text.indexOf(word);
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="example__target">{word}</mark>
      {text.slice(index + word.length)}
    </>
  );
}

export function ExampleBlock({ word }: { word: Word }) {
  return (
    <div className="example">
      <div className="example__head">
        <span className="example__label">En contexto</span>
        <AudioButton
          text={word.example.hanzi}
          label="la frase de ejemplo"
          src={audioUrl('examples', word.id)}
          compact
        />
      </div>
      <p className="example__hanzi" lang="zh-Hans">
        <Highlighted text={word.example.hanzi} word={word.hanzi} />
      </p>
      <p className="example__pinyin">
        <Pinyin pinyin={word.example.pinyin} />
      </p>
      <p className="example__translation">{word.example.translation}</p>
    </div>
  );
}
