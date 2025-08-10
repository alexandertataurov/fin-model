import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from '../components/RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Design System/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
      description: 'Default selected value',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled value',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when selection changes',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the radio group is disabled',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'option2',
  },
  render: (args) => (
    <RadioGroup {...args} className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="option1" />
        <label htmlFor="option1">Option 1</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="option2" />
        <label htmlFor="option2">Option 2</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="option3" />
        <label htmlFor="option3">Option 3</label>
      </div>
    </RadioGroup>
  ),
};

export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="2" className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="1" id="r1" />
        <label htmlFor="r1">Option 1</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="2" id="r2" />
        <label htmlFor="r2">Option 2</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="3" id="r3" />
        <label htmlFor="r3">Option 3</label>
      </div>
    </RadioGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="option2" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="v1" />
        <label htmlFor="v1">Revenue Growth</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="v2" />
        <label htmlFor="v2">EBITDA Growth</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="v3" />
        <label htmlFor="v3">Net Income Growth</label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" disabled className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="d1" />
        <label htmlFor="d1">Option 1</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="d2" />
        <label htmlFor="d2">Option 2</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="d3" />
        <label htmlFor="d3">Option 3</label>
      </div>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('option1');
    return (
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={setValue} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option1" id="c1" />
            <label htmlFor="c1">Conservative</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option2" id="c2" />
            <label htmlFor="c2">Moderate</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option3" id="c3" />
            <label htmlFor="c3">Aggressive</label>
          </div>
        </RadioGroup>
        <div className="text-sm text-muted-foreground">
          Selected: {value}
        </div>
      </div>
    );
  },
};
