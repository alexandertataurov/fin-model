import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/design-system/molecules';
import { Button } from '@/design-system/atoms';
import { Input } from '@/design-system/atoms';
import { Label } from '@/design-system/atoms';
import { Badge } from '@/design-system/atoms';
import { Alert, AlertDescription } from '@/design-system/molecules';
import { Slider } from '@/design-system/atoms';
import { Textarea } from '@/design-system/atoms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/design-system/molecules';
import { Edit, Save, X, Info, TrendingUp, TrendingDown } from 'lucide-react';
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
  onValueChange?: (
    parameterId: number,
    newValue: number,
    changeReason?: string
  ) => void;
  readonly?: boolean;
  compact?: boolean;
}

const ParameterEditor: React.FC<ParameterEditorProps> = ({
  parameter,
  onValueChange,
  readonly = false,
  compact = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(parameter.current_value);
  const [changeReason, setChangeReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

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

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      return response.json() as Promise<ParameterValidation>;
    },
    enabled: editValue !== parameter.current_value,
  });

  // Update parameter mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { value: number; reason?: string }) => {
      const response = await fetch(`/api/v1/parameters/${parameter.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update parameter');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parameters'] });
      setIsEditing(false);
      setValidationError(null);
    },
    onError: error => {
      setValidationError(
        error instanceof Error ? error.message : 'Update failed'
      );
    },
  });

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

  const formatValue = (value: number) => {
    switch (parameter.format_type) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  const handleEditStart = () => {
    setEditValue(parameter.current_value);
    setChangeReason('');
    setValidationError(null);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(parameter.current_value);
    setValidationError(null);
  };

  const handleEditSave = async () => {
    if (validation && !validation.is_valid) {
      setValidationError(validation.validation_errors.join(', '));
      return;
    }

    updateMutation.mutate({
      value: editValue,
      reason: changeReason || undefined,
    });

    onValueChange?.(parameter.id, editValue, changeReason);
  };

  const handleValueChange = (newValue: number) => {
    setEditValue(newValue);
    setValidationError(null);
  };

  const handleSliderChange = (value: number[]) => {
    handleValueChange(value[0]);
  };

  const getTrendIndicator = () => {
    if (parameter.current_value > (parameter.default_value || 0)) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (parameter.current_value < (parameter.default_value || 0)) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium text-sm">
                {parameter.display_name || parameter.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {parameter.description}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={getSensitivityColor(parameter.sensitivity_level)}
            >
              {parameter.sensitivity_level}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {formatValue(parameter.current_value)}
            </span>
            {getTrendIndicator()}
            {!readonly && parameter.is_editable && (
              <Button variant="ghost" size="sm" onClick={handleEditStart}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">
              {parameter.display_name || parameter.name}
            </h3>
            <Badge
              variant="secondary"
              className={getSensitivityColor(parameter.sensitivity_level)}
            >
              {parameter.sensitivity_level}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIndicator()}
            {!readonly && parameter.is_editable && !isEditing && (
              <Button variant="outline" size="sm" onClick={handleEditStart}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        {parameter.description && (
          <p className="text-sm text-muted-foreground">
            {parameter.description}
          </p>
        )}

        {/* Current Value Display */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <Label className="text-sm font-medium">Current Value</Label>
            <p className="text-2xl font-bold">
              {formatValue(parameter.current_value)}
            </p>
          </div>
          {parameter.default_value !== undefined && (
            <div className="text-right">
              <Label className="text-sm text-muted-foreground">Default</Label>
              <p className="text-sm">{formatValue(parameter.default_value)}</p>
            </div>
          )}
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="value">New Value</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="value"
                  type="number"
                  value={editValue}
                  onChange={e => handleValueChange(Number(e.target.value))}
                  className="flex-1"
                />
                {parameter.unit && (
                  <span className="text-sm text-muted-foreground">
                    {parameter.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Slider for range */}
            {parameter.min_value !== undefined &&
              parameter.max_value !== undefined && (
                <div className="space-y-2">
                  <Label>Adjust Value</Label>
                  <Slider
                    value={[editValue]}
                    onValueChange={handleSliderChange}
                    min={parameter.min_value}
                    max={parameter.max_value}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatValue(parameter.min_value)}</span>
                    <span>{formatValue(parameter.max_value)}</span>
                  </div>
                </div>
              )}

            {/* Change Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Change Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={changeReason}
                onChange={e => setChangeReason(e.target.value)}
                placeholder="Explain why this value is being changed..."
                rows={2}
              />
            </div>

            {/* Validation Error */}
            {validationError && (
              <Alert>
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleEditSave}
                disabled={validating || updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleEditCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Advanced Information */}
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Advanced Information
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Parameter Type
                  </Label>
                  <p>{parameter.parameter_type}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Category
                  </Label>
                  <p>{parameter.category}</p>
                </div>
                {parameter.source_sheet && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Source Sheet
                    </Label>
                    <p>{parameter.source_sheet}</p>
                  </div>
                )}
                {parameter.source_cell && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Source Cell
                    </Label>
                    <p>{parameter.source_cell}</p>
                  </div>
                )}
                {parameter.formula && (
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">
                      Formula
                    </Label>
                    <p className="font-mono text-xs bg-muted p-2 rounded">
                      {parameter.formula}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ParameterEditor;
