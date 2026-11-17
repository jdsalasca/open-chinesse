import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppErrorBoundary } from './AppErrorBoundary';

function Crash(): ReactNode {
  throw new Error('prueba de boundary');
}

afterEach(() => vi.restoreAllMocks());

describe('AppErrorBoundary', () => {
  it('deja pasar las pantallas que funcionan', () => {
    render(
      <AppErrorBoundary>
        <p>Contenido sano</p>
      </AppErrorBoundary>,
    );
    expect(screen.getByText('Contenido sano')).toBeInTheDocument();
  });

  it('muestra una salida cuando una pantalla falla', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <AppErrorBoundary>
        <Crash />
      </AppErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: 'Esta pantalla no cargó' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver al inicio' })).toBeInTheDocument();
  });
});
