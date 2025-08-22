import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { Icon } from '../../atoms/Icon';
import { Checkbox } from '../../atoms/Checkbox';
import { SearchInput } from '../../molecules/SearchInput';
import { Select } from '../../molecules/Select';
import { Pagination } from '../../molecules/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../molecules/Table';
import {
  DataTableProps,
  DataTableRef,
  DataTableContextValue,
} from './DataTable.types';
import {
  dataTableVariants,
  dataTableHeaderVariants,
  dataTableRowVariants,
  dataTableCellVariants,
} from './DataTable.variants';

const DataTableContext = React.createContext<DataTableContextValue | null>(
  null
);

const useDataTableContext = () => {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error('DataTable components must be used within a DataTable');
  }
  return context;
};

const DataTable = React.forwardRef<DataTableRef, DataTableProps>(
  (
    {
      title,
      columns = [],
      data = [],
      variant = 'default',
      size = 'md',
      striped = false,
      selectable = false,
      sortable = false,
      searchable = false,
      pagination = false,
      pageSize = 10,
      pageSizeOptions = [10, 20, 50, 100],
      loading = false,
      emptyMessage = 'No data available',
      onRowSelect,
      onRowClick,
      onSort,
      onSearch,
      onPageChange,
      onPageSizeChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const tokens = useDesignTokens();

    // Filter data based on search
    const filteredData = useMemo(() => {
      if (!searchTerm) return data;
      return data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, [data, searchTerm]);

    // Sort data
    const sortedData = useMemo(() => {
      if (!sortColumn || !sortable) return filteredData;
      return [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue === bValue) return 0;
        const comparison = aValue < bValue ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }, [filteredData, sortColumn, sortDirection, sortable]);

    // Paginate data
    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData;
      const startIndex = (currentPage - 1) * currentPageSize;
      const endIndex = startIndex + currentPageSize;
      return sortedData.slice(startIndex, endIndex);
    }, [sortedData, pagination, currentPage, currentPageSize]);

    // Handle row selection
    const handleRowSelect = useCallback(
      (rowId: string, checked: boolean) => {
        const newSelectedRows = new Set(selectedRows);
        if (checked) {
          newSelectedRows.add(rowId);
        } else {
          newSelectedRows.delete(rowId);
        }
        setSelectedRows(newSelectedRows);
        onRowSelect?.(Array.from(newSelectedRows));
      },
      [selectedRows, onRowSelect]
    );

    // Handle select all
    const handleSelectAll = useCallback(
      (checked: boolean) => {
        if (checked) {
          const allIds = filteredData.map(row => row.id || row.key || '');
          setSelectedRows(new Set(allIds));
          onRowSelect?.(allIds);
        } else {
          setSelectedRows(new Set());
          onRowSelect?.([]);
        }
      },
      [filteredData, onRowSelect]
    );

    // Handle sorting
    const handleSort = useCallback(
      (columnKey: string) => {
        if (!sortable) return;

        const newDirection =
          sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(columnKey);
        setSortDirection(newDirection);
        onSort?.(columnKey, newDirection);
      },
      [sortable, sortColumn, sortDirection, onSort]
    );

    // Handle search
    const handleSearch = useCallback(
      (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
        onSearch?.(value);
      },
      [onSearch]
    );

    // Handle page change
    const handlePageChange = useCallback(
      (page: number) => {
        setCurrentPage(page);
        onPageChange?.(page);
      },
      [onPageChange]
    );

    // Handle page size change
    const handlePageSizeChange = useCallback(
      (size: number) => {
        setCurrentPageSize(size);
        setCurrentPage(1);
        onPageSizeChange?.(size);
      },
      [onPageSizeChange]
    );

    // Calculate total pages for pagination
    const totalPages = Math.ceil(filteredData.length / currentPageSize) || 1;

    const contextValue: DataTableContextValue = {
      data: paginatedData,
      columns,
      selectedRows,
      setSelectedRows,
      sortColumn,
      sortDirection,
      searchTerm,
      currentPage,
      currentPageSize,
      onRowSelect: handleRowSelect,
      onSort: handleSort,
      onSearch: handleSearch,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      variant,
      size,
    };

    return (
      <DataTableContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            dataTableVariants({ variant, size, striped }),
            className
          )}
          style={style}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            {title && (
              <h2
                className="text-lg font-semibold text-foreground"
                style={{
                  fontSize: tokens.getFontSize('lg'),
                  fontWeight: tokens.getFontWeight('semibold'),
                  color: tokens.getColor('foreground'),
                }}
              >
                {title}
              </h2>
            )}

            <div className="flex items-center gap-2">
              {children}
            </div>
          </div>

          {/* Filters */}
          {(searchable || selectable) && (
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {searchable && (
                <SearchInput
                  placeholder="Search table..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant={variant}
                  size={size}
                  showClearButton={true}
                />
              )}

              {pagination && (
                <Select
                  placeholder="Page size"
                  value={currentPageSize.toString()}
                  onChange={value => handlePageSizeChange(Number(value))}
                  options={pageSizeOptions.map(size => ({
                    value: size.toString(),
                    label: `${size} per page`,
                  }))}
                  variant={variant}
                  size={size}
                />
              )}
            </div>
          )}

          {/* Table Container */}
          <div
            className="border border-border rounded-lg overflow-hidden"
            style={{
              border: `${tokens.getToken('borderWidth.sm')} solid ${tokens.getColor('border')}`,
              borderRadius: tokens.getBorderRadius('lg'),
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {selectable && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                        indeterminate={selectedRows.size > 0 && selectedRows.size < filteredData.length}
                        onCheckedChange={handleSelectAll}
                        size={size}
                      />
                    </TableHead>
                  )}
                  {columns.map((column, index) => (
                    <TableHead
                      key={column.key}
                      className={cn(
                        column.sortable && sortable && 'cursor-pointer hover:bg-muted/50',
                        dataTableHeaderVariants({ variant, size, sortable: column.sortable && sortable })
                      )}
                      onClick={() => column.sortable && sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.title}</span>
                        {column.sortable && sortable && sortColumn === column.key && (
                          <Icon
                            name={sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'}
                            size="sm"
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      {selectable && (
                        <TableCell className="w-12">
                          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedData.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className="text-center py-8"
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Icon name="inbox" size="lg" />
                        <p>{emptyMessage}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data rows
                  paginatedData.map((row, index) => (
                    <TableRow
                      key={row.id || row.key || index}
                      className={cn(
                        'transition-colors',
                        striped && index % 2 === 1 && 'bg-muted/50',
                        onRowClick && 'cursor-pointer hover:bg-muted/50',
                        dataTableRowVariants({ variant, size, striped })
                      )}
                      onClick={() => onRowClick?.(row, index)}
                    >
                      {selectable && (
                        <TableCell className="w-12">
                          <Checkbox
                            checked={selectedRows.has(row.id || row.key || '')}
                            onCheckedChange={checked =>
                              handleRowSelect(row.id || row.key || '', !!checked)
                            }
                            size={size}
                          />
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => (
                        <TableCell
                          key={column.key}
                          className={cn(
                            dataTableCellVariants({ variant, size })
                          )}
                        >
                          {column.render
                            ? column.render(row[column.key], row, index)
                            : String(row[column.key] || '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {(() => {
                  const startItem = (currentPage - 1) * currentPageSize + 1;
                  const endItem = Math.min(currentPage * currentPageSize, filteredData.length);
                  return `Showing ${startItem} to ${endItem} of ${filteredData.length} results`;
                })()}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                size={size}
                variant={variant}
              />
            </div>
          )}
        </div>
      </DataTableContext.Provider>
    );
  }
);

DataTable.displayName = 'DataTable';

export { DataTable, useDataTableContext };
