import * as React from 'react';
import { ThemeProvider } from '@/design-system/components/ThemeProvider';
// Sidebar/ThemeToggle may not exist; simplify header
import {
  LayoutGrid,
  Target,
  Settings,
  TrendingUp,
  Upload,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    title: 'P&L Statement',
    href: '/dashboards/pl',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: 'DCF Valuation',
    href: '/dcf-valuation',
    icon: <Target className="h-4 w-4" />,
  },
  {
    title: 'Parameters',
    href: '/parameters',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: 'File Upload',
    href: '/upload',
    icon: <Upload className="h-4 w-4" />,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar omitted in this build */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
