import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { SessionHeader } from '../components/SessionHeader';
import { WORDS_BY_ID } from '../data/curriculum';
import { makeCheck, isDue, optionState } from '../lib/check';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

function Result({ score, total }: { score: number; total: number }) {
  return (
    <Card className="check__card">
      <p className="eyebrow">Retención</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="check__lead">
        Esta prueba no cambia tu calendario: mide lo que recuerdas sin pistas. Si sale baja, el
        repaso normal volverá a traerlas.
      </p>
      <button type="button" className="button button--primary" onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </Card>
  );
}

function OptionList({
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
    <div className="check__options">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`option${optionState(option, picked, answer)}`}
          disabled={picked !== null}
          onClick={() => onPick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Bar({ index, total }: { index: number; total: number }) {
  return (
    <SessionHeader
      label="Prueba de retención · sin pistas"
      count={`${index + 1} / ${total}`}
      onExit={() => navigate('/practicar')}
    />
  );
}

function RetentionQuiz({
  wordIds,
  onFinish,
}: {
  wordIds: string[];
  onFinish: (score: number) => void;
}) {
  const questions = useMemo(() => makeCheck(wordIds), [wordIds]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const question = questions[index];
  const { options, answer } = question;
  const pick = (option: string) => {
    setPicked(option);
    if (option === answer) setScore(score + 1);
  };
  const next = () => {
    if (index + 1 >= questions.length) return onFinish(score);
    setPicked(null);
    setIndex(index + 1);
  };
  return (
    <div className="check">
      <Bar index={index} total={questions.length} />
      <Card className="check__card">
        <p className="check__hanzi" lang="zh-Hans">
          {WORDS_BY_ID.get(question.wordId)?.hanzi}
        </p>
        <p className="check__lead">¿Qué significa?</p>
        <OptionList options={options} answer={answer} picked={picked} onPick={pick} />
        {picked && (
          <button type="button" className="button button--primary" onClick={next} autoFocus>
            {index + 1 === questions.length ? 'Ver resultado' : 'Siguiente'}
          </button>
        )}
      </Card>
    </div>
  );
}

export function Check() {
  const retention = useLearner((state) => state.retention);
  const record = useLearner((state) => state.recordRetention);
  const [now] = useState(Date.now);

  if (!retention) {
    return (
      <Card className="check__card">
        <h1>Aún no hay prueba</h1>
        <p className="check__lead">Se programa sola a los diez primeros repasos.</p>
      </Card>
    );
  }
  if (retention.takenAt) {
    return <Result score={retention.score ?? 0} total={retention.wordIds.length} />;
  }
  if (!isDue(retention, now)) {
    const date = new Date(retention.dueAt).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
    return (
      <Card className="check__card">
        <p className="eyebrow">Retención</p>
        <h1>Todavía no toca</h1>
        <p className="check__lead">
          Se programó al llegar a diez repasos y mide lo que queda siete días después. Vuelve el{' '}
          {date}.
        </p>
        <button
          type="button"
          className="button button--primary"
          onClick={() => navigate('/review')}
        >
          Seguir repasando
        </button>
      </Card>
    );
  }
  return <RetentionQuiz wordIds={retention.wordIds} onFinish={record} />;
}
