import { useState } from 'react';
import { useEnterKey } from '../lib/hooks';
import { playCorrect, playWrong } from '../lib/sfx';

type Props = {
  chunks: string[];
  sentence: string;
  translation: string;
  last: boolean;
  onNext: (correct: boolean) => void;
};

function OrderPiece({ chunk, onPick }: { chunk: string; onPick: () => void }) {
  return (
    <button type="button" className="order__piece" onClick={onPick} lang="zh-Hans">
      {chunk}
    </button>
  );
}

function AnswerLine({ placed, onRemove }: { placed: string[]; onRemove: (chunk: string) => void }) {
  return (
    <div className="order__answer" aria-live="polite">
      {placed.length === 0 ? (
        <span className="order__placeholder">Toca las piezas en orden</span>
      ) : (
        placed.map((chunk) => (
          <OrderPiece key={chunk} chunk={chunk} onPick={() => onRemove(chunk)} />
        ))
      )}
    </div>
  );
}

function OrderResult({
  sentence,
  translation,
  correct,
  last,
  onNext,
}: {
  sentence: string;
  translation: string;
  correct: boolean;
  last: boolean;
  onNext: () => void;
}) {
  useEnterKey(onNext);
  return (
    <div className="order">
      <p className="order__sentence" lang="zh-Hans">
        {sentence}
      </p>
      <p className="order__translation">{translation}</p>
      <p className={`order__result${correct ? '' : ' is-wrong'}`}>
        {correct ? 'Correcto.' : 'El orden era otro.'}
      </p>
      <button type="button" className="button button--primary" onClick={onNext}>
        {last ? 'Terminar' : 'Siguiente'}
      </button>
    </div>
  );
}

function CheckButton({ ready, onCheck }: { ready: boolean; onCheck: () => void }) {
  return (
    <button type="button" className="button button--primary" disabled={!ready} onClick={onCheck}>
      Comprobar
    </button>
  );
}

export function OrderExercise({ chunks, sentence, translation, last, onNext }: Props) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const pool = chunks.filter((chunk) => !placed.includes(chunk));

  if (result !== null) {
    return (
      <OrderResult
        sentence={sentence}
        translation={translation}
        correct={result}
        last={last}
        onNext={() => onNext(result)}
      />
    );
  }

  const check = () => {
    const correct = placed.join('') === sentence;
    setResult(correct);
    if (correct) playCorrect();
    else playWrong();
  };

  return (
    <div className="order">
      <p className="order__hint">Ordena: «{translation}»</p>
      <AnswerLine
        placed={placed}
        onRemove={(chunk) => setPlaced(placed.filter((item) => item !== chunk))}
      />
      <div className="order__pool">
        {pool.map((chunk) => (
          <OrderPiece key={chunk} chunk={chunk} onPick={() => setPlaced([...placed, chunk])} />
        ))}
      </div>
      <CheckButton ready={placed.length === chunks.length} onCheck={check} />
    </div>
  );
}
