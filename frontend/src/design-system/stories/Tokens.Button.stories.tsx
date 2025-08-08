import React from 'react';
import { Button } from '../components/Button';

const meta = {
  title: 'Design System/Tokens/Button',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

const variants = ['default','secondary','outline','ghost','link','destructive','success','warning','info'] as const;
const sizes = ['xs','sm','md','lg','xl'] as const;

export const VariantsAndSizes = {
  render: () => (
    <div className="space-y-6">
      {variants.map(v => (
        <div key={v} className="space-y-2">
          <div className="text-sm text-muted-foreground">variant: {v}</div>
          <div className="flex flex-wrap gap-2">
            {sizes.map(s => (
              <Button key={`${v}-${s}`} variant={v as any} size={s as any}>
                {v}/{s}
              </Button>
            ))}
          </div>
        </div>
      ))}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Loading state</div>
        <Button loading>Loading</Button>
      </div>
    </div>
  ),
};
