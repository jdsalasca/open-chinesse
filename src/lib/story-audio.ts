import { useEffect, useRef, useState, type RefObject } from 'react';
import { audioUrl } from './audio';

function lineAudio(prefix: string, index: number): string {
  return audioUrl('stories', `${prefix}-${String(index + 1).padStart(2, '0')}`);
}

function startLine(params: {
  box: RefObject<HTMLAudioElement | null>;
  prefix: string;
  index: number;
  rate: number;
  onEnded: () => void;
  onError: () => void;
}): void {
  const { box, prefix, index, rate, onEnded, onError } = params;
  box.current?.pause();
  const audio = new Audio(lineAudio(prefix, index));
  audio.playbackRate = rate;
  audio.onended = onEnded;
  audio.onerror = onError;
  box.current = audio;
  void audio.play().catch(onError);
}

function usePlayback(params: {
  prefix: string;
  total: number;
  rate: number;
  audioRef: RefObject<HTMLAudioElement | null>;
  setPlaying: (playing: boolean) => void;
  setCurrent: (index: number) => void;
}) {
  const { prefix, total, rate, audioRef, setPlaying, setCurrent } = params;

  function playFrom(index: number) {
    setPlaying(true);
    startLine({
      box: audioRef,
      prefix,
      index,
      rate,
      onEnded: () => advance(index),
      onError: () => setPlaying(false),
    });
  }

  function advance(index: number) {
    if (index + 1 < total) {
      setCurrent(index + 1);
      playFrom(index + 1);
    } else {
      setPlaying(false);
      setCurrent(-1);
    }
  }

  return playFrom;
}

/** Sigue la línea que suena sin que el usuario tenga que buscar el scroll. */
export function useFollowLine(current: number): void {
  useEffect(() => {
    if (current < 0) return;
    document
      .getElementById(`story-line-${current}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [current]);
}

/** Reproductor de una secuencia de líneas con MP3 propios. */
export function useStoryAudio(prefix: string, total: number) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [rate, setRateState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playFrom = usePlayback({ prefix, total, rate, audioRef, setPlaying, setCurrent });

  useEffect(() => () => audioRef.current?.pause(), []);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
    setCurrent(-1);
  };

  const setRate = (next: number) => {
    setRateState(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const toggle = () => {
    if (playing) {
      audioRef.current?.pause();
      return setPlaying(false);
    }
    if (current < 0) {
      setCurrent(0);
      return playFrom(0);
    }
    const audio = audioRef.current;
    if (!audio) return playFrom(current);
    setPlaying(true);
    void audio.play().catch(() => setPlaying(false));
  };

  return { playing, current, toggle, stop, rate, setRate };
}
