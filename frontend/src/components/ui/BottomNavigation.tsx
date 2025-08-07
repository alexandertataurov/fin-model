import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface NavigationItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    value: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'P&L',
    value: '/dashboards/pl',
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: 'Upload',
    value: '/files',
    icon: <Upload className="h-5 w-5" />,
  },
  {
    label: 'Reports',
    value: '/reports',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    value: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

export interface BottomNavigationProps {
  show?: boolean;
}

// Simple media query hook
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  show = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Only show on mobile and when show prop is true
  if (!isMobile || !show) {
    return null;
  }

  const getCurrentValue = () => {
    const path = location.pathname;

    // Find exact match first
    const exactMatch = navigationItems.find(item => item.value === path);
    if (exactMatch) return exactMatch.value;

    // Find best match for nested routes
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      const parentPath = `/${pathSegments[0]}/${pathSegments[1]}`;
      const parentMatch = navigationItems.find(
        item => item.value === parentPath
      );
      if (parentMatch) return parentMatch.value;
    }

    return '/dashboard'; // Default fallback
  };

  const currentValue = getCurrentValue();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex h-16">
        {navigationItems.map(item => {
          const isActive = currentValue === item.value;

          return (
            <Button
              key={item.value}
              variant="ghost"
              onClick={() => navigate(item.value)}
              disabled={item.disabled}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-none',
                'text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="relative">
                {item.badge && item.badge > 0 ? (
                  <div className="relative">
                    {item.icon}
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  </div>
                ) : (
                  item.icon
                )}
              </div>
              <span className="text-xs leading-none">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
