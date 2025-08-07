import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { componentStyles } from '@/components/ui/utils/designSystem';

const PnLDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className={componentStyles.container}>
        <header className="py-6">
          <h1 className={componentStyles.heading.h1}>P&L Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Profit & Loss analysis and insights
          </p>
        </header>

        <main className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The P&L Dashboard is under development. This will provide
                comprehensive profit and loss analysis with interactive charts
                and key metrics.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PnLDashboard;
