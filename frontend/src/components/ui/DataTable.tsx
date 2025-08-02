import React, { useState, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './button';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Separator } from './separator';
import { Skeleton } from './skeleton';
import {
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';

export interface DataTableColumn<T = Record<string, unknown>> {
  id: keyof T;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  format?: (value: unknown, row: T) => React.ReactNode;
  filterType?: 'text' | 'select' | 'number' | 'date';
  filterOptions?: string[];
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  title?: string;
  searchable?: boolean;
  selectable?: boolean;
  exportable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  onExport?: (data: T[]) => void;
  actions?: (row: T) => React.ReactNode;
  pageSize?: number;
  maxHeight?: number | string;
}

type Order = 'asc' | 'desc';

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  title,
  searchable = true,
  selectable = false,
  exportable = false,
  onSelectionChange,
  onExport,
  actions,
  pageSize = 25,
  maxHeight = 600,
}: DataTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [selected, setSelected] = useState<T[]>([]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchable) {
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const cellValue = row[columnId];
          const column = columns.find(col => col.id === columnId);

          switch (column?.filterType) {
            case 'select':
              return cellValue === filterValue;
            case 'number':
              return Number(cellValue) === Number(filterValue);
            case 'text':
            default:
              return String(cellValue)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase());
          }
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, searchable, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleSort = (columnId: keyof T) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(paginatedData);
      onSelectionChange?.(paginatedData);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    if (checked) {
      const newSelected = [...selected, row];
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      const newSelected = selected.filter(item => item !== row);
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    }
  };

  const isSelected = (row: T) => selected.includes(row);
  const isIndeterminate =
    selected.length > 0 && selected.length < paginatedData.length;
  const isAllSelected =
    paginatedData.length > 0 && selected.length === paginatedData.length;

  if (loading) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            )}

            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {columns
                  .filter(col => col.filterable)
                  .map(column => (
                    <DropdownMenuItem key={String(column.id)}>
                      {column.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-2">
            {selected.length > 0 && (
              <Badge variant="secondary">{selected.length} selected</Badge>
            )}

            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onExport?.(selected.length > 0 ? selected : data)
                }
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Table */}
        <div className="rounded-md border" style={{ maxHeight }}>
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className={cn(
                        isIndeterminate && 'data-[state=checked]:bg-primary'
                      )}
                    />
                  </TableHead>
                )}

                {columns.map(column => (
                  <TableHead
                    key={String(column.id)}
                    className={cn(
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:bg-muted/50'
                    )}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              'h-3 w-3',
                              orderBy === column.id && order === 'asc'
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'h-3 w-3',
                              orderBy === column.id && order === 'desc'
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}

                {actions && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected(row)}
                        onCheckedChange={checked =>
                          handleSelectRow(row, checked as boolean)
                        }
                        aria-label={`Select row ${index + 1}`}
                      />
                    </TableCell>
                  )}

                  {columns.map(column => {
                    const value = row[column.id];
                    const formatted = column.format
                      ? column.format(value, row)
                      : String(value);

                    return (
                      <TableCell
                        key={String(column.id)}
                        className={cn(
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {formatted}
                      </TableCell>
                    );
                  })}

                  {actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {actions(row)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {page * rowsPerPage + 1} to{' '}
              {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{' '}
              {filteredData.length} entries
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={value => {
                setRowsPerPage(Number(value));
                setPage(0);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground px-2">
                Page {page + 1} of{' '}
                {Math.ceil(filteredData.length / rowsPerPage)}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
