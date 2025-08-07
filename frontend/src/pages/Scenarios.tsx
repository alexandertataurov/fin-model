import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { componentStyles } from '@/components/ui/utils/designSystem';

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
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Scenario Modeling feature is under development. This will
                provide advanced financial scenario analysis with Monte Carlo
                simulations.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Scenarios;
