import React from 'react';
import { tokens } from '../tokens';

const meta = {
  title: 'Design System/Foundations/Spacing',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Scale = {
  render: () => (
    <div className="space-y-4">
      {Object.entries(tokens.spacing).map(([name, size]) => (
        <div key={name} className="flex items-center gap-4">
          <div className="w-24 text-sm text-muted-foreground">{name}</div>
          <div className="flex-1 bg-muted rounded">
            <div
              className="bg-primary rounded"
              style={{ height: '12px', width: String(size) }}
            />
          </div>
          <div className="w-24 text-sm text-muted-foreground">
            {String(size)}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const VisualStack = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(tokens.spacing).map(([name, size]) => (
        <div key={name} className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground mb-3">gap: {name}</div>
          <div className="bg-muted/60 rounded p-3">
            <div className="flex flex-col" style={{ gap: String(size) }}>
              <div className="h-6 rounded bg-primary/30" />
              <div className="h-6 rounded bg-primary/30" />
              <div className="h-6 rounded bg-primary/30" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {String(size)}
          </div>
        </div>
      ))}
    </div>
  ),
};
