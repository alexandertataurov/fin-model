import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { componentStyles } from '@/design-system/utils/designSystem';

const BalanceSheetDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className={componentStyles.container}>
        <header className="py-6">
          <h1 className={componentStyles.heading.h1}>
            Balance Sheet Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Assets, liabilities, and equity analysis
          </p>
        </header>

        <main className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Balance Sheet Dashboard is under development. This will
                provide comprehensive balance sheet analysis with asset and
                liability breakdowns.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BalanceSheetDashboard;
