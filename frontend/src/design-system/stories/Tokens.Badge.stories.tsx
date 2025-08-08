import React from 'react';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Design System/Badge',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

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

export const Variants = {
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

export const Sizes = {
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
