import React from 'react';
import { tokens } from '../tokens';

const meta = {
  title: 'Design System/Foundations/Shadows',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Elevation = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {Object.entries(tokens.shadows).map(([name, shadow]) => (
        <div key={name} className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground mb-3">{name}</div>
          <div
            className="h-24 rounded-md bg-background"
            style={{ boxShadow: String(shadow) }}
          />
          <div className="text-xs text-muted-foreground mt-2">
            {String(shadow)}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ElevationOnDark = {
  render: () => (
    <div
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 rounded-lg"
      style={{ background: 'hsl(0 0% 10%)' }}
    >
      {Object.entries(tokens.shadows).map(([name, shadow]) => (
        <div
          key={name}
          className="p-4 rounded-lg border bg-card/80 backdrop-blur"
        >
          <div className="text-sm text-muted-foreground mb-3">{name}</div>
          <div
            className="h-24 rounded-md bg-background"
            style={{ boxShadow: String(shadow) }}
          />
          <div className="text-xs text-muted-foreground mt-2">
            {String(shadow)}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { backgrounds: { default: 'dark' } },
};
