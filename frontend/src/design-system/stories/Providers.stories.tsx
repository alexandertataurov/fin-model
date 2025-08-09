import React from 'react';
import { DesignSystemProvider, useDesignSystem } from '../provider';
import { Button } from '../components/Button';

const meta = {
  title: 'Design System/Providers',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

function Controls() {
  const { theme, setTheme, density, setDensity, radius, setRadius } =
    useDesignSystem();
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Theme: {theme}</div>
      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')}>Light</Button>
        <Button variant="outline" onClick={() => setTheme('dark')}>
          Dark
        </Button>
        <Button variant="ghost" onClick={() => setTheme('system')}>
          System
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">Density: {density}</div>
      <div className="flex gap-2">
        <Button onClick={() => setDensity('compact')}>Compact</Button>
        <Button variant="outline" onClick={() => setDensity('comfortable')}>
          Comfortable
        </Button>
        <Button variant="ghost" onClick={() => setDensity('spacious')}>
          Spacious
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">Radius: {radius}</div>
      <div className="flex gap-2">
        <Button onClick={() => setRadius('none')}>None</Button>
        <Button variant="outline" onClick={() => setRadius('md')}>
          MD
        </Button>
        <Button variant="ghost" onClick={() => setRadius('xl')}>
          XL
        </Button>
      </div>
    </div>
  );
}

export const Playground = {
  render: () => (
    <DesignSystemProvider>
      <div className="space-y-6">
        <Controls />
        <div className="rounded-md border p-4">
          Preview box reacts to provider changes.
        </div>
      </div>
    </DesignSystemProvider>
  ),
};
