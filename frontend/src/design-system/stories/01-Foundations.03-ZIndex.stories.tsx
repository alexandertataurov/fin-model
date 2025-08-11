import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import React from 'react';

const meta: Meta = {
  title: 'Design System/Foundations/Z-Index',
  parameters: {
    docs: {
      description: {
        component: 'Z-index tokens define the stacking order of elements. Higher values appear on top. Use semantic tokens for common UI patterns.'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

// Base layer visualization
export const ZIndexLayers: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Z-Index Token System</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our z-index tokens are organized into semantic layers, from base content to highest priority overlays.
          </p>
        </div>

        {/* Base layers (0-50) */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground border-b pb-2">Base Layers</h4>
          <div className="relative h-64 border-2 border-dashed border-muted rounded-xl overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            {Object.entries(tokens.zIndex)
              .filter(([name, z]) => typeof z === 'string' && !isNaN(Number(z)) && Number(z) <= 50)
              .map(([name, z], i) => (
                <div
                  key={name}
                  className="absolute rounded-lg border-2 flex items-center justify-center text-sm font-medium shadow-lg backdrop-blur-sm"
                  style={{
                    zIndex: Number(z as string),
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 8}%`,
                    width: `${120 - i * 8}px`,
                    height: `${80 - i * 6}px`,
                    background: `hsl(215 92% 60% / ${0.1 + i * 0.02})`,
                    borderColor: `hsl(215 20% 50% / ${0.3 + i * 0.1})`,
                    color: 'hsl(215 20% 30%)',
                    transform: `rotate(${i * 2}deg)`,
                  }}
                >
                  <div className="text-center">
                    <div className="font-bold text-xs">{name}</div>
                    <div className="text-xs opacity-75">z={z}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Semantic layers (dropdown-tooltip) */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground border-b pb-2">Semantic Layers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(tokens.zIndex)
              .filter(([name, z]) => typeof z === 'string' && !isNaN(Number(z)) && Number(z) >= 1000)
              .map(([name, z], i) => {
                const colors = [
                  'from-blue-500/20 to-blue-600/20 border-blue-300/50',
                  'from-green-500/20 to-green-600/20 border-green-300/50',
                  'from-purple-500/20 to-purple-600/20 border-purple-300/50',
                  'from-orange-500/20 to-orange-600/20 border-orange-300/50',
                  'from-red-500/20 to-red-600/20 border-red-300/50',
                  'from-pink-500/20 to-pink-600/20 border-pink-300/50',
                ];
                const colorClass = colors[i % colors.length];

                return (
                  <div
                    key={name}
                    className={`relative h-32 rounded-lg border-2 bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
                    style={{ zIndex: Number(z as string) }}
                  >
                    <div className="text-center space-y-1">
                      <div className="font-bold text-sm capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-xs opacity-75 font-mono">z-index: {z}</div>
                      <div className="text-xs opacity-60">
                        {name === 'dropdown' && 'Navigation menus'}
                        {name === 'sticky' && 'Fixed headers'}
                        {name === 'fixed' && 'Fixed elements'}
                        {name === 'modal' && 'Dialog overlays'}
                        {name === 'popover' && 'Context menus'}
                        {name === 'tooltip' && 'Help text'}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Layer hierarchy visualization */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground border-b pb-2">Layer Hierarchy</h4>
          <div className="relative h-48 bg-gradient-to-b from-muted/10 to-background rounded-lg border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-2">
                {Object.entries(tokens.zIndex)
                  .filter(([name, z]) => typeof z === 'string' && !isNaN(Number(z)) && Number(z) >= 1000)
                  .reverse()
                  .map(([name, z], i) => (
                    <div
                      key={name}
                      className="flex items-center space-x-3 px-4 py-2 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm"
                      style={{
                        zIndex: Number(z as string),
                        transform: `translateX(${i * 20}px)`,
                        width: `${300 - i * 20}px`
                      }}
                    >
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium text-sm capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-xs text-muted-foreground font-mono ml-auto">{z}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Usage guidelines */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground border-b pb-2">Usage Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="font-medium text-foreground">When to Use</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Base layers (0-50) for content organization</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Semantic tokens for consistent UI patterns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Higher values only when necessary</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium text-foreground">Avoid</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Arbitrary z-index values</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Values above 1060 unless critical</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Nested stacking contexts without planning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Real-world use cases
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Common Use Cases</h3>

        {/* Navigation with dropdown */}
        <div className="relative border rounded-lg p-6 bg-background">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Navigation with Dropdown (z-dropdown: 1000)</h4>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 px-4 py-2 rounded-md text-primary font-medium">Logo</div>
            <div className="bg-muted px-4 py-2 rounded-md">Home</div>
            <div className="relative">
              <div className="bg-muted px-4 py-2 rounded-md cursor-pointer hover:bg-muted/80">Products ▼</div>
              <div
                className="absolute top-full mt-1 bg-background border rounded-md shadow-lg p-2 min-w-[120px]"
                style={{ zIndex: tokens.zIndex.dropdown }}
              >
                <div className="px-2 py-1 hover:bg-muted rounded text-sm">Product A</div>
                <div className="px-2 py-1 hover:bg-muted rounded text-sm">Product B</div>
                <div className="px-2 py-1 hover:bg-muted rounded text-sm">Product C</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky header */}
        <div className="relative border rounded-lg p-6 bg-background">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Sticky Header (z-sticky: 1020)</h4>
          <div className="space-y-4">
            <div
              className="bg-background border-b px-6 py-3 flex items-center justify-between"
              style={{ zIndex: tokens.zIndex.sticky }}
            >
              <div className="font-semibold">Sticky Header</div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-8 h-8 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="h-32 bg-gradient-to-b from-muted/20 to-transparent rounded-md"></div>
          </div>
        </div>

        {/* Modal overlay */}
        <div className="relative border rounded-lg p-6 bg-background">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Modal with Backdrop (z-modal: 1040)</h4>
          <div className="relative h-40 bg-muted/20 rounded-md overflow-hidden">
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              style={{ zIndex: tokens.zIndex.modal }}
            >
              <div className="bg-background border rounded-lg p-6 max-w-sm mx-4">
                <h5 className="font-semibold mb-2">Modal Title</h5>
                <p className="text-sm text-muted-foreground mb-4">This modal appears above the backdrop.</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Confirm</button>
                  <button className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        <div className="relative border rounded-lg p-6 bg-background">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Tooltip (z-tooltip: 1060)</h4>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-primary px-4 py-2 rounded-md text-primary-foreground cursor-help">Hover me</div>
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap"
                style={{ zIndex: tokens.zIndex.tooltip }}
              >
                This is a tooltip
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Tooltips appear above all other elements</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Stacking context demonstration
export const StackingContext: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Stacking Context Examples</h3>
        <p className="text-sm text-muted-foreground">Elements with higher z-index values appear on top, regardless of DOM order.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic stacking */}
          <div className="border rounded-lg p-4 bg-background">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Basic Stacking</h4>
            <div className="relative h-32">
              <div className="absolute inset-4 bg-blue-200 rounded border-2 border-blue-300 flex items-center justify-center text-sm">
                Base Layer (z=0)
              </div>
              <div
                className="absolute inset-8 bg-green-200 rounded border-2 border-green-300 flex items-center justify-center text-sm"
                style={{ zIndex: tokens.zIndex[10] }}
              >
                Middle (z=10)
              </div>
              <div
                className="absolute inset-12 bg-red-200 rounded border-2 border-red-300 flex items-center justify-center text-sm"
                style={{ zIndex: tokens.zIndex[50] }}
              >
                Top (z=50)
              </div>
            </div>
          </div>

          {/* Overlapping elements */}
          <div className="border rounded-lg p-4 bg-background">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Overlapping Elements</h4>
            <div className="relative h-32">
              <div className="absolute left-2 top-2 w-20 h-20 bg-purple-200 rounded border-2 border-purple-300 flex items-center justify-center text-xs">
                Card 1 (z=20)
              </div>
              <div
                className="absolute left-8 top-8 w-20 h-20 bg-orange-200 rounded border-2 border-orange-300 flex items-center justify-center text-xs"
                style={{ zIndex: tokens.zIndex[30] }}
              >
                Card 2 (z=30)
              </div>
              <div
                className="absolute left-14 top-14 w-20 h-20 bg-pink-200 rounded border-2 border-pink-300 flex items-center justify-center text-xs"
                style={{ zIndex: tokens.zIndex[40] }}
              >
                Card 3 (z=40)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Guidelines
export const Guidelines: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Z-Index Guidelines</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Semantic Tokens</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">dropdown</span>
                <span className="font-mono">1000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">sticky</span>
                <span className="font-mono">1020</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">fixed</span>
                <span className="font-mono">1030</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">modal</span>
                <span className="font-mono">1040</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">popover</span>
                <span className="font-mono">1050</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">tooltip</span>
                <span className="font-mono">1060</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Best Practices</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use semantic tokens for common UI patterns</li>
              <li>• Avoid arbitrary z-index values</li>
              <li>• Keep z-index values as low as possible</li>
              <li>• Consider stacking context when nesting elements</li>
              <li>• Test z-index behavior across different browsers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};