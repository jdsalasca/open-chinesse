import { useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { PageHeader } from '../components/PageHeader';
import { Pinyin } from '../components/Pinyin';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SessionHeader } from '../components/SessionHeader';
import { audioUrl } from '../lib/audio';
import { navigate } from '../lib/router';
import { shadowingTexts, type ShadowingLine, type ShadowingText } from '../lib/shadowing';
import { useRecorder } from '../lib/use-recorder';

const TEXTS = shadowingTexts();

function TextCard({ text, onOpen }: { text: ShadowingText; onOpen: () => void }) {
  return (
    <button type="button" className="shadowing-card" onClick={onOpen}>
      <span className="shadowing-card__meta">
        HSK {text.level} · {text.lines.length} frases
      </span>
      <span className="shadowing-card__title">{text.title}</span>
      <span className="shadowing-card__note">Escucha, graba y compara.</span>
      <span className="shadowing-card__cta">Repetir en voz alta →</span>
    </button>
  );
}

function Playback({ url }: { url: string }) {
  return (
    <button
      type="button"
      className="button button--ghost"
      onClick={() => {
        const audio = new Audio(url);
        void audio.play().catch(() => undefined);
      }}
    >
      Escuchar mi grabación
    </button>
  );
}

function Recorder({ recorder }: { recorder: ReturnType<typeof useRecorder> }) {
  if (recorder.state === 'unsupported') {
    return <p className="shadowing__warn">Este navegador no permite grabar. Usa Chrome o Edge.</p>;
  }
  if (recorder.state === 'denied') {
    return (
      <div className="shadowing__warn">
        <p>No hay permiso para el micrófono. Puedes seguir escuchando el modelo.</p>
        <button type="button" className="button button--ghost" onClick={recorder.start}>
          Reintentar micrófono
        </button>
      </div>
    );
  }
  return (
    <div className="shadowing__record">
      {recorder.state === 'recording' ? (
        <button type="button" className="button button--danger" onClick={recorder.stop}>
          Detener la grabación
        </button>
      ) : (
        <button type="button" className="button button--primary" onClick={recorder.start}>
          {recorder.state === 'ready' ? 'Grabar otra vez' : 'Grabar mi voz'}
        </button>
      )}
      {recorder.url && <Playback url={recorder.url} />}
    </div>
  );
}

function Summary({ text, onRetry }: { text: ShadowingText; onRetry: () => void }) {
  return (
    <section className="scenario-done">
      <span className="scenario-done__icon" aria-hidden="true">
        <Icon name="speaker" size={28} />
      </span>
      <p className="eyebrow">Repite en voz alta</p>
      <h1>Has repetido {text.lines.length} frases</h1>
      <p className="scenario-done__lead">
        Compara tu grabación con el modelo: tonos, ritmo y claridad. Sin nota; tú decides qué
        ajustar la próxima vez.
      </p>
      <div className="scenario-done__actions">
        <button type="button" className="button button--primary" onClick={onRetry}>
          Repetir el texto
        </button>
        <button type="button" className="button button--ghost" onClick={() => navigate('/repite')}>
          Elegir otro texto
        </button>
      </div>
    </section>
  );
}

function Nav({
  index,
  last,
  onPrev,
  onNext,
}: {
  index: number;
  last: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="shadowing__nav">
      <button
        type="button"
        className="button button--ghost"
        onClick={onPrev}
        disabled={index === 0}
      >
        Anterior
      </button>
      <button type="button" className="button button--primary" onClick={onNext}>
        {last ? 'Terminar' : 'Siguiente'}
      </button>
    </div>
  );
}

function Sentence({ line, audioId }: { line: ShadowingLine; audioId: string }) {
  return (
    <>
      <p className="shadowing__hanzi" lang="zh-Hans">
        {line.hanzi}
      </p>
      <Pinyin pinyin={line.pinyin} className="shadowing__pinyin" />
      <p className="shadowing__translation">{line.translation}</p>
      {line.explain && <p className="shadowing__explain">{line.explain}</p>}
      <div className="shadowing__model">
        <span className="shadowing__label">Modelo</span>
        <AudioButton text={line.hanzi} label="el modelo" src={audioUrl('stories', audioId)} />
      </div>
    </>
  );
}

function Reader({ text, onBack }: { text: ShadowingText; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const recorder = useRecorder();
  const line = text.lines[index];
  const last = index + 1 === text.lines.length;
  if (!line) return <Summary text={text} onRetry={() => setIndex(0)} />;
  const audioId = `${text.prefix}-${String(index + 1).padStart(2, '0')}`;
  const go = (delta: number) => {
    recorder.reset();
    setIndex(index + delta);
  };
  return (
    <div className="shadowing">
      <SessionHeader
        label="Repite en voz alta"
        count={`${index + 1} / ${text.lines.length}`}
        onExit={() => navigate('/repite')}
      />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / text.lines.length) * 100}%` }} />
      </div>
      <button type="button" className="link shadowing__back" onClick={onBack}>
        ← Todos los textos
      </button>
      <Card className="shadowing__card">
        <Sentence line={line} audioId={audioId} />
        <Recorder recorder={recorder} />
        <p className="shadowing__hint">
          La grabación se queda en este navegador y se borra al cambiar de frase. Máximo 10
          segundos. Sin nota: compara tonos y ritmo.
        </p>
      </Card>
      <Nav index={index} last={last} onPrev={() => go(-1)} onNext={() => go(1)} />
    </div>
  );
}

export function Shadowing({ textId }: { textId?: string }) {
  const text = TEXTS.find((item) => item.id === textId);
  if (text) return <Reader text={text} onBack={() => navigate('/repite')} />;

  return (
    <section className="shadowing-list">
      <PageHeader
        eyebrow="Repite en voz alta"
        title="Escucha. Graba. Compara."
        lead="Shadowing sin nota: escucha el modelo, graba tu voz y compara tonos y ritmo. El audio se queda en tu navegador."
      />
      <div className="shadowing-grid">
        {TEXTS.map((item) => (
          <TextCard key={item.id} text={item} onOpen={() => navigate(`/repite/${item.id}`)} />
        ))}
      </div>
      <p className="shadowing-list__note">
        {TEXTS.length} textos con audio por frase. Sin micrófono también puedes escuchar y repetir
        en voz alta.
      </p>
    </section>
  );
}
