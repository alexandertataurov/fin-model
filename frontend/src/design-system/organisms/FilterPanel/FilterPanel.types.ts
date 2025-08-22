import * as React from 'react';

export type FilterPanelVariant = 'default' | 'minimal' | 'elevated';
export type FilterPanelSize = 'sm' | 'md' | 'lg';
export type FilterType = 'checkbox' | 'select' | 'date' | 'range' | 'search';
export type FilterValue =
  | boolean
  | string
  | number
  | Date
  | null
  | Array<string>;

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
  count?: number;
}

export interface Filter {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
  count?: number;
  required?: boolean;
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  title: string;
  icon?: string;
  filters: Filter[];
  expanded?: boolean;
}

export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel title */
  title?: string;

  /** Panel subtitle */
  subtitle?: string;

  /** Filters array */
  filters?: Filter[]; // Add filters property

  /** Filter groups */
  groups?: FilterGroup[];

  /** Whether the panel is searchable */
  searchable?: boolean;

  /** Whether the panel is collapsible */
  collapsible?: boolean;

  /** Visual variant of the panel */
  variant?: FilterPanelVariant;

  /** Size of the panel */
  size?: FilterPanelSize;

  /** Whether the panel is collapsed */
  collapsed?: boolean;

  /** Callback when a filter changes */
  onFilterChange?: (filterKey: string, value: FilterValue) => void;

  /** Callback when all filters are cleared */
  onClearAll?: () => void;

  /** Callback when panel collapse state changes */
  onCollapse?: (collapsed: boolean) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface FilterPanelContextValue {
  /** Current active filters */
  activeFilters: Record<string, FilterValue>;

  /** Currently expanded groups */
  expandedGroups: Set<string>;

  /** Current search term */
  searchTerm: string;

  /** Filter change handler */
  onFilterChange: (filterKey: string, value: FilterValue) => void;

  /** Group toggle handler */
  onGroupToggle: (groupId: string) => void;

  /** Remove filter handler */
  onRemoveFilter: (filterKey: string) => void;

  /** Clear all filters handler */
  onClearAll: () => void;

  /** Visual variant */
  variant: FilterPanelVariant;

  /** Size */
  size: FilterPanelSize;
}

// Ref types
export type FilterPanelRef = HTMLDivElement;
