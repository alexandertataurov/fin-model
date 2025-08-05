import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import AuthGuard, { AdminGuard, AnalystGuard, ViewerGuard, VerifiedUserGuard } from './AuthGuard';
import { AuthContext } from '../../contexts/AuthContext';

// Mock React Router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate" data-to={to}>Navigating to {to}</div>),
    useLocation: vi.fn(() => ({ pathname: '/dashboard', state: null })),
  };
});

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

// Helper function to render with Router and proper async handling
const renderWithRouter = async (component: React.ReactElement) => {
  let result;
  await act(async () => {
    result = render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  });
  return result;
};

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when authenticated', async () => {
    const authenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      isLoading: false,
    };

    await renderWithRouter(
      <AuthContext.Provider value={authenticatedContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  }, 3000); // 3 second timeout

  it('shows loading state when loading', async () => {
    const loadingContext = {
      ...mockAuthContext,
      isLoading: true,
      isAuthenticated: false,
    };

    await renderWithRouter(
      <AuthContext.Provider value={loadingContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  }, 3000); // 3 second timeout

  it('redirects to login when not authenticated', async () => {
    const unauthenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    };

    await renderWithRouter(
      <AuthContext.Provider value={unauthenticatedContext}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // Should show navigation to login
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  }, 3000); // 3 second timeout

  it('shows verification required message when user is not verified', async () => {
    const unverifiedContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      isLoading: false,
      user: {
        ...mockAuthContext.user!,
        is_verified: false,
      },
    };

    await renderWithRouter(
      <AuthContext.Provider value={unverifiedContext}>
        <AuthGuard requireVerification>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Email Verification Required')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  }, 3000);

  it('shows access denied when user lacks required role', async () => {
    const insufficientRoleContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      isLoading: false,
      hasRole: vi.fn(() => false), // User does not have required role
    };

    await renderWithRouter(
      <AuthContext.Provider value={insufficientRoleContext}>
        <AuthGuard requiredRole="admin">
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/required role: admin/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  }, 3000);

  it('renders children when user has required role and is verified', async () => {
    const authorizedContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      isLoading: false,
      user: {
        ...mockAuthContext.user!,
        is_verified: true,
      },
      hasRole: vi.fn(() => true),
    };

    await renderWithRouter(
      <AuthContext.Provider value={authorizedContext}>
        <AuthGuard requiredRole="admin" requireVerification>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(authorizedContext.hasRole).toHaveBeenCalledWith('admin');
  }, 3000);
});

describe('AuthGuard Higher-Order Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AdminGuard requires admin role and verification', async () => {
    const mockContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      isLoading: false,
      hasRole: vi.fn((role) => role === 'admin'),
      user: {
        ...mockAuthContext.user!,
        is_verified: true,
      },
    };

    await renderWithRouter(
      <AuthContext.Provider value={mockContext}>
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(mockContext.hasRole).toHaveBeenCalledWith('admin');
  }, 3000);

  it('ViewerGuard works with viewer role', async () => {
    const mockContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      isLoading: false,
      hasRole: vi.fn((role) => role === 'viewer'),
      user: {
        ...mockAuthContext.user!,
        is_verified: true,
      },
    };

    await renderWithRouter(
      <AuthContext.Provider value={mockContext}>
        <ViewerGuard>
          <div>Viewer Content</div>
        </ViewerGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Viewer Content')).toBeInTheDocument();
    expect(mockContext.hasRole).toHaveBeenCalledWith('viewer');
  }, 3000);

  it('VerifiedUserGuard requires verification only', async () => {
    const mockContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      isLoading: false,
      user: {
        ...mockAuthContext.user!,
        is_verified: true,
      },
    };

    await renderWithRouter(
      <AuthContext.Provider value={mockContext}>
        <VerifiedUserGuard>
          <div>Verified Content</div>
        </VerifiedUserGuard>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Verified Content')).toBeInTheDocument();
  }, 3000);
});
