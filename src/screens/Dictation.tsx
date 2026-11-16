import { useMemo, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { SessionHeader } from '../components/SessionHeader';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { audioUrl } from '../lib/audio';
import type { ClozeResult } from '../lib/cloze';
import {
  checkDictation,
  isDictationCorrect,
  makeDictation,
  type DictationQuestion,
} from '../lib/dictation';
import { useEnterKey, useFocusOnMount } from '../lib/hooks';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

function AnswerForm({
  question,
  onCheck,
}: {
  question: DictationQuestion;
  onCheck: (result: ClozeResult, typed: string) => void;
}) {
  const [typed, setTyped] = useState('');
  const inputRef = useFocusOnMount<HTMLInputElement>();
  return (
    <form
      className="typed"
      onSubmit={(event) => {
        event.preventDefault();
        if (typed.trim()) onCheck(checkDictation(typed, question), typed);
      }}
    >
      <label htmlFor="dictation-input" className="typed__label">
        Escribe lo que oyes
      </label>
      <div className="typed__row">
        <input
          id="dictation-input"
          ref={inputRef}
          className="typed__input"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          placeholder="hanzi o pinyin"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button type="submit" className="button button--primary" disabled={!typed.trim()}>
          Comprobar
        </button>
      </div>
    </form>
  );
}

function AnswerResult({
  question,
  result,
  typed,
  last,
  onNext,
}: {
  question: DictationQuestion;
  result: ClozeResult;
  typed: string;
  last: boolean;
  onNext: () => void;
}) {
  const correct = isDictationCorrect(result);
  useEnterKey(onNext);
  return (
    <div className="dictation__answer">
      <p className={`choice__feedback ${correct ? 'is-correct' : 'is-wrong'}`}>
        {correct ? 'Correcto.' : 'Todavía no.'} Era <strong lang="zh-Hans">{question.hanzi}</strong>{' '}
        · {question.pinyin} · {question.meaning}.
        {!correct && typed.trim() && ` Escribiste «${typed.trim()}».`}
      </p>
      <button type="button" className="button button--primary" onClick={onNext}>
        {last ? 'Ver resultado' : 'Siguiente'}
      </button>
    </div>
  );
}

function QuestionCard({
  item,
  result,
  typed,
  last,
  onCheck,
  onNext,
}: {
  item: DictationQuestion;
  result: ClozeResult | null;
  typed: string;
  last: boolean;
  onCheck: (result: ClozeResult, typed: string) => void;
  onNext: () => void;
}) {
  return (
    <Card className="dictation__card">
      <p className="dictation__lead">Escucha la palabra y escríbela en hanzi o pinyin.</p>
      <AudioButton text={item.hanzi} label="la palabra" src={audioUrl('words', item.id)} />
      {result === null ? (
        <AnswerForm question={item} onCheck={onCheck} />
      ) : (
        <AnswerResult question={item} result={result} typed={typed} last={last} onNext={onNext} />
      )}
    </Card>
  );
}

function Question({
  item,
  index,
  total,
  onAnswer,
}: {
  item: DictationQuestion;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [result, setResult] = useState<ClozeResult | null>(null);
  const [typed, setTyped] = useState('');
  const last = index + 1 === total;
  return (
    <div className="dictation">
      <SessionHeader
        label="Dictado · escucha y escribe"
        count={`${index + 1} / ${total}`}
        onExit={() => navigate('/practicar')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <QuestionCard
        item={item}
        result={result}
        typed={typed}
        last={last}
        onCheck={(outcome, value) => {
          setResult(outcome);
          setTyped(value);
        }}
        onNext={() => onAnswer(result !== null && isDictationCorrect(result))}
      />
    </div>
  );
}

function Empty() {
  return (
    <section className="empty">
      <h1>Aún no hay palabras para dictar</h1>
      <p>Termina una unidad: sus palabras ya traen audio para escucharlas y escribirlas.</p>
      <div className="empty__actions">
        <button type="button" className="button button--primary" onClick={() => navigate('/')}>
          Ir a las unidades
        </button>
      </div>
    </section>
  );
}

function Summary({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="check" size={28} />
      </span>
      <p className="eyebrow">Dictado</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="scenario-done__lead">
        Escribir lo que oyes fija la forma de la palabra. Esto no cambia tu calendario de repaso.
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

export function Dictation() {
  const log = useLearner((s) => s.log);
  const studied = useMemo(() => [...new Set(log.map((entry) => entry.wordId))], [log]);
  const [seed, setSeed] = useState(() => Date.now() % 1_000_000);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const questions = useMemo(() => makeDictation(studied, seed, 10), [studied, seed]);

  if (questions.length === 0) return <Empty />;
  if (index >= questions.length) {
    return (
      <Summary
        score={score}
        total={questions.length}
        onRetry={() => {
          setSeed(Date.now() % 1_000_000);
          setIndex(0);
          setScore(0);
        }}
      />
    );
  }

  return (
    <Question
      key={`${seed}-${index}`}
      item={questions[index]}
      index={index}
      total={questions.length}
      onAnswer={(correct) => {
        useLearner.getState().logActivity('dictation', correct);
        if (correct) setScore(score + 1);
        setIndex(index + 1);
      }}
    />
  );
}
