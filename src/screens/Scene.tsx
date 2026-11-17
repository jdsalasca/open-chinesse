import { useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { Pinyin } from '../components/Pinyin';
import { SessionHeader } from '../components/SessionHeader';
import { Card } from '../components/ui/Card';
import { MICRO_STORIES } from '../data/micro';
import { audioUrl } from '../lib/audio';
import { pickSceneQuestions } from '../lib/scene-quiz';
import { navigate } from '../lib/router';
import { dayKey } from '../store/metrics';
import { useLearner } from '../store/useLearner';
import type { SceneQuestion } from '../data/scenes';
import type { Line } from '../data/stories';

type Result = { summary: boolean; evidence: boolean };
type Phase = 'read' | 'evidence' | 'done';

function LineText({
  line,
  phase,
  index,
  onPick,
}: {
  line: Line;
  phase: 'read' | 'evidence' | 'done';
  index: number;
  onPick: (index: number) => void;
}) {
  if (phase !== 'evidence') {
    return (
      <p className="scene__line-text" lang="zh-Hans">
        {line.hanzi}
      </p>
    );
  }
  return (
    <button type="button" className="scene__line-text" onClick={() => onPick(index)} lang="zh-Hans">
      {line.hanzi}
    </button>
  );
}

function LineHead({
  line,
  audioId,
  phase,
  correct,
  index,
  onPick,
}: {
  line: Line;
  audioId: string;
  phase: 'read' | 'evidence' | 'done';
  correct: boolean;
  index: number;
  onPick: (index: number) => void;
}) {
  return (
    <div className="scene__line-head">
      <AudioButton text={line.hanzi} label="la línea" src={audioUrl('stories', audioId)} compact />
      <LineText line={line} phase={phase} index={index} onPick={onPick} />
      {correct && <span className="scene__line-badge">justifica</span>}
    </div>
  );
}

function SceneLine({
  line,
  index,
  audioId,
  phase,
  picked,
  evidence,
  revealed,
  onPick,
}: {
  line: Line;
  index: number;
  audioId: string;
  phase: 'read' | 'evidence' | 'done';
  picked: number | null;
  evidence: number;
  revealed: boolean;
  onPick: (index: number) => void;
}) {
  const correct = revealed && index === evidence;
  const wrong = revealed && picked === index && index !== evidence;
  return (
    <li className={`scene__line${correct ? ' is-correct' : ''}${wrong ? ' is-wrong' : ''}`}>
      <LineHead
        line={line}
        audioId={audioId}
        phase={phase}
        correct={correct}
        index={index}
        onPick={onPick}
      />
      {revealed && (
        <>
          <Pinyin pinyin={line.pinyin} className="scene__line-pinyin" />
          <p className="scene__line-translation">{line.translation}</p>
        </>
      )}
    </li>
  );
}

function SceneLines({
  round,
  story,
  phase,
  picked,
  revealed,
  onPick,
}: {
  round: SceneQuestion;
  story: { id: string; lines: Line[] };
  phase: 'read' | 'evidence' | 'done';
  picked: number | null;
  revealed: boolean;
  onPick: (index: number) => void;
}) {
  return (
    <ol className="scene__lines">
      {story.lines.map((line, index) => (
        <SceneLine
          key={line.hanzi}
          line={line}
          index={index}
          audioId={`${story.id}-${String(index + 1).padStart(2, '0')}`}
          phase={phase}
          picked={picked}
          evidence={round.evidence}
          revealed={revealed}
          onPick={onPick}
        />
      ))}
    </ol>
  );
}

function Story({
  round,
  phase,
  picked,
  revealed,
  onPick,
}: {
  round: SceneQuestion;
  phase: 'read' | 'evidence' | 'done';
  picked: number | null;
  revealed: boolean;
  onPick: (index: number) => void;
}) {
  const story = MICRO_STORIES.find((candidate) => candidate.id === round.storyId);
  if (!story) return null;
  const hint =
    phase === 'read'
      ? 'Escucha o lee y fíjate en lo que pasa.'
      : phase === 'evidence'
        ? 'Ahora señala la frase que justifica tu respuesta.'
        : 'Esta es la frase que lo justifica.';
  return (
    <Card className="scene__story">
      <p className="eyebrow">La escena</p>
      <h1 className="scene__title">{story.title}</h1>
      <p className="scene__note">{story.note}</p>
      <p className="scene__hint">{hint}</p>
      <SceneLines
        round={round}
        story={story}
        phase={phase}
        picked={picked}
        revealed={revealed}
        onPick={onPick}
      />
    </Card>
  );
}

function SceneOptions({
  round,
  picked,
  onPick,
}: {
  round: SceneQuestion;
  picked: number | null;
  onPick: (index: number) => void;
}) {
  return (
    <div className="scene__options" role="group" aria-label="Respuestas">
      {round.options.map((option, index) => {
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
            {option.text}
          </button>
        );
      })}
    </div>
  );
}

function Question({
  round,
  picked,
  evidenceDone,
  onPick,
}: {
  round: SceneQuestion;
  picked: number | null;
  evidenceDone: boolean;
  onPick: (index: number) => void;
}) {
  const answer = round.options.findIndex((option) => option.correct);
  return (
    <Card className="scene__quiz">
      <h2>{round.prompt}</h2>
      <SceneOptions round={round} picked={picked} onPick={onPick} />
      {picked !== null && (
        <p className={`choice__feedback ${picked === answer ? 'is-correct' : 'is-wrong'}`}>
          {picked === answer ? 'Correcto. ' : `Era: ${round.options[answer].text} `}
          {evidenceDone ? '' : 'Ahora busca la línea que lo justifica.'}
        </p>
      )}
    </Card>
  );
}

function EvidenceFeedback({
  round,
  story,
  picked,
  onNext,
  last,
}: {
  round: SceneQuestion;
  story: { lines: Line[] };
  picked: number;
  onNext: () => void;
  last: boolean;
}) {
  const correct = picked === round.evidence;
  return (
    <Card className="scene__evidence">
      <p className={`choice__feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
        {correct
          ? 'Evidencia correcta. '
          : `La frase que lo justifica es la ${round.evidence + 1}. `}
        {round.explain}
      </p>
      <p className="scene__quote" lang="zh-Hans">
        {story.lines[round.evidence]?.hanzi}
      </p>
      <button type="button" className="button button--primary" onClick={onNext}>
        {last ? 'Ver resultado' : 'Siguiente escena'}
      </button>
    </Card>
  );
}

function Summary({
  summary,
  evidence,
  total,
  onRetry,
}: {
  summary: number;
  evidence: number;
  total: number;
  onRetry: () => void;
}) {
  return (
    <section className="scenario-done">
      <p className="eyebrow">¿Qué pasó en la escena?</p>
      <h1>
        {summary} de {total}
      </h1>
      <p className="scenario-done__lead">
        Resumen correcto y evidencia: {evidence} de {total}. Entender no es adivinar: la frase que
        lo justifica es parte de la respuesta.
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

function useSceneProgress() {
  const [items, setItems] = useState(() => pickSceneQuestions(dayKey(Date.now())));
  const [index, setIndex] = useState(0);
  const [summaryPick, setSummaryPick] = useState<number | null>(null);
  const [evidencePick, setEvidencePick] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const logActivity = useLearner((state) => state.logActivity);
  return {
    items,
    setItems,
    index,
    setIndex,
    summaryPick,
    setSummaryPick,
    evidencePick,
    setEvidencePick,
    results,
    setResults,
    logActivity,
  };
}

function useSceneQuiz() {
  const progress = useSceneProgress();
  const round = progress.items[progress.index];
  const story = round
    ? MICRO_STORIES.find((candidate) => candidate.id === round.storyId)
    : undefined;
  const pickEvidence = (line: number) => {
    if (!round || progress.summaryPick === null || progress.evidencePick !== null) return;
    const summary = progress.summaryPick === round.options.findIndex((option) => option.correct);
    progress.setEvidencePick(line);
    progress.setResults([...progress.results, { summary, evidence: line === round.evidence }]);
    progress.logActivity('scene', summary && line === round.evidence);
  };
  const next = () => {
    progress.setIndex(progress.index + 1);
    progress.setSummaryPick(null);
    progress.setEvidencePick(null);
  };
  const restart = () => {
    progress.setItems(pickSceneQuestions(String(Date.now())));
    progress.setIndex(0);
    progress.setSummaryPick(null);
    progress.setEvidencePick(null);
    progress.setResults([]);
  };
  const phase: Phase =
    progress.summaryPick === null ? 'read' : progress.evidencePick === null ? 'evidence' : 'done';
  return { ...progress, round, story, phase, pickEvidence, next, restart };
}

type SceneRoundProps = {
  round: SceneQuestion;
  story: { lines: Line[] };
  phase: Phase;
  summaryPick: number | null;
  evidencePick: number | null;
  pickEvidence: (index: number) => void;
  setSummaryPick: (index: number) => void;
  next: () => void;
  last: boolean;
};

function SceneTail({
  round,
  story,
  summaryPick,
  evidencePick,
  next,
  last,
}: {
  round: SceneQuestion;
  story: { lines: Line[] };
  summaryPick: number | null;
  evidencePick: number | null;
  next: () => void;
  last: boolean;
}) {
  return (
    <>
      {summaryPick !== null && evidencePick === null && (
        <p className="scene__hint scene__hint--actions">
          Señala una línea de la escena para justificar.
        </p>
      )}
      {evidencePick !== null && (
        <EvidenceFeedback
          round={round}
          story={story}
          picked={evidencePick}
          onNext={next}
          last={last}
        />
      )}
    </>
  );
}

function SceneRound({
  round,
  story,
  phase,
  summaryPick,
  evidencePick,
  pickEvidence,
  setSummaryPick,
  next,
  last,
}: SceneRoundProps) {
  return (
    <>
      <Story
        round={round}
        phase={phase}
        picked={evidencePick}
        revealed={evidencePick !== null}
        onPick={pickEvidence}
      />
      <Question
        round={round}
        picked={summaryPick}
        evidenceDone={evidencePick !== null}
        onPick={setSummaryPick}
      />
      <SceneTail
        round={round}
        story={story}
        summaryPick={summaryPick}
        evidencePick={evidencePick}
        next={next}
        last={last}
      />
    </>
  );
}

function SceneEnd({ results, onRetry }: { results: Result[]; onRetry: () => void }) {
  return (
    <Summary
      summary={results.filter((result) => result.summary).length}
      evidence={results.filter((result) => result.evidence).length}
      total={results.length}
      onRetry={onRetry}
    />
  );
}

export function Scene() {
  const {
    items,
    index,
    summaryPick,
    evidencePick,
    results,
    round,
    story,
    phase,
    pickEvidence,
    setSummaryPick,
    next,
    restart,
  } = useSceneQuiz();
  if (!round || !story) return <SceneEnd results={results} onRetry={restart} />;
  return (
    <div className="scene">
      <SessionHeader
        label="¿Qué pasó en la escena?"
        count={`${index + 1} / ${items.length}`}
        onExit={() => navigate('/practicar')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / items.length) * 100}%` }} />
      </div>
      <SceneRound
        round={round}
        story={story}
        phase={phase}
        summaryPick={summaryPick}
        evidencePick={evidencePick}
        pickEvidence={pickEvidence}
        setSummaryPick={setSummaryPick}
        next={next}
        last={index + 1 === items.length}
      />
    </div>
  );
}
