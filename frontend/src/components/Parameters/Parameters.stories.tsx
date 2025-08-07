import type { Meta, StoryObj } from '@storybook/react';
// import { ParameterControl } from './ParameterControl';
// import { ParameterGroup } from './ParameterGroup';
// import { ParameterSearch } from './ParameterSearch';
// import { BulkParameterEdit } from './BulkParameterEdit';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Settings,
  Calculator,
  Search,
  Edit,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

const meta: Meta = {
  title: '🏗️ Application Structure/⚙️ Business Features',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Core business intelligence and operational framework - parameter management systems, scenario analysis tools, and financial modeling workflows.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BusinessFeaturesOverview: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">⚙️ Business Features Framework</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Core business intelligence and operational framework for parameter
          management, scenario analysis, and financial modeling workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parameter Management</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Dynamic Controls</p>
                <p className="text-sm text-muted-foreground">
                  Sliders, inputs, and selectors
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Bulk Operations</p>
                <p className="text-sm text-muted-foreground">
                  Batch editing and updates
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium">Validation</p>
                <p className="text-sm text-muted-foreground">
                  Range checks and constraints
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scenario Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium">What-If Modeling</p>
                <p className="text-sm text-muted-foreground">
                  Sensitivity analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium">Monte Carlo</p>
                <p className="text-sm text-muted-foreground">
                  Probabilistic modeling
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <div>
                <p className="font-medium">Comparison</p>
                <p className="text-sm text-muted-foreground">
                  Base vs scenario results
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Business Intelligence</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <div>
                <p className="font-medium">Real-time Updates</p>
                <p className="text-sm text-muted-foreground">
                  Live calculations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <div>
                <p className="font-medium">Impact Analysis</p>
                <p className="text-sm text-muted-foreground">Change tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Reporting</p>
                <p className="text-sm text-muted-foreground">
                  Automated insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Operational Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Workflow Management</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Parameter lifecycle management</li>
              <li>• Change approval workflows</li>
              <li>• Version control and history</li>
              <li>• Collaboration features</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Data Integration</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Excel import/export</li>
              <li>• API connectivity</li>
              <li>• Real-time synchronization</li>
              <li>• Data validation rules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive overview of the Business Features framework, showcasing parameter management, scenario analysis, and operational capabilities.',
      },
    },
  },
};

// Sample parameter data
const sampleParameters = [
  {
    id: 'revenue_growth',
    name: 'Revenue Growth Rate',
    description: 'Annual revenue growth assumption',
    type: 'percentage',
    category: 'Revenue',
    value: 0.15,
    default_value: 0.1,
    min_value: 0,
    max_value: 0.5,
    control_type: 'slider' as const,
    display_format: 'percentage' as const,
    step_size: 0.01,
    is_editable: true,
  },
  {
    id: 'cost_of_goods_sold',
    name: 'Cost of Goods Sold',
    description: 'COGS as percentage of revenue',
    type: 'percentage',
    category: 'Costs',
    value: 0.6,
    default_value: 0.65,
    min_value: 0.4,
    max_value: 0.8,
    control_type: 'slider' as const,
    display_format: 'percentage' as const,
    step_size: 0.01,
    is_editable: true,
  },
  {
    id: 'discount_rate',
    name: 'Discount Rate',
    description: 'Weighted average cost of capital',
    type: 'percentage',
    category: 'Valuation',
    value: 0.08,
    default_value: 0.1,
    min_value: 0.05,
    max_value: 0.15,
    control_type: 'input' as const,
    display_format: 'percentage' as const,
    step_size: 0.001,
    is_editable: true,
  },
];

export const ParameterSlider: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Revenue Growth Rate</span>
        </CardTitle>
        <CardDescription>
          Annual revenue growth assumption for financial projections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Growth Rate</Label>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">15.0%</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Slider value={[15]} min={0} max={50} step={0.1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current:</span>
            <span className="font-medium">15.0%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Default:</span>
            <span>10.0%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Range:</span>
            <span>0% - 50%</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Impact</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-green-600">+$2.1M</span>
              <TrendingUp className="h-3 w-3 text-green-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Parameter control with slider input and impact analysis.',
      },
    },
  },
};

export const ParameterInput: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Discount Rate</span>
        </CardTitle>
        <CardDescription>
          Weighted average cost of capital for valuation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="discount-rate">Rate (%)</Label>
          <div className="relative">
            <Input
              id="discount-rate"
              type="number"
              value="8.0"
              step="0.1"
              min="5.0"
              max="15.0"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Range: 5.0% - 15.0%</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Current</span>
            <p className="font-medium">8.0%</p>
          </div>
          <div>
            <span className="text-muted-foreground">Default</span>
            <p>10.0%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Sensitivity</span>
            <Badge variant="outline">High</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            1% change = $1.5M valuation impact
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Parameter control with numeric input and sensitivity analysis.',
      },
    },
  },
};

export const ParameterGroupExample: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Revenue Parameters</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">3 parameters</Badge>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Revenue growth assumptions and pricing parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Growth */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-sm font-medium">Revenue Growth Rate</Label>
              <p className="text-xs text-muted-foreground">
                Annual growth assumption
              </p>
            </div>
            <Badge variant="secondary">15.0%</Badge>
          </div>
          <Slider value={[15]} min={0} max={50} step={0.1} />
        </div>

        {/* Price Elasticity */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-sm font-medium">Price Elasticity</Label>
              <p className="text-xs text-muted-foreground">
                Demand sensitivity to price
              </p>
            </div>
            <Badge variant="secondary">-1.2</Badge>
          </div>
          <Slider value={[1.2]} min={0.5} max={3.0} step={0.1} />
        </div>

        {/* Market Share */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-sm font-medium">Market Share</Label>
              <p className="text-xs text-muted-foreground">
                Target market penetration
              </p>
            </div>
            <Badge variant="secondary">12.5%</Badge>
          </div>
          <Slider value={[12.5]} min={0} max={50} step={0.5} />
        </div>

        <div className="pt-4 border-t flex justify-between items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Combined Impact:</span>
            <span className="ml-2 font-medium text-green-600">
              +$3.2M Revenue
            </span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Reset
            </Button>
            <Button size="sm">Apply</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Parameter group with multiple related controls and combined impact.',
      },
    },
  },
};

export const ParameterSearchExample: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      {/* Search Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search parameters..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="costs">Costs</SelectItem>
                <SelectItem value="valuation">Valuation</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Bulk Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parameter List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleParameters.map(param => (
          <Card key={param.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{param.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {param.description}
                  </CardDescription>
                </div>
                <Badge variant="outline">{param.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Current Value
                  </span>
                  <Badge variant="secondary">
                    {param.display_format === 'percentage'
                      ? `${(param.value * 100).toFixed(1)}%`
                      : param.value}
                  </Badge>
                </div>

                {param.control_type === 'slider' && (
                  <Slider
                    value={[param.value * 100]}
                    min={param.min_value! * 100}
                    max={param.max_value! * 100}
                    step={param.step_size! * 100}
                  />
                )}

                {param.control_type === 'input' && (
                  <Input
                    type="number"
                    value={param.value}
                    min={param.min_value}
                    max={param.max_value}
                    step={param.step_size}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Parameter search and filtering interface with multiple parameter types.',
      },
    },
  },
};

export const BulkEditExample: Story = {
  render: () => (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Bulk Parameter Edit</CardTitle>
        <CardDescription>
          Edit multiple parameters simultaneously
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">3 parameters selected</span>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Select All
            </Button>
            <Button variant="outline" size="sm">
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Select</div>
            <div className="col-span-4">Parameter</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Current</div>
            <div className="col-span-3">New Value</div>
          </div>

          {sampleParameters.map(param => (
            <div
              key={param.id}
              className="grid grid-cols-12 gap-4 items-center p-2 border rounded"
            >
              <div className="col-span-1">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              <div className="col-span-4">
                <div>
                  <p className="text-sm font-medium">{param.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {param.description}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className="text-xs">
                  {param.category}
                </Badge>
              </div>
              <div className="col-span-2">
                <span className="text-sm">
                  {param.display_format === 'percentage'
                    ? `${(param.value * 100).toFixed(1)}%`
                    : param.value}
                </span>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  defaultValue={param.value}
                  min={param.min_value}
                  max={param.max_value}
                  step={param.step_size}
                  className="h-8"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Changes will update 3 parameters
          </div>
          <div className="space-x-2">
            <Button variant="outline">Preview Changes</Button>
            <Button>Apply All</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Bulk parameter editing interface for efficient parameter management.',
      },
    },
  },
};
