import React from 'react';
import AuthGuard from './Authentification/AuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'admin' | 'analyst' | 'viewer';
  redirectTo?: string;
  requireVerification?: boolean;
}

/**
 * @deprecated Use AuthGuard directly instead. This component is maintained for backward compatibility.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireVerification = true,
}) => {
  return (
    <AuthGuard
      requiredRole={requiredRole}
      requireVerification={requireVerification}
    >
      {children}
    </AuthGuard>
  );
};

export default ProtectedRoute;
