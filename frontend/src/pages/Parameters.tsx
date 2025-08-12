import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Label } from '@/design-system/components/Label';
import { Badge } from '@/design-system/components/Badge';
import { 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Building, 
  Calculator,
  Target,
  RefreshCw,
  Save,
  RotateCcw
} from 'lucide-react';

const Parameters: React.FC = () => {
  const [activeTab, setActiveTab] = useState('economic');

  const parameterCategories = [
    {
      id: 'economic',
      label: 'Economic Environment',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Inflation, GDP growth, interest rates, commodity prices'
    },
    {
      id: 'tax',
      label: 'Tax Environment',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Corporate tax rates, state taxes, tax credits, foreign taxes'
    },
    {
      id: 'revenue',
      label: 'Revenue Parameters',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Product/service revenue, pricing, volume, mix shifts'
    },
    {
      id: 'cogs',
      label: 'COGS Parameters',
      icon: <Building className="h-4 w-4" />,
      description: 'Direct materials, labor, overhead, efficiency improvements'
    },
    {
      id: 'opex',
      label: 'Operating Expenses',
      icon: <Settings className="h-4 w-4" />,
      description: 'Sales & marketing, R&D, G&A, salary inflation'
    },
    {
      id: 'financial',
      label: 'Financial Parameters',
      icon: <Target className="h-4 w-4" />,
      description: 'Interest rates, investment returns, foreign exchange'
    },
    {
      id: 'operational',
      label: 'Operational Parameters',
      icon: <RefreshCw className="h-4 w-4" />,
      description: 'Working capital, CapEx, depreciation, amortization'
    },
    {
      id: 'cashflow',
      label: 'Cash Flow Lifecycle',
      icon: <RefreshCw className="h-4 w-4" />,
      description: 'Collection periods, payment terms, seasonality'
    },
    {
      id: 'balancesheet',
      label: 'Balance Sheet',
      icon: <Building className="h-4 w-4" />,
      description: 'Assets, liabilities, equity parameters and ratios'
    },
    {
      id: 'assetlifecycle',
      label: 'Asset Lifecycle',
      icon: <Building className="h-4 w-4" />,
      description: 'Useful lives, replacement schedules, maintenance'
    },
    {
      id: 'dcf',
      label: 'DCF Valuation',
      icon: <Target className="h-4 w-4" />,
      description: 'DCF model, cost of capital, terminal value, sensitivity'
    },
    {
      id: 'sensitivity',
      label: 'Sensitivity Analysis',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Key drivers, scenario probabilities, Monte Carlo'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parameters</h1>
          <p className="text-muted-foreground">
            Configure comprehensive financial modeling parameters across 12 categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Parameter Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Categories</CardTitle>
          <CardDescription>
            Manage all financial modeling parameters organized by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
              {parameterCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden lg:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {parameterCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    {category.icon}
                    <h3 className="text-lg font-semibold">{category.label}</h3>
                    <Badge variant="secondary">{category.description}</Badge>
                  </div>
                  
                  {/* Placeholder for parameter inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${category.id}-param1`}>Parameter 1</Label>
                      <Input 
                        id={`${category.id}-param1`} 
                        placeholder="Enter value"
                        type="number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${category.id}-param2`}>Parameter 2</Label>
                      <Input 
                        id={`${category.id}-param2`} 
                        placeholder="Enter value"
                        type="number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${category.id}-param3`}>Parameter 3</Label>
                      <Input 
                        id={`${category.id}-param3`} 
                        placeholder="Enter value"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Changes will automatically trigger model recalculation
                    </p>
                    <Button variant="outline" size="sm">
                      Apply Changes
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

export default Parameters;
