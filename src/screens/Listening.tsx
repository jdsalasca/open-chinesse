import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SessionHeader } from '../components/SessionHeader';
import { Icon } from '../components/ui/Icon';
import { listeningExercises, type ListeningExercise, type ListeningLine } from '../lib/listening';
import { navigate } from '../lib/router';
import { useStoryAudio } from '../lib/story-audio';

const EXERCISES = listeningExercises();

function ExerciseCard({ exercise, onOpen }: { exercise: ListeningExercise; onOpen: () => void }) {
  return (
    <button type="button" className="listening-card" onClick={onOpen}>
      <span className="listening-card__meta">
        HSK {exercise.level} · {exercise.minutes} min · {exercise.lines.length} frases
      </span>
      <span className="listening-card__title">{exercise.title}</span>
      <span className="listening-card__note">{exercise.note}</span>
      <span className="listening-card__cta">Escuchar sin texto →</span>
    </button>
  );
}

function Player({ audio, total }: { audio: ReturnType<typeof useStoryAudio>; total: number }) {
  return (
    <div className="listening-player">
      <span className="listening-player__icon" aria-hidden="true">
        <Icon name="speaker" size={20} />
      </span>
      <button
        type="button"
        className="button button--primary"
        onClick={audio.toggle}
        aria-pressed={audio.playing}
      >
        {audio.playing ? 'Pausar' : audio.current >= 0 ? 'Seguir' : 'Escuchar el audio'}
      </button>
      {audio.current >= 0 && (
        <span className="story-listen__meta">
          Frase {audio.current + 1} de {total}
        </span>
      )}
      {audio.current >= 0 && (
        <button type="button" className="link" onClick={audio.stop}>
          Detener
        </button>
      )}
    </div>
  );
}

function QuestionOptions({
  question,
  picked,
  onPick,
}: {
  question: ListeningExercise['question'];
  picked: number | null;
  onPick: (index: number) => void;
}) {
  return (
    <div className="listening-quiz__options" role="group" aria-label="Respuestas">
      {question.options.map((option, index) => {
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
            onClick={() => onPick(index)}
            disabled={picked !== null}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
}

function QuestionFeedback({
  question,
  picked,
  onReveal,
  revealed,
}: {
  question: ListeningExercise['question'];
  picked: number;
  onReveal: () => void;
  revealed: boolean;
}) {
  const answer = question.options.findIndex((option) => option.correct);
  return (
    <>
      <p className={`choice__feedback ${picked === answer ? 'is-correct' : 'is-wrong'}`}>
        {picked === answer ? 'Correcto. ' : `Era: ${question.options[answer].text}. `}
        {question.explain}
      </p>
      {!revealed && (
        <button type="button" className="link" onClick={onReveal}>
          Ver la transcripción
        </button>
      )}
    </>
  );
}

function Question({
  exercise,
  picked,
  onPick,
  onReveal,
  revealed,
}: {
  exercise: ListeningExercise;
  picked: number | null;
  onPick: (index: number) => void;
  onReveal: () => void;
  revealed: boolean;
}) {
  return (
    <section className="listening-quiz" aria-labelledby="listening-question">
      <h2 id="listening-question">{exercise.question.prompt}</h2>
      <QuestionOptions question={exercise.question} picked={picked} onPick={onPick} />
      {picked !== null && (
        <QuestionFeedback
          question={exercise.question}
          picked={picked}
          onReveal={onReveal}
          revealed={revealed}
        />
      )}
    </section>
  );
}

function Transcript({ lines }: { lines: ListeningLine[] }) {
  return (
    <section className="listening-transcript" aria-label="Transcripción">
      <h2>Transcripción</h2>
      <ol>
        {lines.map((line) => (
          <li key={line.hanzi}>
            <p className="listening-transcript__hanzi" lang="zh-Hans">
              {line.hanzi}
            </p>
            <p className="listening-transcript__pinyin">{line.pinyin}</p>
            <p className="listening-transcript__translation">{line.translation}</p>
            {line.explain && <p className="listening-transcript__explain">{line.explain}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Exercise({ exercise, onBack }: { exercise: ListeningExercise; onBack: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const audio = useStoryAudio(exercise.prefix, exercise.lines.length);
  return (
    <div className="listening">
      <SessionHeader
        label="Comprensión auditiva"
        count={`HSK ${exercise.level}`}
        onExit={() => navigate('/escucha')}
      />
      <button type="button" className="link listening__back" onClick={onBack}>
        ← Todos los audios
      </button>
      <h1 className="listening__title">{exercise.title}</h1>
      <p className="listening__note">
        Escucha sin mirar el texto. Puedes repetir el audio antes de responder.
      </p>
      <Player audio={audio} total={exercise.lines.length} />
      <Question
        exercise={exercise}
        picked={picked}
        onPick={(index) => {
          setPicked(index);
          audio.stop();
        }}
        onReveal={() => setRevealed(true)}
        revealed={revealed}
      />
      {revealed && <Transcript lines={exercise.lines} />}
    </div>
  );
}

export function Listening({ exerciseId }: { exerciseId?: string }) {
  const exercise = EXERCISES.find((item) => item.id === exerciseId);
  if (exercise) return <Exercise exercise={exercise} onBack={() => navigate('/escucha')} />;

  return (
    <section className="listening-list">
      <PageHeader
        eyebrow="Comprensión auditiva"
        title="Entiende sin mirar el texto"
        lead="Audios cortos de historias y cultura. Escucha, responde y solo después revela la transcripción."
      />
      <div className="listening-grid">
        {EXERCISES.map((item) => (
          <ExerciseCard
            key={item.id}
            exercise={item}
            onOpen={() => navigate(`/escucha/${item.id}`)}
          />
        ))}
      </div>
      <p className="listening-list__note">
        Seis audios con una pregunta cada uno. Sin texto hasta que responds.
      </p>
    </section>
  );
}
