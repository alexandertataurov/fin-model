import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
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
  BarChart3
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
  onSaveTemplate?: (template: any) => void;
}

const parameterCategories = [
  {
    id: 'economic-environment',
    name: 'Economic Environment',
    icon: Building,
    description: 'Inflation, GDP growth, interest rates, commodity prices',
    parameters: [
      { id: 'inflation_rate', name: 'Inflation Rate', value: 2.5, unit: '%', description: 'General inflation rate' },
      { id: 'gdp_growth_rate', name: 'GDP Growth Rate', value: 2.1, unit: '%', description: 'GDP growth rate' },
      { id: 'interest_rate_environment', name: 'Base Interest Rate', value: 4.5, unit: '%', description: 'Base interest rate' },
      { id: 'currency_exchange_rate', name: 'Exchange Rate vs USD', value: 1.0, unit: 'USD', description: 'Exchange rate vs USD' }
    ]
  },
  {
    id: 'tax-environment',
    name: 'Tax Environment',
    icon: Calculator,
    description: 'Corporate tax rates, state taxes, tax credits, foreign taxes',
    parameters: [
      { id: 'corporate_tax_rate', name: 'Corporate Tax Rate', value: 21.0, unit: '%', description: 'Corporate income tax rate' },
      { id: 'state_tax_rate', name: 'State Tax Rate', value: 5.0, unit: '%', description: 'State/local tax rate' },
      { id: 'effective_tax_rate', name: 'Effective Tax Rate', value: 25.0, unit: '%', description: 'Effective tax rate' },
      { id: 'tax_credits', name: 'Tax Credits', value: 0.0, unit: '$', description: 'Available tax credits' }
    ]
  },
  {
    id: 'revenue-parameters',
    name: 'Revenue Parameters',
    icon: TrendingUp,
    description: 'Product/service revenue, pricing, volume, mix shifts',
    parameters: [
      { id: 'product_revenue_growth', name: 'Product Revenue Growth', value: 15.0, unit: '%', description: 'Product revenue growth rate' },
      { id: 'product_price_inflation', name: 'Product Price Inflation', value: 3.0, unit: '%', description: 'Product price inflation' },
      { id: 'service_revenue_growth', name: 'Service Revenue Growth', value: 12.0, unit: '%', description: 'Service revenue growth rate' },
      { id: 'service_price_inflation', name: 'Service Price Inflation', value: 2.5, unit: '%', description: 'Service price inflation' }
    ]
  },
  {
    id: 'cogs-parameters',
    name: 'COGS Parameters',
    icon: DollarSign,
    description: 'Direct materials, labor, overhead, efficiency improvements',
    parameters: [
      { id: 'direct_materials_percentage', name: 'Direct Materials %', value: 35.0, unit: '%', description: 'Direct materials as % of revenue' },
      { id: 'direct_labor_percentage', name: 'Direct Labor %', value: 20.0, unit: '%', description: 'Direct labor as % of revenue' },
      { id: 'manufacturing_overhead_percentage', name: 'Mfg Overhead %', value: 15.0, unit: '%', description: 'Manufacturing overhead as % of revenue' },
      { id: 'materials_inflation_rate', name: 'Materials Inflation', value: 2.0, unit: '%', description: 'Materials cost inflation' }
    ]
  },
  {
    id: 'operating-expenses',
    name: 'Operating Expenses',
    icon: Settings,
    description: 'Sales & marketing, R&D, G&A, salary inflation',
    parameters: [
      { id: 'sales_commission_percentage', name: 'Sales Commission %', value: 8.0, unit: '%', description: 'Sales commission as % of revenue' },
      { id: 'marketing_spend_percentage', name: 'Marketing Spend %', value: 12.0, unit: '%', description: 'Marketing as % of revenue' },
      { id: 'rnd_percentage', name: 'R&D %', value: 10.0, unit: '%', description: 'R&D as % of revenue' },
      { id: 'executive_salaries_percentage', name: 'Executive Salaries %', value: 5.0, unit: '%', description: 'Executive salaries as % of revenue' }
    ]
  },
  {
    id: 'financial-parameters',
    name: 'Financial Parameters',
    icon: BarChart3,
    description: 'Interest rates, investment returns, foreign exchange',
    parameters: [
      { id: 'short_term_interest_rate', name: 'Short-term Interest Rate', value: 5.0, unit: '%', description: 'Short-term debt rate' },
      { id: 'long_term_interest_rate', name: 'Long-term Interest Rate', value: 6.0, unit: '%', description: 'Long-term debt rate' },
      { id: 'cash_investment_return', name: 'Cash Investment Return', value: 3.5, unit: '%', description: 'Cash investment return' },
      { id: 'foreign_exchange_gain_loss', name: 'FX Gain/Loss %', value: 0.5, unit: '%', description: 'FX gain/loss as % of revenue' }
    ]
  },
  {
    id: 'operational-parameters',
    name: 'Operational Parameters',
    icon: Clock,
    description: 'Working capital, CapEx, depreciation, amortization',
    parameters: [
      { id: 'accounts_receivable_days', name: 'Accounts Receivable Days', value: 45, unit: 'days', description: 'Days sales outstanding' },
      { id: 'inventory_days', name: 'Inventory Days', value: 60, unit: 'days', description: 'Days inventory outstanding' },
      { id: 'accounts_payable_days', name: 'Accounts Payable Days', value: 30, unit: 'days', description: 'Days payables outstanding' },
      { id: 'maintenance_capex_percentage', name: 'Maintenance CapEx %', value: 8.0, unit: '%', description: 'Maintenance CapEx as % of revenue' }
    ]
  },
  {
    id: 'cash-flow-lifecycle',
    name: 'Cash Flow Lifecycle',
    icon: Activity,
    description: 'Collection periods, payment terms, seasonality',
    parameters: [
      { id: 'collection_period_days', name: 'Collection Period Days', value: 45, unit: 'days', description: 'Days sales outstanding' },
      { id: 'payment_terms_days', name: 'Payment Terms Days', value: 30, unit: 'days', description: 'Days payables outstanding' },
      { id: 'inventory_holding_days', name: 'Inventory Holding Days', value: 60, unit: 'days', description: 'Days inventory outstanding' },
      { id: 'cash_conversion_cycle', name: 'Cash Conversion Cycle', value: 75, unit: 'days', description: 'Cash conversion cycle days' }
    ]
  },
  {
    id: 'cash-flow-statement',
    name: 'Cash Flow Statement',
    icon: FileText,
    description: 'Operating, investing, financing activities parameters',
    parameters: [
      { id: 'depreciation_percentage', name: 'Depreciation %', value: 10.0, unit: '%', description: 'Depreciation as % of PP&E' },
      { id: 'amortization_percentage', name: 'Amortization %', value: 15.0, unit: '%', description: 'Amortization as % of intangibles' },
      { id: 'working_capital_percentage', name: 'Working Capital %', value: 25.0, unit: '%', description: 'Working capital as % of revenue' },
      { id: 'capex_percentage', name: 'CapEx %', value: 12.0, unit: '%', description: 'CapEx as % of revenue' }
    ]
  },
  {
    id: 'asset-lifecycle',
    name: 'Asset Lifecycle',
    icon: Target,
    description: 'Useful lives, replacement schedules, maintenance',
    parameters: [
      { id: 'asset_useful_life_years', name: 'Asset Useful Life', value: 10, unit: 'years', description: 'Average asset useful life' },
      { id: 'replacement_cycle_years', name: 'Replacement Cycle', value: 8, unit: 'years', description: 'Asset replacement frequency' },
      { id: 'salvage_value_percentage', name: 'Salvage Value %', value: 10.0, unit: '%', description: '% of original cost' },
      { id: 'maintenance_spend_percentage', name: 'Maintenance Spend %', value: 3.0, unit: '%', description: 'Maintenance as % of asset value' }
    ]
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    icon: PieChart,
    description: 'Assets, liabilities, equity parameters and ratios',
    parameters: [
      { id: 'cash_percentage', name: 'Cash %', value: 15.0, unit: '%', description: 'Cash as % of revenue' },
      { id: 'accounts_receivable_days', name: 'AR Days', value: 45, unit: 'days', description: 'Days sales outstanding' },
      { id: 'inventory_days', name: 'Inventory Days', value: 60, unit: 'days', description: 'Days inventory outstanding' },
      { id: 'target_debt_to_equity_ratio', name: 'Target Debt/Equity', value: 0.5, unit: 'ratio', description: 'Target debt-to-equity ratio' }
    ]
  },
  {
    id: 'valuation-parameters',
    name: 'Valuation Parameters',
    icon: Zap,
    description: 'DCF model, cost of capital, terminal value, sensitivity analysis',
    parameters: [
      { id: 'projection_period_years', name: 'Projection Period', value: 5, unit: 'years', description: 'Number of years to project' },
      { id: 'terminal_growth_rate', name: 'Terminal Growth Rate', value: 2.5, unit: '%', description: 'Long-term growth rate' },
      { id: 'risk_free_rate', name: 'Risk-free Rate', value: 3.0, unit: '%', description: 'Risk-free rate' },
      { id: 'market_risk_premium', name: 'Market Risk Premium', value: 6.0, unit: '%', description: 'Market risk premium' }
    ]
  }
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
