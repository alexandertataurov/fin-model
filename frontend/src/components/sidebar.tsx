import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export function Sidebar({ className, items, ...props }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        'flex h-screen w-60 flex-col border-r border-border bg-sidebar',
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-lg font-semibold">FinVision</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2">
          {items.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
