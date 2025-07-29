import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fin-vision-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
          <div className="container flex h-14 items-center justify-between">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {/* Add navigation items here */}
            </nav>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {/* Add other header items here */}
            </div>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </div>
    </ThemeProvider>
  );
}
