import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Label } from '@/design-system/components/Label';
import { Badge } from '@/design-system/components/Badge';
import { Separator } from '@/design-system/components/Separator';
import { 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Calculator,
  Building,
  FileText,
  PieChart,
  Activity,
  Target,
  Zap,
  Clock,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface Parameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
  category: string;
  min?: number;
  max?: number;
  step?: number;
}

interface ParameterManagerProps {
  onParameterChange?: (parameters: Parameter[]) => void;
  onSaveTemplate?: (parameters: Parameter[]) => void;
}

// Parameter categories based on the lean financial modeling plan
const parameterCategories = [
  {
    id: 'economic-environment',
    name: 'Economic Environment',
    icon: TrendingUp,
    description: 'Inflation, GDP growth, interest rates, commodity prices',
    parameters: [
      {
        id: 'inflation_rate',
        name: 'Inflation Rate',
        value: 0.025,
        unit: '%',
        description: 'General inflation rate',
        category: 'economic-environment',
        min: 0,
        max: 0.5,
        step: 0.001,
      },
      {
        id: 'gdp_growth_rate',
        name: 'GDP Growth Rate',
        value: 0.03,
        unit: '%',
        description: 'GDP growth rate',
        category: 'economic-environment',
        min: -0.1,
        max: 0.1,
        step: 0.001,
      },
    ],
  },
  {
    id: 'tax-environment',
    name: 'Tax Environment',
    icon: Calculator,
    description: 'Corporate tax rates, state taxes, tax credits',
    parameters: [
      {
        id: 'corporate_tax_rate',
        name: 'Corporate Tax Rate',
        value: 0.25,
        unit: '%',
        description: 'Corporate income tax rate',
        category: 'tax-environment',
        min: 0,
        max: 0.5,
        step: 0.001,
      },
      {
        id: 'effective_tax_rate',
        name: 'Effective Tax Rate',
        value: 0.22,
        unit: '%',
        description: 'Effective tax rate',
        category: 'tax-environment',
        min: 0,
        max: 0.5,
        step: 0.001,
      },
    ],
  },
  {
    id: 'revenue-parameters',
    name: 'Revenue Parameters',
    icon: DollarSign,
    description: 'Product/service revenue, pricing, volume',
    parameters: [
      {
        id: 'product_revenue_growth',
        name: 'Product Revenue Growth',
        value: 0.15,
        unit: '%',
        description: 'Product revenue growth rate',
        category: 'revenue-parameters',
        min: -0.5,
        max: 2.0,
        step: 0.01,
      },
      {
        id: 'service_revenue_growth',
        name: 'Service Revenue Growth',
        value: 0.12,
        unit: '%',
        description: 'Service revenue growth rate',
        category: 'revenue-parameters',
        min: -0.5,
        max: 2.0,
        step: 0.01,
      },
    ],
  },
  {
    id: 'cogs-parameters',
    name: 'COGS Parameters',
    icon: Building,
    description: 'Direct materials, labor, overhead',
    parameters: [
      {
        id: 'direct_materials_percentage',
        name: 'Direct Materials %',
        value: 0.45,
        unit: '%',
        description: 'Direct materials as % of revenue',
        category: 'cogs-parameters',
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        id: 'direct_labor_percentage',
        name: 'Direct Labor %',
        value: 0.25,
        unit: '%',
        description: 'Direct labor as % of revenue',
        category: 'cogs-parameters',
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    id: 'operating-expenses',
    name: 'Operating Expenses',
    icon: Settings,
    description: 'Sales & marketing, R&D, G&A',
    parameters: [
      {
        id: 'sales_commission_percentage',
        name: 'Sales Commission %',
        value: 0.05,
        unit: '%',
        description: 'Sales commission as % of revenue',
        category: 'operating-expenses',
        min: 0,
        max: 0.2,
        step: 0.001,
      },
      {
        id: 'marketing_spend_percentage',
        name: 'Marketing Spend %',
        value: 0.08,
        unit: '%',
        description: 'Marketing as % of revenue',
        category: 'operating-expenses',
        min: 0,
        max: 0.3,
        step: 0.001,
      },
    ],
  },
  {
    id: 'financial-parameters',
    name: 'Financial Parameters',
    icon: Target,
    description: 'Interest rates, investment returns',
    parameters: [
      {
        id: 'short_term_interest_rate',
        name: 'Short-term Interest Rate',
        value: 0.04,
        unit: '%',
        description: 'Short-term debt rate',
        category: 'financial-parameters',
        min: 0,
        max: 0.2,
        step: 0.001,
      },
      {
        id: 'long_term_interest_rate',
        name: 'Long-term Interest Rate',
        value: 0.06,
        unit: '%',
        description: 'Long-term debt rate',
        category: 'financial-parameters',
        min: 0,
        max: 0.2,
        step: 0.001,
      },
    ],
  },
  {
    id: 'operational-parameters',
    name: 'Operational Parameters',
    icon: Activity,
    description: 'Working capital, CapEx, depreciation',
    parameters: [
      {
        id: 'accounts_receivable_days',
        name: 'Accounts Receivable Days',
        value: 45,
        unit: 'days',
        description: 'Days sales outstanding',
        category: 'operational-parameters',
        min: 0,
        max: 365,
        step: 1,
      },
      {
        id: 'inventory_days',
        name: 'Inventory Days',
        value: 60,
        unit: 'days',
        description: 'Days inventory outstanding',
        category: 'operational-parameters',
        min: 0,
        max: 365,
        step: 1,
      },
    ],
  },
  {
    id: 'cash-flow-lifecycle',
    name: 'Cash Flow Lifecycle',
    icon: RefreshCw,
    description: 'Collection periods, payment terms',
    parameters: [
      {
        id: 'collection_period_days',
        name: 'Collection Period Days',
        value: 45,
        unit: 'days',
        description: 'Days sales outstanding',
        category: 'cash-flow-lifecycle',
        min: 0,
        max: 365,
        step: 1,
      },
      {
        id: 'payment_terms_days',
        name: 'Payment Terms Days',
        value: 30,
        unit: 'days',
        description: 'Days payables outstanding',
        category: 'cash-flow-lifecycle',
        min: 0,
        max: 365,
        step: 1,
      },
    ],
  },
  {
    id: 'cash-flow-parameters',
    name: 'Cash Flow Parameters',
    icon: FileText,
    description: 'Operating, investing, financing activities',
    parameters: [
      {
        id: 'depreciation_percentage',
        name: 'Depreciation %',
        value: 0.1,
        unit: '%',
        description: 'Depreciation as % of PP&E',
        category: 'cash-flow-parameters',
        min: 0,
        max: 0.5,
        step: 0.001,
      },
      {
        id: 'amortization_percentage',
        name: 'Amortization %',
        value: 0.05,
        unit: '%',
        description: 'Amortization as % of intangibles',
        category: 'cash-flow-parameters',
        min: 0,
        max: 0.5,
        step: 0.001,
      },
    ],
  },
  {
    id: 'balance-sheet-parameters',
    name: 'Balance Sheet Parameters',
    icon: PieChart,
    description: 'Assets, liabilities, equity parameters',
    parameters: [
      {
        id: 'cash_percentage',
        name: 'Cash %',
        value: 0.1,
        unit: '%',
        description: 'Cash as % of revenue',
        category: 'balance-sheet-parameters',
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        id: 'accounts_payable_days',
        name: 'Accounts Payable Days',
        value: 30,
        unit: 'days',
        description: 'Days payables outstanding',
        category: 'balance-sheet-parameters',
        min: 0,
        max: 365,
        step: 1,
      },
    ],
  },
  {
    id: 'asset-lifecycle',
    name: 'Asset Lifecycle',
    icon: Building,
    description: 'Useful lives, replacement schedules',
    parameters: [
      {
        id: 'asset_useful_life_years',
        name: 'Asset Useful Life',
        value: 10,
        unit: 'years',
        description: 'Average asset useful life',
        category: 'asset-lifecycle',
        min: 1,
        max: 50,
        step: 1,
      },
      {
        id: 'replacement_cycle_years',
        name: 'Replacement Cycle',
        value: 8,
        unit: 'years',
        description: 'Asset replacement frequency',
        category: 'asset-lifecycle',
        min: 1,
        max: 50,
        step: 1,
      },
    ],
  },
  {
    id: 'valuation-parameters',
    name: 'Valuation Parameters',
    icon: Target,
    description: 'DCF model, cost of capital, terminal value',
    parameters: [
      {
        id: 'discount_rate',
        name: 'Discount Rate',
        value: 0.1,
        unit: '%',
        description: 'WACC for DCF',
        category: 'valuation-parameters',
        min: 0,
        max: 0.5,
        step: 0.001,
      },
      {
        id: 'terminal_growth_rate',
        name: 'Terminal Growth Rate',
        value: 0.025,
        unit: '%',
        description: 'Terminal growth rate',
        category: 'valuation-parameters',
        min: 0,
        max: 0.1,
        step: 0.001,
      },
    ],
  },
];

export function ParameterManager({
  onParameterChange,
  onSaveTemplate
}: ParameterManagerProps) {
  const [activeCategory, setActiveCategory] = useState('economic-environment');
  const [parameters, setParameters] = useState<Parameter[]>(
    parameterCategories.flatMap(cat => cat.parameters)
  );

  const handleParameterChange = (id: string, value: number) => {
    const updatedParameters = parameters.map(param =>
      param.id === id ? { ...param, value } : param
    );
    setParameters(updatedParameters);
    onParameterChange?.(updatedParameters);
  };

  const activeCategoryData = parameterCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Parameter Management</h2>
          <p className="text-muted-foreground">
            Manage 12 categories of modeling parameters for comprehensive financial modeling
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onSaveTemplate?.(parameters)}>
            Save Template
          </Button>
          <Button>Apply Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Select a parameter category to edit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {parameterCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {category.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Parameter Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center space-x-2">
              {activeCategoryData && <activeCategoryData.icon className="h-5 w-5" />}
              <div>
                <CardTitle>{activeCategoryData?.name}</CardTitle>
                <CardDescription>
                  {activeCategoryData?.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCategoryData?.parameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={param.id} className="font-medium">
                      {param.name}
                    </Label>
                    <Badge variant="outline">{param.unit}</Badge>
                  </div>
                  <Input
                    id={param.id}
                    type="number"
                    value={param.value}
                    onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value) || 0)}
                    step={param.step || 0.1}
                    min={param.min}
                    max={param.max}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    {param.description}
                  </p>
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parameter Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Summary</CardTitle>
          <CardDescription>
            Overview of all parameter categories and their values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {parameterCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <category.icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {category.parameters.length} parameters
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
