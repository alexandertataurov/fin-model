import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import AuthGuard from './AuthGuard';

// Mock the auth context
const mockAuthContext = {
  user: null,
  token: null,
  permissions: [],
  roles: [],
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  updateUser: jest.fn(),
  hasPermission: jest.fn(),
  hasRole: jest.fn(),
  isAdmin: jest.fn(),
  isAnalyst: jest.fn(),
};

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => mockAuthContext,
}));

const TestComponent = () => <div>Protected Content</div>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when authentication is loading', () => {
    mockAuthContext.isLoading = true;
    mockAuthContext.isAuthenticated = false;

    renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockAuthContext.isLoading = false;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.user = null;

    renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    // Should redirect to login (component won't render)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and verified', () => {
    mockAuthContext.isLoading = false;
    mockAuthContext.isAuthenticated = true;
    (mockAuthContext.user as any) = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      is_active: true,
      is_verified: true,
      last_login: null,
      failed_login_attempts: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows verification required message when user is not verified', () => {
    mockAuthContext.isLoading = false;
    mockAuthContext.isAuthenticated = true;
    (mockAuthContext.user as any) = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      is_active: true,
      is_verified: false, // Not verified
      last_login: null,
      failed_login_attempts: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    renderWithRouter(
      <AuthGuard requireVerification={true}>
        <TestComponent />
      </AuthGuard>
    );

    expect(screen.getByText('Email Verification Required')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows access denied when user lacks required role', () => {
    mockAuthContext.isLoading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.hasRole = jest.fn().mockReturnValue(false);
    (mockAuthContext.user as any) = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      is_active: true,
      is_verified: true,
      last_login: null,
      failed_login_attempts: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    renderWithRouter(
      <AuthGuard requiredRole="admin">
        <TestComponent />
      </AuthGuard>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
