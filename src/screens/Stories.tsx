import { useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { Pinyin } from '../components/Pinyin';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { PageHeader } from '../components/PageHeader';
import { WORDS_BY_ID, type Word } from '../data/curriculum';
import { STORIES, type Line, type Story } from '../data/stories';
import { audioUrl } from '../lib/audio';
import { withKeys } from '../lib/keys';
import { segment } from '../lib/quiz';
import { navigate } from '../lib/router';
import { useFollowLine, useStoryAudio } from '../lib/story-audio';
import { useCharacterView } from '../store/character-view';

const BY_HANZI = new Map<string, Word>();
for (const word of WORDS_BY_ID.values()) {
  if (!BY_HANZI.has(word.hanzi)) BY_HANZI.set(word.hanzi, word);
}

type Pick = { chunk: string; word?: Word };

function StoryCard({ story, onOpen }: { story: Story; onOpen: () => void }) {
  const [zh, es] = story.title.split(' · ');
  return (
    <button type="button" className="story-card" onClick={onOpen}>
      <span className="story-card__meta">
        {story.kind} · HSK {story.level} · {story.minutes} min
      </span>
      <span className="story-card__title" lang="zh-Hans">
        {zh}
      </span>
      <span className="story-card__subtitle">{es ?? ''}</span>
      <span className="story-card__note">{story.note}</span>
      <span className="story-card__cta">Leer →</span>
    </button>
  );
}

function WordButtons({
  line,
  picked,
  previewed,
  onPick,
  onPreview,
}: {
  line: Line;
  picked: string | null;
  previewed: string | null;
  onPick: (pick: Pick) => void;
  onPreview: (pick: Pick | null) => void;
}) {
  const chunks = withKeys(segment(line.hanzi), (chunk) => chunk);
  const pick = (chunk: string): Pick => ({ chunk, word: BY_HANZI.get(chunk) });
  return (
    <p className="story-line__hanzi" lang="zh-Hans">
      {chunks.map(({ item: chunk, key }) => (
        <button
          key={key}
          type="button"
          className={`story-line__word${picked === chunk ? ' is-picked' : ''}${previewed === chunk ? ' is-preview' : ''}`}
          onClick={() => onPick(pick(chunk))}
          onMouseEnter={() => onPreview(pick(chunk))}
          onMouseLeave={() => onPreview(null)}
          onFocus={() => onPreview(pick(chunk))}
          onBlur={() => onPreview(null)}
          lang="zh-Hans"
        >
          {chunk}
        </button>
      ))}
    </p>
  );
}

function LineHead({
  line,
  audioId,
  picked,
  previewed,
  listening,
  onPick,
  onPreview,
}: {
  line: Line;
  audioId: string;
  picked: string | null;
  previewed: string | null;
  listening: boolean;
  onPick: (pick: Pick) => void;
  onPreview: (pick: Pick | null) => void;
}) {
  return (
    <div className="story-line__head">
      <WordButtons
        line={line}
        picked={picked}
        previewed={previewed}
        onPick={onPick}
        onPreview={onPreview}
      />
      {!listening && (
        <AudioButton
          text={line.hanzi}
          label="la frase"
          src={audioUrl('stories', audioId)}
          compact
        />
      )}
    </div>
  );
}

function LineView({
  line,
  index,
  audioId,
  onPick,
  onPreview,
  picked,
  previewed,
  active,
  listening,
}: {
  line: Line;
  index: number;
  audioId: string;
  onPick: (pick: Pick) => void;
  onPreview: (pick: Pick | null) => void;
  picked: string | null;
  previewed: string | null;
  active: boolean;
  listening: boolean;
}) {
  return (
    <li className={`story-line${active ? ' is-active' : ''}`} id={`story-line-${index}`}>
      <LineHead
        line={line}
        audioId={audioId}
        picked={picked}
        previewed={previewed}
        listening={listening}
        onPick={onPick}
        onPreview={onPreview}
      />
      <Pinyin pinyin={line.pinyin} className="story-line__pinyin" />
      <p className="story-line__translation">{line.translation}</p>
    </li>
  );
}

function GlossWord({
  word,
  chars,
  onOpen,
}: {
  word: Word;
  chars: string[];
  onOpen: (char: string) => void;
}) {
  return (
    <>
      <Pinyin pinyin={word.pinyin} className="gloss__pinyin" />
      <p className="gloss__meaning">{word.meaning}</p>
      <div className="gloss__actions">
        <AudioButton
          text={word.hanzi}
          label={word.hanzi}
          src={audioUrl('words', word.id)}
          compact
        />
        {withKeys(chars, (char) => char).map(({ item: char, key }) => (
          <button key={key} type="button" className="link" onClick={() => onOpen(char)}>
            {char} →
          </button>
        ))}
      </div>
    </>
  );
}

function Gloss({ pick, pinned, onClose }: { pick: Pick; pinned: boolean; onClose: () => void }) {
  const openChar = useCharacterView((state) => state.open);
  const base = pick.chunk.replace(/[，。！？、：；]+$/u, '') || pick.chunk;
  const word = pick.word ?? BY_HANZI.get(base);
  const chars = [...new Set([...base])];
  return (
    <div className="gloss" role="status">
      <p className="gloss__head" lang="zh-Hans">
        {base}
      </p>
      {word ? (
        <GlossWord word={word} chars={chars} onOpen={(char) => openChar(char, chars)} />
      ) : (
        <p className="gloss__meaning">Esta pieza no es una palabra suelta del curso.</p>
      )}
      {pinned && (
        <button type="button" className="link" onClick={onClose}>
          Cerrar
        </button>
      )}
    </div>
  );
}

function ListenBar({
  playing,
  current,
  total,
  onToggle,
  onStop,
}: {
  playing: boolean;
  current: number;
  total: number;
  onToggle: () => void;
  onStop: () => void;
}) {
  return (
    <div className="story-listen">
      <button
        type="button"
        className="button button--primary"
        onClick={onToggle}
        aria-pressed={playing}
      >
        <Icon name="speaker" size={16} />
        {playing ? 'Pausar' : current >= 0 ? 'Seguir' : 'Escuchar la historia'}
      </button>
      {current >= 0 && (
        <span className="story-listen__meta">
          {playing ? 'Línea' : 'Pausado en'} {current + 1} de {total}
        </span>
      )}
      {current >= 0 && (
        <button type="button" className="link" onClick={onStop}>
          Detener
        </button>
      )}
    </div>
  );
}

function StoryLines({
  story,
  pick,
  preview,
  audio,
  onPick,
  onPreview,
}: {
  story: Story;
  pick: Pick | null;
  preview: Pick | null;
  audio: ReturnType<typeof useStoryAudio>;
  onPick: (pick: Pick) => void;
  onPreview: (pick: Pick | null) => void;
}) {
  return (
    <Card>
      <ol className="story-lines">
        {withKeys(story.lines, (line) => line.hanzi).map(({ item: line, key }, index) => (
          <LineView
            key={key}
            line={line}
            index={index}
            audioId={`${story.id}-${String(index + 1).padStart(2, '0')}`}
            onPick={onPick}
            onPreview={onPreview}
            picked={pick?.chunk ?? null}
            previewed={preview?.chunk ?? null}
            active={audio.current === index}
            listening={audio.playing}
          />
        ))}
      </ol>
    </Card>
  );
}

function Reader({ story, onBack }: { story: Story; onBack: () => void }) {
  const [pick, setPick] = useState<Pick | null>(null);
  const [preview, setPreview] = useState<Pick | null>(null);
  const audio = useStoryAudio(story.id, story.lines.length);
  const shown = pick ?? preview;
  useFollowLine(audio.current);

  return (
    <article className="story-reader">
      <button type="button" className="link story-reader__back" onClick={onBack}>
        ← Todas las lecturas
      </button>
      <h1 className="story-reader__title">{story.title}</h1>
      <p className="story-reader__note">{story.note}</p>
      <ListenBar
        playing={audio.playing}
        current={audio.current}
        total={story.lines.length}
        onToggle={audio.toggle}
        onStop={audio.stop}
      />
      <StoryLines
        story={story}
        pick={pick}
        preview={preview}
        audio={audio}
        onPick={setPick}
        onPreview={setPreview}
      />
      {shown ? (
        <Gloss pick={shown} pinned={pick !== null} onClose={() => setPick(null)} />
      ) : (
        <p className="story-reader__hint">
          Pasa el cursor o toca cualquier palabra para ver su significado.
        </p>
      )}
    </article>
  );
}

export function Stories({ storyId }: { storyId?: string }) {
  const story = STORIES.find((item) => item.id === storyId);
  if (story) return <Reader story={story} onBack={() => navigate('/historias')} />;

  return (
    <section className="stories">
      <PageHeader
        eyebrow="Historias"
        title="Chino que ya puedes leer"
        lead="Textos cortos hechos solo con vocabulario del curso. Escúchalos seguidos, con la línea iluminada, y pasa el cursor por cualquier palabra para ver qué significa."
      />
      <div className="stories__grid">
        {STORIES.map((item) => (
          <StoryCard key={item.id} story={item} onOpen={() => navigate(`/historias/${item.id}`)} />
        ))}
      </div>
      <p className="stories__note">
        ¿Prefieres escuchar? En{' '}
        <button type="button" className="link" onClick={() => navigate('/inmersion')}>
          Inmersión
        </button>{' '}
        hay canales de YouTube.
      </p>
    </section>
  );
}
