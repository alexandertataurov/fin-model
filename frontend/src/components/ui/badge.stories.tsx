import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: '🧩 UI Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Badge Component

Small status indicators built with Class Variance Authority for type-safe variant management. Used throughout FinVision to communicate status, categories, and quick information.

## Badge Variants

- **default**: Primary brand color for standard status
- **secondary**: Muted background for supplementary information
- **destructive**: Red color for errors and warnings
- **outline**: Bordered style for subtle emphasis

## Key Features

- **Semantic Colors**: Status-appropriate color coding
- **Consistent Sizing**: Uniform height and padding
- **Icon Support**: Works well with small icons
- **Accessibility**: Proper contrast ratios
- **Flexible Content**: Text, numbers, or icons

## Usage in FinVision

- **Parameter Status**: Modified, default, validation states
- **Model Health**: Calculation status, error indicators
- **User Roles**: Permission levels and access
- **Data Categories**: Financial statement types
- **Progress Indicators**: Completion states
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants with their visual styles.',
      },
    },
  },
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Model Status</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default" className="bg-green-700 text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Complete
          </Badge>
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </Badge>
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Parameter Status</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">Default Value</Badge>
          <Badge variant="default">Modified</Badge>
          <Badge variant="secondary">Calculated</Badge>
          <Badge variant="destructive">Invalid</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status indicators for different system states.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Badge variant="default">
        <TrendingUp className="mr-1 h-3 w-3" />
        Growing
      </Badge>
      <Badge variant="destructive">
        <TrendingDown className="mr-1 h-3 w-3" />
        Declining
      </Badge>
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
      <Badge variant="outline">
        <CheckCircle className="mr-1 h-3 w-3" />
        Verified
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with icons for enhanced visual communication.',
      },
    },
  },
};

export const NumberBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Counts and Metrics</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">24</Badge>
          <Badge variant="secondary">3 Modified</Badge>
          <Badge variant="outline">15.2%</Badge>
          <Badge variant="destructive">2 Errors</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Performance Indicators</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default" className="bg-green-700 text-white">
            +12.5%
          </Badge>
          <Badge variant="destructive">-3.2%</Badge>
          <Badge variant="secondary">$1.2M</Badge>
          <Badge variant="outline">Q4 2024</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges displaying numerical data and performance metrics.',
      },
    },
  },
};

export const DismissableBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default" className="pr-1">
        Filter: Revenue
        <button className="ml-1 hover:bg-white/20 rounded-full p-0.5">
          <X className="h-3 w-3" />
        </button>
      </Badge>
      <Badge variant="secondary" className="pr-1">
        Modified Today
        <button className="ml-1 hover:bg-black/20 rounded-full p-0.5">
          <X className="h-3 w-3" />
        </button>
      </Badge>
      <Badge variant="outline" className="pr-1">
        Q1 2024
        <button className="ml-1 hover:bg-muted rounded-full p-0.5">
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dismissable badges for filters and temporary selections.',
      },
    },
  },
};

export const ParameterCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">Revenue Growth Rate</CardTitle>
          <div className="flex gap-1">
            <Badge variant="outline">Revenue</Badge>
            <Badge variant="default">Modified</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Current Value</span>
            <Badge variant="secondary" className="font-mono">
              15.0%
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Default Value</span>
            <Badge variant="outline" className="font-mono">
              10.0%
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Impact</span>
            <Badge variant="default" className="bg-green-700 text-white">
              <TrendingUp className="mr-1 h-3 w-3" />
              +$2.1M
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Parameter card using badges to show category, status, and impact.',
      },
    },
  },
};

export const DashboardExample: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">Model Status</CardTitle>
              <Badge variant="default" className="bg-green-700 text-white">
                <CheckCircle className="mr-1 h-3 w-3" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">FinModel v2.1</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">Parameters</CardTitle>
              <div className="flex gap-1">
                <Badge variant="secondary">24 Total</Badge>
                <Badge variant="default">3 Modified</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21 Valid</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">Last Update</CardTitle>
              <Badge variant="outline">
                <Clock className="mr-1 h-3 w-3" />5 min ago
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Auto-sync</div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard example showing badges in context with cards and metrics.',
      },
    },
  },
};
