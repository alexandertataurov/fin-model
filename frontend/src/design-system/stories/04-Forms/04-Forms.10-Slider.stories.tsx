import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../../components/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Design System/4 - Forms/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'object' },
      description: 'Current value(s) of the slider',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when value changes',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
    },
    step: {
      control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
      description: 'Step increment',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the slider is disabled',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: [50],
    min: 0,
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-80 space-y-2">
      <Slider {...args} />
      <div className="text-sm text-muted-foreground">Value: {args.value?.[0]}</div>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState([50]);
    return (
      <div className="w-80 space-y-2">
        <Slider value={value} onValueChange={setValue} max={100} min={0} />
        <div className="text-sm text-muted-foreground">Value: {value[0]}</div>
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = React.useState([25, 75]);
    return (
      <div className="w-80 space-y-2">
        <Slider value={value} onValueChange={setValue} max={100} min={0} />
        <div className="text-sm text-muted-foreground">
          Range: {value[0]} - {value[1]}
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: [50],
    min: 0,
    max: 100,
    disabled: true,
  },
  render: (args) => (
    <div className="w-80 space-y-2">
      <Slider {...args} />
      <div className="text-sm text-muted-foreground">Disabled slider</div>
    </div>
  ),
};

export const WithSteps: Story = {
  args: {
    value: [50],
    min: 0,
    max: 100,
    step: 10,
  },
  render: (args) => (
    <div className="w-80 space-y-2">
      <Slider {...args} />
      <div className="text-sm text-muted-foreground">Step: 10</div>
    </div>
  ),
};
