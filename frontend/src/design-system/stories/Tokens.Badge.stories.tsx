import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Design System/Tokens/Badge',
  component: Badge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'outline', 'destructive', 'success', 'warning', 'info', 'muted'],
      description: 'Badge variant style',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const variants = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'success',
  'warning',
  'info',
  'muted',
] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {variants.map(v => (
        <Badge key={v} variant={v as any}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {sizes.map(s => (
        <Badge key={s} size={s as any}>
          {s}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="success">✓ Success</Badge>
      <Badge variant="warning">⚠ Warning</Badge>
      <Badge variant="destructive">✗ Error</Badge>
      <Badge variant="info">ℹ Info</Badge>
    </div>
  ),
};
