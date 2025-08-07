import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  TrendingUp,
  Calculator,
  BarChart3,
  DollarSign,
  Calendar,
  Save,
  Play,
} from 'lucide-react';

const CashFlowLifecycle: React.FC = () => {
  const [activeTab, setActiveTab] = useState('operating-cycle');

  const cashFlowSections = [
    {
      id: 'operating-cycle',
      label: 'Operating Cycle',
      icon: <RefreshCw className="h-4 w-4" />,
      description: 'Cash conversion cycle and working capital',
    },
    {
      id: 'collection',
      label: 'Collection Management',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Accounts receivable and collection periods',
    },
    {
      id: 'payment',
      label: 'Payment Management',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Accounts payable and payment terms',
    },
    {
      id: 'inventory',
      label: 'Inventory Management',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Inventory turnover and holding periods',
    },
    {
      id: 'forecasting',
      label: 'Cash Forecasting',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Cash flow projections and planning',
    },
    {
      id: 'metrics',
      label: 'Cash Flow Metrics',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Performance metrics and ratios',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cash Flow Lifecycle
          </h1>
          <p className="text-muted-foreground">
            Comprehensive cash flow lifecycle modeling and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Model
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Cash Flow Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Lifecycle Components</CardTitle>
          <CardDescription>
            Manage all aspects of cash flow lifecycle modeling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {cashFlowSections.map(section => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex items-center gap-2"
                >
                  {section.icon}
                  <span className="hidden lg:inline">{section.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {cashFlowSections.map(section => (
              <TabsContent key={section.id} value={section.id} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    {section.icon}
                    <h3 className="text-lg font-semibold">{section.label}</h3>
                    <Badge variant="secondary">{section.description}</Badge>
                  </div>

                  {/* Section-specific content */}
                  {section.id === 'operating-cycle' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Cash to Inventory (Days)</Label>
                        <Input placeholder="30" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Inventory to Receivables (Days)</Label>
                        <Input placeholder="45" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Receivables to Cash (Days)</Label>
                        <Input placeholder="60" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cash Conversion Cycle (Days)</Label>
                        <Input placeholder="75" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Working Capital Efficiency (%)</Label>
                        <Input placeholder="85" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cash Flow Volatility Factor</Label>
                        <Input placeholder="1.2" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'collection' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Days Sales Outstanding</Label>
                        <Input placeholder="60" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Collection Period (Days)</Label>
                        <Input placeholder="60" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Bad Debt Percentage (%)</Label>
                        <Input placeholder="2.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Credit Terms (Days)</Label>
                        <Input placeholder="30" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Collection Efficiency (%)</Label>
                        <Input placeholder="95" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Early Payment Discount (%)</Label>
                        <Input placeholder="2.0" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'payment' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Days Payables Outstanding</Label>
                        <Input placeholder="30" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Terms (Days)</Label>
                        <Input placeholder="30" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Early Payment Discount (%)</Label>
                        <Input placeholder="2.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Efficiency (%)</Label>
                        <Input placeholder="98" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Supplier Credit Utilization (%)</Label>
                        <Input placeholder="85" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Processing Days</Label>
                        <Input placeholder="2" type="number" />
                      </div>
                    </div>
                  )}

                  {section.id === 'inventory' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Inventory Turnover Ratio</Label>
                        <Input placeholder="8.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Days Inventory Outstanding</Label>
                        <Input placeholder="45" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Raw Materials Days</Label>
                        <Input placeholder="30" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>WIP Days</Label>
                        <Input placeholder="15" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Finished Goods Days</Label>
                        <Input placeholder="45" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Inventory Carrying Cost (%)</Label>
                        <Input placeholder="15.0" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'forecasting' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Minimum Cash Balance</Label>
                        <Input placeholder="$500,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Target Cash Balance</Label>
                        <Input placeholder="$1,000,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Excess Cash Investment (%)</Label>
                        <Input placeholder="80" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cash Flow Volatility Factor</Label>
                        <Input placeholder="1.2" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Seasonal Factors</Label>
                        <Input
                          placeholder="Q1:0.8, Q2:1.0, Q3:1.2, Q4:1.0"
                          type="text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Forecast Horizon (Months)</Label>
                        <Input placeholder="12" type="number" />
                      </div>
                    </div>
                  )}

                  {section.id === 'metrics' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Cash Conversion Cycle
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">75 days</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Working Capital Ratio
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">1.8x</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Cash Flow Coverage
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">2.3x</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Operating Cash Flow Margin
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">15.2%</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Changes will update cash flow lifecycle calculations
                    </p>
                    <Button variant="outline" size="sm">
                      Update Model
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowLifecycle;
