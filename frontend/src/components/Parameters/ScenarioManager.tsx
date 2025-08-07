/**
 * Scenario Management Component
 * Based on lean financial modeling plan - manage multiple parameter scenarios
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Button } from '@/design-system/components/Button';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Input } from '@/design-system/components/Input';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Label } from '@/design-system/components/Label';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/design-system/components/Dialog';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/design-system/components/Select';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Badge } from '@/design-system/components/Badge';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { 
  Play,
  Plus, 
  Copy,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'base' | 'optimistic' | 'pessimistic' | 'custom';
  created_at: string;
  updated_at: string;
  parameters: Record<string, number>;
  results?: ScenarioResults;
  status: 'draft' | 'calculated' | 'error';
}

export interface ScenarioResults {
  net_income: number;
  revenue: number;
  ebitda: number;
  free_cash_flow: number;
  enterprise_value: number;
  equity_value: number;
  value_per_share: number;
  roi: number;
  payback_period: number;
}

interface ScenarioManagerProps {
  scenarios?: Scenario[];
  onScenarioCreate?: (scenario: Scenario) => void;
  onScenarioUpdate?: (scenario: Scenario) => void;
  onScenarioDelete?: (scenarioId: string) => void;
  onScenarioCalculate?: (scenarioId: string) => void;
  onScenarioSelect?: (scenario: Scenario) => void;
  selectedScenarioId?: string;
  isLoading?: boolean;
}

const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  scenarios = [],
  onScenarioCreate,
  onScenarioUpdate,
  onScenarioDelete,
  onScenarioCalculate,
  onScenarioSelect,
  selectedScenarioId,
  isLoading = false,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [newScenarioData, setNewScenarioData] = useState({
    name: '',
    description: '',
    type: 'custom' as const,
  });





  const getScenarioTypeIcon = (type: string) => {
    switch (type) {
      case 'base':
        return <Target className="w-4 h-4" />;
      case 'optimistic':
        return <TrendingUp className="w-4 h-4" />;
      case 'pessimistic':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getScenarioTypeColor = (type: string) => {
    switch (type) {
      case 'base':
        return 'bg-blue-100 text-blue-800';
      case 'optimistic':
        return 'bg-green-100 text-green-800';
      case 'pessimistic':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'calculated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCreateScenario = () => {
    const newScenario: Scenario = {
      id: `scenario_${Date.now()}`,
      name: newScenarioData.name,
      description: newScenarioData.description,
      type: newScenarioData.type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parameters: {},
      status: 'draft',
    };

    onScenarioCreate?.(newScenario);
    setNewScenarioData({ name: '', description: '', type: 'custom' });
    setIsCreateDialogOpen(false);
  };

  const handleDuplicateScenario = (scenario: Scenario) => {
    const duplicatedScenario: Scenario = {
      ...scenario,
      id: `scenario_${Date.now()}`,
      name: `${scenario.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      results: undefined,
    };

    onScenarioCreate?.(duplicatedScenario);
  };

  const handleCalculateScenario = (scenarioId: string) => {
    onScenarioCalculate?.(scenarioId);
  };

  const ScenarioCard: React.FC<{ scenario: Scenario }> = ({ scenario }) => {
    const isSelected = selectedScenarioId === scenario.id;

    return (
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
        }`}
        onClick={() => onScenarioSelect?.(scenario)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge className={getScenarioTypeColor(scenario.type)}>
                {getScenarioTypeIcon(scenario.type)}
                <span className="ml-1 capitalize">{scenario.type}</span>
              </Badge>
              {getStatusIcon(scenario.status)}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculateScenario(scenario.id);
                }}
                disabled={isLoading}
              >
                <Play className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateScenario(scenario);
                }}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingScenario(scenario);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onScenarioDelete?.(scenario.id);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">{scenario.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
          </div>

          {scenario.results && (
            <div className="space-y-2 border-t pt-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <p className="font-semibold">{formatCurrency(scenario.results.revenue)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Net Income</p>
                  <p className="font-semibold">{formatCurrency(scenario.results.net_income)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Free Cash Flow</p>
                  <p className="font-semibold">{formatCurrency(scenario.results.free_cash_flow)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Value/Share</p>
                  <p className="font-semibold">{formatCurrency(scenario.results.value_per_share)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div>
                  <p className="text-xs text-gray-500">ROI</p>
                  <p className="font-semibold text-sm">{formatPercentage(scenario.results.roi)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payback</p>
                  <p className="font-semibold text-sm">{scenario.results.payback_period.toFixed(1)}y</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-gray-400">
            Updated: {new Date(scenario.updated_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreateScenarioDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Scenario
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Scenario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="scenario-name">Scenario Name</Label>
            <Input
              id="scenario-name"
              value={newScenarioData.name}
              onChange={(e) => setNewScenarioData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter scenario name"
            />
          </div>
          <div>
            <Label htmlFor="scenario-description">Description</Label>
            <Input
              id="scenario-description"
              value={newScenarioData.description}
              onChange={(e) => setNewScenarioData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this scenario"
            />
          </div>
          <div>
            <Label htmlFor="scenario-type">Scenario Type</Label>
            <Select
              value={newScenarioData.type}
              onValueChange={(value) => setNewScenarioData(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base">Base Case</SelectItem>
                <SelectItem value="optimistic">Optimistic</SelectItem>
                <SelectItem value="pessimistic">Pessimistic</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateScenario}
              disabled={!newScenarioData.name}
            >
              Create Scenario
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-6 h-6" />
          <span>Scenario Management</span>
        </CardTitle>
        <div className="flex space-x-2">
          <CreateScenarioDialog />
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {scenarios.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scenarios yet</h3>
            <p className="text-gray-500 mb-4">Create your first scenario to start modeling different business cases.</p>
            <CreateScenarioDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        )}

        {scenarios.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Calculate All
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Sensitivity Analysis
              </Button>
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                Monte Carlo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScenarioManager;