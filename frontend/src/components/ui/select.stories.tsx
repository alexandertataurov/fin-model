import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Select Component

A dropdown select component built on Radix UI primitives with full accessibility support. Provides consistent styling and behavior for choosing from predefined options.

## Select Components

- **Select**: Root select container
- **SelectTrigger**: Button that opens the dropdown
- **SelectValue**: Displays the selected value
- **SelectContent**: Dropdown content container
- **SelectItem**: Individual selectable options

## Key Features

- **Accessible**: Full keyboard navigation and screen reader support
- **Searchable**: Type to filter options (when enabled)
- **Customizable**: Flexible styling and content options
- **Controlled**: Both controlled and uncontrolled modes
- **Multi-select**: Support for multiple selections

## Usage in FinVision

- **Parameter Categories**: Filter parameters by type
- **Time Periods**: Select reporting periods
- **Chart Types**: Choose visualization types
- **User Roles**: Admin interface selections
- **File Types**: Filter uploaded files
        `,
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Choose an option</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Time Period</Label>
      <Select defaultValue="q1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="q1">Q1 2024</SelectItem>
          <SelectItem value="q2">Q2 2024</SelectItem>
          <SelectItem value="q3">Q3 2024</SelectItem>
          <SelectItem value="q4">Q4 2024</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select with a pre-selected default value.',
      },
    },
  },
};

export const ParameterCategories: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Parameter Category</Label>
      <Select defaultValue="all">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="revenue">Revenue Parameters</SelectItem>
          <SelectItem value="costs">Cost Parameters</SelectItem>
          <SelectItem value="valuation">Valuation Parameters</SelectItem>
          <SelectItem value="operational">Operational Parameters</SelectItem>
          <SelectItem value="market">Market Parameters</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Parameter category selector for filtering financial parameters.',
      },
    },
  },
};

export const ChartTypes: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Chart Type</Label>
      <Select defaultValue="line">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="line">Line Chart</SelectItem>
          <SelectItem value="bar">Bar Chart</SelectItem>
          <SelectItem value="pie">Pie Chart</SelectItem>
          <SelectItem value="waterfall">Waterfall Chart</SelectItem>
          <SelectItem value="scatter">Scatter Plot</SelectItem>
          <SelectItem value="heatmap">Heat Map</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart type selector for data visualization options.',
      },
    },
  },
};

export const CurrencySelector: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Display Currency</Label>
      <Select defaultValue="usd">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">🇺🇸 USD - US Dollar</SelectItem>
          <SelectItem value="eur">🇪🇺 EUR - Euro</SelectItem>
          <SelectItem value="gbp">🇬🇧 GBP - British Pound</SelectItem>
          <SelectItem value="jpy">🇯🇵 JPY - Japanese Yen</SelectItem>
          <SelectItem value="cad">🇨🇦 CAD - Canadian Dollar</SelectItem>
          <SelectItem value="aud">🇦🇺 AUD - Australian Dollar</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Currency selector with flags and full currency names.',
      },
    },
  },
};

export const UserRoles: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>User Role</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select user role..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Administrator</SelectItem>
          <SelectItem value="analyst">Financial Analyst</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User role selector for admin interface.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Disabled Select</Label>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="This select is disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select component in disabled state.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Report Configuration</CardTitle>
        <CardDescription>
          Configure your financial report settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select defaultValue="income">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income Statement</SelectItem>
              <SelectItem value="balance">Balance Sheet</SelectItem>
              <SelectItem value="cashflow">Cash Flow Statement</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Period</Label>
          <Select defaultValue="annual">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select defaultValue="pdf">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button className="w-full">Generate Report</Button>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form example using multiple select components for report configuration.',
      },
    },
  },
};

export const FilterExample: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label className="sr-only">Search</Label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search parameters..."
          />
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

        <Select defaultValue="any">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Status</SelectItem>
            <SelectItem value="modified">Recently Modified</SelectItem>
            <SelectItem value="default">Default Values</SelectItem>
            <SelectItem value="custom">Custom Values</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Filter results would appear here based on the selected criteria.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple select components used together for advanced filtering.',
      },
    },
  },
};