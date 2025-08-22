import * as React from 'react';

export type ReportLayoutVariant = 'default' | 'minimal' | 'elevated';
export type ReportLayoutSize = 'sm' | 'md' | 'lg';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface ReportLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Logo icon name */
  logo?: string;

  /** Logo text */
  logoText?: string;

  /** Breadcrumb items */
  breadcrumbItems?: any[];

  /** Filter items */
  filterItems?: any[];

  /** Action items */
  actions?: any[];

  /** Pagination information */
  pagination?: PaginationInfo;

  /** Visual variant of the layout */
  variant?: ReportLayoutVariant;

  /** Size of the layout */
  size?: ReportLayoutSize;

  /** Whether the sidebar is collapsed */
  sidebarCollapsed?: boolean;

  /** Whether to show the header */
  showHeader?: boolean;

  /** Whether to show the footer */
  showFooter?: boolean;

  /** Whether to show the sidebar */
  showSidebar?: boolean;

  /** Whether to show the breadcrumb */
  showBreadcrumb?: boolean;

  /** Whether to show the filters */
  showFilters?: boolean;

  /** Whether to show the actions */
  showActions?: boolean;

  /** Whether to show the pagination */
  showPagination?: boolean;

  /** Header component props */
  headerProps?: any;

  /** Footer component props */
  footerProps?: any;

  /** Filter panel component props */
  filterPanelProps?: any;

  /** Action bar component props */
  actionBarProps?: any;

  /** Pagination component props */
  paginationProps?: any;

  /** Callback when sidebar is toggled */
  onSidebarToggle?: (collapsed: boolean) => void;

  /** Callback when logo is clicked */
  onLogoClick?: () => void;

  /** Callback when breadcrumb item is clicked */
  onBreadcrumbItemClick?: (item: any) => void;

  /** Callback when filter is changed */
  onFilterChange?: (filters: any) => void;

  /** Callback when action is clicked */
  onActionClick?: (action: any) => void;

  /** Callback when pagination is changed */
  onPaginationChange?: (page: number) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface ReportLayoutContextValue {
  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Logo icon name */
  logo?: string;

  /** Logo text */
  logoText?: string;

  /** Breadcrumb items */
  breadcrumbItems: any[];

  /** Filter items */
  filterItems: any[];

  /** Action items */
  actions: any[];

  /** Pagination information */
  pagination?: PaginationInfo;

  /** Visual variant */
  variant: ReportLayoutVariant;

  /** Size */
  size: ReportLayoutSize;

  /** Whether sidebar is collapsed */
  sidebarCollapsed: boolean;

  /** Whether mobile menu is open */
  mobileMenuOpen: boolean;

  /** Sidebar toggle handler */
  onSidebarToggle: (collapsed: boolean) => void;

  /** Mobile menu toggle handler */
  onMobileMenuToggle: () => void;

  /** Logo click handler */
  onLogoClick: () => void;

  /** Breadcrumb item click handler */
  onBreadcrumbItemClick: (item: any) => void;

  /** Filter change handler */
  onFilterChange: (filters: any) => void;

  /** Action click handler */
  onActionClick: (action: any) => void;

  /** Pagination change handler */
  onPaginationChange: (page: number) => void;
}

// Ref types
export type ReportLayoutRef = HTMLDivElement;
