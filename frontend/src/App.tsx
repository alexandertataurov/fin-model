import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/design-system/components/Toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { DesignSystemProvider } from '@/design-system';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminGuard from '@/components/auth/AdminGuard';
import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import FileUpload from '@/pages/FileUpload';
import FinancialModeling from '@/pages/FinancialModeling';
import PnLDashboard from '@/pages/PnLDashboard';
import CashFlowDashboard from '@/pages/CashFlowDashboard';
import BalanceSheetDashboard from '@/pages/BalanceSheetDashboard';
import Scenarios from '@/pages/Scenarios';
import Parameters from '@/pages/Parameters';
import DCFValuation from '@/pages/DCFValuation';
import AssetLifecycle from '@/pages/AssetLifecycle';
import CashFlowLifecycle from '@/pages/CashFlowLifecycle';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import './styles/globals.css';

// Component to conditionally render NotificationProvider with autoConnect
const AuthenticatedNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
=======
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

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
import Analytics from './pages/Analytics';
import FileUpload from './pages/FileUpload';
import Reports from './pages/Reports';
import ScenarioModeling from './pages/ScenarioModeling';

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

// Protected Layout Component
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <VerifiedUserGuard>{children}</VerifiedUserGuard>;

export default function App() {
>>>>>>> 9437f9b (refactor: remove unused dashboard layout)
  return (
    <NotificationProvider autoConnect={false}>{children}</NotificationProvider>
  );
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DesignSystemProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-surface text-on-surface">
              <Routes>
                {/* Public Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
<<<<<<< HEAD
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes - All wrapped with AuthGuard */}
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <AuthenticatedNotificationProvider>
                        <Layout />
                      </AuthenticatedNotificationProvider>
                    </AuthGuard>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="upload" element={<FileUpload />} />
                  <Route path="dashboards/pl" element={<PnLDashboard />} />
                  <Route
                    path="dashboards/cashflow"
                    element={<CashFlowDashboard />}
                  />
                  <Route
                    path="dashboards/balance"
                    element={<BalanceSheetDashboard />}
                  />
                  <Route path="scenarios" element={<Scenarios />} />
                  <Route path="parameters" element={<Parameters />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="dcf-valuation" element={<DCFValuation />} />
                  <Route path="asset-lifecycle" element={<AssetLifecycle />} />
                  <Route
                    path="cash-flow-lifecycle"
                    element={<CashFlowLifecycle />}
                  />
                  {/* New streamlined routes */}
                  <Route
                    path="financial-modeling"
                    element={<FinancialModeling />}
                  />
                  <Route
                    path="admin"
                    element={
                      <AdminGuard>
                        <AdminDashboard />
                      </AdminGuard>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
=======
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordForm />}
                />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
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

                <Route
                  path="/scenarios"
                  element={
                    <AnalystGuard>
                      <ProtectedLayout>
                        <ScenarioModeling />
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

>>>>>>> 9437f9b (refactor: remove unused dashboard layout)
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </DesignSystemProvider>
    </ThemeProvider>
  );
}
<<<<<<< HEAD

export default App;
=======
>>>>>>> 9437f9b (refactor: remove unused dashboard layout)
