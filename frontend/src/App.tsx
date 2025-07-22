import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import Analytics from './pages/Analytics';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

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
        <Route path="files" element={<FileUpload />} />
        <Route path="analytics" element={<Analytics />} />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Admin Panel - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="models/*"
          element={
            <ProtectedRoute requiredRole="analyst">
              <div>Financial Models - Coming Soon</div>
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
