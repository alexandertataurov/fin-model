import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';

// Authentication Components - Keep these as regular imports since they're small
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import EmailVerification from './components/auth/EmailVerification';
import {
  AdminGuard,
  AnalystGuard,
  VerifiedUserGuard,
} from './components/auth/AuthGuard';

// Main Application Components - Lazy load for better performance
const DashboardLayout = React.lazy(() => import('./components/DashboardLayout').then(module => ({ default: module.DashboardLayout })));

// Lazy load heavy components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const FileUpload = React.lazy(() => import('./pages/FileUpload'));
const Reports = React.lazy(() => import('./pages/Reports'));

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">
              Authentication Error
            </h1>
            <p className="text-muted-foreground">
              Something went wrong with authentication. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Protected Layout Component with Suspense
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <VerifiedUserGuard>
    <React.Suspense fallback={<LoadingFallback />}>
      <DashboardLayout>
        <React.Suspense fallback={<LoadingFallback />}>{children}</React.Suspense>
      </DashboardLayout>
    </React.Suspense>
  </VerifiedUserGuard>
);

// Create QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      // Add garbage collection time to help with memory management
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  {/* Public Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordForm />}
                  />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordForm />}
                  />
                  <Route path="/verify-email" element={<EmailVerification />} />

                  {/* Protected Application Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedLayout>
                        <Dashboard />
                      </ProtectedLayout>
                    }
                  />

                  <Route
                    path="/analytics"
                    element={
                      <ProtectedLayout>
                        <Analytics />
                      </ProtectedLayout>
                    }
                  />

                  <Route
                    path="/upload"
                    element={
                      <ProtectedLayout>
                        <FileUpload />
                      </ProtectedLayout>
                    }
                  />

                  <Route
                    path="/reports"
                    element={
                      <AnalystGuard>
                        <ProtectedLayout>
                          <Reports />
                        </ProtectedLayout>
                      </AnalystGuard>
                    }
                  />

                  {/* Admin Only Routes - placeholder for future admin panel */}
                  <Route
                    path="/admin/*"
                    element={
                      <AdminGuard>
                        <ProtectedLayout>
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Admin Panel
                            </h1>
                            <p className="text-muted-foreground">
                              Admin features coming soon...
                            </p>
                          </div>
                        </ProtectedLayout>
                      </AdminGuard>
                    }
                  />

                  {/* Default redirects */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />

                  {/* 404 Fallback */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="text-center space-y-4">
                          <h1 className="text-4xl font-bold text-muted-foreground">
                            404
                          </h1>
                          <p className="text-xl text-muted-foreground">
                            Page not found
                          </p>
                          <button
                            onClick={() => window.history.back()}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                          >
                            Go Back
                          </button>
                        </div>
                      </div>
                    }
                  />
                </Routes>

                <Toaster />
              </div>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
