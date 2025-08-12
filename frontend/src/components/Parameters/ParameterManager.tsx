/**
 * Comprehensive Parameter Management UI
 * Based on lean financial modeling plan - 12-category parameter interface
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Label } from '@/design-system/components/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import { Slider } from '@/design-system/components/Slider';
import {
  Settings,
  Save,
  RefreshCw,
  Download,
  Upload,
  TrendingUp,
  DollarSign,
  Users,
  Factory,
  Building,
  Calculator,
  BarChart3,
  Target,
  AlertTriangle
} from 'lucide-react';

// Define parameter categories based on the lean financial modeling plan
export interface ParameterGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  parameters: ParameterDefinition[];
}

export interface ParameterDefinition {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  min_value?: number;
  max_value?: number;
  validation_rule?: string;
  category: string;
  subcategory?: string;
  is_percentage?: boolean;
  is_currency?: boolean;
  is_count?: boolean;
  dependent_on?: string[];
}

interface ParameterManagerProps {
  initialParameters?: ParameterGroup[];
  onParametersChange?: (parameters: ParameterGroup[]) => void;
  onSave?: (parameters: ParameterGroup[]) => void;
  onReset?: () => void;
  isLoading?: boolean;
}

const ParameterManager: React.FC<ParameterManagerProps> = ({
  initialParameters = [],
  onParametersChange,
  onSave,
  onReset,
  isLoading = false,
}) => {
  const [parameters, setParameters] = useState<ParameterGroup[]>(initialParameters);
  const [activeTab, setActiveTab] = useState<string>('revenue');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [_validationErrors, _setValidationErrors] = useState<Record<string, string>>({});

  // Default parameter structure based on lean financial modeling plan
  const defaultParameters: ParameterGroup[] = useMemo(() => ([
    {
      id: 'revenue',
      name: 'Revenue & Growth',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
      parameters: [
        {
          id: 'initial_revenue',
          name: 'Initial Revenue',
          description: 'Starting annual revenue',
          value: 10000000,
          unit: 'USD',
          min_value: 0,
          category: 'revenue',
          is_currency: true,
        },
        {
          id: 'revenue_growth_rate',
          name: 'Revenue Growth Rate',
          description: 'Annual revenue growth percentage',
          value: 0.15,
          unit: '%',
          min_value: -0.5,
          max_value: 2.0,
          category: 'revenue',
          is_percentage: true,
        },
        {
          id: 'seasonal_factor',
          name: 'Seasonality Factor',
          description: 'Revenue seasonality multiplier',
          value: 1.0,
          unit: 'x',
          min_value: 0.5,
          max_value: 2.0,
          category: 'revenue',
        }
      ]
    },
    {
      id: 'costs',
      name: 'Cost Structure',
      icon: <Calculator className="w-5 h-5" />,
      color: 'text-red-600',
      parameters: [
        {
          id: 'cogs_percentage',
          name: 'Cost of Goods Sold %',
          description: 'COGS as percentage of revenue',
          value: 0.60,
          unit: '%',
          min_value: 0.0,
          max_value: 1.0,
          category: 'costs',
          is_percentage: true,
        },
        {
          id: 'gross_margin_target',
          name: 'Gross Margin Target',
          description: 'Target gross margin percentage',
          value: 0.40,
          unit: '%',
          min_value: 0.0,
          max_value: 1.0,
          category: 'costs',
          is_percentage: true,
        },
        {
          id: 'variable_cost_ratio',
          name: 'Variable Cost Ratio',
          description: 'Variable costs as % of revenue',
          value: 0.25,
          unit: '%',
          min_value: 0.0,
          max_value: 0.8,
          category: 'costs',
          is_percentage: true,
        }
      ]
    },
    {
      id: 'personnel',
      name: 'Personnel & HR',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      parameters: [
        {
          id: 'employee_count',
          name: 'Employee Count',
          description: 'Total number of employees',
          value: 50,
          unit: 'people',
          min_value: 1,
          max_value: 10000,
          category: 'personnel',
          is_count: true,
        },
        {
          id: 'average_salary',
          name: 'Average Salary',
          description: 'Average annual salary per employee',
          value: 75000,
          unit: 'USD',
          min_value: 20000,
          max_value: 500000,
          category: 'personnel',
          is_currency: true,
        },
        {
          id: 'salary_growth_rate',
          name: 'Salary Growth Rate',
          description: 'Annual salary increase percentage',
          value: 0.03,
          unit: '%',
          min_value: 0.0,
          max_value: 0.15,
          category: 'personnel',
          is_percentage: true,
        },
        {
          id: 'benefits_rate',
          name: 'Benefits Rate',
          description: 'Employee benefits as % of salary',
          value: 0.25,
          unit: '%',
          min_value: 0.0,
          max_value: 0.5,
          category: 'personnel',
          is_percentage: true,
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: <Factory className="w-5 h-5" />,
      color: 'text-purple-600',
      parameters: [
        {
          id: 'operational_efficiency',
          name: 'Operational Efficiency',
          description: 'Overall operational efficiency factor',
          value: 0.85,
          unit: '%',
          min_value: 0.3,
          max_value: 1.0,
          category: 'operations',
          is_percentage: true,
        },
        {
          id: 'capacity_utilization',
          name: 'Capacity Utilization',
          description: 'Production capacity utilization',
          value: 0.75,
          unit: '%',
          min_value: 0.0,
          max_value: 1.0,
          category: 'operations',
          is_percentage: true,
        },
        {
          id: 'maintenance_cost_rate',
          name: 'Maintenance Cost Rate',
          description: 'Maintenance costs as % of revenue',
          value: 0.02,
          unit: '%',
          min_value: 0.0,
          max_value: 0.1,
          category: 'operations',
          is_percentage: true,
        }
      ]
    },
    {
      id: 'capex',
      name: 'Capital Expenditures',
      icon: <Building className="w-5 h-5" />,
      color: 'text-indigo-600',
      parameters: [
        {
          id: 'annual_capex_rate',
          name: 'Annual CapEx Rate',
          description: 'Capital expenditures as % of revenue',
          value: 0.05,
          unit: '%',
          min_value: 0.0,
          max_value: 0.3,
          category: 'capex',
          is_percentage: true,
        },
        {
          id: 'depreciation_rate',
          name: 'Depreciation Rate',
          description: 'Annual depreciation rate',
          value: 0.10,
          unit: '%',
          min_value: 0.01,
          max_value: 0.5,
          category: 'capex',
          is_percentage: true,
        },
        {
          id: 'asset_life_years',
          name: 'Asset Life',
          description: 'Average asset useful life in years',
          value: 10,
          unit: 'years',
          min_value: 1,
          max_value: 50,
          category: 'capex',
          is_count: true,
        }
      ]
    },
    {
      id: 'working_capital',
      name: 'Working Capital',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-yellow-600',
      parameters: [
        {
          id: 'days_sales_outstanding',
          name: 'Days Sales Outstanding',
          description: 'Average collection period in days',
          value: 45,
          unit: 'days',
          min_value: 0,
          max_value: 365,
          category: 'working_capital',
          is_count: true,
        },
        {
          id: 'days_inventory_outstanding',
          name: 'Days Inventory Outstanding',
          description: 'Inventory turnover period in days',
          value: 60,
          unit: 'days',
          min_value: 0,
          max_value: 365,
          category: 'working_capital',
          is_count: true,
        },
        {
          id: 'days_payable_outstanding',
          name: 'Days Payable Outstanding',
          description: 'Payment period to suppliers in days',
          value: 30,
          unit: 'days',
          min_value: 0,
          max_value: 180,
          category: 'working_capital',
          is_count: true,
        }
      ]
    },
    {
      id: 'financing',
      name: 'Financing',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-pink-600',
      parameters: [
        {
          id: 'debt_to_equity_ratio',
          name: 'Debt-to-Equity Ratio',
          description: 'Target debt to equity ratio',
          value: 0.3,
          unit: 'x',
          min_value: 0.0,
          max_value: 5.0,
          category: 'financing',
        },
        {
          id: 'interest_rate',
          name: 'Interest Rate',
          description: 'Average cost of debt',
          value: 0.06,
          unit: '%',
          min_value: 0.0,
          max_value: 0.25,
          category: 'financing',
          is_percentage: true,
        },
        {
          id: 'dividend_payout_ratio',
          name: 'Dividend Payout Ratio',
          description: 'Dividends as % of net income',
          value: 0.30,
          unit: '%',
          min_value: 0.0,
          max_value: 1.0,
          category: 'financing',
          is_percentage: true,
        }
      ]
    },
    {
      id: 'valuation',
      name: 'Valuation',
      icon: <Target className="w-5 h-5" />,
      color: 'text-emerald-600',
      parameters: [
        {
          id: 'discount_rate',
          name: 'Discount Rate (WACC)',
          description: 'Weighted average cost of capital',
          value: 0.12,
          unit: '%',
          min_value: 0.01,
          max_value: 0.3,
          category: 'valuation',
          is_percentage: true,
        },
        {
          id: 'terminal_growth_rate',
          name: 'Terminal Growth Rate',
          description: 'Long-term growth rate for DCF',
          value: 0.02,
          unit: '%',
          min_value: 0.0,
          max_value: 0.1,
          category: 'valuation',
          is_percentage: true,
        },
        {
          id: 'projection_years',
          name: 'Projection Years',
          description: 'Number of years to project',
          value: 10,
          unit: 'years',
          min_value: 3,
          max_value: 20,
          category: 'valuation',
          is_count: true,
        }
      ]
    }
  ]), []);

  useEffect(() => {
    if (initialParameters.length === 0) {
      setParameters(defaultParameters);
    } else {
      setParameters(initialParameters);
    }
  }, [initialParameters, defaultParameters]);

  const formatValue = (parameter: ParameterDefinition): string => {
    if (parameter.is_percentage) {
      return `${(parameter.value * 100).toFixed(1)}%`;
    } else if (parameter.is_currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parameter.value);
    } else if (parameter.is_count) {
      return parameter.value.toLocaleString();
    } else {
      return parameter.value.toFixed(2);
    }
  };

  const updateParameter = (groupId: string, parameterId: string, newValue: number) => {
    const updatedParameters = parameters.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          parameters: group.parameters.map(param => {
            if (param.id === parameterId) {
              // Validate the new value
              let validatedValue = newValue;
              if (param.min_value !== undefined) {
                validatedValue = Math.max(validatedValue, param.min_value);
              }
              if (param.max_value !== undefined) {
                validatedValue = Math.min(validatedValue, param.max_value);
              }

              return { ...param, value: validatedValue };
            }
            return param;
          })
        };
      }
      return group;
    });

    setParameters(updatedParameters);
    setHasUnsavedChanges(true);
    onParametersChange?.(updatedParameters);
  };

  const handleSave = () => {
    onSave?.(parameters);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    setParameters(defaultParameters);
    setHasUnsavedChanges(false);
    onReset?.();
  };

  const ParameterInput: React.FC<{
    parameter: ParameterDefinition;
    groupId: string;
  }> = ({ parameter, groupId }) => {
    const [inputValue, setInputValue] = useState(parameter.value.toString());

    const handleInputChange = (value: string) => {
      setInputValue(value);
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        updateParameter(groupId, parameter.id, numericValue);
      }
    };

    const handleSliderChange = (values: number[]) => {
      const newValue = values[0];
      setInputValue(newValue.toString());
      updateParameter(groupId, parameter.id, newValue);
    };

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <Label className="font-medium">{parameter.name}</Label>
            <p className="text-sm text-gray-500 mt-1">{parameter.description}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">{formatValue(parameter)}</div>
            <div className="text-xs text-gray-500">{parameter.unit}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            type="number"
            step={parameter.is_percentage ? "0.01" : "1"}
            min={parameter.min_value}
            max={parameter.max_value}
            className="w-full"
          />

          {(parameter.min_value !== undefined && parameter.max_value !== undefined) && (
            <Slider
              value={[parameter.value]}
              onValueChange={handleSliderChange}
              min={parameter.min_value}
              max={parameter.max_value}
              step={parameter.is_percentage ? 0.001 : 1}
              className="w-full"
            />
          )}
        </div>

        {parameter.min_value !== undefined && parameter.max_value !== undefined && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>{parameter.is_percentage ? `${(parameter.min_value * 100).toFixed(0)}%` : parameter.min_value}</span>
            <span>{parameter.is_percentage ? `${(parameter.max_value * 100).toFixed(0)}%` : parameter.max_value}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-6 h-6" />
          <span>Parameter Management</span>
          {hasUnsavedChanges && (
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          )}
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isLoading}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            {parameters.map((group) => (
              <TabsTrigger
                key={group.id}
                value={group.id}
                className="flex flex-col items-center space-y-1 p-2"
              >
                <div className={group.color}>{group.icon}</div>
                <span className="text-xs font-medium">{group.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {parameters.map((group) => (
            <TabsContent key={group.id} value={group.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={group.color}>{group.icon}</div>
                    <span>{group.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {group.parameters.map((parameter) => (
                      <Card key={parameter.id} className="p-4">
                        <ParameterInput parameter={parameter} groupId={group.id} />
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {hasUnsavedChanges && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">You have unsaved changes</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Click "Save Changes" to apply your parameter updates to the financial model.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterManager;