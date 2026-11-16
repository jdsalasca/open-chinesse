import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BottomNav } from './BottomNav';

describe('BottomNav', () => {
  it('muestra las cinco secciones en orden', () => {
    render(<BottomNav current="home" />);
    const labels = screen.getAllByRole('link').map((link) => link.textContent);
    expect(labels).toEqual(['Aprender', 'Practicar', 'Historias', 'Inmersión', 'Yo']);
  });

  it('marca solo la sección actual', () => {
    render(<BottomNav current="practicar" />);
    expect(screen.getByText('Practicar').closest('a')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Aprender').closest('a')).not.toHaveAttribute('aria-current');
  });

  it('apunta a las rutas del router', () => {
    render(<BottomNav current="historias" />);
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['#/', '#/practicar', '#/historias', '#/inmersion', '#/perfil']);
  });
});
