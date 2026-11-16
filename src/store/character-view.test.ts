import { beforeEach, describe, expect, it } from 'vitest';
import { useCharacterView } from './character-view';

beforeEach(() => useCharacterView.getState().close());

describe('apertura y paginador', () => {
  it('abre un carácter y guarda la palabra de contexto', () => {
    useCharacterView.getState().open('阿', ['阿', '姨']);
    expect(useCharacterView.getState().char).toBe('阿');
    expect(useCharacterView.getState().chars).toEqual(['阿', '姨']);
    expect(useCharacterView.getState().layers).toHaveLength(1);
  });

  it('navega al siguiente y vuelve al principio', () => {
    const view = useCharacterView.getState();
    view.open('阿', ['阿', '姨']);
    view.step(1);
    expect(useCharacterView.getState().char).toBe('姨');
    expect(useCharacterView.getState().layers[0].char).toBe('姨');
    useCharacterView.getState().step(1);
    expect(useCharacterView.getState().char).toBe('阿');
  });

  it('no navega si solo hay un carácter', () => {
    useCharacterView.getState().open('好');
    useCharacterView.getState().step(1);
    expect(useCharacterView.getState().char).toBe('好');
  });
});

describe('capas de origen', () => {
  it('encadena fichas y guarda la relación', () => {
    const view = useCharacterView.getState();
    view.open('好');
    view.drill('女', { from: '好', relation: 'Radical de 好', note: 'Pista de significado.' });
    expect(useCharacterView.getState().char).toBe('女');
    expect(useCharacterView.getState().layers).toHaveLength(2);
    expect(useCharacterView.getState().layers[1]).toMatchObject({
      char: '女',
      from: '好',
      relation: 'Radical de 好',
    });
  });

  it('vuelve atrás y salta a una capa anterior', () => {
    const view = useCharacterView.getState();
    view.open('好');
    view.drill('女');
    view.drill('子');
    expect(useCharacterView.getState().layers).toHaveLength(3);
    useCharacterView.getState().pop();
    expect(useCharacterView.getState().char).toBe('女');
    useCharacterView.getState().jump(0);
    expect(useCharacterView.getState().layers).toHaveLength(1);
    expect(useCharacterView.getState().char).toBe('好');
  });

  it('no apila más de seis fichas', () => {
    const view = useCharacterView.getState();
    view.open('一');
    for (const char of ['二', '三', '四', '五', '六', '七']) view.drill(char);
    expect(useCharacterView.getState().layers).toHaveLength(6);
  });

  it('cierra y limpia el contexto', () => {
    useCharacterView.getState().open('好', ['好']);
    useCharacterView.getState().close();
    expect(useCharacterView.getState().char).toBeNull();
    expect(useCharacterView.getState().chars).toEqual([]);
    expect(useCharacterView.getState().layers).toEqual([]);
  });
});
