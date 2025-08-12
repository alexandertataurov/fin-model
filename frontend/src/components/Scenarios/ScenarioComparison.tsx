import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
import { Badge } from '@/design-system/components/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/design-system/components/Table';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { ScrollArea } from '@/design-system/components/ScrollArea';
import { Separator } from '@/design-system/components/Separator';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertCircle,
  BarChart3,
  Minus,
} from 'lucide-react';

interface Scenario {
  id: number;
  name: string;
  description?: string;
  scenario_type: string;
}

interface ParameterDifference {
  parameter_id: number;
  parameter_name: string;
  scenario_1_value: number;
  scenario_2_value: number;
  absolute_difference: number;
  percent_change: number;
  scenario_1_has_override: boolean;
  scenario_2_has_override: boolean;
}

interface ComparisonResult {
  scenario_1_id: number;
  scenario_2_id: number;
  differences: ParameterDifference[];
  total_differences: number;
  total_parameters_compared: number;
}

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  onClose?: () => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  onClose,
}) => {
  const [selectedScenario1, setSelectedScenario1] = useState<number | null>(
    null
  );
  const [selectedScenario2, setSelectedScenario2] = useState<number | null>(
    null
  );
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'absolute' | 'percent'>(
    'percent'
  );
  const [filterSignificant, setFilterSignificant] = useState(false);

  const compareScenarios = async () => {
    if (!selectedScenario1 || !selectedScenario2) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/scenarios/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          scenario_ids: [selectedScenario1, selectedScenario2],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare scenarios');
      }

      const result = await response.json();
      setComparisonResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to compare scenarios'
      );
    } finally {
      setLoading(false);
    }
  };

  const getSortedDifferences = () => {
    if (!comparisonResult) return [];

    let differences = [...comparisonResult.differences];

    // Apply significance filter
    if (filterSignificant) {
      differences = differences.filter(
        diff => Math.abs(diff.percent_change) >= 5
      );
    }

    // Sort by selected criteria
    switch (sortBy) {
      case 'name':
        differences.sort((a, b) =>
          a.parameter_name.localeCompare(b.parameter_name)
        );
        break;
      case 'absolute':
        differences.sort(
          (a, b) =>
            Math.abs(b.absolute_difference) - Math.abs(a.absolute_difference)
        );
        break;
      case 'percent':
        differences.sort((a, b) => {
          const aPercent = Math.abs(
            a.percent_change === Infinity ? 999 : a.percent_change
          );
          const bPercent = Math.abs(
            b.percent_change === Infinity ? 999 : b.percent_change
          );
          return bPercent - aPercent;
        });
        break;
    }

    return differences;
  };

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toFixed(2);
    }
  };

  const formatPercent = (percent: number): string => {
    if (percent === Infinity || percent === -Infinity) {
      return '∞%';
    }
    return `${percent.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = (percent: number): string => {
    const absPercent = Math.abs(percent === Infinity ? 999 : percent);
    if (absPercent >= 20) return 'text-red-600 font-semibold';
    if (absPercent >= 10) return 'text-orange-600 font-medium';
    if (absPercent >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const scenario1 = scenarios.find(s => s.id === selectedScenario1);
  const scenario2 = scenarios.find(s => s.id === selectedScenario2);
  const sortedDifferences = getSortedDifferences();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scenario Comparison</h2>
          <p className="text-muted-foreground">
            Compare parameter values between different scenarios
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

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Scenarios to Compare</CardTitle>
          <CardDescription>
            Choose two scenarios to analyze their differences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium mb-2 block">
                First Scenario
              </label>
              <Select
                value={selectedScenario1?.toString()}
                onValueChange={value => setSelectedScenario1(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map(scenario => (
                    <SelectItem
                      key={scenario.id}
                      value={scenario.id.toString()}
                    >
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Second Scenario
              </label>
              <Select
                value={selectedScenario2?.toString()}
                onValueChange={value => setSelectedScenario2(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select second scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios
                    .filter(s => s.id !== selectedScenario1)
                    .map(scenario => (
                      <SelectItem
                        key={scenario.id}
                        value={scenario.id.toString()}
                      >
                        {scenario.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={compareScenarios}
              disabled={!selectedScenario1 || !selectedScenario2 || loading}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {loading ? 'Comparing...' : 'Compare Scenarios'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonResult && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Comparison Results</CardTitle>
                <CardDescription>
                  Comparing "{scenario1?.name}" vs "{scenario2?.name}"
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary">
                  {comparisonResult.total_differences} differences
                </Badge>
                <Badge variant="outline">
                  {comparisonResult.total_parameters_compared} parameters
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-center">
                    {comparisonResult.total_differences}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Parameters Changed
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-center">
                    {Math.round(
                      (comparisonResult.total_differences /
                        comparisonResult.total_parameters_compared) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Parameters Affected
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-center">
                    {
                      sortedDifferences.filter(
                        d => Math.abs(d.percent_change) >= 10
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Significant Changes (≥10%)
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* Filters and Sorting */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <div>
                  <label className="text-sm font-medium mr-2">Sort by:</label>
                  <Select
                    value={sortBy}
                    onValueChange={(value: any) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">% Change</SelectItem>
                      <SelectItem value="absolute">Absolute Change</SelectItem>
                      <SelectItem value="name">Parameter Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="significant"
                    checked={filterSignificant}
                    onChange={e => setFilterSignificant(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="significant" className="text-sm">
                    Show only significant changes (≥5%)
                  </label>
                </div>
              </div>
            </div>

            {/* Differences Table */}
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead className="text-right">
                      {scenario1?.name}
                    </TableHead>
                    <TableHead className="text-center">Change</TableHead>
                    <TableHead className="text-right">
                      {scenario2?.name}
                    </TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead className="text-right">% Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDifferences.map(diff => (
                    <TableRow key={diff.parameter_id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{diff.parameter_name}</span>
                          {(diff.scenario_1_has_override ||
                            diff.scenario_2_has_override) && (
                            <Badge variant="secondary" className="text-xs">
                              Override
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatValue(diff.scenario_1_value)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getChangeIcon(diff.absolute_difference)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatValue(diff.scenario_2_value)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span
                          className={
                            diff.absolute_difference >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {diff.absolute_difference >= 0 ? '+' : ''}
                          {formatValue(diff.absolute_difference)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className={getChangeColor(diff.percent_change)}>
                          {diff.percent_change >= 0 ? '+' : ''}
                          {formatPercent(diff.percent_change)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            {sortedDifferences.length === 0 &&
              comparisonResult.total_differences > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No differences match the current filters.
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => setFilterSignificant(false)}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

            {comparisonResult.total_differences === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No differences found between the selected scenarios.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
