import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ParameterEditor from './ParameterEditor';

// Types
interface Parameter {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  parameter_type: string;
  category: string;
  sensitivity_level: 'low' | 'medium' | 'high' | 'critical';
  current_value: number;
  default_value?: number;
  min_value?: number;
  max_value?: number;
  unit?: string;
  format_type: 'number' | 'percentage' | 'currency';
  is_required: boolean;
  is_editable: boolean;
  source_sheet?: string;
  source_cell?: string;
  created_at: string;
  updated_at: string;
}

interface FilterState {
  search: string;
  category: string;
  parameter_type: string;
  sensitivity_level: string;
  is_editable: string;
  source_file_id: string;
}

interface ParameterListProps {
  fileId?: number;
  scenarioId?: number;
  readonly?: boolean;
  allowBulkEdit?: boolean;
  showGrouping?: boolean;
  compact?: boolean;
  onParameterSelect?: (parameter: Parameter) => void;
  onBulkUpdate?: (updates: Array<{ id: number; value: number }>) => void;
}

const ParameterList: React.FC<ParameterListProps> = ({
  fileId,
  scenarioId,
  readonly = false,
  allowBulkEdit = true,
  showGrouping = true,
  _compact = false,
  onParameterSelect,
  onBulkUpdate,
}) => {
  // State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    parameter_type: '',
    sensitivity_level: '',
    is_editable: '',
    source_file_id: fileId?.toString() || '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedParams, setSelectedParams] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [groupBy, setGroupBy] = useState<'category' | 'type' | 'sensitivity' | 'none'>('category');
  const [sortBy] = useState<'name' | 'created_at' | 'updated_at' | 'sensitivity_level'>('name');
  const [sortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    parameter: Parameter;
  } | null>(null);

  const queryClient = useQueryClient();

  // Fetch parameters
  const { data: parametersData, isLoading, error, refetch } = useQuery({
    queryKey: ['parameters', filters, page, rowsPerPage, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        skip: (page * rowsPerPage).toString(),
        limit: rowsPerPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.parameter_type && { parameter_type: filters.parameter_type }),
        ...(filters.source_file_id && { source_file_id: filters.source_file_id }),
      });

      const response = await fetch(`/api/v1/parameters?${params}`);
      if (!response.ok) throw new Error('Failed to fetch parameters');
      
      return response.json() as Parameter[];
    },
    staleTime: 30000, // 30 seconds
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates: Array<{ parameter_id: number; new_value: number; change_reason?: string }>) => {
      const response = await fetch('/api/v1/parameters/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates,
          scenario_id: scenarioId,
          recalculate_formulas: true,
        }),
      });
      
      if (!response.ok) throw new Error('Bulk update failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parameters'] });
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      setSelectedParams(new Set());
    },
  });

  // Delete parameter mutation
  const deleteParameterMutation = useMutation({
    mutationFn: async (parameterId: number) => {
      const response = await fetch(`/api/v1/parameters/${parameterId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Delete failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parameters'] });
      setContextMenu(null);
    },
  });

  // Process and group parameters
  const processedParameters = useMemo(() => {
    if (!parametersData) return { grouped: {}, total: 0 };

    let filtered = parametersData;

    // Apply client-side filters (for additional filtering)
    if (filters.sensitivity_level) {
      filtered = filtered.filter(p => p.sensitivity_level === filters.sensitivity_level);
    }
    if (filters.is_editable) {
      const isEditable = filters.is_editable === 'true';
      filtered = filtered.filter(p => p.is_editable === isEditable);
    }

    // Sort parameters
    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      
      switch (sortBy) {
        case 'name':
          aVal = a.display_name || a.name;
          bVal = b.display_name || b.name;
          break;
        case 'created_at':
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          aVal = new Date(a.updated_at).getTime();
          bVal = new Date(b.updated_at).getTime();
          break;
        case 'sensitivity_level': {
          const sensOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aVal = sensOrder[a.sensitivity_level];
          bVal = sensOrder[b.sensitivity_level];
          break;
        }
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }
    });

    // Group parameters
    const grouped: Record<string, Parameter[]> = {};
    
    if (groupBy === 'none') {
      grouped['All Parameters'] = filtered;
    } else {
      filtered.forEach(param => {
        let groupKey: string;
        switch (groupBy) {
          case 'category':
            groupKey = param.category || 'Other';
            break;
          case 'type':
            groupKey = param.parameter_type || 'Other';
            break;
          case 'sensitivity':
            groupKey = param.sensitivity_level || 'Unknown';
            break;
          default:
            groupKey = 'All';
        }
        
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(param);
      });
    }

    return { grouped, total: filtered.length };
  }, [parametersData, filters, sortBy, sortOrder, groupBy]);

  // Handle filter change
  const handleFilterChange = useCallback((field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page
  }, []);

  // Handle selection
  const handleSelectParameter = useCallback((parameterId: number) => {
    setSelectedParams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parameterId)) {
        newSet.delete(parameterId);
      } else {
        newSet.add(parameterId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = new Set(Object.values(processedParameters.grouped).flat().map(p => p.id));
      setSelectedParams(allIds);
    } else {
      setSelectedParams(new Set());
    }
  }, [processedParameters]);

  // Handle context menu
  const handleContextMenu = useCallback((event: React.MouseEvent, parameter: Parameter) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      parameter,
    });
  }, []);

  // Handle parameter value change
  const handleParameterValueChange = useCallback((parameterId: number, newValue: number, changeReason?: string) => {
    if (onBulkUpdate) {
      onBulkUpdate([{ id: parameterId, value: newValue }]);
    } else {
      bulkUpdateMutation.mutate([{
        parameter_id: parameterId,
        new_value: newValue,
        change_reason: changeReason,
      }]);
    }
  }, [onBulkUpdate, bulkUpdateMutation]);

  // Format value
  const formatValue = useCallback((parameter: Parameter) => {
    const value = parameter.current_value;
    switch (parameter.format_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      default:
        return value.toLocaleString();
    }
  }, []);

  // Get sensitivity color
  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Render parameter row
  const renderParameterRow = (parameter: Parameter) => (
    <TableRow
      key={parameter.id}
      hover
      onClick={() => onParameterSelect?.(parameter)}
      onContextMenu={(e) => handleContextMenu(e, parameter)}
      sx={{ cursor: onParameterSelect ? 'pointer' : 'default' }}
    >
      {allowBulkEdit && (
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedParams.has(parameter.id)}
            onChange={() => handleSelectParameter(parameter.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
      )}
      
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {parameter.display_name || parameter.name}
          </Typography>
          {parameter.description && (
            <Typography variant="caption" color="text.secondary">
              {parameter.description}
            </Typography>
          )}
        </Box>
      </TableCell>
      
      <TableCell>
        <Chip
          size="small"
          label={parameter.category}
          variant="outlined"
        />
      </TableCell>
      
      <TableCell>
        <Chip
          size="small"
          label={parameter.sensitivity_level}
                      color={getSensitivityColor(parameter.sensitivity_level) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
        />
      </TableCell>
      
      <TableCell align="right">
        <Typography variant="body2" fontWeight="medium">
          {formatValue(parameter)}
        </Typography>
        {parameter.unit && (
          <Typography variant="caption" color="text.secondary">
            {parameter.unit}
          </Typography>
        )}
      </TableCell>
      
      <TableCell>
        {parameter.source_cell && (
          <Chip
            size="small"
            label={`${parameter.source_sheet}!${parameter.source_cell}`}
            variant="outlined"
          />
        )}
      </TableCell>
      
      <TableCell>
        <Box display="flex" gap={0.5}>
          {parameter.is_editable ? (
            <Chip size="small" label="Editable" color="success" />
          ) : (
            <Chip size="small" label="Calculated" color="default" />
          )}
          {parameter.is_required && (
            <Chip size="small" label="Required" color="warning" />
          )}
        </Box>
      </TableCell>
      
      <TableCell>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenu(e, parameter);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  // Render parameter card
  const renderParameterCard = (parameter: Parameter) => (
    <Card key={parameter.id} variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ p: 2 }}>
        <ParameterEditor
          parameter={parameter}
          scenarioId={scenarioId}
          onValueChange={handleParameterValueChange}
          readonly={readonly}
          compact={true}
        />
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load parameters: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">
          Parameters ({processedParameters.total})
        </Typography>
        
        <Box display="flex" gap={1}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="table">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="cards">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Accordion expanded={showFilters} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Filters & Search</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <TextField
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name, description..."
                size="small"
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="costs">Costs</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="assumptions">Assumptions</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sensitivity</InputLabel>
                <Select
                  value={filters.sensitivity_level}
                  onChange={(e) => handleFilterChange('sensitivity_level', e.target.value)}
                  label="Sensitivity"
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Editable</InputLabel>
                <Select
                  value={filters.is_editable}
                  onChange={(e) => handleFilterChange('is_editable', e.target.value)}
                  label="Editable"
                >
                  <MenuItem value="">All Parameters</MenuItem>
                  <MenuItem value="true">Editable Only</MenuItem>
                  <MenuItem value="false">Calculated Only</MenuItem>
                </Select>
              </FormControl>
              
              {showGrouping && (
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Group By</InputLabel>
                  <Select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value as 'category' | 'type' | 'sensitivity' | 'none')}
                    label="Group By"
                  >
                    <MenuItem value="none">No Grouping</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                    <MenuItem value="sensitivity">Sensitivity</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Bulk Actions */}
      {allowBulkEdit && selectedParams.size > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography>
              {selectedParams.size} parameter(s) selected
            </Typography>
            <Box display="flex" gap={1}>
              <Button size="small" variant="outlined">
                Bulk Edit
              </Button>
              <Button size="small" variant="outlined" color="error">
                Delete Selected
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {/* Content */}
      {viewMode === 'table' ? (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                {allowBulkEdit && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedParams.size > 0 && selectedParams.size === processedParameters.total}
                      indeterminate={selectedParams.size > 0 && selectedParams.size < processedParameters.total}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                )}
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sensitivity</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Properties</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(processedParameters.grouped).map(([groupName, parameters]) => (
                <React.Fragment key={groupName}>
                  {groupBy !== 'none' && (
                    <TableRow>
                      <TableCell
                        colSpan={allowBulkEdit ? 8 : 7}
                        sx={{ backgroundColor: 'action.hover', fontWeight: 'bold' }}
                      >
                        {groupName} ({parameters.length})
                      </TableCell>
                    </TableRow>
                  )}
                  {parameters.map(renderParameterRow)}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          
          <TablePagination
            component="div"
            count={processedParameters.total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      ) : (
        <Box>
          {Object.entries(processedParameters.grouped).map(([groupName, parameters]) => (
            <Box key={groupName} mb={3}>
              {groupBy !== 'none' && (
                <Typography variant="h6" gutterBottom>
                  {groupName} ({parameters.length})
                </Typography>
              )}
              {parameters.map(renderParameterCard)}
            </Box>
          ))}
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => contextMenu && onParameterSelect?.(contextMenu.parameter)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Parameter</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {/* TODO: Implement copy parameter */}}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem
          onClick={() => contextMenu && deleteParameterMutation.mutate(contextMenu.parameter.id)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Parameter</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ParameterList; 