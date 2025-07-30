import { ThemeProvider } from '../components/theme-provider';
import { DashboardLayout } from '../components/dashboard-layout';

const NewDashboard = () => (
  <ThemeProvider>
    <div className="min-h-screen bg-background text-foreground">
      <DashboardLayout />
    </div>
  </ThemeProvider>
);

export default NewDashboard;
