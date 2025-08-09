import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import { Alert, AlertDescription } from '@/design-system/components/Alert';

import { DistributionChart } from './DistributionChart';
import { ScatterPlot } from './ScatterPlot';

import { Download, AlertCircle, Target, BarChart3 } from 'lucide-react';

interface SimulationResult {
  simulation_id: string;
  name: string;
  scenario_id: number;
  status: string;
  iterations: number;
  execution_time: number;
  results: Record<string, number[]>;
  statistics: Record<string, any>;
  risk_metrics: Record<string, any>;
  distributions: Record<number, any>;
  correlations: Record<string, number>;
  output_metrics: string[];
  created_at: string;
  completed_at: string;
}

interface SimulationResultsProps {
  simulationId: string;
  onClose?: () => void;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  simulationId,
  onClose,
}) => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/scenarios/monte-carlo/${simulationId}/results`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch simulation results');
      }

      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, [simulationId]);

  useEffect(() => {
    fetchResults();
  }, [simulationId, fetchResults]);

  useEffect(() => {
    if (result?.output_metrics && result.output_metrics.length > 0) {
      setSelectedMetric(result.output_metrics[0]);
    }
  }, [result]);

  const exportResults = async () => {
    try {
      const response = await fetch(
        `/api/v1/scenarios/monte-carlo/${simulationId}/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export results');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monte-carlo-results-${simulationId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export results');
    }
  };

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else {
      return value.toFixed(2);
    }
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRiskLevel = (
    probability: number
  ): { color: string; label: string } => {
    if (probability >= 0.3)
      return { color: 'text-red-600', label: 'High Risk' };
    if (probability >= 0.15)
      return { color: 'text-orange-600', label: 'Medium Risk' };
    if (probability >= 0.05)
      return { color: 'text-yellow-600', label: 'Low Risk' };
    return { color: 'text-green-600', label: 'Very Low Risk' };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading simulation results...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No results available
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedStats = selectedMetric
    ? result.statistics[selectedMetric]
    : null;
  const selectedRiskMetrics = selectedMetric
    ? result.risk_metrics[selectedMetric]
    : null;
  const selectedData = selectedMetric ? result.results[selectedMetric] : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Simulation Results</h2>
          <p className="text-muted-foreground">
            {result.name} • {result.iterations.toLocaleString()} iterations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {result.iterations.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Iterations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {result.execution_time?.toFixed(2)}s
            </div>
            <div className="text-sm text-muted-foreground">Execution Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {result.output_metrics?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Output Metrics</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(result.distributions || {}).length}
            </div>
            <div className="text-sm text-muted-foreground">Variables</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Metric Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Output Metric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.output_metrics?.map(metric => (
                  <Button
                    key={metric}
                    variant={selectedMetric === metric ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetric(metric)}
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Metric Statistics */}
          {selectedStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Statistical Summary</span>
                  </CardTitle>
                  <CardDescription>{selectedMetric}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Mean</div>
                      <div className="text-lg font-semibold">
                        {formatValue(selectedStats.mean)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Std Dev
                      </div>
                      <div className="text-lg font-semibold">
                        {formatValue(selectedStats.std_dev)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Minimum
                      </div>
                      <div className="text-lg font-semibold text-red-600">
                        {formatValue(selectedStats.min)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Maximum
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatValue(selectedStats.max)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Percentiles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        label: '5th Percentile',
                        value: selectedStats.percentile_5,
                        color: 'text-red-600',
                      },
                      {
                        label: '25th Percentile',
                        value: selectedStats.percentile_25,
                        color: 'text-orange-600',
                      },
                      {
                        label: '50th Percentile (Median)',
                        value: selectedStats.percentile_50,
                        color: 'text-blue-600',
                      },
                      {
                        label: '75th Percentile',
                        value: selectedStats.percentile_75,
                        color: 'text-green-600',
                      },
                      {
                        label: '95th Percentile',
                        value: selectedStats.percentile_95,
                        color: 'text-green-700',
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {label}
                        </span>
                        <span className={`font-semibold ${color}`}>
                          {formatValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4">
          {selectedData && selectedStats && (
            <DistributionChart
              data={{
                values: selectedData.slice(0, 50), // Sample for visualization
                bin_edges: Array.from(
                  { length: 51 },
                  (_, i) =>
                    selectedStats.min +
                    (i / 50) * (selectedStats.max - selectedStats.min)
                ),
                title: selectedMetric,
              }}
              stats={selectedStats}
              title={`Distribution: ${selectedMetric}`}
            />
          )}
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {result.output_metrics?.map(metric => {
              const correlation = result.correlations?.[`1,${metric}`] || 0; // Simplified correlation lookup
              const xData = Array.from(
                { length: 100 },
                () => Math.random() * 100
              );
              const yData = result.results[metric]?.slice(0, 100) || [];

              const scatterData = xData.map((x, i) => ({
                x,
                y: yData[i] || 0,
              }));

              return (
                <ScatterPlot
                  key={metric}
                  data={scatterData}
                  xLabel="Parameter Value"
                  yLabel={metric}
                  title={`${metric} Correlation`}
                  correlation={correlation}
                  width={350}
                  height={250}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {selectedRiskMetrics && (
            <>
              {/* Risk Metrics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">
                      Value at Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">VaR (95%)</span>
                        <span className="font-semibold">
                          {formatValue(selectedRiskMetrics.VaR_95)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">VaR (99%)</span>
                        <span className="font-semibold">
                          {formatValue(selectedRiskMetrics.VaR_99)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-600">
                      Expected Shortfall
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">CVaR (95%)</span>
                        <span className="font-semibold">
                          {formatValue(selectedRiskMetrics.CVaR_95)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">CVaR (99%)</span>
                        <span className="font-semibold">
                          {formatValue(selectedRiskMetrics.CVaR_99)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">
                      Loss Probability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatPercent(selectedRiskMetrics.probability_of_loss)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Probability of Loss
                      </div>
                      <Badge
                        className={`mt-2 ${
                          getRiskLevel(selectedRiskMetrics.probability_of_loss)
                            .color
                        }`}
                        variant="outline"
                      >
                        {
                          getRiskLevel(selectedRiskMetrics.probability_of_loss)
                            .label
                        }
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Risk Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">Downside Risk</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Maximum Loss</span>
                          <span className="font-semibold text-red-600">
                            {formatValue(selectedRiskMetrics.maximum_loss)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Shortfall</span>
                          <span className="font-semibold text-red-500">
                            {formatValue(
                              selectedRiskMetrics.expected_shortfall
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Downside Deviation</span>
                          <span className="font-semibold">
                            {formatValue(
                              selectedRiskMetrics.downside_deviation
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">Upside Potential</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Maximum Gain</span>
                          <span className="font-semibold text-green-600">
                            {formatValue(selectedRiskMetrics.maximum_gain)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Probability of Gain</span>
                          <span className="font-semibold text-green-500">
                            {formatPercent(
                              1 - selectedRiskMetrics.probability_of_loss
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
