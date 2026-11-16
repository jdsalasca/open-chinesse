import { describe, expect, it } from 'vitest';
import { parseHash } from './router';

describe('rutas', () => {
  it('reconoce la ficha de un carácter', () => {
    expect(parseHash('#/caracter/好')).toEqual({ name: 'character', char: '好' });
    expect(parseHash('#/caracter/%E4%BD%A0')).toEqual({ name: 'character', char: '你' });
  });

  it('mantiene las rutas existentes', () => {
    expect(parseHash('#/lesson/h3-01')).toEqual({ name: 'lesson', unitId: 'h3-01' });
    expect(parseHash('#/')).toEqual({ name: 'home' });
    expect(parseHash('')).toEqual({ name: 'home' });
  });

  it('reconoce las secciones nuevas', () => {
    expect(parseHash('#/practicar')).toEqual({ name: 'practice' });
    expect(parseHash('#/historias')).toEqual({ name: 'stories', storyId: undefined });
    expect(parseHash('#/historias/parque')).toEqual({ name: 'stories', storyId: 'parque' });
    expect(parseHash('#/inmersion')).toEqual({ name: 'immersion' });
    expect(parseHash('#/tonos')).toEqual({ name: 'tones' });
  });

  it('no se rompe con una ruta de carácter vacía', () => {
    expect(parseHash('#/caracter')).toEqual({ name: 'home' });
    expect(parseHash('#/caracter/%E0%A4%A')).toEqual({ name: 'character', char: '%E0%A4%A' });
  });

  it('trata un anclaje interno como la portada si se carga de cero', () => {
    expect(parseHash('#contenido')).toEqual({ name: 'home' });
  });
});
