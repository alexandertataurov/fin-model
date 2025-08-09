import React from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '../components/HoverCard';

const meta = {
  title: 'Design System/HoverCard',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="underline cursor-pointer">
        Hover over me
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <div className="font-medium">Hover Card</div>
          <div className="text-xs text-muted-foreground">
            Useful for previews.
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
