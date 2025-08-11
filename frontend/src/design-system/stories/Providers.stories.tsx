import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DesignSystemProvider, useDesignSystem } from '../provider';
import { Button } from '../components/Button';

const meta: Meta<typeof DesignSystemProvider> = {
  title: 'Design System/Providers',
  component: DesignSystemProvider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description: 'Theme setting',
    },
    density: {
      control: { type: 'select' },
      options: ['compact', 'comfortable', 'spacious'],
      description: 'Density setting',
    },
    radius: {
      control: { type: 'select' },
      options: ['none', 'md', 'xl'],
      description: 'Border radius setting',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

function Controls() {
  const { theme, setTheme, density, setDensity, radius, setRadius } =
    useDesignSystem();
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Theme: {theme}</div>
      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')}>Light</Button>
        <Button variant="outline" onClick={() => setTheme('dark')}>
          Dark
        </Button>
        <Button variant="ghost" onClick={() => setTheme('system')}>
          System
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">Density: {density}</div>
      <div className="flex gap-2">
        <Button onClick={() => setDensity('compact')}>Compact</Button>
        <Button variant="outline" onClick={() => setDensity('comfortable')}>
          Comfortable
        </Button>
        <Button variant="ghost" onClick={() => setDensity('spacious')}>
          Spacious
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">Radius: {radius}</div>
      <div className="flex gap-2">
        <Button onClick={() => setRadius('none')}>None</Button>
        <Button variant="outline" onClick={() => setRadius('md')}>
          MD
        </Button>
        <Button variant="ghost" onClick={() => setRadius('xl')}>
          XL
        </Button>
      </div>
    </div>
  );
}

export const Playground: Story = {
  args: {
    theme: 'light',
    density: 'comfortable',
    radius: 'md',
  },
  render: (args) => (
    <DesignSystemProvider {...args}>
      <div className="space-y-6">
        <Controls />
        <div className="rounded-md border p-4">
          Preview box reacts to provider changes.
        </div>
      </div>
    </DesignSystemProvider>
  ),
};

export const FinancialTheme: Story = {
  render: () => (
    <DesignSystemProvider theme="light" density="compact" radius="md">
      <div className="space-y-6">
        <div className="rounded-md border p-4 bg-gradient-to-r from-blue-50 to-green-50">
          <h3 className="font-semibold text-blue-900">Financial Dashboard</h3>
          <p className="text-sm text-blue-700">Professional theme for financial applications</p>
        </div>
        <Controls />
      </div>
    </DesignSystemProvider>
  ),
};
