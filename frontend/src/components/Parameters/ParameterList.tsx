import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SelectChangeEvent } from '@mui/material/Select';

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
  validation_rules?: Record<string, unknown>;
  source_sheet?: string;
  source_cell?: string;
  formula?: string;
  depends_on?: string[];
  affects?: string[];
  created_at: string;
  updated_at: string;
}
interface Category {
  category: string;
  description: string;
}


interface ParameterListProps {
  fileId?: number;
  scenarioId?: number;
  onParameterChange?: (parameter: Parameter) => void;
  onParameterSelect?: (parameter: Parameter | null) => void;
  onBulkUpdate?: (updates: Array<{ id: number; value: number }>) => void;
  allowBulkEdit?: boolean;
  showGrouping?: boolean;
}

const ParameterList: React.FC<ParameterListProps> = ({
  fileId,
  scenarioId: _scenarioId,
  onParameterChange: _onParameterChange,
  onParameterSelect: _onParameterSelect,
  onBulkUpdate: _onBulkUpdate,
  allowBulkEdit: _allowBulkEdit,
  showGrouping: _showGrouping,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSensitivity, setSelectedSensitivity] = useState<string>('all');
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [, setCreateDialogOpen] = useState(false);
  const [, setHistoryDialogOpen] = useState(false);
  const [, setSelectedParameterId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // Fetch parameters
  const { data: parameters = [], isLoading, error, refetch } = useQuery({
    queryKey: ['parameters', fileId, selectedCategory, selectedType, selectedSensitivity],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams();
      
      if (fileId) params.append('file_id', fileId.toString());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedType !== 'all') params.append('parameter_type', selectedType);
      if (selectedSensitivity !== 'all') params.append('sensitivity_level', selectedSensitivity);
      
      const response = await fetch(`/api/v1/parameters?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch parameters');
      }
      
      return await response.json() as Parameter[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch parameter categories
  const { data: categories = [] } = useQuery({
    queryKey: ['parameter-categories'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/v1/parameters/categories/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return response.json();
    },
  });

  // Update parameter mutation
  const updateParameterMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Parameter> }) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/v1/parameters/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update parameter');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['parameters']);
      setEditingParameter(null);
    },
  });

  // Delete parameter mutation
  const deleteParameterMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/v1/parameters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete parameter');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['parameters']);
    },
  });

  // Detect parameters from file mutation
  const detectParametersMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/v1/parameters/detect-from-file/${fileId}?auto_create=true`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect parameters');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['parameters']);
    },
  });

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setSelectedType(event.target.value);
  };

  const handleSensitivityChange = (event: SelectChangeEvent) => {
    setSelectedSensitivity(event.target.value);
  };

  const handleEditParameter = (parameter: Parameter) => {
    setEditingParameter(parameter);
  };

  const handleSaveParameter = useCallback(async () => {
    if (!editingParameter) return;

    const updates = {
      display_name: editingParameter.display_name,
      description: editingParameter.description,
      current_value: editingParameter.current_value,
      min_value: editingParameter.min_value,
      max_value: editingParameter.max_value,
      unit: editingParameter.unit,
      is_required: editingParameter.is_required,
      is_editable: editingParameter.is_editable,
    };

    updateParameterMutation.mutate({ id: editingParameter.id, updates });
  }, [editingParameter, updateParameterMutation]);

  const handleDeleteParameter = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this parameter?')) {
      deleteParameterMutation.mutate(id);
    }
  }, [deleteParameterMutation]);

  const handleDetectParameters = useCallback(async () => {
    if (!fileId) return;
    
    detectParametersMutation.mutate(fileId);
  }, [fileId, detectParametersMutation]);



  const formatValue = (parameter: Parameter): string => {
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
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load parameters. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header and Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Parameters
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {fileId && (
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={handleDetectParameters}
              disabled={detectParametersMutation.isLoading}
            >
              {detectParametersMutation.isLoading ? 'Detecting...' : 'Auto-Detect'}
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Add Parameter
          </Button>
          
          <IconButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category: Category) => (
                    <MenuItem key={category.category} value={category.category}>
                      {category.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedType}
                  label="Type"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="growth_rate">Growth Rate</MenuItem>
                  <MenuItem value="revenue_assumption">Revenue Assumption</MenuItem>
                  <MenuItem value="cost_assumption">Cost Assumption</MenuItem>
                  <MenuItem value="discount_rate">Discount Rate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sensitivity</InputLabel>
                <Select
                  value={selectedSensitivity}
                  label="Sensitivity"
                  onChange={handleSensitivityChange}
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Parameters Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Current Value</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sensitivity</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parameters.map((parameter) => (
                <TableRow key={parameter.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {parameter.display_name || parameter.name}
                      </Typography>
                      {parameter.description && (
                        <Typography variant="caption" color="text.secondary">
                          {parameter.description}
                        </Typography>
                      )}
                      {parameter.unit && (
                        <Chip 
                          label={parameter.unit} 
                          size="small" 
                          variant="outlined" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {formatValue(parameter)}
                      </Typography>
                      {parameter.is_editable && (
                        <IconButton
                          size="small"
                          onClick={() => handleEditParameter(parameter)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={parameter.parameter_type.replace('_', ' ')} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={parameter.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={parameter.sensitivity_level} 
                      size="small" 
                      color={getSensitivityColor(parameter.sensitivity_level)} 
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      {parameter.source_sheet && (
                        <Typography variant="caption" display="block">
                          Sheet: {parameter.source_sheet}
                        </Typography>
                      )}
                      {parameter.source_cell && (
                        <Typography variant="caption" display="block">
                          Cell: {parameter.source_cell}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View History">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedParameterId(parameter.id);
                            setHistoryDialogOpen(true);
                          }}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Parameter Info">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Parameter">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteParameter(parameter.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              
              {parameters.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No parameters found. {fileId ? 'Try auto-detecting parameters from your file.' : 'Upload a file to get started.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Parameter Dialog */}
      <Dialog 
        open={!!editingParameter} 
        onClose={() => setEditingParameter(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Parameter</DialogTitle>
        <DialogContent>
          {editingParameter && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={editingParameter.display_name || ''}
                    onChange={(e) => setEditingParameter({
                      ...editingParameter,
                      display_name: e.target.value
                    })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Value"
                    type="number"
                    value={editingParameter.current_value || ''}
                    onChange={(e) => setEditingParameter({
                      ...editingParameter,
                      current_value: parseFloat(e.target.value)
                    })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={editingParameter.description || ''}
                    onChange={(e) => setEditingParameter({
                      ...editingParameter,
                      description: e.target.value
                    })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Value"
                    type="number"
                    value={editingParameter.min_value || ''}
                    onChange={(e) => setEditingParameter({
                      ...editingParameter,
                      min_value: parseFloat(e.target.value)
                    })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Value"
                    type="number"
                    value={editingParameter.max_value || ''}
                    onChange={(e) => setEditingParameter({
                      ...editingParameter,
                      max_value: parseFloat(e.target.value)
                    })}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingParameter(null)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveParameter}
            variant="contained"
            disabled={updateParameterMutation.isLoading}
          >
            {updateParameterMutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParameterList; 