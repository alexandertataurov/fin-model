import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  roles?: string[];
  badge?: string | number;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    path: '/',
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

export const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      // Toggle expansion for items with children
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    } else if (item.path) {
      // Navigate to the path
      navigate(item.path);
    }
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const hasPermission = (item: NavItem): boolean => {
    if (!item.roles) return true;
    return item.roles.some(role => user?.roles?.includes(role));
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    if (!hasPermission(item)) return null;

    const isActive = isItemActive(item);
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <Collapsible
          key={item.id}
          open={isExpanded}
          onOpenChange={() => handleItemClick(item)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-between h-10 px-3 ${
                level > 0 ? 'ml-4' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.id}
        variant={isActive ? 'secondary' : 'ghost'}
        className={`w-full justify-start h-10 px-3 ${level > 0 ? 'ml-4' : ''}`}
        onClick={() => handleItemClick(item)}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Button>
    );
  };

  return (
    <div
      className={`border-r bg-background transition-all duration-300 ${
        open ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {open && <h2 className="text-lg font-semibold">FinVision</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {open ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-2 space-y-1">
          {navigationItems.map(item => renderNavItem(item))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
