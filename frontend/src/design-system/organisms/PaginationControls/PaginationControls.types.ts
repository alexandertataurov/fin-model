import * as React from 'react';

export type PaginationControlsVariant = 'default' | 'minimal' | 'elevated';
export type PaginationControlsSize = 'sm' | 'md' | 'lg';
export type PaginationControlsAlignment =
  | 'left'
  | 'center'
  | 'right'
  | 'space-between';

export interface PaginationInfo {
  startItem: number;
  endItem: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface PaginationControlsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Current page number */
  currentPage?: number;

  /** Total number of pages */
  totalPages?: number;

  /** Total number of items */
  totalItems?: number;

  /** Number of items per page */
  pageSize?: number;

  /** Available page size options */
  pageSizeOptions?: number[];

  /** Whether to show pagination info */
  showInfo?: boolean;

  /** Whether to show page size selector */
  showPageSize?: boolean;

  /** Whether to show navigation controls */
  showNavigation?: boolean;

  /** Whether to show page numbers */
  showNumbers?: boolean;

  /** Maximum number of visible page numbers */
  maxVisiblePages?: number;

  /** Visual variant of the pagination controls */
  variant?: PaginationControlsVariant;

  /** Size of the pagination controls */
  size?: PaginationControlsSize;

  /** Alignment of the pagination controls */
  alignment?: PaginationControlsAlignment;

  /** Callback when page changes */
  onPageChange?: (page: number) => void;

  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface PaginationControlsContextValue {
  /** Current page number */
  currentPage: number;

  /** Total number of pages */
  totalPages: number;

  /** Total number of items */
  totalItems: number;

  /** Number of items per page */
  pageSize: number;

  /** Pagination information */
  paginationInfo: PaginationInfo;

  /** Visible page numbers */
  visiblePages: (number | 'ellipsis')[];

  /** Page change handler */
  onPageChange: (page: number) => void;

  /** Page size change handler */
  onPageSizeChange: (pageSize: number) => void;

  /** First page handler */
  onFirstPage: () => void;

  /** Previous page handler */
  onPreviousPage: () => void;

  /** Next page handler */
  onNextPage: () => void;

  /** Last page handler */
  onLastPage: () => void;

  /** Visual variant */
  variant: PaginationControlsVariant;

  /** Size */
  size: PaginationControlsSize;
}

// Ref types
export type PaginationControlsRef = HTMLDivElement;
