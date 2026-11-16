const BASE = import.meta.env.BASE_URL;

export function audioUrl(kind: 'words' | 'examples' | 'stories', id: string): string {
  return `${BASE}audio/${kind}/${id}.mp3`;
}

/** El audio de un carácter suelto se nombra por su punto de código. */
export function charAudioUrl(char: string): string {
  const code = (char.codePointAt(0) ?? 0).toString(16);
  return `${BASE}audio/chars/u${code}.mp3`;
}
