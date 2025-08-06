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
const DashboardLayout = React.lazy(() =>
  import('./components/DashboardLayout').then(module => ({
    default: module.DashboardLayout,
  }))
);

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
    console.error('=== ERROR BOUNDARY TRIGGERED ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('================================');
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
        <React.Suspense fallback={<LoadingFallback />}>
          {children}
        </React.Suspense>
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
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  console.log('=== APP COMPONENT RENDERING ===');
  
  // Temporary minimal app to isolate the error
  try {
    console.log('=== ATTEMPTING TO RENDER MINIMAL APP ===');
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Debug Mode - App is Loading</h1>
        <p>If you see this, React is working!</p>
        <p>Time: {new Date().toISOString()}</p>
      </div>
    );
  } catch (error) {
    console.error('Error in minimal app render:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Render Error</h1>
        <p>Error: {String(error)}</p>
      </div>
    );
  }
}
