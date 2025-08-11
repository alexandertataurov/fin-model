import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../components/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is required',
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback when checked state changes',
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
    checked: false,
    disabled: false,
    required: false,
  },
  render: (args) => <Checkbox {...args} aria-label="Checkbox" />,
};

export const Basic: Story = {
  render: () => <Checkbox aria-label="Checkbox" />,
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex items-center gap-2">
        <Checkbox checked={checked} onCheckedChange={setChecked} id="c1" />
        <label htmlFor="c1" className="text-sm">
          Subscribe
        </label>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <label htmlFor="disabled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Disabled option
      </label>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="required" required />
      <label htmlFor="required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Required field *
      </label>
    </div>
  ),
};

export const FinancialOptions: Story = {
  render: () => {
    const [options, setOptions] = React.useState({
      riskAnalysis: false,
      sensitivityTesting: true,
      monteCarlo: false,
      scenarioComparison: true,
    });

    const handleChange = (key: string, checked: boolean) => {
      setOptions(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="space-y-3">
        <h4 className="font-medium">Analysis Options</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="riskAnalysis" 
              checked={options.riskAnalysis}
              onCheckedChange={(checked) => handleChange('riskAnalysis', checked as boolean)}
            />
            <label htmlFor="riskAnalysis" className="text-sm">
              Risk Analysis
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sensitivityTesting" 
              checked={options.sensitivityTesting}
              onCheckedChange={(checked) => handleChange('sensitivityTesting', checked as boolean)}
            />
            <label htmlFor="sensitivityTesting" className="text-sm">
              Sensitivity Testing
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="monteCarlo" 
              checked={options.monteCarlo}
              onCheckedChange={(checked) => handleChange('monteCarlo', checked as boolean)}
            />
            <label htmlFor="monteCarlo" className="text-sm">
              Monte Carlo Simulation
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="scenarioComparison" 
              checked={options.scenarioComparison}
              onCheckedChange={(checked) => handleChange('scenarioComparison', checked as boolean)}
            />
            <label htmlFor="scenarioComparison" className="text-sm">
              Scenario Comparison
            </label>
          </div>
        </div>
      </div>
    );
  },
};

export const MultipleStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <label htmlFor="unchecked" className="text-sm">Unchecked</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="checked" defaultChecked />
        <label htmlFor="checked" className="text-sm">Checked</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <label htmlFor="disabled-unchecked" className="text-sm">Disabled Unchecked</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <label htmlFor="disabled-checked" className="text-sm">Disabled Checked</label>
      </div>
    </div>
  ),
};
