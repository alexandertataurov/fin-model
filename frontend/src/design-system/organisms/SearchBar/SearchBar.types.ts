import * as React from 'react';

export type SearchBarVariant = 'default' | 'outline' | 'filled';
export type SearchBarSize = 'sm' | 'md' | 'lg';

export interface SearchBarFilter {
  key: string;
  label: string;
  count?: number;
  icon?: string;
}

export interface SearchBarResult {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  meta?: string;
  url?: string;
}

export interface SearchBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSearch'> {
  /** Placeholder text for the search input */
  placeholder?: string;

  /** Visual variant of the search bar */
  variant?: SearchBarVariant;

  /** Size of the search bar */
  size?: SearchBarSize;

  /** Whether the search bar is expanded to show filters */
  expanded?: boolean;

  /** Whether to show the filters section */
  showFilters?: boolean;

  /** Whether to show the results section */
  showResults?: boolean;

  /** Available filters */
  filters?: SearchBarFilter[];

  /** Search results */
  results?: SearchBarResult[];

  /** Callback when search value changes */
  onSearch?: (value: string, filters: string[]) => void;

  /** Callback when filters change */
  onFilterChange?: (filters: string[]) => void;

  /** Callback when a result is selected */
  onResultSelect?: (result: SearchBarResult) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface SearchBarContextValue {
  /** Current search value */
  searchValue: string;

  /** Function to set search value */
  setSearchValue: (value: string) => void;

  /** Currently active filters */
  activeFilters: string[];

  /** Function to set active filters */
  setActiveFilters: (filters: string[]) => void;

  /** Whether the search bar is expanded */
  isExpanded: boolean;

  /** Function to set expanded state */
  setIsExpanded: (expanded: boolean) => void;

  /** Visual variant */
  variant: SearchBarVariant;

  /** Size */
  size: SearchBarSize;

  /** Search callback */
  onSearch?: (value: string, filters: string[]) => void;

  /** Filter change callback */
  onFilterChange?: (filters: string[]) => void;

  /** Result selection callback */
  onResultSelect?: (result: SearchBarResult) => void;
}

// Ref types
export type SearchBarRef = HTMLDivElement;
