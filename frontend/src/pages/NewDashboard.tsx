import { ThemeProvider } from '../components/theme-provider';
import { DashboardLayout } from '../components/dashboard-layout';

/**
 * Financial Analytics Dashboard
 *
 * This component provides a comprehensive view of financial data with:
 * - Tab-based navigation (Overview, P&L, Cash Flow, Balance, Parameters, Sales)
 * - Interactive charts and visualizations
 * - Data filtering and manipulation tools
 * - Real-time financial metrics
 */
const FinancialDashboard = () => (
  <ThemeProvider>
    <div className="min-h-screen bg-background text-foreground">
      <DashboardLayout />
    </div>
  </ThemeProvider>
);

export default FinancialDashboard;
