import { useMemo, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { Card } from '../components/ui/Card';
import { ALL_WORDS, WORDS_BY_ID } from '../data/curriculum';
import { audioUrl } from '../lib/audio';
import { navigate } from '../lib/router';
import { playCorrect, playWrong } from '../lib/sfx';
import { makeToneQuiz, type ToneQuestion } from '../lib/tone-quiz';

function Summary({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  return (
    <Card className="tones__summary">
      <p className="eyebrow">Tonos</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="tones__lead">
        {score === total
          ? 'Oído fino. Los tonos ya no te engañan.'
          : 'Los tonos se entrenan: repite y verás cómo mejora la discriminación.'}
      </p>
      <div className="tones__actions">
        <button type="button" className="button button--primary" onClick={onRetry}>
          Otra tanda
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => navigate('/practicar')}
        >
          Volver a Practicar
        </button>
      </div>
    </Card>
  );
}

function Options({
  options,
  answer,
  picked,
  onPick,
}: {
  options: string[];
  answer: string;
  picked: string | null;
  onPick: (option: string) => void;
}) {
  return (
    <div className="tones__options">
      {options.map((option) => {
        const state = picked
          ? option === answer
            ? ' is-correct'
            : option === picked
              ? ' is-wrong'
              : ' is-muted'
          : '';
        return (
          <button
            key={option}
            type="button"
            className={`option${state}`}
            onClick={() => onPick(option)}
            disabled={picked !== null}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Feedback({
  word,
  last,
  onNext,
}: {
  word: { hanzi: string; pinyin: string; meaning: string };
  last: boolean;
  onNext: () => void;
}) {
  return (
    <div className="tones__feedback">
      <p>
        <span lang="zh-Hans">{word.hanzi}</span> · {word.pinyin} · {word.meaning}
      </p>
      <button type="button" className="button button--primary" onClick={onNext} autoFocus>
        {last ? 'Ver resultado' : 'Siguiente'}
      </button>
    </div>
  );
}

function Bar({ index, total }: { index: number; total: number }) {
  return (
    <div className="lesson__bar">
      <span className="lesson__label">Tonos · escucha y elige</span>
      <span className="lesson__count">
        {index + 1} / {total}
      </span>
    </div>
  );
}

function Question({
  item,
  index,
  total,
  onAnswer,
}: {
  item: ToneQuestion;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const word = WORDS_BY_ID.get(item.wordId);
  if (!word) return null;

  const choose = (option: string) => {
    if (picked) return;
    setPicked(option);
    if (option === item.answer) playCorrect();
    else playWrong();
  };

  return (
    <div className="tones">
      <Bar index={index} total={total} />

      <Card className="tones__card">
        <p className="tones__lead">Escucha y elige el pinyin con sus tonos.</p>
        <div className="tones__audio">
          <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
        </div>
        <Options options={item.options} answer={item.answer} picked={picked} onPick={choose} />
        {picked && (
          <Feedback
            word={word}
            last={index + 1 === total}
            onNext={() => onAnswer(picked === item.answer)}
          />
        )}
      </Card>
    </div>
  );
}

export function Tones() {
  const [round, setRound] = useState(0);
  const quiz = useMemo(() => makeToneQuiz(ALL_WORDS, 10, 7 + round * 13), [round]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  if (index >= quiz.length) {
    return (
      <Summary
        score={score}
        total={quiz.length}
        onRetry={() => {
          setRound(round + 1);
          setIndex(0);
          setScore(0);
        }}
      />
    );
  }

  return (
    <Question
      key={quiz[index].wordId}
      item={quiz[index]}
      index={index}
      total={quiz.length}
      onAnswer={(correct) => {
        if (correct) setScore(score + 1);
        setIndex(index + 1);
      }}
    />
  );
}
