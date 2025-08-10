import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../components/Label';
import { Input } from '../components/Input';

const meta: Meta<typeof Label> = {
  title: 'Design System/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: { type: 'text' },
      description: 'ID of the associated form element',
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
    htmlFor: 'input',
    children: 'Label Text',
  },
  render: (args) => (
    <div className="grid w-[280px] items-center gap-1.5">
      <Label {...args} />
      <Input id="input" placeholder="Enter value" />
    </div>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-[280px] items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const FinancialForm: Story = {
  render: () => (
    <div className="space-y-4 w-[320px]">
      <div className="grid items-center gap-1.5">
        <Label htmlFor="revenue">Annual Revenue</Label>
        <Input id="revenue" type="number" placeholder="1000000" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="growthRate">Growth Rate (%)</Label>
        <Input id="growthRate" type="number" placeholder="15" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="discountRate">Discount Rate (%)</Label>
        <Input id="discountRate" type="number" placeholder="10" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="operatingMargin">Operating Margin (%)</Label>
        <Input id="operatingMargin" type="number" placeholder="20" />
      </div>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="grid w-[280px] items-center gap-1.5">
      <Label htmlFor="required" className="after:content-['*'] after:ml-0.5 after:text-red-500">
        Required Field
      </Label>
      <Input id="required" placeholder="This field is required" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-[280px] items-center gap-1.5">
      <Label htmlFor="disabled" className="text-muted-foreground">
        Disabled Field
      </Label>
      <Input id="disabled" disabled placeholder="This field is disabled" />
    </div>
  ),
};
