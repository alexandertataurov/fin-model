import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../../pages/Login';
import { AuthContext } from '../../../contexts/AuthContext';

// Mock the context
const mockLogin = jest.fn();
const mockAuthContext = {
  login: mockLogin,
  logout: jest.fn(),
  user: null,
  loading: false,
  isAuthenticated: false,
};

// Mock WebAuthn
Object.defineProperty(window, 'PublicKeyCredential', {
  value: jest.fn(),
  configurable: true,
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Enhanced Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockResolvedValue(true);
  });

  it('renders login form with enhanced form fields', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('FinVision')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('validates email format in real-time', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, '123');
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(
        screen.getByText(/password should be of minimum 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('shows password visibility toggle', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByLabelText(/show password/i);

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/hide password/i)).toBeInTheDocument();
  });

  it('shows biometric authentication when supported', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/sign in with biometrics/i)).toBeInTheDocument();
  });

  it('hides biometric authentication when not supported', () => {
    // Remove WebAuthn support
    delete (window as any).PublicKeyCredential;

    renderWithProviders(<Login />);
    expect(
      screen.queryByText(/sign in with biometrics/i)
    ).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        false
      );
    });
  });

  it('handles remember me checkbox', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(rememberMeCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        true
      );
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(true), 1000))
    );

    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue({ response: { status: 401 } });

    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i)
      ).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    expect(emailInput).toHaveAttribute('autoFocus');
  });
});
