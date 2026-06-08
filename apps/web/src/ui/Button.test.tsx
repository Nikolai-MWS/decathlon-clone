import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Add to cart</Button>);
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Buy</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Buy' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
