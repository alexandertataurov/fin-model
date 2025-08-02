import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Info,
  History,
  BarChart3,
} from 'lucide-react';
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
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(
    null
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState<number | null>(
    null
  );

  const queryClient = useQueryClient();

  // Fetch parameters
  const {
    data: parameters = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Parameter[]>({
    queryKey: ['parameters', fileId],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/parameters${fileId ? `?file_id=${fileId}` : ''}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch parameters');
      }
      return response.json();
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['parameter-categories'],
    queryFn: async () => {
      const response = await fetch('/api/v1/parameters/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
  });

  // Delete parameter mutation
  const deleteMutation = useMutation({
    mutationFn: async (parameterId: number) => {
      const response = await fetch(`/api/v1/parameters/${parameterId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete parameter');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parameters'] });
    },
  });

  // Update parameter mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; value: number }) => {
      const response = await fetch(`/api/v1/parameters/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: data.value }),
      });
      if (!response.ok) {
        throw new Error('Failed to update parameter');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parameters'] });
    },
  });

  // Filter parameters based on selected filters
  const filteredParameters = parameters.filter(parameter => {
    if (selectedCategory !== 'all' && parameter.category !== selectedCategory)
      return false;
    if (selectedType !== 'all' && parameter.parameter_type !== selectedType)
      return false;
    if (
      selectedSensitivity !== 'all' &&
      parameter.sensitivity_level !== selectedSensitivity
    )
      return false;
    return true;
  });

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleSensitivityChange = (value: string) => {
    setSelectedSensitivity(value);
  };

  const handleEditParameter = (parameter: Parameter) => {
    setEditingParameter(parameter);
  };

  const handleDeleteParameter = (parameterId: number) => {
    if (confirm('Are you sure you want to delete this parameter?')) {
      deleteMutation.mutate(parameterId);
    }
  };

  const handleUpdateParameter = (parameterId: number, newValue: number) => {
    updateMutation.mutate({ id: parameterId, value: newValue });
  };

  const formatValue = (parameter: Parameter): string => {
    switch (parameter.format_type) {
      case 'percentage':
        return `${parameter.current_value.toFixed(2)}%`;
      case 'currency':
        return `$${parameter.current_value.toLocaleString()}`;
      default:
        return parameter.current_value.toLocaleString();
    }
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load parameters:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Parameters</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.category} value={category.category}>
                  {category.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="input">Input</SelectItem>
              <SelectItem value="calculated">Calculated</SelectItem>
              <SelectItem value="derived">Derived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedSensitivity}
            onValueChange={handleSensitivityChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sensitivity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sensitivity Levels</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Parameters Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Parameter List</h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sensitivity</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParameters.map(parameter => (
                  <TableRow key={parameter.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {parameter.display_name || parameter.name}
                        </p>
                        {parameter.description && (
                          <p className="text-sm text-muted-foreground">
                            {parameter.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{parameter.category}</TableCell>
                    <TableCell>{parameter.parameter_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getSensitivityColor(
                          parameter.sensitivity_level
                        )}
                      >
                        {parameter.sensitivity_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatValue(parameter)}
                        </span>
                        {parameter.unit && (
                          <span className="text-sm text-muted-foreground">
                            {parameter.unit}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditParameter(parameter)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit parameter</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setHistoryDialogOpen(true)}
                              >
                                <History className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View history</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteParameter(parameter.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete parameter</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Parameter Dialog */}
      <Dialog
        open={!!editingParameter}
        onOpenChange={() => setEditingParameter(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Parameter</DialogTitle>
            <DialogDescription>
              Update the value for{' '}
              {editingParameter?.display_name || editingParameter?.name}
            </DialogDescription>
          </DialogHeader>
          {editingParameter && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Value</label>
                <Input
                  type="number"
                  defaultValue={editingParameter.current_value}
                  onChange={e => {
                    const newValue = Number(e.target.value);
                    if (!isNaN(newValue)) {
                      handleUpdateParameter(editingParameter.id, newValue);
                    }
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingParameter(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parameter History</DialogTitle>
            <DialogDescription>
              View the change history for this parameter
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              History feature coming soon...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParameterList;
