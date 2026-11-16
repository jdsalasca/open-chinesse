let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickChineseVoice(): SpeechSynthesisVoice | null {
  const synth = globalThis.speechSynthesis;
  if (!synth || typeof synth.getVoices !== 'function') return null;
  const voices = synth.getVoices();
  if (voices.length === 0) return null;
  return (
    voices.find((v) => v.lang === 'zh-CN') ??
    voices.find((v) => v.lang?.toLowerCase().startsWith('zh')) ??
    null
  );
}

export function hasChineseVoice(): boolean {
  if (cachedVoice === undefined) cachedVoice = pickChineseVoice();
  return cachedVoice !== null;
}

export function speak(
  text: string,
  rate = 0.85,
  handlers: { onStart?: () => void; onEnd?: () => void } = {},
): void {
  const synth = globalThis.speechSynthesis;
  if (!synth) {
    handlers.onEnd?.();
    return;
  }
  if (cachedVoice === undefined) cachedVoice = pickChineseVoice();
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onEnd?.();
  if (cachedVoice) utterance.voice = cachedVoice;
  synth.speak(utterance);
}

/** Algunos navegadores cargan las voces de forma asíncrona. */
export function onVoicesReady(callback: () => void): () => void {
  const synth = globalThis.speechSynthesis;
  if (!synth) return () => {};
  if (synth.getVoices().length > 0) {
    cachedVoice = pickChineseVoice();
    callback();
    return () => {};
  }
  const handler = () => {
    cachedVoice = pickChineseVoice();
    callback();
  };
  synth.addEventListener('voiceschanged', handler, { once: true });
  return () => synth.removeEventListener('voiceschanged', handler);
}
