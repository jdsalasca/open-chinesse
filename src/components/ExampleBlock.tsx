import { AudioButton } from './AudioButton';
import { Pinyin } from './Pinyin';
import { audioUrl } from '../lib/audio';
import type { Word } from '../data/curriculum';

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
        {word.example.hanzi}
      </p>
      <p className="example__pinyin">
        <Pinyin pinyin={word.example.pinyin} />
      </p>
      <p className="example__translation">{word.example.translation}</p>
    </div>
  );
}
