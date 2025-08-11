import React from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../components/Collapsible';
import { Button } from '../components/Button';

const meta = {
  title: 'Design System/6 - Data/Collapsible',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle content</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 w-64 text-sm text-muted-foreground">
          Hidden content revealed. Use for show/hide sections.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
