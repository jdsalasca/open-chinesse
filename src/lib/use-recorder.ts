import { useEffect, useRef, useState } from 'react';

export type RecorderState = 'idle' | 'recording' | 'ready' | 'denied' | 'unsupported';

function canRecord(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'
  );
}

function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

class VoiceRecorder {
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private url: string | null = null;
  private timer: number | null = null;
  private discard = false;

  async start(
    onUrl: (url: string) => void,
    onState: (state: RecorderState) => void,
  ): Promise<void> {
    if (!canRecord()) return onState('unsupported');
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = media;
      const recorder = new MediaRecorder(media);
      this.chunks = [];
      this.discard = false;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.chunks.push(event.data);
      };
      recorder.onstop = () => {
        stopStream(media);
        if (this.discard) return;
        const blob = new Blob(this.chunks, { type: recorder.mimeType || 'audio/webm' });
        this.releaseUrl();
        this.url = URL.createObjectURL(blob);
        onUrl(this.url);
        onState('ready');
      };
      recorder.start();
      this.recorder = recorder;
      onState('recording');
      this.timer = window.setTimeout(() => recorder.stop(), 10_000);
    } catch {
      onState('denied');
    }
  }

  stop(): void {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    this.recorder?.stop();
    this.recorder = null;
  }

  reset(onUrl: (url: string | null) => void, onState: (state: RecorderState) => void): void {
    this.discard = true;
    this.stop();
    stopStream(this.stream);
    this.stream = null;
    this.releaseUrl();
    onUrl(null);
    onState(canRecord() ? 'idle' : 'unsupported');
  }

  dispose(): void {
    this.discard = true;
    this.stop();
    stopStream(this.stream);
    this.releaseUrl();
  }

  private releaseUrl(): void {
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = null;
  }
}

export function useRecorder() {
  const [state, setState] = useState<RecorderState>(() => (canRecord() ? 'idle' : 'unsupported'));
  const [url, setUrl] = useState<string | null>(null);
  const recorder = useRef<VoiceRecorder | null>(null);
  if (!recorder.current) recorder.current = new VoiceRecorder();

  const start = () => recorder.current?.start(setUrl, setState);
  const stop = () => recorder.current?.stop();
  const reset = () => recorder.current?.reset(setUrl, setState);

  useEffect(() => () => recorder.current?.dispose(), []);

  return { state, url, start, stop, reset };
}
