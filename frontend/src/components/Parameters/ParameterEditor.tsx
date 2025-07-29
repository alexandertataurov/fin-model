import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Slider,
  Button,
  IconButton,
  Chip,
  Alert,
  Tooltip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
}

interface ParameterValidation {
  is_valid: boolean;
  validation_errors: string[];
  suggested_value?: number;
}

interface ParameterEditorProps {
  parameter: Parameter;
  onValueChange?: (parameterId: number, newValue: number, changeReason?: string) => void;
  readonly?: boolean;
  showDependencies?: boolean;
  compact?: boolean;
}

const ParameterEditor: React.FC<ParameterEditorProps> = ({
  parameter,
  onValueChange,
  readonly = false,
  showDependencies = true,
  compact = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(parameter.current_value);
  const [changeReason, setChangeReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const queryClient = useQueryClient();

  // Validation query
  const { data: validation, isLoading: validating } = useQuery({
    queryKey: ['parameter-validation', parameter.id, editValue],
    queryFn: async () => {
      if (editValue === parameter.current_value) return null;
      
      const response = await fetch('/api/v1/parameters/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parameter_id: parameter.id,
          value: editValue,
        }),
      });
      
      if (!response.ok) throw new Error('Validation failed');
      return await response.json() as ParameterValidation;
    },
    enabled: isEditing && editValue !== parameter.current_value,
    staleTime: 1000, // 1 second
  });

  // Update parameter mutation
  const updateParameterMutation = useMutation({
    mutationFn: async ({ value, reason }: { value: number; reason?: string }) => {
      const response = await fetch(`/api/v1/parameters/${parameter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_value: value,
          change_reason: reason,
        }),
      });
      
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parameters'] });
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      setIsEditing(false);
      setChangeReason('');
    },
  });

  // Format value display
  const formatValue = useCallback((value: number) => {
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
  }, [parameter.format_type]);

  // Get sensitivity color
  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  // Handle edit start
  const handleEditStart = () => {
    if (!parameter.is_editable || readonly) return;
    setIsEditing(true);
    setEditValue(parameter.current_value);
    setValidationError(null);
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(parameter.current_value);
    setChangeReason('');
    setValidationError(null);
  };

  // Handle edit save
  const handleEditSave = async () => {
    if (validation && !validation.is_valid) {
      setValidationError(validation.validation_errors.join(', '));
      return;
    }

    try {
      if (onValueChange) {
        onValueChange(parameter.id, editValue, changeReason || undefined);
      } else {
        await updateParameterMutation.mutateAsync({
          value: editValue,
          reason: changeReason || undefined,
        });
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Update failed');
    }
  };

  // Handle value change
  const handleValueChange = (newValue: number) => {
    setEditValue(newValue);
    setValidationError(null);
  };

  // Handle slider change
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      handleValueChange(newValue);
    }
  };

  // Get trend indicator
  const getTrendIndicator = () => {
    if (editValue > parameter.current_value) {
      return <TrendingUpIcon color="success" fontSize="small" />;
    } else if (editValue < parameter.current_value) {
      return <TrendingDownIcon color="error" fontSize="small" />;
    }
    return null;
  };

  // Render compact view
  if (compact) {
    return (
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {parameter.display_name || parameter.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatValue(parameter.current_value)}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                size="small"
                label={parameter.sensitivity_level}
                sx={{
                  backgroundColor: getSensitivityColor(parameter.sensitivity_level),
                  color: 'white',
                  fontSize: '0.7rem',
                }}
              />
              
              {!readonly && parameter.is_editable && (
                <IconButton size="small" onClick={handleEditStart}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Main component render
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h6" component="h3">
              {parameter.display_name || parameter.name}
            </Typography>
            {parameter.description && (
              <Typography variant="body2" color="text.secondary">
                {parameter.description}
              </Typography>
            )}
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              size="small"
              label={parameter.sensitivity_level}
              sx={{
                backgroundColor: getSensitivityColor(parameter.sensitivity_level),
                color: 'white',
              }}
            />
            
            {parameter.source_cell && (
              <Tooltip title={`Source: ${parameter.source_sheet}!${parameter.source_cell}`}>
                <Chip
                  size="small"
                  label={parameter.source_cell}
                  variant="outlined"
                  icon={<InfoIcon />}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Value Editor */}
        <Box mb={2}>
          {isEditing ? (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={editValue}
                  onChange={(e) => handleValueChange(Number(e.target.value))}
                  error={!!validationError || (validation ? !validation.is_valid : false)}
                  helperText={
                    validationError ||
                    (validation && !validation.is_valid 
                      ? validation.validation_errors.join(', ')
                      : `Current: ${formatValue(parameter.current_value)}`
                    )
                  }
                  InputProps={{
                    startAdornment: parameter.unit && (
                      <InputAdornment position="start">{parameter.unit}</InputAdornment>
                    ),
                    endAdornment: getTrendIndicator() && (
                      <InputAdornment position="end">{getTrendIndicator()}</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Slider for range inputs */}
              {parameter.min_value !== undefined && parameter.max_value !== undefined && (
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" gutterBottom>
                    Range: {formatValue(parameter.min_value)} - {formatValue(parameter.max_value)}
                  </Typography>
                  <Slider
                    value={editValue}
                    onChange={handleSliderChange}
                    min={parameter.min_value}
                    max={parameter.max_value}
                    step={(parameter.max_value - parameter.min_value) / 100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={formatValue}
                  />
                </Grid>
              )}
              
              {/* Change Reason */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Change Reason (Optional)"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Why are you changing this value?"
                  size="small"
                />
              </Grid>
              
              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleEditSave}
                    disabled={
                      validating ||
                      (validation && !validation.is_valid) ||
                      updateParameterMutation.isPending
                    }
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </Button>
                  
                  {validation && validation.suggested_value !== undefined && (
                    <Button
                      variant="text"
                      onClick={() => handleValueChange(validation.suggested_value ?? 0)}
                    >
                      Use Suggested: {formatValue(validation.suggested_value)}
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h4" component="div">
                {formatValue(parameter.current_value)}
              </Typography>
              
              {!readonly && parameter.is_editable && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditStart}
                >
                  Edit
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Advanced Information */}
        {showDependencies && (parameter.depends_on?.length || parameter.affects?.length || parameter.formula) && (
          <Accordion expanded={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Advanced Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Formula */}
                {parameter.formula && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Formula:
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {parameter.formula}
                    </Typography>
                  </Grid>
                )}
                
                {/* Dependencies */}
                {parameter.depends_on?.length && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Depends On:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                      {parameter.depends_on.map((dep, index) => (
                        <Chip key={index} size="small" label={dep} variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {/* Affects */}
                {parameter.affects?.length && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Affects:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                      {parameter.affects?.map((affect, index) => (
                        <Chip key={index} size="small" label={affect} variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {/* Validation Rules */}
                {parameter.validation_rules && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Validation Rules:
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {JSON.stringify(parameter.validation_rules, null, 2)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Validation Warnings */}
        {validation && validation.is_valid && editValue !== parameter.current_value && (
          <Alert severity="info" sx={{ mt: 1 }}>
            Value change is valid. Impact will be calculated after save.
          </Alert>
        )}
        
        {validation && !validation.is_valid && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            <Typography variant="body2">
              {validation.validation_errors.join(', ')}
            </Typography>
            {validation.suggested_value && (
              <Typography variant="caption">
                Suggested value: {formatValue(validation.suggested_value)}
              </Typography>
            )}
          </Alert>
        )}
        
        {!parameter.is_editable && (
          <Alert severity="info" sx={{ mt: 1 }}>
            This parameter is calculated automatically and cannot be edited.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterEditor; 