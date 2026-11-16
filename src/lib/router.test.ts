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

  it('no se rompe con una ruta de carácter vacía', () => {
    expect(parseHash('#/caracter')).toEqual({ name: 'home' });
    expect(parseHash('#/caracter/%E0%A4%A')).toEqual({ name: 'character', char: '%E0%A4%A' });
  });
});
