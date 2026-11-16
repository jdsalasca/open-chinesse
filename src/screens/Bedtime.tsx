import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/ui/Icon';
import { BEDTIME_STORIES, type BedtimeLine, type BedtimeStory } from '../data/bedtime';
import { navigate } from '../lib/router';
import { useFollowLine, useStoryAudio } from '../lib/story-audio';

function BedtimeCard({ story, onOpen }: { story: BedtimeStory; onOpen: () => void }) {
  return (
    <button type="button" className="bedtime-card" onClick={onOpen}>
      <span className="bedtime-card__meta">
        HSK {story.level} · {story.minutes} min
      </span>
      <span className="bedtime-card__title">{story.title}</span>
      <span className="bedtime-card__note">{story.note}</span>
      <span className="bedtime-card__cta">Escuchar →</span>
    </button>
  );
}

function Controls({ audio, total }: { audio: ReturnType<typeof useStoryAudio>; total: number }) {
  return (
    <div className="bedtime-controls">
      <button
        type="button"
        className="button button--primary"
        onClick={audio.toggle}
        aria-pressed={audio.playing}
      >
        <Icon name="speaker" size={16} />
        {audio.playing ? 'Pausar' : audio.current >= 0 ? 'Seguir' : 'Escuchar despacio'}
      </button>
      {audio.current >= 0 && (
        <span className="bedtime-controls__meta">
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

function StoryLine({ line, index, active }: { line: BedtimeLine; index: number; active: boolean }) {
  return (
    <li className={`bedtime-line${active ? ' is-active' : ''}`} id={`story-line-${index}`}>
      <p className="bedtime-line__hanzi" lang="zh-Hans">
        {line.hanzi}
      </p>
      <p className="bedtime-line__pinyin">{line.pinyin}</p>
      <p className="bedtime-line__translation">{line.translation}</p>
      <p className="bedtime-line__explain">{line.explain}</p>
    </li>
  );
}

function Reader({ story, onBack }: { story: BedtimeStory; onBack: () => void }) {
  const audio = useStoryAudio(`sleep-${story.id}`, story.lines.length);
  useFollowLine(audio.current);
  return (
    <section className="bedtime-reader">
      <button type="button" className="link bedtime-reader__back" onClick={onBack}>
        ← Cuentos para dormir
      </button>
      <header className="bedtime-reader__head">
        <p className="eyebrow">Para dormir</p>
        <h1>{story.title}</h1>
        <p className="bedtime-reader__note">{story.note}</p>
      </header>
      <Controls audio={audio} total={story.lines.length} />
      <ol className="bedtime-lines">
        {story.lines.map((line, index) => (
          <StoryLine key={line.hanzi} line={line} index={index} active={audio.current === index} />
        ))}
      </ol>
    </section>
  );
}

export function Bedtime({ storyId }: { storyId?: string }) {
  const story = BEDTIME_STORIES.find((item) => item.id === storyId);
  if (story) return <Reader story={story} onBack={() => navigate('/dormir')} />;

  return (
    <section className="bedtime">
      <PageHeader
        eyebrow="Para dormir"
        title="Cuentos lentos para cerrar el día"
        lead="Tres historias cortas con voz pausada, traducción y una explicación de cada línea. Sin preguntas ni prisa."
      />
      <div className="bedtime-grid">
        {BEDTIME_STORIES.map((item) => (
          <BedtimeCard key={item.id} story={item} onOpen={() => navigate(`/dormir/${item.id}`)} />
        ))}
      </div>
      <p className="bedtime__note">
        Se escuchan despacio y se pueden seguir con el texto. Ideal para el final del día.
      </p>
    </section>
  );
}
