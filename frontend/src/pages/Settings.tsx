import React from 'react';
import { EnhancedCard } from '@/components/ui';
import { componentStyles } from '@/components/ui/utils/designSystem';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className={componentStyles.container}>
        <header className="py-6">
          <h1 className={componentStyles.heading.h1}>Settings</h1>
          <p className="text-muted-foreground mt-2">
            Application settings and preferences
          </p>
        </header>

        <main className="space-y-6">
          <EnhancedCard variant="default">
            <h2 className={componentStyles.heading.h2}>Coming Soon</h2>
            <p className="text-muted-foreground">
              The Settings page is under development. This will provide user
              preferences, account settings, and application configuration
              options.
            </p>
          </EnhancedCard>
        </main>
      </div>
    </div>
  );
};

export default Settings;
