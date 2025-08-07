import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import {
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
} from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: '🧩 UI Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Card Component

A flexible card component system built with composition in mind. Cards are the primary content containers in FinVision, used for dashboards, reports, and data visualization.

## Card Components

- **Card**: Main container with border and background
- **CardHeader**: Header section with title and optional actions
- **CardTitle**: Semantic title with customizable heading level
- **CardDescription**: Subtitle or description text
- **CardContent**: Main content area
- **CardFooter**: Footer section for actions or metadata
- **CardAction**: Action buttons in the header area

## Key Features

- **Composable**: Mix and match card components as needed
- **Semantic**: Proper heading hierarchy support
- **Interactive**: Built-in hover and focus states
- **Accessible**: Screen reader friendly structure

## Usage in FinVision

- **Dashboard Widgets**: KPI cards, charts, and metrics
- **Report Cards**: Financial statement summaries
- **Parameter Groups**: Organized parameter editing
- **File Upload**: Progress and status cards
        `,
      },
    },
  },
  argTypes: {
    interactive: {
      control: 'boolean',
      description: 'Enable interactive hover states',
    },
    hover: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description of what this card contains.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Summary of key financial metrics</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Revenue</span>
            <span className="font-medium">$1.2M</span>
          </div>
          <div className="flex justify-between">
            <span>Profit</span>
            <span className="font-medium text-green-600">$240K</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with action button in the header area.',
      },
    },
  },
};

export const DashboardWidgets: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      {/* KPI Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,234,567</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">+12.5%</span>
            <span>from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Report Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Badge variant="secondary">In Progress</Badge>
        </CardFooter>
      </Card>

      {/* File Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Q4 Financial Report</span>
          </CardTitle>
          <CardDescription>Last updated 2 hours ago</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Comprehensive quarterly analysis with key metrics and forecasts.
          </p>
        </CardContent>
        <CardFooter className="space-x-2">
          <Button size="sm" variant="outline">
            View
          </Button>
          <Button size="sm">Download</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Various dashboard widget examples showing different card patterns.',
      },
    },
  },
};

export const ParameterGroup: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Revenue Parameters</CardTitle>
        <CardDescription>Adjust revenue growth assumptions</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Growth Rate</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                defaultValue="0.15"
                className="flex-1"
              />
              <span className="text-sm font-mono">15%</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Amount</label>
            <input
              type="number"
              defaultValue="1000000"
              className="w-full px-3 py-1 border rounded text-sm"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button variant="outline" size="sm">
          Reset
        </Button>
        <Button size="sm">Apply</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example parameter group card from the financial modeling interface.',
      },
    },
  },
};

export const FileUploadCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Upload Financial Data</CardTitle>
        <CardDescription>Upload Excel files for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop your files here, or click to browse
          </p>
          <Button variant="outline" size="sm">
            Browse Files
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Supports .xlsx, .xls, .csv files up to 10MB
        </p>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'File upload card example from the data import workflow.',
      },
    },
  },
};

export const Simple: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p>A simple card with just content.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal card with only content area.',
      },
    },
  },
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Header Only Card</CardTitle>
        <CardDescription>Sometimes you just need a header</CardDescription>
      </CardHeader>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with only header section.',
      },
    },
  },
};
