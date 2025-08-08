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
  FileText,
  TrendingUp,
  PieChart,
  ChevronLeft,
  ChevronRight,
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
  Database,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id}>
        {hasChildren ? (
          <Collapsible
            open={isExpanded}
            onOpenChange={() => toggleExpanded(item.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-between h-10 px-3 ${
                  active ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {item.children?.map(child => (
                <Button
                  key={child.id}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start h-8 px-6 ml-2 ${
                    isActive(child.path)
                      ? 'bg-accent text-accent-foreground'
                      : ''
                  }`}
                  onClick={() => handleNavigation(child.path!)}
                >
                  <div className="flex items-center space-x-3">
                    {child.icon}
                    <span className="text-sm">{child.label}</span>
                  </div>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Button
            variant="ghost"
            className={`w-full justify-start h-10 px-3 ${
              active ? 'bg-accent text-accent-foreground' : ''
            }`}
            onClick={() => item.path && handleNavigation(item.path)}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:inset-y-0 lg:left-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">FinModel</h1>
                <p className="text-xs text-muted-foreground">v2.0.0</p>
              </div>
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

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.first_name || user?.username || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {navigationItems.map(renderNavItem)}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Lean App
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
