import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import { Button } from '@/design-system/atoms';
import { Badge } from '@/design-system/atoms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/design-system/molecules';
import { Progress } from '@/design-system/atoms';
import { Alert, AlertDescription } from '@/design-system/molecules';
import {
  Search,
  RotateCcw,
  CheckCircle,
  Settings,
  Calculator,
  LayoutTemplate,
  Download,
  Undo,
  Redo,
} from 'lucide-react';
import { ParameterGroup } from './ParameterGroup';
import { ParameterSearch } from './ParameterSearch';
import { BulkParameterEdit } from './BulkParameterEdit';
import { ImpactAnalysis } from './ImpactAnalysis';
import { ParameterHistory } from './ParameterHistory';
import { ParameterTemplates } from './ParameterTemplates';
import { ParameterExport } from './ParameterExport';

export interface Parameter {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  type: string;
  category: string;
  value: number;
  default_value: number;
  min_value?: number;
  max_value?: number;
  control_type: 'slider' | 'input' | 'dropdown';
  display_format: 'number' | 'percentage' | 'currency';
  step_size?: number;
  group_id?: string;
  is_editable: boolean;
  source_cell?: string;
  updated_at?: string;
}

export interface ParameterGroupData {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_expanded: boolean;
  parameters: Parameter[];
}

interface ParameterPanelProps {
  modelId: string;
  onParameterChange?: (parameterId: string, value: number) => void;
  onBulkParameterChange?: (
    updates: Array<{ id: string; value: number }>
  ) => void;
  readOnly?: boolean;
}

export function ParameterPanel({
  modelId,
  onParameterChange,
  onBulkParameterChange,
  readOnly = false,
}: ParameterPanelProps) {
  const [parameterGroups, setParameterGroups] = useState<ParameterGroupData[]>(
    []
  );
  const [ungroupedParameters, setUngroupedParameters] = useState<Parameter[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [lastCalculationTime, setLastCalculationTime] = useState<number | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>(
    {}
  );
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showImpactAnalysis, setShowImpactAnalysis] =
    useState<Parameter | null>(null);
  const [showHistory, setShowHistory] = useState<Parameter | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [undoHistory, setUndoHistory] = useState<
    Array<{ parameterId: string; oldValue: number; newValue: number }>
  >([]);
  const [redoHistory, setRedoHistory] = useState<
    Array<{ parameterId: string; oldValue: number; newValue: number }>
  >([]);

  // Load parameter groups and data
  const loadParameterData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/v1/parameters/models/${modelId}/parameter-groups`
      );
      if (response.ok) {
        const data = await response.json();
        setParameterGroups(data.grouped_parameters || []);
        setUngroupedParameters(data.ungrouped_parameters || []);
      }
    } catch (error) {
      console.error('Failed to load parameter data:', error);
    }
  }, [modelId]);

  useEffect(() => {
    loadParameterData();
  }, [loadParameterData]);

  // Handle parameter value changes
  const handleParameterChange = useCallback(
    async (parameterId: string, value: number) => {
      if (readOnly) return;

      // Update pending changes
      setPendingChanges(prev => ({ ...prev, [parameterId]: value }));

      // Clear any existing validation errors for this parameter
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[parameterId];
        return newErrors;
      });

      // Validate parameter value
      try {
        const response = await fetch(
          `/api/v1/parameters/${parameterId}/validate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
          }
        );

        const validation = await response.json();
        if (!validation.is_valid) {
          setValidationErrors(prev => ({
            ...prev,
            [parameterId]: validation.validation_errors.join(', '),
          }));
          return;
        }
      } catch (error) {
        console.error('Validation failed:', error);
        return;
      }

      // Trigger recalculation
      setIsRecalculating(true);
      setCalculationProgress(0);

      try {
        const response = await fetch(
          `/api/v1/parameters/${parameterId}/value`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              value,
              reason: 'User adjustment',
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          setLastCalculationTime(result.calculation_time);
          setCalculationProgress(100);

          // Add to undo history
          const currentParam = [
            ...parameterGroups.flatMap(g => g.parameters),
            ...ungroupedParameters,
          ].find(p => p.id === parameterId);
          if (currentParam) {
            setUndoHistory(prev => [
              ...prev,
              {
                parameterId,
                oldValue: currentParam.value,
                newValue: value,
              },
            ]);
            setRedoHistory([]); // Clear redo history when new change is made
          }

          // Remove from pending changes
          setPendingChanges(prev => {
            const newPending = { ...prev };
            delete newPending[parameterId];
            return newPending;
          });

          // Call callback
          onParameterChange?.(parameterId, value);

          // Reload data to get updated values
          await loadParameterData();
        }
      } catch (error) {
        console.error('Parameter update failed:', error);
        setValidationErrors(prev => ({
          ...prev,
          [parameterId]: 'Failed to update parameter',
        }));
      } finally {
        setIsRecalculating(false);
      }
    },
    [
      readOnly,
      onParameterChange,
      loadParameterData,
      parameterGroups,
      ungroupedParameters,
    ]
  );

  // Handle bulk parameter updates
  const handleBulkUpdate = useCallback(
    async (updates: Array<{ id: string; value: number }>) => {
      if (readOnly) return;

      setIsRecalculating(true);
      setCalculationProgress(0);

      try {
        const response = await fetch(
          `/api/v1/parameters/models/${modelId}/parameters/batch`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          setLastCalculationTime(result.calculation_time);
          setCalculationProgress(100);

          // Clear pending changes for updated parameters
          setPendingChanges(prev => {
            const newPending = { ...prev };
            updates.forEach(update => {
              delete newPending[update.id];
            });
            return newPending;
          });

          onBulkParameterChange?.(updates);
          await loadParameterData();
        }
      } catch (error) {
        console.error('Bulk update failed:', error);
      } finally {
        setIsRecalculating(false);
      }
    },
    [readOnly, onBulkParameterChange, loadParameterData, modelId]
  );

  // Reset parameters to default
  const resetParametersToDefault = useCallback(async () => {
    if (readOnly) return;

    const allParameterIds = [
      ...parameterGroups.flatMap(group => group.parameters.map(p => p.id)),
      ...ungroupedParameters.map(p => p.id),
    ];

    try {
      const response = await fetch(
        `/api/v1/parameters/models/${modelId}/reset-parameters`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parameter_ids: allParameterIds }),
        }
      );

      if (response.ok) {
        setPendingChanges({});
        setValidationErrors({});
        await loadParameterData();
      }
    } catch (error) {
      console.error('Reset failed:', error);
    }
  }, [
    readOnly,
    parameterGroups,
    ungroupedParameters,
    modelId,
    loadParameterData,
  ]);

  // Undo/Redo functionality
  const handleUndo = useCallback(async () => {
    if (undoHistory.length === 0) return;

    const lastChange = undoHistory[undoHistory.length - 1];

    // Add to redo history
    setRedoHistory(prev => [...prev, lastChange]);

    // Remove from undo history
    setUndoHistory(prev => prev.slice(0, -1));

    // Apply the old value
    await handleParameterChange(lastChange.parameterId, lastChange.oldValue);
  }, [undoHistory, handleParameterChange]);

  const handleRedo = useCallback(async () => {
    if (redoHistory.length === 0) return;

    const lastUndo = redoHistory[redoHistory.length - 1];

    // Add to undo history
    setUndoHistory(prev => [...prev, lastUndo]);

    // Remove from redo history
    setRedoHistory(prev => prev.slice(0, -1));

    // Apply the new value
    await handleParameterChange(lastUndo.parameterId, lastUndo.newValue);
  }, [redoHistory, handleParameterChange]);

  // Filter parameters based on search and category
  const filterParameters = useCallback(
    (parameters: Parameter[]) => {
      return parameters.filter(param => {
        const matchesSearch =
          !searchTerm ||
          param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          param.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' || param.category === selectedCategory;

        return matchesSearch && matchesCategory;
      });
    },
    [searchTerm, selectedCategory]
  );

  const categories = [
    'all',
    ...new Set([
      ...parameterGroups.flatMap(group =>
        group.parameters.map(p => p.category)
      ),
      ...ungroupedParameters.map(p => p.category),
    ]),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Parameter Management</h2>
          <p className="text-muted-foreground">
            Adjust model parameters and see real-time recalculation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={undoHistory.length === 0}
                title="Undo last change"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={redoHistory.length === 0}
                title="Redo last undone change"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(true)}
              >
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExport(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkEdit(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Bulk Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetParametersToDefault}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Calculation Status */}
      {isRecalculating && (
        <Alert>
          <Calculator className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Recalculating model...</span>
              <Progress value={calculationProgress} className="w-32" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {lastCalculationTime && !isRecalculating && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Model recalculated successfully in {lastCalculationTime.toFixed(2)}s
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ParameterSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        </CardContent>
      </Card>

      {/* Parameter Groups */}
      <div className="space-y-4">
        {parameterGroups.length > 0 && (
          <Accordion
            type="multiple"
            defaultValue={parameterGroups.map(g => g.id)}
          >
            {parameterGroups.map(group => (
              <AccordionItem key={group.id} value={group.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{group.name}</span>
                    <Badge variant="secondary">
                      {filterParameters(group.parameters).length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ParameterGroup
                    parameters={filterParameters(group.parameters)}
                    onParameterChange={handleParameterChange}
                    validationErrors={validationErrors}
                    pendingChanges={pendingChanges}
                    readOnly={readOnly}
                    onShowImpact={setShowImpactAnalysis}
                    onShowHistory={setShowHistory}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Ungrouped Parameters */}
        {ungroupedParameters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Other Parameters</span>
                <Badge variant="secondary">
                  {filterParameters(ungroupedParameters).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ParameterGroup
                parameters={filterParameters(ungroupedParameters)}
                onParameterChange={handleParameterChange}
                validationErrors={validationErrors}
                pendingChanges={pendingChanges}
                readOnly={readOnly}
                onShowImpact={setShowImpactAnalysis}
                onShowHistory={setShowHistory}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bulk Edit Modal */}
      {showBulkEdit && (
        <BulkParameterEdit
          parameters={[
            ...parameterGroups.flatMap(group => group.parameters),
            ...ungroupedParameters,
          ]}
          onBulkUpdate={handleBulkUpdate}
          onClose={() => setShowBulkEdit(false)}
        />
      )}

      {/* Impact Analysis Modal */}
      {showImpactAnalysis && (
        <ImpactAnalysis
          parameter={showImpactAnalysis}
          modelId={modelId}
          onClose={() => setShowImpactAnalysis(null)}
        />
      )}

      {/* Parameter History Modal */}
      {showHistory && (
        <ParameterHistory
          parameter={showHistory}
          onClose={() => setShowHistory(null)}
          onRevertToValue={value =>
            handleParameterChange(showHistory.id, value)
          }
        />
      )}

      {/* Parameter Templates Modal */}
      {showTemplates && (
        <ParameterTemplates
          modelId={modelId}
          onClose={() => setShowTemplates(false)}
          onTemplateApplied={loadParameterData}
        />
      )}

      {/* Export/Import Modal */}
      {showExport && (
        <ParameterExport
          modelId={modelId}
          parameters={[
            ...parameterGroups.flatMap(g => g.parameters),
            ...ungroupedParameters,
          ]}
          parameterGroups={parameterGroups}
          onClose={() => setShowExport(false)}
          onImportComplete={loadParameterData}
        />
      )}
    </div>
  );
}
