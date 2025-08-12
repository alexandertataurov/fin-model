import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Toggle size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
    size: 'md',
  },
  render: (args) => <ThemeToggle {...args} />,
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => <ThemeToggle {...args} />,
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => <ThemeToggle {...args} />,
};

export const WithCustomStyling: Story = {
  args: {
    className: 'border-2 border-primary rounded-lg p-2',
  },
  render: (args) => <ThemeToggle {...args} />,
};

export const Loading: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Empty: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Error: Story = { parameters: { docs: { description: { story: 'Error state.' } } } };
