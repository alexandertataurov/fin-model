import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/design-system/components/Toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { DesignSystemProvider } from '@/design-system';
import AuthGuard from '@/components/auth/AuthGuard';
import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import FileUpload from '@/pages/FileUpload';
import PnLDashboard from '@/pages/PnLDashboard';
import CashFlowDashboard from '@/pages/CashFlowDashboard';
import BalanceSheetDashboard from '@/pages/BalanceSheetDashboard';
import Scenarios from '@/pages/Scenarios';
import Parameters from '@/pages/Parameters';
import DCFValuation from '@/pages/DCFValuation';
import AssetLifecycle from '@/pages/AssetLifecycle';
import CashFlowLifecycle from '@/pages/CashFlowLifecycle';
import NotFound from '@/pages/NotFound';
import './styles/globals.css';

// Component to conditionally render NotificationProvider with autoConnect
const AuthenticatedNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <NotificationProvider autoConnect={true}>{children}</NotificationProvider>
  );
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DesignSystemProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                {/* Public Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
                  <Route path="dcf-valuation" element={<DCFValuation />} />
                  <Route path="asset-lifecycle" element={<AssetLifecycle />} />
                  <Route
                    path="cash-flow-lifecycle"
                    element={<CashFlowLifecycle />}
                  />
                  {/* New streamlined routes */}
                  <Route path="financial-modeling" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </DesignSystemProvider>
    </ThemeProvider>
  );
}

export default App;
