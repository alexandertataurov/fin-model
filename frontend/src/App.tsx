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
import AdminDashboard from './pages/AdminDashboard';
import FinancialModeling from './pages/FinancialModeling';
import PnLDashboard from './pages/PnLDashboard';
import CashFlowDashboard from './pages/CashFlowDashboard';
import BalanceSheetDashboard from './pages/BalanceSheetDashboard';
import DCFValuation from './pages/DCFValuation';
import AssetLifecycle from './pages/AssetLifecycle';
import CashFlowLifecycle from './pages/CashFlowLifecycle';
import Parameters from './pages/Parameters';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
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
                <Route path="financial-modeling" element={<FinancialModeling />} />
                <Route path="dashboards/pl" element={<PnLDashboard />} />
                <Route path="dashboards/cashflow" element={<CashFlowDashboard />} />
                <Route path="dashboards/balance" element={<BalanceSheetDashboard />} />
                <Route path="dcf-valuation" element={<DCFValuation />} />
                <Route
                  path="scenarios"
                  element={
                    <AnalystGuard>
                      <Scenarios />
                    </AnalystGuard>
                  }
                />
                <Route path="asset-lifecycle" element={<AssetLifecycle />} />
                <Route path="cash-flow-lifecycle" element={<CashFlowLifecycle />} />
                <Route path="parameters" element={<Parameters />} />
                <Route path="upload" element={<FileUpload />} />
                <Route path="settings" element={<Settings />} />
                <Route
                  path="admin"
                  element={
                    <AdminGuard>
                      <AdminDashboard />
                    </AdminGuard>
                  }
                />
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
