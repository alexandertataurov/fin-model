import * as React from 'react';

export type ListLayoutVariant = 'default' | 'minimal' | 'elevated';
export type ListLayoutSize = 'sm' | 'md' | 'lg';

export interface ListLayoutAction {
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

export interface ListLayoutSidebarSection {
  title?: string;
  content: React.ReactNode;
}

export interface ListLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header component */
  header?: React.ReactElement;

  /** Footer component */
  footer?: React.ReactElement;

  /** DataTable component */
  dataTable?: React.ReactElement;

  /** SearchBar component */
  searchBar?: React.ReactElement;

  /** Sidebar sections */
  sidebar?: ListLayoutSidebarSection[];

  /** Page title */
  title?: string;

  /** Breadcrumb navigation items */
  breadcrumb?: string[];

  /** Page actions */
  actions?: ListLayoutAction[];

  /** Visual variant of the layout */
  variant?: ListLayoutVariant;

  /** Size of the layout */
  size?: ListLayoutSize;

  /** Callback when search is performed */
  onSearch?: (searchTerm: string, filters: string[]) => void;

  /** Callback when filters change */
  onFilterChange?: (filters: string[]) => void;

  /** Callback when an action is clicked */
  onActionClick?: (action: ListLayoutAction) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface ListLayoutContextValue {
  /** Current search term */
  searchTerm: string;

  /** Current active filters */
  activeFilters: string[];

  /** Search handler */
  onSearch: (searchTerm: string, filters: string[]) => void;

  /** Filter change handler */
  onFilterChange: (filters: string[]) => void;

  /** Action click handler */
  onActionClick: (action: ListLayoutAction) => void;

  /** Visual variant */
  variant: ListLayoutVariant;

  /** Size */
  size: ListLayoutSize;
}

// Ref types
export type ListLayoutRef = HTMLDivElement;
