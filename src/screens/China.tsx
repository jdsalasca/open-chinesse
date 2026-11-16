import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/ui/Icon';
import { CHINA_TEXTS, type ChinaLine, type ChinaQuestion, type ChinaText } from '../data/china';
import { navigate } from '../lib/router';
import { useFollowLine, useStoryAudio } from '../lib/story-audio';

function TextCard({ text, onOpen }: { text: ChinaText; onOpen: () => void }) {
  return (
    <button type="button" className="china-card" onClick={onOpen}>
      <span className="china-card__meta">
        {text.era} · HSK {text.level} · {text.minutes} min
      </span>
      <span className="china-card__title">{text.title}</span>
      <span className="china-card__note">{text.note}</span>
      <span className="china-card__cta">Leer y escuchar →</span>
    </button>
  );
}

function Controls({ audio, total }: { audio: ReturnType<typeof useStoryAudio>; total: number }) {
  return (
    <div className="story-listen">
      <button
        type="button"
        className="button button--primary"
        onClick={audio.toggle}
        aria-pressed={audio.playing}
      >
        <Icon name="speaker" size={16} />
        {audio.playing ? 'Pausar' : audio.current >= 0 ? 'Seguir' : 'Escuchar la lectura'}
      </button>
      {audio.current >= 0 && (
        <span className="story-listen__meta">
          {audio.playing ? 'Línea' : 'Pausado en'} {audio.current + 1} de {total}
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

function Line({ line, index, active }: { line: ChinaLine; index: number; active: boolean }) {
  return (
    <li className={`china-line${active ? ' is-active' : ''}`} id={`story-line-${index}`}>
      <p className="china-line__hanzi" lang="zh-Hans">
        {line.hanzi}
      </p>
      <p className="china-line__pinyin">{line.pinyin}</p>
      <p className="china-line__translation">{line.translation}</p>
      <p className="china-line__explain">{line.explain}</p>
    </li>
  );
}

function Quiz({ question }: { question: ChinaQuestion }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <section className="china-quiz" aria-labelledby="china-quiz-title">
      <h2 id="china-quiz-title">Comprueba lo que entendiste</h2>
      <p className="china-quiz__prompt">{question.prompt}</p>
      <div className="china-quiz__options" role="group" aria-label="Respuestas">
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
              onClick={() => picked === null && setPicked(index)}
              disabled={picked !== null}
            >
              {option.text}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p
          className={`choice__feedback ${question.options[picked].correct ? 'is-correct' : 'is-wrong'}`}
        >
          {question.options[picked].correct ? 'Correcto. ' : 'Casi. '}
          {question.explain}
        </p>
      )}
    </section>
  );
}

function Reader({ text, onBack }: { text: ChinaText; onBack: () => void }) {
  const audio = useStoryAudio(`china-${text.id}`, text.lines.length);
  useFollowLine(audio.current);
  return (
    <article className="china-reader">
      <button type="button" className="link china-reader__back" onClick={onBack}>
        ← China en chino
      </button>
      <header className="china-reader__head">
        <p className="eyebrow">Cultura · {text.era}</p>
        <h1>{text.title}</h1>
        <p className="china-reader__note">{text.note}</p>
      </header>
      <Controls audio={audio} total={text.lines.length} />
      <ol className="china-lines">
        {text.lines.map((line, index) => (
          <Line key={line.hanzi} line={line} index={index} active={audio.current === index} />
        ))}
      </ol>
      <Quiz question={text.question} />
    </article>
  );
}

export function China({ textId }: { textId?: string }) {
  const text = CHINA_TEXTS.find((item) => item.id === textId);
  if (text) return <Reader text={text} onBack={() => navigate('/china')} />;

  return (
    <section className="china">
      <PageHeader
        eyebrow="Cultura"
        title="China en chino"
        lead="Tres lecturas cortas sobre el té, la ciudad y la familia. Audio, explicación de cada línea y una pregunta para comprobar lo que entendiste."
      />
      <div className="china-grid">
        {CHINA_TEXTS.map((item) => (
          <TextCard key={item.id} text={item} onOpen={() => navigate(`/china/${item.id}`)} />
        ))}
      </div>
      <p className="china__note">
        Textos escritos solo con vocabulario del curso: puedes leerlos sin salir de lo que ya sabes.
      </p>
    </section>
  );
}
