import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SpeedControl } from './SpeedControl';

describe('SpeedControl', () => {
  it('marca la velocidad activa y emite el cambio', async () => {
    const onChange = vi.fn();
    render(<SpeedControl rate={1} onChange={onChange} />);
    expect(screen.getByRole('button', { name: '1×' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: '0.75×' }));
    expect(onChange).toHaveBeenCalledWith(0.75);
  });
});
