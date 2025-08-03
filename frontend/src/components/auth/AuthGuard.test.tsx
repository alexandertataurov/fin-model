import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthGuard } from './AuthGuard';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the auth context
const mockAuthContext = {
  isLoading: false,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  user: null,
};

describe('AuthGuard', () => {
  it('renders children when authenticated', () => {
    const authenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: true,
    };

    render(
      <AuthContext.Provider value={authenticatedContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    const loadingContext = {
      ...mockAuthContext,
      isLoading: true,
    };

    render(
      <AuthContext.Provider value={loadingContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
