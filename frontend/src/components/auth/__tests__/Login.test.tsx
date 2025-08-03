import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Login } from '../../pages/Login';

// Mock the context
const mockLogin = vi.fn();
const mockAuthContext = {
  login: mockLogin,
  isLoading: false,
  error: null,
};

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(<Login />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows loading state during submission', () => {
    const loadingContext = {
      ...mockAuthContext,
      isLoading: true,
    };

    vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue(
      loadingContext
    );

    render(<Login />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message when login fails', () => {
    const errorContext = {
      ...mockAuthContext,
      error: 'Invalid credentials',
    };

    vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue(
      errorContext
    );

    render(<Login />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
