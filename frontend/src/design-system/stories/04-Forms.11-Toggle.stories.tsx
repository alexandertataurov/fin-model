import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../components/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Design System/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
      description: 'Toggle variant style',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
      description: 'Toggle size',
    },
    pressed: {
      control: { type: 'boolean' },
      description: 'Whether the toggle is pressed',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the toggle is disabled',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Toggle',
    children: 'Toggle',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold">B</Toggle>
      <Toggle variant="outline" aria-label="Italic">
        I
      </Toggle>
      <Toggle variant="default" aria-label="Underline">
        U
      </Toggle>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Toggle size="sm" aria-label="Small">S</Toggle>
      <Toggle size="default" aria-label="Default">D</Toggle>
      <Toggle size="lg" aria-label="Large">L</Toggle>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Default">Default</Toggle>
      <Toggle pressed aria-label="Pressed">Pressed</Toggle>
      <Toggle disabled aria-label="Disabled">Disabled</Toggle>
    </div>
  ),
};
