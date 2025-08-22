import * as React from 'react';

export type DataTableVariant = 'default' | 'outline' | 'filled';
export type DataTableSize = 'sm' | 'md' | 'lg';

export interface DataTableColumn {
  key: string;
  title: string;
  label?: string; // Add label property for backward compatibility
  sortable?: boolean;
  render?: (value: any, row: DataTableRow, index: number) => React.ReactNode;
}

export interface DataTableRow {
  id: string; // Make id required and string type
  [key: string]: any;
}

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Table data */
  data?: DataTableRow[];

  /** Column definitions */
  columns?: DataTableColumn[];

  /** Table title */
  title?: string;

  /** Visual variant of the table */
  variant?: DataTableVariant;

  /** Size of the table */
  size?: DataTableSize;

  /** Whether to show striped rows */
  striped?: boolean;

  /** Whether rows are selectable */
  selectable?: boolean;

  /** Whether columns are sortable */
  sortable?: boolean;

  /** Whether to show search functionality */
  searchable?: boolean;

  /** Whether to show pagination */
  pagination?: boolean;

  /** Number of items per page */
  pageSize?: number;

  /** Available page size options */
  pageSizeOptions?: number[];

  /** Whether the table is in loading state */
  loading?: boolean;

  /** Message to show when no data is available */
  emptyMessage?: string;

  /** Callback when rows are selected */
  onRowSelect?: (selectedIds: string[]) => void;

  /** Callback when a row is clicked */
  onRowClick?: (row: DataTableRow, index: number) => void;

  /** Callback when sorting changes */
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;

  /** Callback when search term changes */
  onSearch?: (searchTerm: string) => void;

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

export interface DataTableContextValue {
  /** Current table data */
  data: DataTableRow[];

  /** Column definitions */
  columns: DataTableColumn[];

  /** Currently selected rows */
  selectedRows: Set<string>;

  /** Function to set selected rows */
  setSelectedRows: (rows: Set<string>) => void;

  /** Currently sorted column */
  sortColumn: string | null;

  /** Current sort direction */
  sortDirection: 'asc' | 'desc';

  /** Current search term */
  searchTerm: string;

  /** Current page number */
  currentPage: number;

  /** Current page size */
  currentPageSize: number;

  /** Row selection handler */
  onRowSelect: (rowId: string, checked: boolean) => void;

  /** Sorting handler */
  onSort: (columnKey: string) => void;

  /** Search handler */
  onSearch: (value: string) => void;

  /** Page change handler */
  onPageChange: (page: number) => void;

  /** Page size change handler */
  onPageSizeChange: (pageSize: number) => void;

  /** Visual variant */
  variant: DataTableVariant;

  /** Size */
  size: DataTableSize;
}

// Ref types
export type DataTableRef = HTMLDivElement;
