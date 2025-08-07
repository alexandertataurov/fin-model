import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { BarChart3, FileText, Settings, TrendingUp } from 'lucide-react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Tabs Component

A tabs component built with Radix UI primitives for organizing content into logical sections with consistent styling and accessibility.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Keyboard Navigation**: Full keyboard support for tab switching
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Flexible styling and content organization
- **Icon Support**: Works well with icon components

## Usage in FinVision

- **Financial Reports**: Organize different report sections
- **Dashboard Views**: Switch between different dashboard panels
- **Model Parameters**: Group related parameters into tabs
- **Settings Pages**: Organize settings into logical categories
        `,
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Default active tab',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="name">Name</label>
              <input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <label htmlFor="username">Username</label>
              <input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="current">Current password</label>
              <input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <label htmlFor="new">New password</label>
              <input id="new" type="password" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const FinancialDashboard: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Reports
        </TabsTrigger>
        <TabsTrigger value="analysis" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Analysis
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Key metrics and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold">$2.4M</p>
                <p className="text-xs text-green-600">+12.5% vs last year</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Profit Margin</p>
                <p className="text-2xl font-bold">18.2%</p>
                <p className="text-xs text-green-600">+2.1% vs last year</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
            <CardDescription>
              Generate and view financial reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Income Statement</p>
                  <p className="text-sm text-muted-foreground">Q4 2024</p>
                </div>
                <button className="text-sm text-blue-600">View</button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Balance Sheet</p>
                  <p className="text-sm text-muted-foreground">Q4 2024</p>
                </div>
                <button className="text-sm text-blue-600">View</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analysis">
        <Card>
          <CardHeader>
            <CardTitle>Financial Analysis</CardTitle>
            <CardDescription>
              Advanced analysis and forecasting tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Trend Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze revenue and expense trends over time
                </p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Scenario Planning</h4>
                <p className="text-sm text-muted-foreground">
                  Model different business scenarios and outcomes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Settings</CardTitle>
            <CardDescription>
              Customize your dashboard preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-refresh</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show alerts</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" orientation="vertical" className="w-[600px]">
      <TabsList className="grid w-40 grid-cols-1">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="ml-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              High-level financial summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Overview content goes here...</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports" className="ml-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Financial reporting tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Reports content goes here...</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analysis" className="ml-6">
        <Card>
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
            <CardDescription>
              Advanced analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Analysis content goes here...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
