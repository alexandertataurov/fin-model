import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Upload,
  Settings,
  BarChart3,
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  PieChart,
  Activity,
  Target,
} from 'lucide-react';

// Import shared utilities
import {
  ModelStatus,
  ActiveTab,
  MetricCard,
  ActionButton,
  StatementCard,
  StatusBadge,
  PARAMETER_CATEGORIES,
  VALUATION_SECTIONS,
} from './shared';

// Consolidated interface for all component props
interface CoreFinancialModelingProps {
  onFileUpload?: (file: File) => void;
  onParameterChange?: (parameters: any) => void;
  onScenarioCreate?: (scenario: any) => void;
  onValuationChange?: (valuation: any) => void;
  onExportResults?: (results: any) => void;
}

export function CoreFinancialModeling({
  onFileUpload,
  onParameterChange,
  onScenarioCreate,
  onValuationChange,
  onExportResults,
}: CoreFinancialModelingProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');

  // Consolidated handlers
  const handleFileUpload = (file: File) => {
    setModelStatus('processing');
    onFileUpload?.(file);
    setTimeout(() => setModelStatus('complete'), 2000);
  };

  const handleTabChange = (tab: string) => setActiveTab(tab as ActiveTab);

  // Consolidated metrics data
  const metrics = [
    {
      title: 'Revenue',
      value: '$2.4M',
      change: '+20.1% from last month',
      icon: DollarSign,
    },
    {
      title: 'Gross Margin',
      value: '68.2%',
      change: '+2.1% from last month',
      icon: PieChart,
    },
    {
      title: 'Operating Income',
      value: '$456K',
      change: '+12.3% from last month',
      icon: Activity,
    },
    {
      title: 'Free Cash Flow',
      value: '$234K',
      change: '+8.7% from last month',
      icon: TrendingUp,
    },
  ];

  // Consolidated scenarios
  const scenarios = [
    { name: 'Base Case', status: 'Active' as const },
    { name: 'Optimistic', status: 'Inactive' as const },
    { name: 'Pessimistic', status: 'Inactive' as const },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Modeling Platform</h1>
          <p className="text-muted-foreground">
            Comprehensive business modeling with revenue, COGS, OPEX, taxes,
            debt, and full financial statements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={modelStatus} />
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="statements"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Statements</span>
          </TabsTrigger>
          <TabsTrigger
            value="parameters"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Parameters</span>
          </TabsTrigger>
          <TabsTrigger
            value="scenarios"
            className="flex items-center space-x-2"
          >
            <Target className="h-4 w-4" />
            <span>Scenarios</span>
          </TabsTrigger>
          <TabsTrigger
            value="valuation"
            className="flex items-center space-x-2"
          >
            <Calculator className="h-4 w-4" />
            <span>DCF</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analysis</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map(metric => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common modeling tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton
                icon={FileText}
                label="View Statements"
                onClick={() => handleTabChange('statements')}
              />
              <ActionButton
                icon={Settings}
                label="Manage Parameters"
                onClick={() => handleTabChange('parameters')}
              />
              <ActionButton
                icon={Calculator}
                label="DCF Valuation"
                onClick={() => handleTabChange('valuation')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statements Tab */}
        <TabsContent value="statements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatementCard
              title="Profit & Loss"
              description="Comprehensive P&L with granular line items"
              icon={FileText}
            />
            <StatementCard
              title="Balance Sheet"
              description="Detailed balance sheet with all line items"
              icon={PieChart}
            />
            <StatementCard
              title="Cash Flow"
              description="Operating, investing, and financing activities"
              icon={Activity}
            />
          </div>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parameter Management</CardTitle>
              <CardDescription>
                Manage 12 categories of modeling parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {PARAMETER_CATEGORIES.map(category => (
                  <Button
                    key={category}
                    variant="outline"
                    className="h-16 text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Management</CardTitle>
              <CardDescription>
                Create and compare different modeling scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">Create New Scenario</Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarios.map(scenario => (
                    <Card key={scenario.name}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {scenario.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge
                          variant={
                            scenario.status === 'Active'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {scenario.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Valuation Tab */}
        <TabsContent value="valuation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DCF Valuation Model</CardTitle>
              <CardDescription>
                Comprehensive DCF with detailed FCF projections, terminal value,
                and sensitivity analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VALUATION_SECTIONS.map(section => (
                  <Button key={section} variant="outline" className="h-16">
                    {section}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatementCard
              title="Cash Flow Lifecycle"
              description="Working capital cycle and cash conversion analysis"
              icon={Activity}
              actionLabel="View Cash Flow Lifecycle"
            />
            <StatementCard
              title="Asset Lifecycle"
              description="Depreciation schedules and replacement timelines"
              icon={PieChart}
              actionLabel="View Asset Lifecycle"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
