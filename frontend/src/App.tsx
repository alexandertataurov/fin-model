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
import PLDashboard from './pages/PLDashboard';
import CashFlowDashboard from './pages/CashFlowDashboard';
import FileUpload from './pages/FileUpload';
import Reports from './pages/Reports';
import ScenarioModeling from './pages/ScenarioModeling';
import Analytics from './pages/Analytics';
import NewDashboard from './pages/NewDashboard';

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
        <Route path="dashboards/pl" element={<PLDashboard />} />
        <Route path="dashboards/cashflow" element={<CashFlowDashboard />} />
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
              <ScenarioModeling />
            </ProtectedRoute>
          }
        />
        <Route path="analytics" element={<Analytics />} />
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
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <Router>
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
