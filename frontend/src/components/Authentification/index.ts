// Authentication Components
export {
  default as AuthGuard,
  AdminGuard,
  AnalystGuard,
  ViewerGuard,
  VerifiedUserGuard,
  withAuthGuard,
} from './AuthGuard';
export { default as ForgotPasswordForm } from './ForgotPasswordForm';
export { default as ResetPasswordForm } from './ResetPasswordForm';
export { default as EmailVerification } from './EmailVerification';

// Re-export auth context and hooks
export { AuthProvider, useAuth } from '../../contexts/AuthContext';
export type {
  User,
  AuthContextType,
  RegisterData,
} from '../../contexts/AuthContext';
