import { useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { Pinyin } from '../components/Pinyin';
import { Card } from '../components/ui/Card';
import { WORDS_BY_ID, type Word } from '../data/curriculum';
import { STORIES, type Line, type Story } from '../data/stories';
import { audioUrl } from '../lib/audio';
import { segment } from '../lib/quiz';
import { navigate } from '../lib/router';

const BY_HANZI = new Map<string, Word>();
for (const word of WORDS_BY_ID.values()) {
  if (!BY_HANZI.has(word.hanzi)) BY_HANZI.set(word.hanzi, word);
}

type Pick = { chunk: string; word?: Word };

function StoryCard({ story, onOpen }: { story: Story; onOpen: () => void }) {
  return (
    <button type="button" className="story-card" onClick={onOpen}>
      <span className="story-card__meta">
        {story.kind} · HSK {story.level} · {story.minutes} min
      </span>
      <span className="story-card__title">{story.title}</span>
      <span className="story-card__note">{story.note}</span>
      <span className="story-card__cta">Leer →</span>
    </button>
  );
}

function LineView({
  line,
  audioId,
  onPick,
  picked,
}: {
  line: Line;
  audioId: string;
  onPick: (pick: Pick) => void;
  picked: string | null;
}) {
  return (
    <li className="story-line">
      <div className="story-line__head">
        <p className="story-line__hanzi" lang="zh-Hans">
          {segment(line.hanzi).map((chunk, index) => (
            <button
              key={`${chunk}-${index}`}
              type="button"
              className={`story-line__word${picked === chunk ? ' is-picked' : ''}`}
              onClick={() => onPick({ chunk, word: BY_HANZI.get(chunk) })}
              lang="zh-Hans"
            >
              {chunk}
            </button>
          ))}
        </p>
        <AudioButton
          text={line.hanzi}
          label="la frase"
          src={audioUrl('stories', audioId)}
          compact
        />
      </div>
      <Pinyin pinyin={line.pinyin} className="story-line__pinyin" />
      <p className="story-line__translation">{line.translation}</p>
    </li>
  );
}

function Gloss({ pick, onClose }: { pick: Pick; onClose: () => void }) {
  return (
    <div className="gloss" role="status">
      <p className="gloss__head" lang="zh-Hans">
        {pick.chunk}
      </p>
      {pick.word ? (
        <>
          <Pinyin pinyin={pick.word.pinyin} className="gloss__pinyin" />
          <p className="gloss__meaning">{pick.word.meaning}</p>
          <div className="gloss__actions">
            <AudioButton
              text={pick.word.hanzi}
              label={pick.word.hanzi}
              src={audioUrl('words', pick.word.id)}
              compact
            />
            <a className="link" href={`#/caracter/${encodeURIComponent(pick.chunk[0])}`}>
              Ver el carácter {pick.chunk[0]} →
            </a>
          </div>
        </>
      ) : (
        <p className="gloss__meaning">Esta pieza no es una palabra suelta del curso.</p>
      )}
      <button type="button" className="link" onClick={onClose}>
        Cerrar
      </button>
    </div>
  );
}

function Reader({ story, onBack }: { story: Story; onBack: () => void }) {
  const [pick, setPick] = useState<Pick | null>(null);
  return (
    <article className="story-reader">
      <button type="button" className="link story-reader__back" onClick={onBack}>
        ← Todas las lecturas
      </button>
      <h1 className="story-reader__title">{story.title}</h1>
      <p className="story-reader__note">{story.note}</p>
      <Card>
        <ol className="story-lines">
          {story.lines.map((line, index) => (
            <LineView
              key={`${story.id}-${index}`}
              line={line}
              audioId={`${story.id}-${String(index + 1).padStart(2, '0')}`}
              onPick={setPick}
              picked={pick?.chunk ?? null}
            />
          ))}
        </ol>
      </Card>
      {pick ? (
        <Gloss pick={pick} onClose={() => setPick(null)} />
      ) : (
        <p className="story-reader__hint">Toca cualquier palabra para ver qué significa.</p>
      )}
    </article>
  );
}

export function Stories() {
  const [openId, setOpenId] = useState<string | null>(null);
  const story = STORIES.find((item) => item.id === openId);
  if (story) return <Reader story={story} onBack={() => setOpenId(null)} />;

  return (
    <section className="stories">
      <header className="stories__head">
        <p className="eyebrow">Historias</p>
        <h1>Chino que ya puedes leer</h1>
        <p className="stories__lead">
          Textos cortos hechos solo con vocabulario del curso. Audio por frase y glosa al tocar
          cualquier palabra.
        </p>
      </header>
      <div className="stories__grid">
        {STORIES.map((item) => (
          <StoryCard key={item.id} story={item} onOpen={() => setOpenId(item.id)} />
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
