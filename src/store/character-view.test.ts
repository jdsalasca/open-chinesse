import { beforeEach, describe, expect, it } from 'vitest';
import { useCharacterView } from './character-view';

describe('ficha lateral', () => {
  beforeEach(() => useCharacterView.getState().close());

  it('abre un carácter y guarda la palabra de contexto', () => {
    useCharacterView.getState().open('阿', ['阿', '姨']);
    expect(useCharacterView.getState().char).toBe('阿');
    expect(useCharacterView.getState().chars).toEqual(['阿', '姨']);
  });

  it('navega al siguiente y vuelve al principio', () => {
    const view = useCharacterView.getState();
    view.open('阿', ['阿', '姨']);
    view.step(1);
    expect(useCharacterView.getState().char).toBe('姨');
    useCharacterView.getState().step(1);
    expect(useCharacterView.getState().char).toBe('阿');
  });

  it('no navega si solo hay un carácter', () => {
    useCharacterView.getState().open('好');
    useCharacterView.getState().step(1);
    expect(useCharacterView.getState().char).toBe('好');
  });

  it('cierra y limpia el contexto', () => {
    useCharacterView.getState().open('好', ['好']);
    useCharacterView.getState().close();
    expect(useCharacterView.getState().char).toBeNull();
    expect(useCharacterView.getState().chars).toEqual([]);
  });
});
