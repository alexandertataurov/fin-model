import * as React from 'react';

export type ActionBarVariant = 'default' | 'minimal' | 'elevated';
export type ActionBarSize = 'sm' | 'md' | 'lg';

export interface ActionItem {
  key: string;
  label: string;
  description?: string;
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
  bulkAction?: boolean;
  confirm?: boolean;
  confirmMessage?: string;
}

export interface ActionGroup {
  id: string;
  title?: string;
  icon?: string;
  actions: ActionItem[];
  expanded?: boolean;
}

export interface ActionBarFilter {
  key: string;
  placeholder: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Action bar title */
  title?: string;

  /** Action bar subtitle */
  subtitle?: string;

  /** Actions array */
  actions?: ActionItem[]; // Add actions property

  /** Action groups */
  groups?: ActionGroup[];

  /** Whether the action bar is searchable */
  searchable?: boolean;

  /** Whether the action bar has filters */
  filterable?: boolean;

  /** Whether bulk actions are enabled */
  bulkActions?: boolean;

  /** Number of selected items for bulk actions */
  selectedCount?: number;

  /** Available filters */
  filters?: ActionBarFilter[];

  /** Visual variant of the action bar */
  variant?: ActionBarVariant;

  /** Size of the action bar */
  size?: ActionBarSize;

  /** Whether the action bar is sticky */
  sticky?: boolean;

  /** Callback when an action is clicked */
  onActionClick?: (action: ActionItem) => void;

  /** Callback when search is performed */
  onSearch?: (searchTerm: string) => void;

  /** Callback when a filter changes */
  onFilterChange?: (filterKey: string, value: any) => void;

  /** Callback when a bulk action is performed */
  onBulkAction?: (action: ActionItem) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface ActionBarContextValue {
  /** Current search term */
  searchTerm: string;

  /** Current active filters */
  activeFilters: Record<string, any>;

  /** Currently expanded groups */
  expandedGroups: Set<string>;

  /** Number of selected items */
  selectedCount: number;

  /** Action click handler */
  onActionClick: (action: ActionItem) => void;

  /** Search handler */
  onSearch: (searchTerm: string) => void;

  /** Filter change handler */
  onFilterChange: (filterKey: string, value: any) => void;

  /** Bulk action handler */
  onBulkAction: (action: ActionItem) => void;

  /** Group toggle handler */
  onGroupToggle: (groupId: string) => void;

  /** Visual variant */
  variant: ActionBarVariant;

  /** Size */
  size: ActionBarSize;
}

// Ref types
export type ActionBarRef = HTMLDivElement;
