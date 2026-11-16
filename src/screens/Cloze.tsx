import { useMemo, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { SessionHeader } from '../components/SessionHeader';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { audioUrl } from '../lib/audio';
import {
  checkCloze,
  isClozeCorrect,
  makeCloze,
  type ClozeQuestion,
  type ClozeResult,
} from '../lib/cloze';
import { navigate } from '../lib/router';
import { useEnterKey, useFocusOnMount } from '../lib/hooks';
import { useLearner } from '../store/useLearner';

const VERDICTS: Record<ClozeResult, string> = {
  hanzi: 'Correcto.',
  ok: 'Correcto, con los tonos.',
  'sin-tonos': 'Correcto. La próxima vez, añade los tonos.',
  tonos: 'Las sílabas están bien, pero el tono no.',
  mal: 'No es esa palabra.',
  vacio: '',
};

function Sentence({ prompt }: { prompt: string }) {
  const [before, after] = prompt.split('＿＿');
  return (
    <p className="cloze__sentence" lang="zh-Hans">
      {before}
      <span className="cloze__blank">＿＿</span>
      {after}
    </p>
  );
}

function Feedback({ question }: { question: ClozeQuestion }) {
  return (
    <div className="example">
      <div className="example__head">
        <span className="example__label">La frase completa</span>
        <AudioButton
          text={question.exampleHanzi}
          label="la frase"
          src={audioUrl('examples', question.wordId)}
          compact
        />
      </div>
      <p className="example__hanzi" lang="zh-Hans">
        {question.exampleHanzi}
      </p>
      <p className="example__pinyin">{question.examplePinyin}</p>
      <p className="example__translation">{question.translation}</p>
    </div>
  );
}

function Summary({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="check" size={28} />
      </span>
      <p className="eyebrow">En contexto</p>
      <h1>
        {score} de {total}
      </h1>
      <p className="scenario-done__lead">
        Completaste frases reales con la palabra que faltaba. Esto no cambia tu calendario de
        repaso: mide lo que puedes producir con contexto.
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

function Empty() {
  return (
    <section className="empty">
      <h1>Aún no hay frases para practicar</h1>
      <p>Termina una unidad: sus palabras ya traen ejemplos y audio.</p>
      <div className="empty__actions">
        <button type="button" className="button button--primary" onClick={() => navigate('/')}>
          Ir a las unidades
        </button>
      </div>
    </section>
  );
}

function ClozeForm({
  question,
  onCheck,
}: {
  question: ClozeQuestion;
  onCheck: (result: ClozeResult, typed: string) => void;
}) {
  const [typed, setTyped] = useState('');
  const inputRef = useFocusOnMount<HTMLInputElement>();
  return (
    <form
      className="typed"
      onSubmit={(event) => {
        event.preventDefault();
        onCheck(checkCloze(typed, question), typed);
      }}
    >
      <label htmlFor="cloze-input" className="typed__label">
        La palabra que falta
      </label>
      <div className="typed__row">
        <input
          id="cloze-input"
          ref={inputRef}
          className="typed__input"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          placeholder="pinyin o carácter"
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

function BeforeAnswer({
  question,
  onCheck,
  onReveal,
}: {
  question: ClozeQuestion;
  onCheck: (result: ClozeResult, typed: string) => void;
  onReveal: () => void;
}) {
  const [hint, setHint] = useState(false);
  return (
    <>
      <ClozeForm question={question} onCheck={onCheck} />
      <div className="cloze__actions">
        <button type="button" className="link" onClick={() => setHint(true)}>
          Ver una pista
        </button>
        <button type="button" className="link" onClick={onReveal}>
          No lo sé
        </button>
      </div>
      {hint && (
        <p className="cloze__hint">
          Significa «{question.meaning}». Aun así, escribe el pinyin o el carácter.
        </p>
      )}
    </>
  );
}

function AfterAnswer({
  question,
  result,
  typed,
  last,
  onNext,
}: {
  question: ClozeQuestion;
  result: ClozeResult;
  typed: string;
  last: boolean;
  onNext: () => void;
}) {
  const correct = isClozeCorrect(result);
  useEnterKey(onNext);
  return (
    <>
      <div className={`cloze__result${correct ? ' is-ok' : ' is-bad'}`}>
        <p className="cloze__verdict">{VERDICTS[result]}</p>
        {!correct && typed.trim() && <p className="cloze__typed">Escribiste «{typed.trim()}».</p>}
        <p className="cloze__answer" lang="zh-Hans">
          {question.hanzi} <span>{question.pinyin}</span>
        </p>
        <p className="cloze__meaning">{question.meaning}</p>
      </div>
      <Feedback question={question} />
      <div className="chat__advance">
        <button type="button" className="button button--primary" onClick={onNext}>
          {last ? 'Ver resultado' : 'Siguiente'}
        </button>
      </div>
    </>
  );
}

function PendingAnswer({
  question,
  onResult,
}: {
  question: ClozeQuestion;
  onResult: (result: ClozeResult, typed: string) => void;
}) {
  return (
    <>
      <Sentence prompt={question.prompt} />
      <BeforeAnswer
        question={question}
        onCheck={(outcome, value) => onResult(outcome, value)}
        onReveal={() => onResult('mal', '')}
      />
    </>
  );
}

function Question({
  question,
  index,
  total,
  onDone,
}: {
  question: ClozeQuestion;
  index: number;
  total: number;
  onDone: (correct: boolean) => void;
}) {
  const [result, setResult] = useState<ClozeResult | null>(null);
  const [typed, setTyped] = useState('');

  return (
    <Card className="cloze__card">
      <p className="eyebrow">Completa la frase</p>
      <p className="cloze__translation">{question.translation}</p>
      {result === null ? (
        <PendingAnswer
          question={question}
          onResult={(outcome, value) => {
            setResult(outcome);
            setTyped(value);
          }}
        />
      ) : (
        <AfterAnswer
          question={question}
          result={result}
          typed={typed}
          last={index + 1 === total}
          onNext={() => onDone(isClozeCorrect(result))}
        />
      )}
    </Card>
  );
}

export function Cloze() {
  const log = useLearner((state) => state.log);
  const [seed, setSeed] = useState(() => Date.now() % 1_000_000);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const studied = useMemo(() => [...new Set(log.map((entry) => entry.wordId))], [log]);
  const questions = useMemo(() => makeCloze(studied, seed, 6), [studied, seed]);

  const retry = () => {
    setSeed(Date.now() % 1_000_000);
    setIndex(0);
    setScore(0);
  };

  if (questions.length === 0) return <Empty />;
  if (index >= questions.length) {
    return <Summary score={score} total={questions.length} onRetry={retry} />;
  }

  const question = questions[index];
  return (
    <div className="cloze">
      <SessionHeader
        label="En contexto"
        count={`${index + 1} / ${questions.length}`}
        onExit={() => navigate('/practicar')}
      />
      <Question
        key={`${question.wordId}-${seed}`}
        question={question}
        index={index}
        total={questions.length}
        onDone={(correct) => {
          useLearner.getState().logActivity('cloze', correct);
          if (correct) setScore(score + 1);
          setIndex(index + 1);
        }}
      />
    </div>
  );
}
