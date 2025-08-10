import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './design-system/components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './design-system/components/Sonner';

// Authentication Components
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

// Main Application Components
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import Scenarios from './pages/Scenarios';
import Layout from './components/Layout/Layout';

// Protected Layout Component
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <VerifiedUserGuard>{children}</VerifiedUserGuard>;

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/forgot-password"
                element={<ForgotPasswordForm />}
              />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/verify-email" element={<EmailVerification />} />

              {/* Protected Application Routes with Sidebar Layout */}
              <Route
                path="/"
                element={
                  <ProtectedLayout>
                    <Layout />
                  </ProtectedLayout>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="upload" element={<FileUpload />} />
                <Route
                  path="scenarios"
                  element={
                    <AnalystGuard>
                      <Scenarios />
                    </AnalystGuard>
                  }
                />
                <Route
                  path="admin/*"
                  element={
                    <AdminGuard>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">
                          Admin Panel
                        </h1>
                        <p className="text-muted-foreground">
                          Admin features coming soon...
                        </p>
                      </div>
                    </AdminGuard>
                  }
                />
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Route>

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
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
