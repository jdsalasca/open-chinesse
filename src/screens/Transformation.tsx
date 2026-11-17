import { useState } from 'react';
import { SessionHeader } from '../components/SessionHeader';
import { Card } from '../components/ui/Card';
import { Pinyin } from '../components/Pinyin';
import { dayKey } from '../store/metrics';
import { useLearner } from '../store/useLearner';
import { pickTransformations } from '../lib/transformation-quiz';
import type { Transformation, TransformOption } from '../data/transformations';
import { navigate } from '../lib/router';

function BaseCard({ item }: { item: Transformation }) {
  return (
    <Card className="transform__base">
      <p className="eyebrow">Frase de partida</p>
      <p className="transform__hanzi" lang="zh-Hans">
        {item.base.hanzi}
      </p>
      <Pinyin pinyin={item.base.pinyin} className="transform__pinyin" />
      <p className="transform__translation">{item.base.translation}</p>
      <p className="transform__intent">
        <span>Quieres decir</span>
        {item.intent}
      </p>
    </Card>
  );
}

function Options({
  item,
  picked,
  onPick,
}: {
  item: Transformation;
  picked: TransformOption | null;
  onPick: (option: TransformOption) => void;
}) {
  return (
    <div className="transform__options" role="group" aria-label="Transformaciones">
      {item.options.map((option) => {
        const state =
          picked === null
            ? ''
            : option.correct
              ? ' is-correct'
              : option === picked
                ? ' is-wrong'
                : ' is-muted';
        return (
          <button
            key={option.hanzi}
            type="button"
            className={`option${state}`}
            disabled={picked !== null}
            onClick={() => onPick(option)}
          >
            <span lang="zh-Hans">{option.hanzi}</span>
            <span className="transform__option-pinyin">{option.pinyin}</span>
          </button>
        );
      })}
    </div>
  );
}

function Feedback({ item, picked }: { item: Transformation; picked: TransformOption }) {
  return (
    <p className={`choice__feedback ${picked.correct ? 'is-correct' : 'is-wrong'}`} role="status">
      {picked.correct ? 'Correcto. ' : `Era: ${item.options.find((o) => o.correct)?.hanzi} `}
      {item.explain}
    </p>
  );
}

function Summary({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  return (
    <section className="scenario-done">
      <p className="eyebrow">Cambia la intención</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="scenario-done__lead">
        Cambiaste el tiempo, la negación o la persona sin cambiar lo demás. Eso es transferencia:
        usar la forma que pide la intención.
      </p>
      <div className="scenario-done__actions">
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
    </section>
  );
}

function useTransformationQuiz() {
  const [items, setItems] = useState(() => pickTransformations(dayKey(Date.now())));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<TransformOption | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const logActivity = useLearner((state) => state.logActivity);
  const item = items[index];
  const choose = (option: TransformOption) => {
    if (!item || picked) return;
    setPicked(option);
    setAnswers([...answers, option.correct]);
    logActivity('transform', option.correct);
  };
  const next = () => {
    setIndex(index + 1);
    setPicked(null);
  };
  const restart = () => {
    setItems(pickTransformations(String(Date.now())));
    setIndex(0);
    setPicked(null);
    setAnswers([]);
  };
  return { items, index, picked, answers, item, choose, next, restart };
}

export function Transformation() {
  const { items, index, picked, answers, item, choose, next, restart } = useTransformationQuiz();
  if (!item) {
    return (
      <Summary score={answers.filter(Boolean).length} total={answers.length} onRetry={restart} />
    );
  }
  return (
    <div className="transform">
      <SessionHeader
        label="Cambia la intención"
        count={`${index + 1} / ${items.length}`}
        onExit={() => navigate('/practicar')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / items.length) * 100}%` }} />
      </div>
      <BaseCard item={item} />
      <Options item={item} picked={picked} onPick={choose} />
      {picked && (
        <>
          <Feedback item={item} picked={picked} />
          <button type="button" className="button button--primary" onClick={next}>
            {index + 1 === items.length ? 'Ver resultado' : 'Siguiente'}
          </button>
        </>
      )}
    </div>
  );
}
