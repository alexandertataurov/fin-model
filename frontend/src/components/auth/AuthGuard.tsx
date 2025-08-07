import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Mail, Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'analyst' | 'viewer';
  requireVerification?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  requireVerification = false,
}) => {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Only redirect if we're sure the user is not authenticated (not loading and no user/token)
  if (!isLoading && (!isAuthenticated || !user)) {
    console.log('AuthGuard: User not authenticated, redirecting to login', {
      isAuthenticated,
      hasUser: !!user,
      isLoading,
      currentPath: location.pathname,
    });

    // Only redirect if we're not already on the login page
    if (location.pathname !== '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Check email verification requirement
  if (requireVerification && !user.is_verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-lg shadow-lg p-6 text-center space-y-4">
            <div className="p-3 rounded-full bg-yellow-100 mx-auto w-fit">
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Email Verification Required
              </h2>
              <p className="text-muted-foreground">
                Please verify your email address to access this page. Check your
                email for verification instructions.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                I've Verified My Email
              </button>
              <button
                onClick={() => {
                  // This would trigger resend verification email
                  // For now, just show message
                  alert(
                    'Please check your email for verification instructions.'
                  );
                }}
                className="w-full text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-lg shadow-lg p-6 text-center space-y-4">
            <div className="p-3 rounded-full bg-red-100 mx-auto w-fit">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Access Denied
              </h2>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
                {requiredRole && (
                  <span className="block mt-1 text-sm">
                    Required role:{' '}
                    {requiredRole.charAt(0).toUpperCase() +
                      requiredRole.slice(1)}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

// Higher-order component for role-based route protection
export const withAuthGuard = (
  Component: React.ComponentType,
  requiredRole?: 'admin' | 'analyst' | 'viewer',
  requireVerification?: boolean
) => {
  return (props: any) => (
    <AuthGuard
      requiredRole={requiredRole}
      requireVerification={requireVerification}
    >
      <Component {...props} />
    </AuthGuard>
  );
};

// Specific guards for different access levels
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthGuard requiredRole="admin" requireVerification>
    {children}
  </AuthGuard>
);

export const AnalystGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthGuard requiredRole="analyst" requireVerification>
    {children}
  </AuthGuard>
);

export const ViewerGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthGuard requiredRole="viewer" requireVerification>
    {children}
  </AuthGuard>
);

export const VerifiedUserGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <AuthGuard requireVerification>{children}</AuthGuard>;

export default AuthGuard;
