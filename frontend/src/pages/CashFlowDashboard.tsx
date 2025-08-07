import React from 'react';
import { EnhancedCard } from '@/components/ui';
import { componentStyles } from '@/components/ui/utils/designSystem';

const CashFlowDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className={componentStyles.container}>
        <header className="py-6">
          <h1 className={componentStyles.heading.h1}>Cash Flow Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Cash flow analysis and forecasting
          </p>
        </header>
        
        <main className="space-y-6">
          <EnhancedCard variant="default">
            <h2 className={componentStyles.heading.h2}>Coming Soon</h2>
            <p className="text-muted-foreground">
              The Cash Flow Dashboard is under development. This will provide detailed
              cash flow analysis with waterfall charts and forecasting tools.
            </p>
          </EnhancedCard>
        </main>
      </div>
    </div>
  );
};

export default CashFlowDashboard; 