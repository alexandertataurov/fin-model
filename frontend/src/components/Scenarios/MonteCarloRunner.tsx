import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Label } from '@/design-system/components/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
import { Badge } from '@/design-system/components/Badge';
import { Progress } from '@/design-system/components/Progress';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { ScrollArea } from '@/design-system/components/ScrollArea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import {
  Play,
  Settings,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react';

interface Parameter {
  id: number;
  name: string;
  display_name?: string;
  current_value: number;
  min_value?: number;
  max_value?: number;
  parameter_type: string;
}

interface Distribution {
  type: 'normal' | 'uniform' | 'triangular' | 'lognormal';
  mean?: number;
  std_dev?: number;
  min?: number;
  max?: number;
  mode?: number;
  mu?: number;
  sigma?: number;
}

interface ParameterDistribution {
  parameter_id: number;
  parameter_name: string;
  distribution: Distribution;
}

interface SimulationConfig {
  scenario_id: number;
  iterations: number;
  distributions: Record<number, Distribution>;
  output_metrics: string[];
  correlations?: Record<string, number>;
  random_seed?: number;
  name?: string;
}

interface SimulationResult {
  simulation_id: string;
  scenario_id: number;
  status: 'configured' | 'running' | 'completed' | 'error';
  iterations: number;
  execution_time?: number;
  results_summary?: Record<string, any>;
  risk_metrics?: Record<string, number>;
  parameter_correlations?: Record<number, number>;
}

interface MonteCarloRunnerProps {
  scenarioId: number;
  parameters: Parameter[];
  onClose?: () => void;
}

export const MonteCarloRunner: React.FC<MonteCarloRunnerProps> = ({
  scenarioId,
  parameters,
  onClose,
}) => {
  const [parameterDistributions, setParameterDistributions] = useState<
    ParameterDistribution[]
  >([]);
  const [outputMetrics, setOutputMetrics] = useState<string[]>([]);
  const [newOutputMetric, setNewOutputMetric] = useState('');
  const [iterations, setIterations] = useState(10000);
  const [simulationName, setSimulationName] = useState('');
  const [randomSeed, setRandomSeed] = useState<number | undefined>();

  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const addParameterDistribution = () => {
    const availableParams = parameters.filter(
      p => !parameterDistributions.some(pd => pd.parameter_id === p.id)
    );

    if (availableParams.length === 0) return;

    const param = availableParams[0];
    const newDistribution: ParameterDistribution = {
      parameter_id: param.id,
      parameter_name: param.display_name || param.name,
      distribution: {
        type: 'normal',
        mean: param.current_value,
        std_dev: Math.abs(param.current_value * 0.1) || 1,
      },
    };

    setParameterDistributions(prev => [...prev, newDistribution]);
  };

  const updateParameterDistribution = (
    index: number,
    updates: Partial<ParameterDistribution>
  ) => {
    setParameterDistributions(prev =>
      prev.map((pd, i) => (i === index ? { ...pd, ...updates } : pd))
    );
  };

  const removeParameterDistribution = (index: number) => {
    setParameterDistributions(prev => prev.filter((_, i) => i !== index));
  };

  const addOutputMetric = () => {
    if (newOutputMetric && !outputMetrics.includes(newOutputMetric)) {
      setOutputMetrics(prev => [...prev, newOutputMetric]);
      setNewOutputMetric('');
    }
  };

  const removeOutputMetric = (metric: string) => {
    setOutputMetrics(prev => prev.filter(m => m !== metric));
  };

  const setupSimulation = async () => {
    try {
      setLoading(true);
      setError(null);

      const distributions: Record<number, Distribution> = {};
      parameterDistributions.forEach(pd => {
        distributions[pd.parameter_id] = pd.distribution;
      });

      const config: SimulationConfig = {
        scenario_id: scenarioId,
        iterations,
        distributions,
        output_metrics: outputMetrics,
        name:
          simulationName || `Monte Carlo - ${new Date().toLocaleDateString()}`,
        random_seed: randomSeed,
      };

      const response = await fetch(
        `/api/v1/scenarios/${scenarioId}/monte-carlo/setup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(config),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to setup simulation');
      }

      const result = await response.json();
      setSimulationId(result.simulation_id);
      setSimulationResult({
        simulation_id: result.simulation_id,
        scenario_id: scenarioId,
        status: 'configured',
        iterations,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to setup simulation'
      );
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    if (!simulationId) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      // Start simulation
      const response = await fetch(
        `/api/v1/scenarios/${scenarioId}/monte-carlo/run`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            simulation_id: simulationId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to run simulation');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      const result = await response.json();

      clearInterval(progressInterval);
      setProgress(100);
      setSimulationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const getDistributionFields = (
    distribution: Distribution,
    onChange: (updates: Partial<Distribution>) => void
  ) => {
    switch (distribution.type) {
      case 'normal':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Mean</Label>
              <Input
                type="number"
                value={distribution.mean || 0}
                onChange={e => onChange({ mean: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Std Dev</Label>
              <Input
                type="number"
                value={distribution.std_dev || 0}
                onChange={e => onChange({ std_dev: Number(e.target.value) })}
              />
            </div>
          </div>
        );

      case 'uniform':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Min</Label>
              <Input
                type="number"
                value={distribution.min || 0}
                onChange={e => onChange({ min: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Max</Label>
              <Input
                type="number"
                value={distribution.max || 0}
                onChange={e => onChange({ max: Number(e.target.value) })}
              />
            </div>
          </div>
        );

      case 'triangular':
        return (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Min</Label>
              <Input
                type="number"
                value={distribution.min || 0}
                onChange={e => onChange({ min: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Mode</Label>
              <Input
                type="number"
                value={distribution.mode || 0}
                onChange={e => onChange({ mode: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Max</Label>
              <Input
                type="number"
                value={distribution.max || 0}
                onChange={e => onChange({ max: Number(e.target.value) })}
              />
            </div>
          </div>
        );

      case 'lognormal':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>μ (mu)</Label>
              <Input
                type="number"
                value={distribution.mu || 0}
                onChange={e => onChange({ mu: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>σ (sigma)</Label>
              <Input
                type="number"
                value={distribution.sigma || 0}
                onChange={e => onChange({ sigma: Number(e.target.value) })}
              />
            </div>
          </div>
        );

      default:
        return null;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Monte Carlo Simulation</h2>
          <p className="text-muted-foreground">
            Run probabilistic analysis with parameter uncertainty
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="setup" className="w-full">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="results" disabled={!simulationResult}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Configuration</CardTitle>
              <CardDescription>
                Configure the basic simulation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Simulation Name</Label>
                  <Input
                    id="name"
                    value={simulationName}
                    onChange={e => setSimulationName(e.target.value)}
                    placeholder="e.g., Quarterly Forecast"
                  />
                </div>
                <div>
                  <Label htmlFor="iterations">Iterations</Label>
                  <Input
                    id="iterations"
                    type="number"
                    value={iterations}
                    onChange={e => setIterations(Number(e.target.value))}
                    min={1000}
                    max={100000}
                  />
                </div>
                <div>
                  <Label htmlFor="seed">Random Seed (Optional)</Label>
                  <Input
                    id="seed"
                    type="number"
                    value={randomSeed || ''}
                    onChange={e =>
                      setRandomSeed(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="For reproducible results"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parameter Distributions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Parameter Distributions</CardTitle>
                  <CardDescription>
                    Define probability distributions for uncertain parameters
                  </CardDescription>
                </div>
                <Button size="sm" onClick={addParameterDistribution}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {parameterDistributions.map((pd, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium">{pd.parameter_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Parameter ID: {pd.parameter_id}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeParameterDistribution(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label>Distribution Type</Label>
                            <Select
                              value={pd.distribution.type}
                              onValueChange={(value: any) =>
                                updateParameterDistribution(index, {
                                  distribution: {
                                    ...pd.distribution,
                                    type: value,
                                  },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="uniform">Uniform</SelectItem>
                                <SelectItem value="triangular">
                                  Triangular
                                </SelectItem>
                                <SelectItem value="lognormal">
                                  Log-Normal
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {getDistributionFields(pd.distribution, updates =>
                            updateParameterDistribution(index, {
                              distribution: { ...pd.distribution, ...updates },
                            })
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {parameterDistributions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No parameter distributions configured.
                      <br />
                      Add parameters to define uncertainty ranges.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Output Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Output Metrics</CardTitle>
              <CardDescription>
                Specify which cells or metrics to track in the simulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newOutputMetric}
                  onChange={e => setNewOutputMetric(e.target.value)}
                  placeholder="e.g., Sheet1!D10, NPV, Revenue"
                />
                <Button onClick={addOutputMetric}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {outputMetrics.map(metric => (
                  <Badge
                    key={metric}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeOutputMetric(metric)}
                  >
                    {metric}
                    <Trash2 className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>

              {outputMetrics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No output metrics defined. Add cell references or metric names
                  to track.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Run Simulation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-4">
                {!simulationId ? (
                  <Button
                    onClick={setupSimulation}
                    disabled={
                      parameterDistributions.length === 0 ||
                      outputMetrics.length === 0 ||
                      loading
                    }
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Setup Simulation
                  </Button>
                ) : (
                  <Button onClick={runSimulation} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    {loading ? 'Running...' : 'Run Simulation'}
                  </Button>
                )}
              </div>

              {loading && (
                <div className="mt-4 space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    {progress < 100
                      ? `Running simulation... ${Math.round(progress)}%`
                      : 'Completing...'}
                  </p>
                </div>
              )}

              {simulationResult && simulationResult.status === 'configured' && (
                <div className="mt-4 text-center">
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Simulation Configured
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {simulationResult && simulationResult.status === 'completed' && (
            <>
              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Summary</CardTitle>
                  <CardDescription>
                    Results from {simulationResult.iterations.toLocaleString()}{' '}
                    iterations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">
                          {simulationResult.iterations.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Iterations
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">
                          {simulationResult.execution_time?.toFixed(2)}s
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Execution Time
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">
                          {
                            Object.keys(simulationResult.results_summary || {})
                              .length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Output Metrics
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">
                          {parameterDistributions.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Variables
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Results Details */}
              {simulationResult.results_summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Statistical Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {Object.entries(simulationResult.results_summary).map(
                          ([metric, stats]) => (
                            <Card key={metric}>
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  {metric}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="font-medium">Mean</div>
                                    <div className="text-muted-foreground">
                                      {formatValue(stats.mean)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium">Std Dev</div>
                                    <div className="text-muted-foreground">
                                      {formatValue(stats.std_dev)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      5th Percentile
                                    </div>
                                    <div className="text-muted-foreground">
                                      {formatValue(stats.percentile_5)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      95th Percentile
                                    </div>
                                    <div className="text-muted-foreground">
                                      {formatValue(stats.percentile_95)}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {simulationResult && simulationResult.status === 'configured' && (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Simulation Ready</h3>
                <p className="text-muted-foreground mb-4">
                  Configuration complete. Switch to the Setup tab to run the
                  simulation.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
