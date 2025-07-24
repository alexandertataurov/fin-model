import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  Toolbar,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';

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
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

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
              return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
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

  const handleSelectRow = (row: T) => {
    const selectedIndex = selected.findIndex(item => 
      JSON.stringify(item) === JSON.stringify(row)
    );
    
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, row];
    } else {
      newSelected = selected.filter((_, index) => index !== selectedIndex);
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (row: T) => {
    return selected.some(item => JSON.stringify(item) === JSON.stringify(row));
  };

  const handleFilterChange = (columnId: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value || undefined,
    }));
  };

  const clearFilter = (columnId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(Boolean).length;
  };

  const renderFilter = (column: DataTableColumn<T>) => {
    const currentFilter = filters[column.id as string];

    switch (column.filterType) {
      case 'select':
        return (
          <TextField
            select
            size="small"
            value={currentFilter || ''}
            onChange={(e) => handleFilterChange(column.id as string, e.target.value)}
            placeholder={`Filter ${column.label}`}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            {column.filterOptions?.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'number':
        return (
          <TextField
            type="number"
            size="small"
            value={currentFilter || ''}
            onChange={(e) => handleFilterChange(column.id as string, e.target.value)}
            placeholder={`Filter ${column.label}`}
            sx={{ minWidth: 120 }}
          />
        );
      case 'text':
      default:
        return (
          <TextField
            size="small"
            value={currentFilter || ''}
            onChange={(e) => handleFilterChange(column.id as string, e.target.value)}
            placeholder={`Filter ${column.label}`}
            sx={{ minWidth: 120 }}
          />
        );
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        <Box sx={{ flex: '1 1 100%' }}>
          {title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search */}
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}

          {/* Filter Menu */}
          <IconButton
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            color={getActiveFiltersCount() > 0 ? 'primary' : 'default'}
          >
            <FilterIcon />
            {getActiveFiltersCount() > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getActiveFiltersCount()}
              </Box>
            )}
          </IconButton>

          {/* Export */}
          {exportable && (
            <Button
              startIcon={<ExportIcon />}
              onClick={() => onExport?.(selected.length > 0 ? selected : filteredData)}
              size="small"
            >
              Export
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            Active filters:
          </Typography>
          {Object.entries(filters).map(([columnId, value]) => {
            if (!value) return null;
            const column = columns.find(col => col.id === columnId);
            return (
              <Chip
                key={columnId}
                label={`${column?.label}: ${value}`}
                size="small"
                onDelete={() => clearFilter(columnId)}
                sx={{ mr: 1 }}
              />
            );
          })}
        </Box>
      )}

      {/* Table */}
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selected.length === paginatedData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.align}
                  style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }, (_, index) => (
                <TableRow key={index}>
                  {selectable && <TableCell />}
                  {columns.map((column) => (
                    <TableCell key={column.id as string}>
                      <Box sx={{ height: 20, backgroundColor: 'grey.200', borderRadius: 1 }} />
                    </TableCell>
                  ))}
                  {actions && <TableCell />}
                </TableRow>
              ))
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  selected={isSelected(row)}
                  onClick={selectable ? () => handleSelectRow(row) : undefined}
                  sx={{ cursor: selectable ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected(row)} />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id as string} align={column.align}>
                      {column.format ? column.format(row[column.id], row) : row[column.id]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="center">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        {columns
          .filter(column => column.filterable)
          .map((column) => (
            <MenuItem key={column.id as string} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Typography variant="caption" sx={{ mb: 1 }}>
                {column.label}
              </Typography>
              {renderFilter(column)}
            </MenuItem>
          ))}
      </Menu>
    </Paper>
  );
};

export default DataTable; 