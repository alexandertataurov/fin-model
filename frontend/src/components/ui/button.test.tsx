import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="default">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-input');
  });

  it('handles disabled state as loading', () => {
    render(
      <Button disabled>
        Loading...
      </Button>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles disabled state correctly', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with SVG icons correctly', () => {
    render(
      <Button>
        <span data-testid="start-icon" />
        Button
        <span data-testid="end-icon" />
      </Button>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(<Button size="default">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="sm">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="lg">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');
  });

  it('forwards refs correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Button</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('spreads additional props to the button element', () => {
    render(<Button data-testid="test-button">Button</Button>);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });
});
