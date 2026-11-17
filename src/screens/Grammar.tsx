import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SessionHeader } from '../components/SessionHeader';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { GRAMMAR_TOPICS, type GrammarItem, type GrammarTopic } from '../data/grammar';
import { failedItems, grammarStage, type GrammarProgress, type GrammarStage } from '../lib/grammar';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

const DAY_MS = 86_400_000;
type Mode = 'practice' | 'check' | 'review';
type Result = { score: number; total: number; failed: string[]; mode: Mode };

function daysUntil(at: number | undefined, now: number): number {
  if (!at) return 0;
  return Math.max(0, Math.ceil((at - now) / DAY_MS));
}

function statusText(
  stage: GrammarStage,
  progress: GrammarProgress | undefined,
  now: number,
): string {
  if (stage === 'scheduled') return `Prueba diferida en ${daysUntil(progress?.checkAt, now)} días`;
  if (stage === 'practice-due') return 'Toca repasar las frases';
  if (stage === 'check-ready') return 'Prueba diferida disponible';
  if (stage === 'checked' && progress?.check) {
    return `Primera prueba: ${progress.check.score}/${progress.check.total}`;
  }
  return 'Sin empezar · 7 frases y una prueba a 7 días';
}

function TopicCard({
  topic,
  progress,
  now,
  onOpen,
}: {
  topic: GrammarTopic;
  progress: GrammarProgress | undefined;
  now: number;
  onOpen: () => void;
}) {
  const stage = grammarStage(progress, now);
  return (
    <button type="button" className="grammar-card" onClick={onOpen}>
      <span className="grammar-card__meta">
        HSK {topic.level} · {topic.practice.length + topic.check.length} ítems
      </span>
      <span className="grammar-card__title">{topic.title}</span>
      <span className="grammar-card__subtitle">{topic.subtitle}</span>
      <span className={`grammar-card__status is-${stage}`}>{statusText(stage, progress, now)}</span>
      <span className="grammar-card__cta">Entrar →</span>
    </button>
  );
}

function Rules({ topic }: { topic: GrammarTopic }) {
  return (
    <section className="grammar-rules" aria-label="Reglas">
      {topic.rules.map((rule) => (
        <article key={rule.title} className="grammar-rule">
          <h2>{rule.title}</h2>
          <p className="grammar-rule__text">{rule.text}</p>
          <ul className="grammar-rule__examples">
            {rule.examples.map((example) => (
              <li key={example.hanzi}>
                <p className="grammar-example__hanzi" lang="zh-Hans">
                  {example.hanzi}
                </p>
                <p className="grammar-example__pinyin">{example.pinyin}</p>
                <p className="grammar-example__translation">{example.translation}</p>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function Contrasts({ topic }: { topic: GrammarTopic }) {
  return (
    <section className="grammar-contrasts" aria-label="Contrastes">
      {topic.contrasts.map((contrast) => (
        <article key={contrast.wrong} className="grammar-contrast">
          <p className="grammar-contrast__wrong">
            <span aria-hidden="true">✗ </span>
            <span lang="zh-Hans">{contrast.wrong}</span>
          </p>
          <p className="grammar-contrast__right">
            <span aria-hidden="true">✓ </span>
            <span lang="zh-Hans">{contrast.right}</span>
          </p>
          <p className="grammar-contrast__why">{contrast.why}</p>
        </article>
      ))}
    </section>
  );
}

function Options({
  item,
  picked,
  onPick,
}: {
  item: GrammarItem;
  picked: number | null;
  onPick: (index: number) => void;
}) {
  return (
    <div className="grammar-item__options" role="group" aria-label="Respuestas">
      {item.options.map((option, index) => {
        const state =
          picked === null
            ? ''
            : option.correct
              ? ' is-correct'
              : picked === index
                ? ' is-wrong'
                : ' is-muted';
        return (
          <button
            key={option.text}
            type="button"
            className={`option${state}`}
            disabled={picked !== null}
            onClick={() => onPick(index)}
          >
            <span lang="zh-Hans">{option.text}</span>
            {option.pinyin && <span className="grammar-option__pinyin">{option.pinyin}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Feedback({ item, picked }: { item: GrammarItem; picked: number }) {
  const answer = item.options.findIndex((option) => option.correct);
  const correct = picked === answer;
  return (
    <p className={`choice__feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
      {correct ? 'Correcto. ' : `Era: ${item.options[answer].text}. `}
      {item.explain}
    </p>
  );
}

function ItemCard({
  item,
  index,
  total,
  label,
  picked,
  onPick,
  onNext,
}: {
  item: GrammarItem;
  index: number;
  total: number;
  label: string;
  picked: number | null;
  onPick: (index: number) => void;
  onNext: () => void;
}) {
  return (
    <Card className="grammar-item">
      <p className="eyebrow">{label}</p>
      <p className="grammar-item__prompt" lang="zh-Hans">
        {item.prompt}
      </p>
      <p className="grammar-item__pinyin">{item.pinyin}</p>
      <p className="grammar-item__translation">{item.translation}</p>
      <Options item={item} picked={picked} onPick={onPick} />
      {picked !== null && (
        <>
          <Feedback item={item} picked={picked} />
          <button type="button" className="button button--primary" onClick={onNext}>
            {index + 1 === total ? 'Ver resultado' : 'Siguiente'}
          </button>
        </>
      )}
    </Card>
  );
}

function PracticeHeader({
  topic,
  index,
  total,
  onExit,
}: {
  topic: GrammarTopic;
  index: number;
  total: number;
  onExit: () => void;
}) {
  return (
    <>
      <SessionHeader label={topic.title} count={`${index + 1} / ${total}`} onExit={onExit} />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <button type="button" className="link grammar__back" onClick={onExit}>
        ← {topic.title}
      </button>
    </>
  );
}

function modeLabel(mode: Mode): string {
  if (mode === 'check') return 'Prueba diferida';
  if (mode === 'review') return 'Repaso de fallos';
  return 'Práctica';
}

type PracticeProps = {
  topic: GrammarTopic;
  items: GrammarItem[];
  mode: Mode;
  onAnswer: (correct: boolean) => void;
  onFinish: (answers: boolean[]) => void;
  onExit: () => void;
};

function Practice({ topic, items, mode, onAnswer, onFinish, onExit }: PracticeProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const item = items[index];
  if (!item) return null;
  const pick = (optionIndex: number) => {
    const correct = Boolean(item.options[optionIndex]?.correct);
    setPicked(optionIndex);
    setAnswers([...answers, correct]);
    onAnswer(correct);
  };
  const next = () => {
    if (index + 1 === items.length) return onFinish(answers);
    setIndex(index + 1);
    setPicked(null);
  };
  return (
    <div className="grammar">
      <PracticeHeader topic={topic} index={index} total={items.length} onExit={onExit} />
      <ItemCard
        item={item}
        index={index}
        total={items.length}
        label={modeLabel(mode)}
        picked={picked}
        onPick={pick}
        onNext={next}
      />
    </div>
  );
}

function failLabel(count: number): string {
  return count === 1 ? 'Repasar el fallo' : `Repasar los ${count} fallos`;
}

function summaryLead(check: boolean): string {
  return check
    ? 'Guardado como tu primera prueba. No cambia tu repaso de palabras: mide si la distinción se mantiene sin práctica inmediata.'
    : 'Repaso programado en 3 días y prueba diferida en 7. Los fallos quedan anotados para repetirlos.';
}

function Summary({
  result,
  onDone,
  onReview,
}: {
  result: Result;
  onDone: () => void;
  onReview: () => void;
}) {
  const check = result.mode === 'check';
  const review = !check && result.failed.length > 0;
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="check" size={28} />
      </span>
      <p className="eyebrow">{check ? 'Prueba diferida' : 'Gramática en contraste'}</p>
      <h1>
        {result.score} de {result.total}
      </h1>
      <p className="scenario-done__lead">{summaryLead(check)}</p>
      <div className="scenario-done__actions">
        {review && (
          <button type="button" className="button button--primary" onClick={onReview}>
            {failLabel(result.failed.length)}
          </button>
        )}
        <button
          type="button"
          className={`button ${review ? 'button--ghost' : 'button--primary'}`}
          onClick={onDone}
        >
          Volver al tema
        </button>
      </div>
    </section>
  );
}

type ProgressPanelProps = {
  progress: GrammarProgress | undefined;
  stage: GrammarStage;
  fails: number;
  now: number;
  onPractice: () => void;
  onCheck: () => void;
  onFails: () => void;
};

function ProgressPanel({
  progress,
  stage,
  fails,
  now,
  onPractice,
  onCheck,
  onFails,
}: ProgressPanelProps) {
  return (
    <section className="grammar-panel" aria-label="Tu progreso">
      <p className="grammar-panel__status">{statusText(stage, progress, now)}</p>
      {progress?.check && (
        <p className="grammar-panel__check">
          Primera prueba: {progress.check.score} de {progress.check.total}. No se repite para no
          maquillar el resultado.
        </p>
      )}
      <div className="grammar-panel__actions">
        <button type="button" className="button button--primary" onClick={onPractice}>
          {progress ? 'Practicar otra vez' : 'Practicar las 7 frases'}
        </button>
        {stage === 'check-ready' && (
          <button type="button" className="button button--primary" onClick={onCheck}>
            Prueba diferida · 5 frases
          </button>
        )}
        {fails > 0 && (
          <button type="button" className="button button--ghost" onClick={onFails}>
            {failLabel(fails)}
          </button>
        )}
      </div>
    </section>
  );
}

type IntroProps = {
  topic: GrammarTopic;
  progress: GrammarProgress | undefined;
  stage: GrammarStage;
  fails: number;
  now: number;
  onPractice: () => void;
  onCheck: () => void;
  onFails: () => void;
  onBack: () => void;
};

function Intro({
  topic,
  progress,
  stage,
  fails,
  now,
  onPractice,
  onCheck,
  onFails,
  onBack,
}: IntroProps) {
  return (
    <div className="grammar">
      <SessionHeader label="Gramática en contraste" count={`HSK ${topic.level}`} onExit={onBack} />
      <button type="button" className="link grammar__back" onClick={onBack}>
        ← Todos los temas
      </button>
      <h1 className="grammar__title">{topic.title}</h1>
      <p className="grammar__summary">{topic.summary}</p>
      <Rules topic={topic} />
      <Contrasts topic={topic} />
      <ProgressPanel
        progress={progress}
        stage={stage}
        fails={fails}
        now={now}
        onPractice={onPractice}
        onCheck={onCheck}
        onFails={onFails}
      />
    </div>
  );
}

type TopicSessionProps = {
  topic: GrammarTopic;
  mode: Mode;
  items: GrammarItem[];
  onExit: () => void;
  onMode: (mode: Mode) => void;
};

function TopicSession({ topic, mode, items, onExit, onMode }: TopicSessionProps) {
  const savePractice = useLearner((state) => state.saveGrammarPractice);
  const saveCheck = useLearner((state) => state.saveGrammarCheck);
  const logActivity = useLearner((state) => state.logActivity);
  const [result, setResult] = useState<Result | null>(null);
  const finish = (answers: boolean[]) => {
    const failed = items.filter((_, index) => !answers[index]).map((item) => item.id);
    const score = answers.filter(Boolean).length;
    if (mode === 'check') saveCheck(topic.id, score, answers.length);
    else savePractice(topic.id, failed);
    setResult({ score, total: answers.length, failed, mode });
  };
  if (result) {
    return (
      <Summary
        result={result}
        onDone={onExit}
        onReview={() => {
          setResult(null);
          onMode('review');
        }}
      />
    );
  }
  return (
    <Practice
      topic={topic}
      items={items}
      mode={mode}
      onAnswer={(correct) => {
        logActivity('grammar', correct);
      }}
      onFinish={finish}
      onExit={onExit}
    />
  );
}

function TopicView({ topic, onBack }: { topic: GrammarTopic; onBack: () => void }) {
  const progress = useLearner((state) => state.grammar[topic.id]);
  const [mode, setMode] = useState<'intro' | Mode>('intro');
  const fails = failedItems(topic, progress);
  const stage = grammarStage(progress, Date.now());
  if (mode === 'intro') {
    return (
      <Intro
        topic={topic}
        progress={progress}
        stage={stage}
        fails={fails.length}
        now={Date.now()}
        onPractice={() => setMode('practice')}
        onCheck={() => setMode('check')}
        onFails={() => setMode('review')}
        onBack={onBack}
      />
    );
  }
  const items = mode === 'check' ? topic.check : mode === 'review' ? fails : topic.practice;
  return (
    <TopicSession
      key={mode}
      topic={topic}
      mode={mode}
      items={items}
      onExit={() => setMode('intro')}
      onMode={setMode}
    />
  );
}

export function Grammar({ topicId }: { topicId?: string }) {
  const grammar = useLearner((state) => state.grammar);
  const topic = GRAMMAR_TOPICS.find((item) => item.id === topicId);
  if (topic)
    return <TopicView key={topic.id} topic={topic} onBack={() => navigate('/gramatica')} />;
  return (
    <section className="grammar-list">
      <PageHeader
        eyebrow="Gramática en contraste"
        title="Entiende por qué, no solo cuál"
        lead="Una distinción por tema, ejemplos que la muestran y una prueba diferida para comprobar que se quedó."
      />
      <div className="grammar-grid">
        {GRAMMAR_TOPICS.map((item) => (
          <TopicCard
            key={item.id}
            topic={item}
            progress={grammar[item.id]}
            now={Date.now()}
            onOpen={() => navigate(`/gramatica/${item.id}`)}
          />
        ))}
      </div>
      <p className="grammar-list__note">
        Cada tema reserva 5 frases nuevas para la prueba de los 7 días.
      </p>
    </section>
  );
}
