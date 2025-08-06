import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './components/theme-provider';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary, ToastProvider } from './components/ui';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import NewDashboard from './pages/NewDashboard';
import TemplateDashboard from './pages/TemplateDashboard';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// App routes with authentication logic
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // AuthProvider will show loading
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />
      <Route path="/new-dashboard" element={<NewDashboard />} />
      <Route path="/template-dashboard" element={<TemplateDashboard />} />

      {/* Protected routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="dashboards/pl"
          element={<div>PL Dashboard - Coming Soon</div>}
        />
        <Route
          path="dashboards/cashflow"
          element={<div>Cash Flow Dashboard - Coming Soon</div>}
        />
        <Route
          path="dashboards/balance-sheet"
          element={<div>Balance Sheet Dashboard - Coming Soon</div>}
        />
        <Route path="files" element={<FileUpload />} />
        <Route path="reports" element={<Reports />} />
        <Route
          path="scenarios"
          element={
            <ProtectedRoute requiredRole="analyst">
              <div>Scenario Modeling - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route path="analytics" element={<Analytics />} />
        <Route path="template" element={<TemplateDashboard />} />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Admin Panel - Coming Soon</div>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Default redirects */}
      <Route
        index
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />

      {/* Catch all - redirect to dashboard or login */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  console.log('=== APP RENDERING ===');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
