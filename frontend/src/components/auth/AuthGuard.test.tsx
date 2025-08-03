import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthGuard } from './AuthGuard';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the auth context
const mockAuthContext = {
  user: {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    is_active: true,
    is_verified: true,
    last_login: '2024-01-01T00:00:00Z',
    failed_login_attempts: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    roles: ['viewer'],
  },
  token: 'mock-token',
  permissions: ['read'],
  roles: ['viewer'],
  isLoading: false,
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  refreshToken: vi.fn(),
  updateUser: vi.fn(),
  hasPermission: vi.fn(() => true),
  hasRole: vi.fn(() => true),
  isAdmin: vi.fn(() => false),
  isAnalyst: vi.fn(() => false),
};

// Helper function to render with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AuthGuard', () => {
  it('renders children when authenticated', () => {
    const authenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: true,
    };

    renderWithRouter(
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

    renderWithRouter(
      <AuthContext.Provider value={loadingContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    const unauthenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: false,
      user: null,
    };

    renderWithRouter(
      <AuthContext.Provider value={unauthenticatedContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
