import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles text input correctly', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test text');
    expect(input).toHaveValue('test text');
  });

  it('shows error state correctly', () => {
    render(<Input error helperText="This field is required" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
    expect(screen.getByText('This field is required')).toHaveClass(
      'text-destructive'
    );
  });

  it('shows helper text without error', () => {
    render(<Input helperText="Enter your username" />);

    const helperText = screen.getByText('Enter your username');
    expect(helperText).toHaveClass('text-muted-foreground');
    expect(helperText).not.toHaveClass('text-destructive');
  });

  it('handles different types correctly', () => {
    const { rerender } = render(<Input type="password" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');

    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('forwards refs correctly', () => {
    const ref = jest.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('applies custom className correctly', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('handles disabled state correctly', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
