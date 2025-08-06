import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { DesignSystemProvider } from '@/components/ui/DesignSystemProvider';
import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import FileUpload from '@/pages/FileUpload';
import PnLDashboard from '@/pages/PnLDashboard';
import CashFlowDashboard from '@/pages/CashFlowDashboard';
import BalanceSheetDashboard from '@/pages/BalanceSheetDashboard';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Scenarios from '@/pages/Scenarios';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DesignSystemProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Layout />}>
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
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="scenarios" element={<Scenarios />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
                <Toaster />
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </DesignSystemProvider>
    </ThemeProvider>
  );
}

export default App;
