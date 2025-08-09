import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../components/Popover';
import { Button } from '../components/Button';

const meta = {
  title: 'Design System/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-1">
          <div className="font-medium">Popover Title</div>
          <div className="text-sm text-muted-foreground">
            Small description text.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
