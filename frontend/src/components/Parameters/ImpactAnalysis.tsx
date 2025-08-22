import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import { Button } from '@/design-system/atoms';
import { Input } from '@/design-system/atoms';
import { Label } from '@/design-system/atoms';
import { Badge } from '@/design-system/atoms';
import { Alert, AlertDescription } from '@/design-system/molecules';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart, Loader } from 'lucide-react';
import type { Parameter } from './ParameterPanel';

interface ImpactAnalysisProps {
  parameter: Parameter;
  modelId: string;
  onClose: () => void;
}

interface ImpactResult {
  parameter_value: number;
  cell_values: Record<string, number>;
  percentage_changes: Record<string, number>;
}

interface AnalysisData {
  parameter_id: string;
  value_range: [number, number];
  results: ImpactResult[];
  summary: {
    most_sensitive_cells: Array<[string, number]>;
    total_affected_cells: number;
    max_sensitivity: number;
    min_sensitivity: number;
  };
}

export function ImpactAnalysis({ parameter, onClose }: ImpactAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minValue, setMinValue] = useState(
    parameter.min_value?.toString() || (parameter.value * 0.5).toString()
  );
  const [maxValue, setMaxValue] = useState(
    parameter.max_value?.toString() || (parameter.value * 1.5).toString()
  );
  const [steps, setSteps] = useState('10');

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/parameters/${parameter.id}/impact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            value_range: {
              min: parseFloat(minValue),
              max: parseFloat(maxValue),
            },
            steps: parseInt(steps),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data);
      } else {
        setError('Failed to run impact analysis');
      }
    } catch (_err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number) => {
    switch (parameter.display_format) {
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      default:
        return value.toFixed(4);
    }
  };

  const prepareChartData = () => {
    if (!analysisData) return [];

    return analysisData.results.map(result => ({
      parameterValue: result.parameter_value,
      formattedValue: formatValue(result.parameter_value),
      ...result.percentage_changes,
    }));
  };

  const getTopSensitiveCells = () => {
    if (!analysisData) return [];
    return analysisData.summary.most_sensitive_cells.slice(0, 5);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Impact Analysis: {parameter.display_name || parameter.name}
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Analysis Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="min-value">Minimum Value</Label>
              <Input
                id="min-value"
                type="number"
                step="0.0001"
                value={minValue}
                onChange={e => setMinValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-value">Maximum Value</Label>
              <Input
                id="max-value"
                type="number"
                step="0.0001"
                value={maxValue}
                onChange={e => setMaxValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="steps">Analysis Steps</Label>
              <Input
                id="steps"
                type="number"
                min="5"
                max="50"
                value={steps}
                onChange={e => setSteps(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={runAnalysis}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Run Analysis
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {analysisData && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisData.summary.total_affected_cells}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Affected Cells
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(analysisData.summary.max_sensitivity || 0).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Max Impact
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatValue(parseFloat(minValue))} -{' '}
                        {formatValue(parseFloat(maxValue))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Value Range
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analysisData.results.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Data Points
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Sensitive Cells */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Sensitive Cells</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getTopSensitiveCells().map(
                      ([cellRef, sensitivity], index) => (
                        <div
                          key={cellRef}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <span className="font-mono text-sm">{cellRef}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {sensitivity > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">
                              {Math.abs(sensitivity).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Impact Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Parameter Impact Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="formattedValue"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          label={{
                            value: 'Impact (%)',
                            angle: -90,
                            position: 'insideLeft',
                          }}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            `${value.toFixed(2)}%`,
                            name,
                          ]}
                          labelFormatter={label => `Parameter Value: ${label}`}
                        />
                        <Legend />
                        {getTopSensitiveCells()
                          .slice(0, 3)
                          .map(([cellRef], index) => (
                            <Line
                              key={cellRef}
                              type="monotone"
                              dataKey={cellRef}
                              stroke={
                                [
                                  'var(--chart-1)',
                                  'var(--chart-2)',
                                  'var(--chart-3)',
                                ][index]
                              }
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              name={cellRef}
                            />
                          ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
