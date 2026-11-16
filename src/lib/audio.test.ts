import { describe, expect, it } from 'vitest';
import { audioUrl, charAudioUrl } from './audio';

describe('rutas de audio', () => {
  it('nombra palabras y frases por su id', () => {
    expect(audioUrl('words', 'h3-01-w01')).toBe('/audio/words/h3-01-w01.mp3');
    expect(audioUrl('examples', 'h3-01-w01')).toBe('/audio/examples/h3-01-w01.mp3');
  });

  it('nombra caracteres por su punto de código', () => {
    expect(charAudioUrl('好')).toBe('/audio/chars/u597d.mp3');
    expect(charAudioUrl('𠮷')).toBe('/audio/chars/u20bb7.mp3');
  });
});
