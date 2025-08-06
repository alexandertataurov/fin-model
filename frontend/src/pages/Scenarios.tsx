import React from 'react';
import { EnhancedCard, componentStyles } from '@/components/ui';

const Scenarios: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className={componentStyles.container}>
        <header className="py-6">
          <h1 className={componentStyles.heading.h1}>Scenario Modeling</h1>
          <p className="text-muted-foreground mt-2">
            Financial scenario analysis and modeling
          </p>
        </header>

        <main className="space-y-6">
          <EnhancedCard variant="default">
            <h2 className={componentStyles.heading.h2}>Coming Soon</h2>
            <p className="text-muted-foreground">
              The Scenario Modeling feature is under development. This will
              provide advanced financial scenario analysis with Monte Carlo
              simulations.
            </p>
          </EnhancedCard>
        </main>
      </div>
    </div>
  );
};

export default Scenarios;
