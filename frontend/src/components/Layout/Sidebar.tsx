import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ScrollArea } from '@/design-system/components/ScrollArea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/design-system/components/Collapsible';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  TrendingUp,
  PieChart,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  Brain,
  Calculator,
  Target,
  Building,
  RefreshCw,
  Settings,
  Activity,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { textStyles } from '@/design-system/utils/typography';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  const baseNavigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/',
    },
    {
      id: 'financial-modeling',
      label: 'Financial Modeling',
      icon: <Activity className="h-4 w-4" />,
      path: '/financial-modeling',
    },
    {
      id: 'financial-dashboards',
      label: 'Financial Statements',
      icon: <BarChart3 className="h-4 w-4" />,
      children: [
        {
          id: 'pl-dashboard',
          label: 'P&L Statement',
          icon: <TrendingUp className="h-4 w-4" />,
          path: '/dashboards/pl',
        },
        {
          id: 'cashflow-dashboard',
          label: 'Cash Flow Statement',
          icon: <TrendingUp className="h-4 w-4" />,
          path: '/dashboards/cashflow',
        },
        {
          id: 'balance-sheet',
          label: 'Balance Sheet',
          icon: <PieChart className="h-4 w-4" />,
          path: '/dashboards/balance',
        },
      ],
    },
    {
      id: 'modeling-tools',
      label: 'Modeling Tools',
      icon: <Calculator className="h-4 w-4" />,
      children: [
        {
          id: 'dcf-valuation',
          label: 'DCF Valuation',
          icon: <Target className="h-4 w-4" />,
          path: '/dcf-valuation',
        },
        {
          id: 'scenario-modeling',
          label: 'Scenario Modeling',
          icon: <Brain className="h-4 w-4" />,
          path: '/scenarios',
        },
        {
          id: 'asset-lifecycle',
          label: 'Asset Lifecycle',
          icon: <Building className="h-4 w-4" />,
          path: '/asset-lifecycle',
        },
        {
          id: 'cash-flow-lifecycle',
          label: 'Cash Flow Lifecycle',
          icon: <RefreshCw className="h-4 w-4" />,
          path: '/cash-flow-lifecycle',
        },
      ],
    },
    {
      id: 'parameters',
      label: 'Parameters',
      icon: <Settings className="h-4 w-4" />,
      path: '/parameters',
    },
    {
      id: 'files',
      label: 'File Upload',
      icon: <Upload className="h-4 w-4" />,
      path: '/upload',
    },
  ];

  // Add admin navigation item only for admin users
  const navigationItems: NavItem[] = isAdmin() ? [
    ...baseNavigationItems,
    {
      id: 'admin',
      label: 'Administration',
      icon: <Users className="h-4 w-4" />,
      path: '/admin',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      path: '/settings',
    },
  ] : [
    ...baseNavigationItems,
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      path: '/settings',
    },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (!open) {
      onToggle();
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const renderNavItem = (item: NavItem) => {
    const isItemActive = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    if (hasChildren) {
      return (
        <Collapsible
          key={item.id}
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-between p-2 h-auto ${isItemActive ? 'bg-accent text-accent-foreground' : ''
                }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span style={textStyles.nav}>{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => (
              <Button
                key={child.id}
                variant="ghost"
                className={`w-full justify-start p-2 h-auto pl-8 ${isActive(child.path) ? 'bg-accent text-accent-foreground' : ''
                  }`}
                onClick={() => handleNavigation(child.path!)}
              >
                <div className="flex items-center space-x-2">
                  {child.icon}
                  <span style={textStyles.nav}>{child.label}</span>
                </div>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={`w-full justify-start p-2 h-auto ${isItemActive ? 'bg-accent text-accent-foreground' : ''
          }`}
        onClick={() => item.path && handleNavigation(item.path)}
      >
        <div className="flex items-center space-x-2">
          {item.icon}
          <span style={textStyles.nav}>{item.label}</span>
        </div>
      </Button>
    );
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span style={textStyles.h3} className="text-primary-foreground font-bold">
              FM
            </span>
          </div>
          <span style={textStyles.h3} className="font-semibold">
            FinVision
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="lg:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {baseNavigationItems.map(renderNavItem)}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <span style={textStyles.caption} className="text-primary-foreground font-medium text-xs">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex flex-col">
              <span style={textStyles.nav} className="font-medium">
                {user?.first_name || user?.username || 'User'}
              </span>
              <span style={textStyles.caption} className="text-muted-foreground">
                {user?.roles?.[0] || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
