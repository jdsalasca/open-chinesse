import { AudioButton } from '../AudioButton';
import { audioUrl } from '../../lib/audio';
import type { ScenarioLine } from '../../data/scenarios';
import type { Aids } from './aids';

function BubbleText({ line, aids }: { line: ScenarioLine; aids: Aids }) {
  return (
    <>
      {aids.pinyin && <p className="bubble__pinyin">{line.pinyin}</p>}
      {aids.translation && <p className="bubble__translation">{line.translation}</p>}
    </>
  );
}

export function Bubble({
  line,
  audioId,
  mine = false,
  aids,
}: {
  line: ScenarioLine;
  audioId?: string;
  mine?: boolean;
  aids: Aids;
}) {
  return (
    <div className={`bubble${mine ? ' bubble--mine' : ''}`}>
      <div className="bubble__head">
        <p className="bubble__hanzi" lang="zh-Hans">
          {line.hanzi}
        </p>
        {!mine && audioId && (
          <AudioButton
            text={line.hanzi}
            label="la frase"
            src={audioUrl('scenarios', audioId)}
            compact
          />
        )}
      </div>
      <BubbleText line={line} aids={aids} />
    </div>
  );
}
