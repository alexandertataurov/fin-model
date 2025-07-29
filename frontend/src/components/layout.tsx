import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/sidebar';
import {
  LayoutGrid,
  FileText,
  Settings,
  BarChart4,
  Calculator,
  Users,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart4 className="h-4 w-4" />,
  },
  {
    title: 'Calculations',
    href: '/calculations',
    icon: <Calculator className="h-4 w-4" />,
  },
  {
    title: 'Team',
    href: '/team',
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fin-vision-ui-theme">
      <div className="flex min-h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-end px-6">
              <div className="flex items-center space-x-4">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
