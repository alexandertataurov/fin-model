import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/Tooltip';
import { Button } from '../components/Button';

const meta = {
  title: 'Design System/Tooltip',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Placements = {
  render: () => (
    <div className="flex gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map(side => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
