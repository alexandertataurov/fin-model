import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Design System/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.',
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
      description: 'Default selected tab value',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled tab value',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when tab value changes',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
    },
    activationMode: {
      control: { type: 'select' },
      options: ['automatic', 'manual'],
      description: 'Tab activation mode',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'account',
    orientation: 'horizontal',
    activationMode: 'automatic',
  },
  render: (args) => (
    <Tabs {...args} className="w-[480px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content here</TabsContent>
      <TabsContent value="password">Password content here</TabsContent>
      <TabsContent value="billing">Billing content here</TabsContent>
    </Tabs>
  ),
};

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content here</TabsContent>
      <TabsContent value="password">Password content here</TabsContent>
      <TabsContent value="billing">Billing content here</TabsContent>
    </Tabs>
  ),
};

export const FinancialDashboard: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        <TabsTrigger value="ratios">Ratios</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Financial Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">$2.4M</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">$1.8M</div>
              <div className="text-sm text-muted-foreground">Total Expenses</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">$600K</div>
              <div className="text-sm text-muted-foreground">Net Income</div>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="revenue">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Revenue Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Detailed revenue breakdown by product line and region.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="expenses">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Expense Breakdown</h3>
          <p className="text-sm text-muted-foreground">
            Operating expenses, cost of goods sold, and overhead analysis.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="cashflow">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cash Flow Statement</h3>
          <p className="text-sm text-muted-foreground">
            Operating, investing, and financing cash flows.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="ratios">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Financial Ratios</h3>
          <p className="text-sm text-muted-foreground">
            Liquidity, profitability, and efficiency ratios.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <Tabs defaultValue="parameters" orientation="vertical" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="parameters">Parameters</TabsTrigger>
        <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
      </TabsList>
      <TabsContent value="parameters" className="mt-0">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Model Parameters</h3>
          <p className="text-sm text-muted-foreground">
            Configure financial model parameters and assumptions.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="scenarios" className="mt-0">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scenario Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Define and manage different business scenarios.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="results" className="mt-0">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Model Results</h3>
          <p className="text-sm text-muted-foreground">
            View calculated financial metrics and projections.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="charts" className="mt-0">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Visualizations</h3>
          <p className="text-sm text-muted-foreground">
            Charts and graphs for data visualization.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
