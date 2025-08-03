import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Copy,
  Trash2,
  Plus,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface Scenario {
  id: number;
  name: string;
  description?: string;
  scenario_type: 'base' | 'optimistic' | 'pessimistic' | 'custom';
  is_baseline: boolean;
  is_base_case: boolean;
  status: 'draft' | 'active' | 'archived';
  calculation_status: 'pending' | 'calculating' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
  version: string;
  parent_scenario_id?: number;
}

interface ScenarioManagerProps {
  baseFileId: number;
  onScenarioSelect?: (scenario: Scenario) => void;
}

export const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  baseFileId,
  onScenarioSelect,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [scenarioToClone, setScenarioToClone] = useState<Scenario | null>(null);

  // Form states
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    scenario_type: 'custom' as const,
    is_baseline: false,
  });

  const [cloneScenario, setCloneScenario] = useState({
    name: '',
    description: '',
  });

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/scenarios/?base_file_id=${baseFileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch scenarios');
      }

      const data = await response.json();
      setScenarios(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [baseFileId]);

  useEffect(() => {
    fetchScenarios();
  }, [baseFileId, fetchScenarios]);

  const createScenario = async () => {
    try {
      const response = await fetch('/api/v1/scenarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...newScenario,
          base_file_id: baseFileId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create scenario');
      }

      const scenario = await response.json();
      setScenarios(prev => [scenario, ...prev]);
      setIsCreateDialogOpen(false);
      setNewScenario({
        name: '',
        description: '',
        scenario_type: 'custom',
        is_baseline: false,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create scenario'
      );
    }
  };

  const cloneScenarioHandler = async () => {
    if (!scenarioToClone) return;

    try {
      const response = await fetch(
        `/api/v1/scenarios/${scenarioToClone.id}/clone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            name: cloneScenario.name,
            description: cloneScenario.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to clone scenario');
      }

      const scenario = await response.json();
      setScenarios(prev => [scenario, ...prev]);
      setIsCloneDialogOpen(false);
      setScenarioToClone(null);
      setCloneScenario({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clone scenario');
    }
  };

  const deleteScenario = async (scenarioId: number) => {
    if (!confirm('Are you sure you want to delete this scenario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/scenarios/${scenarioId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete scenario');
      }

      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
      if (selectedScenario?.id === scenarioId) {
        setSelectedScenario(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete scenario'
      );
    }
  };

  const calculateScenario = async (scenarioId: number) => {
    try {
      const response = await fetch(
        `/api/v1/scenarios/${scenarioId}/calculate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to calculate scenario');
      }

      // Update scenario status
      setScenarios(prev =>
        prev.map(s =>
          s.id === scenarioId ? { ...s, calculation_status: 'calculating' } : s
        )
      );

      // Poll for completion (simplified)
      setTimeout(() => {
        setScenarios(prev =>
          prev.map(s =>
            s.id === scenarioId ? { ...s, calculation_status: 'completed' } : s
          )
        );
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to calculate scenario'
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'calculating':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading scenarios...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scenario Management</h2>
          <p className="text-muted-foreground">
            Create and manage different scenarios for your financial model
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Scenario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Scenario</DialogTitle>
              <DialogDescription>
                Create a new scenario to explore different assumptions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newScenario.name}
                  onChange={e =>
                    setNewScenario(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., High Growth Scenario"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newScenario.description}
                  onChange={e =>
                    setNewScenario(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe this scenario..."
                />
              </div>
              <div>
                <Label htmlFor="type">Scenario Type</Label>
                <Select
                  value={newScenario.scenario_type}
                  onValueChange={(value: any) =>
                    setNewScenario(prev => ({ ...prev, scenario_type: value }))
                  }
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
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={createScenario} disabled={!newScenario.name}>
                Create Scenario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedScenario?.id === scenario.id
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
                onClick={() => {
                  setSelectedScenario(scenario);
                  onScenarioSelect?.(scenario);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {scenario.description || 'No description'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(scenario.calculation_status)}
                      <Badge
                        className={getScenarioTypeColor(scenario.scenario_type)}
                      >
                        {scenario.scenario_type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize">{scenario.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Version:</span>
                      <span>{scenario.version}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Updated:</span>
                      <span>
                        {new Date(scenario.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex space-x-2 w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        calculateScenario(scenario.id);
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Calculate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        setScenarioToClone(scenario);
                        setCloneScenario({
                          name: `${scenario.name} (Copy)`,
                          description: scenario.description || '',
                        });
                        setIsCloneDialogOpen(true);
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        deleteScenario(scenario.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="divide-y">
                  {scenarios.map(scenario => (
                    <div
                      key={scenario.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 ${
                        selectedScenario?.id === scenario.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        setSelectedScenario(scenario);
                        onScenarioSelect?.(scenario);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{scenario.name}</h3>
                            <Badge
                              className={getScenarioTypeColor(
                                scenario.scenario_type
                              )}
                            >
                              {scenario.scenario_type}
                            </Badge>
                            {scenario.is_baseline && (
                              <Badge variant="secondary">Baseline</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {scenario.description || 'No description'}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Version {scenario.version}</span>
                            <span>
                              Updated{' '}
                              {new Date(
                                scenario.updated_at
                              ).toLocaleDateString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(scenario.calculation_status)}
                              <span className="capitalize">
                                {scenario.calculation_status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={e => {
                              e.stopPropagation();
                              calculateScenario(scenario.id);
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={e => {
                              e.stopPropagation();
                              setScenarioToClone(scenario);
                              setCloneScenario({
                                name: `${scenario.name} (Copy)`,
                                description: scenario.description || '',
                              });
                              setIsCloneDialogOpen(true);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={e => {
                              e.stopPropagation();
                              deleteScenario(scenario.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Clone Dialog */}
      <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Scenario</DialogTitle>
            <DialogDescription>
              Create a copy of "{scenarioToClone?.name}" with all parameter
              values
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clone-name">Name</Label>
              <Input
                id="clone-name"
                value={cloneScenario.name}
                onChange={e =>
                  setCloneScenario(prev => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="clone-description">Description</Label>
              <Input
                id="clone-description"
                value={cloneScenario.description}
                onChange={e =>
                  setCloneScenario(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCloneDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={cloneScenarioHandler}
              disabled={!cloneScenario.name}
            >
              Clone Scenario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
