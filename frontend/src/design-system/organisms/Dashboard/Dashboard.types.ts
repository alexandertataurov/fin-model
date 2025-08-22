import * as React from 'react';

export type DashboardVariant = 'default' | 'minimal' | 'elevated';
export type DashboardSize = 'sm' | 'md' | 'lg';
export type DashboardLayout = 'grid' | 'list' | 'compact';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  color?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  content:
    | React.ReactNode
    | ((props: DashboardWidgetContentProps) => React.ReactNode);
  span?: number;
  actions?: DashboardWidgetAction[];
}

export interface DashboardWidgetAction {
  key: string;
  label: string;
  icon?: string;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  disabled?: boolean;
}

export interface DashboardWidgetContentProps {
  filters: Record<string, any>;
  onAction: (action: string) => void;
}

export interface DashboardFilter {
  key: string;
  placeholder: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export interface DashboardAction {
  label: string;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  icon?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  disabled?: boolean;
}

export interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dashboard title */
  title?: string;

  /** Dashboard subtitle */
  subtitle?: string;

  /** Loading state */
  loading?: boolean; // Add loading property

  /** Dashboard metrics */
  metrics?: DashboardMetric[];

  /** Dashboard widgets */
  widgets?: DashboardWidget[];

  /** Dashboard filters */
  filters?: DashboardFilter[];

  /** Dashboard actions */
  actions?: DashboardAction[];

  /** Visual variant of the dashboard */
  variant?: DashboardVariant;

  /** Size of the dashboard */
  size?: DashboardSize;

  /** Layout of the dashboard */
  layout?: DashboardLayout;

  /** Callback when a metric is clicked */
  onMetricClick?: (metric: DashboardMetric) => void;

  /** Callback when a widget action is triggered */
  onWidgetAction?: (widgetId: string, action: string) => void;

  /** Callback when a filter changes */
  onFilterChange?: (filterKey: string, value: any) => void;

  /** Callback when an action is clicked */
  onActionClick?: (action: DashboardAction) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface DashboardContextValue {
  /** Current metrics */
  metrics: DashboardMetric[];

  /** Current widgets */
  widgets: DashboardWidget[];

  /** Current filters */
  filters: Record<string, any>;

  /** Current search term */
  searchTerm: string;

  /** Metric click handler */
  onMetricClick: (metric: DashboardMetric) => void;

  /** Widget action handler */
  onWidgetAction: (widgetId: string, action: string) => void;

  /** Filter change handler */
  onFilterChange: (filterKey: string, value: any) => void;

  /** Search handler */
  onSearch: (value: string) => void;

  /** Visual variant */
  variant: DashboardVariant;

  /** Size */
  size: DashboardSize;
}

// Ref types
export type DashboardRef = HTMLDivElement;
