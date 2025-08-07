import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
  Target
} from 'lucide-react';

interface CoreFinancialModelingProps {
  onFileUpload?: (file: File) => void;
  onParameterChange?: (parameters: any) => void;
  onScenarioCreate?: (scenario: any) => void;
}

export function CoreFinancialModeling({
  onFileUpload,
  onParameterChange,
  onScenarioCreate
}: CoreFinancialModelingProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [modelStatus, setModelStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');

  const handleFileUpload = (file: File) => {
    setModelStatus('processing');
    onFileUpload?.(file);
    // Simulate processing
    setTimeout(() => setModelStatus('complete'), 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Modeling Platform</h1>
          <p className="text-muted-foreground">
            Comprehensive business modeling with revenue, COGS, OPEX, taxes, debt, and full financial statements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={modelStatus === 'complete' ? 'default' : 'secondary'}>
            {modelStatus === 'complete' ? 'Model Ready' : 'Model Status'}
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="statements" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Statements</span>
          </TabsTrigger>
          <TabsTrigger value="parameters" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Parameters</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="valuation" className="flex items-center space-x-2">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operating Income</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$456K</div>
                <p className="text-xs text-muted-foreground">+12.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Free Cash Flow</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$234K</div>
                <p className="text-xs text-muted-foreground">+8.7% from last month</p>
              </CardContent>
            </Card>
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
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setActiveTab('statements')}
              >
                <FileText className="h-6 w-6" />
                <span>View Statements</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setActiveTab('parameters')}
              >
                <Settings className="h-6 w-6" />
                <span>Manage Parameters</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setActiveTab('valuation')}
              >
                <Calculator className="h-6 w-6" />
                <span>DCF Valuation</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statements Tab */}
        <TabsContent value="statements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Profit & Loss</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive P&L with granular line items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View P&L Statement
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Balance Sheet</span>
                </CardTitle>
                <CardDescription>
                  Detailed balance sheet with all line items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Balance Sheet
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Cash Flow</span>
                </CardTitle>
                <CardDescription>
                  Operating, investing, and financing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Cash Flow
                </Button>
              </CardContent>
            </Card>
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
                {[
                  'Economic Environment',
                  'Tax Environment', 
                  'Revenue Parameters',
                  'COGS Parameters',
                  'Operating Expenses',
                  'Financial Parameters',
                  'Operational Parameters',
                  'Cash Flow Lifecycle',
                  'Cash Flow Statement',
                  'Asset Lifecycle',
                  'Balance Sheet',
                  'Valuation Parameters'
                ].map((category) => (
                  <Button key={category} variant="outline" className="h-16 text-sm">
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
                <Button className="w-full">
                  Create New Scenario
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Base Case</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="default">Active</Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Optimistic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Inactive</Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Pessimistic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Inactive</Badge>
                    </CardContent>
                  </Card>
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
                Comprehensive DCF with detailed FCF projections, terminal value, and sensitivity analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16">
                  Free Cash Flow Projections
                </Button>
                <Button variant="outline" className="h-16">
                  Terminal Value Analysis
                </Button>
                <Button variant="outline" className="h-16">
                  Cost of Capital Breakdown
                </Button>
                <Button variant="outline" className="h-16">
                  Sensitivity Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Lifecycle</CardTitle>
                <CardDescription>
                  Working capital cycle and cash conversion analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Cash Flow Lifecycle
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset Lifecycle</CardTitle>
                <CardDescription>
                  Depreciation schedules and replacement timelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Asset Lifecycle
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
