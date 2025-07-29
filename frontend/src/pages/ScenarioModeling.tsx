import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  PlayArrow as PlayIcon,
  Compare as CompareIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import ParameterList from '../components/Parameters/ParameterList';
import { BarChart } from '../components/Charts';

// Types
interface Scenario {
  id: number;
  name: string;
  description?: string;
  is_baseline: boolean;
  is_template: boolean;
  status: string;
  version: string;
  base_file_id: number;
  parent_scenario_id?: number;
  last_calculated_at?: string;
  calculation_status: string;
  calculation_results?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface Parameter {
  id: number;
  name: string;
  display_name?: string;
  current_value: number;
  parameter_type: string;
  category: string;
  sensitivity_level: string;
  is_editable: boolean;
}

interface SensitivityResult {
  parameter_id: number;
  parameter_name: string;
  sensitivity_coefficient: number;
  impact_range: [number, number];
  correlation?: number;
}

interface SensitivityAnalysis {
  analysis_id: number;
  scenario_id: number;
  target_parameter_id: number;
  analysis_type: string;
  results: SensitivityResult[];
  chart_data: Record<string, unknown>;
  summary_statistics: Record<string, unknown>;
  execution_time: number;
  status: string;
}

const ScenarioModeling: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const queryClient = useQueryClient();

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(null);
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  
  // Suppress unused variable warnings - these are used in JSX
  void selectedParameter;
  void compareDialogOpen;
  const [sensitivityDialogOpen, setSensitivityDialogOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioDescription, setNewScenarioDescription] = useState('');
  const [targetParameterId, setTargetParameterId] = useState<number | null>(null);

  // Fetch scenarios
  const { data: scenarios, isLoading: scenariosLoading } = useQuery({
    queryKey: ['scenarios', fileId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/scenarios?base_file_id=${fileId}`);
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      return await response.json() as Scenario[];
    },
    enabled: !!fileId,
  });

  // Fetch parameters for selected scenario
  const { data: parameters } = useQuery({
    queryKey: ['scenario-parameters', selectedScenario?.id],
    queryFn: async () => {
      if (!selectedScenario) return [];
      const response = await fetch(`/api/v1/scenarios/${selectedScenario.id}/parameters`);
      if (!response.ok) throw new Error('Failed to fetch parameters');
      return await response.json() as Parameter[];
    },
    enabled: !!selectedScenario,
  });

  // Fetch sensitivity analysis
  const { data: sensitivityAnalysis } = useQuery({
    queryKey: ['sensitivity-analysis', selectedScenario?.id, targetParameterId],
    queryFn: async () => {
      if (!selectedScenario || !targetParameterId) return null;
      const response = await fetch(
        `/api/v1/sensitivity-analysis?scenario_id=${selectedScenario.id}&target_parameter_id=${targetParameterId}`
      );
      if (!response.ok) throw new Error('Failed to fetch sensitivity analysis');
      return await response.json() as SensitivityAnalysis;
    },
    enabled: !!selectedScenario && !!targetParameterId,
  });

  // Create scenario mutation
  const createScenarioMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; parent_scenario_id?: number }) => {
      const response = await fetch('/api/v1/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          base_file_id: fileId ? parseInt(fileId) : 0,
        }),
      });
      if (!response.ok) throw new Error('Failed to create scenario');
      return await response.json() as Scenario;
    },
    onSuccess: (newScenario) => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      setSelectedScenario(newScenario);
      setCreateScenarioOpen(false);
      setNewScenarioName('');
      setNewScenarioDescription('');
    },
  });

  // Calculate scenario mutation
  const calculateScenarioMutation = useMutation({
    mutationFn: async (scenarioId: number) => {
      const response = await fetch(`/api/v1/scenarios/${scenarioId}/calculate`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to calculate scenario');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });

  // Clone scenario mutation
  const cloneScenarioMutation = useMutation({
    mutationFn: async (data: { source_scenario_id: number; name: string; description?: string }) => {
      const response = await fetch('/api/v1/scenarios/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to clone scenario');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });

  // Handle scenario selection
  const handleScenarioSelect = useCallback((scenario: Scenario) => {
    setSelectedScenario(scenario);
    setActiveTab(1); // Switch to parameters tab
  }, []);

  // Handle bulk parameter updates
  const handleBulkParameterUpdate = useCallback((_updates: Array<{ id: number; value: number }>) => {
    // This would update the parameter values in the selected scenario
    // For now, just invalidate queries to refetch data
    // TODO: Implement actual bulk parameter update API call
    queryClient.invalidateQueries({ queryKey: ['scenario-parameters'] });
  }, [queryClient]);

  // Handle create scenario
  const handleCreateScenario = useCallback(() => {
    if (!newScenarioName.trim()) return;
    
    createScenarioMutation.mutate({
      name: newScenarioName.trim(),
      description: newScenarioDescription.trim() || undefined,
      parent_scenario_id: selectedScenario?.id,
    });
  }, [newScenarioName, newScenarioDescription, selectedScenario, createScenarioMutation]);

  // Handle clone scenario
  const handleCloneScenario = useCallback((sourceScenario: Scenario) => {
    const name = `${sourceScenario.name} (Copy)`;
    cloneScenarioMutation.mutate({
      source_scenario_id: sourceScenario.id,
      name,
      description: sourceScenario.description,
    });
  }, [cloneScenarioMutation]);

  // Handle calculate scenario
  const handleCalculateScenario = useCallback((scenario: Scenario) => {
    calculateScenarioMutation.mutate(scenario.id);
  }, [calculateScenarioMutation]);

  // Render scenario card
  const renderScenarioCard = (scenario: Scenario) => (
    <Card
      key={scenario.id}
      variant={selectedScenario?.id === scenario.id ? 'elevation' : 'outlined'}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': { elevation: 4 },
        border: selectedScenario?.id === scenario.id ? 2 : 1,
        borderColor: selectedScenario?.id === scenario.id ? 'primary.main' : 'divider',
      }}
      onClick={() => handleScenarioSelect(scenario)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h3">
            {scenario.name}
          </Typography>
          
          <Box display="flex" gap={0.5}>
            {scenario.is_baseline && (
              <Chip size="small" label="Baseline" color="primary" />
            )}
            {scenario.is_template && (
              <Chip size="small" label="Template" color="secondary" />
            )}
          </Box>
        </Box>
        
        {scenario.description && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {scenario.description}
          </Typography>
        )}
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="caption" color="text.secondary">
            Version: {scenario.version}
          </Typography>
          
          <Chip
            size="small"
            label={scenario.calculation_status}
            color={
              scenario.calculation_status === 'completed' ? 'success' :
              scenario.calculation_status === 'error' ? 'error' :
              scenario.calculation_status === 'calculating' ? 'warning' : 'default'
            }
          />
        </Box>
        
        {scenario.last_calculated_at && (
          <Typography variant="caption" color="text.secondary">
            Last calculated: {new Date(scenario.last_calculated_at).toLocaleString()}
          </Typography>
        )}
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="caption" color="text.secondary">
            {new Date(scenario.updated_at).toLocaleDateString()}
          </Typography>
          
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleCalculateScenario(scenario);
              }}
              disabled={calculateScenarioMutation.isPending}
            >
              <PlayIcon />
            </IconButton>
            
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleCloneScenario(scenario);
              }}
              disabled={cloneScenarioMutation.isPending}
            >
              <CopyIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Render sensitivity chart
  const renderSensitivityChart = () => {
    if (!sensitivityAnalysis || !sensitivityAnalysis.results.length) {
      return (
        <Alert severity="info">
          No sensitivity analysis data available. Run analysis to see results.
        </Alert>
      );
    }

    const chartData = sensitivityAnalysis.results.map(result => ({
      name: result.parameter_name,
      value: Math.abs(result.sensitivity_coefficient),
      impact: result.impact_range[1] - result.impact_range[0],
    }));

    return (
      <BarChart
        data={chartData}
        series={[
          { dataKey: 'value', name: 'Sensitivity', color: 'var(--chart-1)' },
          // DESIGN_FIX: replaced hex color with chart token
          { dataKey: 'impact', name: 'Impact Range', color: 'var(--chart-4)' },
        ]}
        height={400}
        title="Parameter Sensitivity Analysis"
        subtitle="Impact of parameter changes on target metric"
      />
    );
  };

  if (!fileId) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          No file ID provided. Please select a file first.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Scenario Modeling
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage financial modeling scenarios with parameter adjustments and sensitivity analysis.
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Scenarios Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Scenarios</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateScenarioOpen(true)}
                  size="small"
                >
                  New
                </Button>
              </Box>
              
              {scenariosLoading ? (
                <LinearProgress />
              ) : (
                <Box display="flex" flexDirection="column" gap={1}>
                  {scenarios?.map(renderScenarioCard)}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Panel */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {selectedScenario ? (
                <>
                  {/* Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      {selectedScenario.name}
                    </Typography>
                    
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        startIcon={<CompareIcon />}
                        onClick={() => setCompareDialogOpen(true)}
                        size="small"
                      >
                        Compare
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<AnalyticsIcon />}
                        onClick={() => setSensitivityDialogOpen(true)}
                        size="small"
                      >
                        Sensitivity
                      </Button>
                      
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        onClick={() => handleCalculateScenario(selectedScenario)}
                        disabled={calculateScenarioMutation.isPending}
                        size="small"
                      >
                        Calculate
                      </Button>
                    </Box>
                  </Box>

                  {/* Tabs */}
                  <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="Overview" />
                    <Tab label="Parameters" />
                    <Tab label="Sensitivity" />
                    <Tab label="Results" />
                  </Tabs>

                  {/* Tab Content */}
                  <Box mt={2}>
                    {activeTab === 0 && (
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                              Scenario Information
                            </Typography>
                            <List dense>
                              <ListItem>
                                <ListItemText primary="Version" secondary={selectedScenario.version} />
                              </ListItem>
                              <ListItem>
                                <ListItemText primary="Status" secondary={selectedScenario.status} />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Calculation Status"
                                  secondary={selectedScenario.calculation_status}
                                />
                              </ListItem>
                              {selectedScenario.last_calculated_at && (
                                <ListItem>
                                  <ListItemText
                                    primary="Last Calculated"
                                    secondary={new Date(selectedScenario.last_calculated_at).toLocaleString()}
                                  />
                                </ListItem>
                              )}
                            </List>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                              Quick Actions
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                              <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={() => handleCalculateScenario(selectedScenario)}
                                fullWidth
                              >
                                Recalculate Scenario
                              </Button>
                              
                              <Button
                                variant="outlined"
                                startIcon={<CopyIcon />}
                                onClick={() => handleCloneScenario(selectedScenario)}
                                fullWidth
                              >
                                Duplicate Scenario
                              </Button>
                              
                              <Button
                                variant="outlined"
                                startIcon={<ExportIcon />}
                                fullWidth
                              >
                                Export Results
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {activeTab === 1 && (
                      <ParameterList
                        fileId={parseInt(fileId)}
                        scenarioId={selectedScenario.id}
                        onParameterSelect={setSelectedParameter}
                        onBulkUpdate={handleBulkParameterUpdate}
                        allowBulkEdit={true}
                        showGrouping={true}
                      />
                    )}

                    {activeTab === 2 && (
                      <Box>
                        {renderSensitivityChart()}
                        
                        <Box mt={2} display="flex" justifyContent="center">
                          <Button
                            variant="contained"
                            startIcon={<AnalyticsIcon />}
                            onClick={() => setSensitivityDialogOpen(true)}
                          >
                            Run Sensitivity Analysis
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {activeTab === 3 && (
                      <Box>
                        {selectedScenario.calculation_results ? (
                          <Typography>
                            Calculation results will be displayed here
                          </Typography>
                        ) : (
                          <Alert severity="info">
                            No calculation results available. Click "Calculate" to run scenario calculations.
                          </Alert>
                        )}
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight={400}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Scenario Selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Select a scenario from the list or create a new one to get started.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateScenarioOpen(true)}
                  >
                    Create New Scenario
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Scenario Dialog */}
      <Dialog open={createScenarioOpen} onClose={() => setCreateScenarioOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Scenario</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Scenario Name"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Description (Optional)"
              value={newScenarioDescription}
              onChange={(e) => setNewScenarioDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            
            {selectedScenario && (
              <Alert severity="info">
                This scenario will be created as a child of "{selectedScenario.name}".
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateScenarioOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateScenario}
            variant="contained"
            disabled={!newScenarioName.trim() || createScenarioMutation.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sensitivity Analysis Dialog */}
      <Dialog open={sensitivityDialogOpen} onClose={() => setSensitivityDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Sensitivity Analysis</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Target Parameter</InputLabel>
              <Select
                value={targetParameterId || ''}
                onChange={(e) => setTargetParameterId(Number(e.target.value))}
                label="Target Parameter"
              >
                {parameters?.map(param => (
                  <MenuItem key={param.id} value={param.id}>
                    {param.display_name || param.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Alert severity="info">
              Sensitivity analysis will show how changes in input parameters affect the selected target parameter.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSensitivityDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => setSensitivityDialogOpen(false)}
            variant="contained"
            disabled={!targetParameterId}
          >
            Run Analysis
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ScenarioModeling; 