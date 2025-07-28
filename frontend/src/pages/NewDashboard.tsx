import React from 'react';
import { ThemeProvider } from '../design/components/ThemeProvider';
import { DashboardLayout } from '../design/components/DashboardLayout';

const NewDashboard = () => (
  <ThemeProvider>
    <div className="min-h-screen bg-background text-foreground">
      <DashboardLayout />
    </div>
  </ThemeProvider>
);

export default NewDashboard;
