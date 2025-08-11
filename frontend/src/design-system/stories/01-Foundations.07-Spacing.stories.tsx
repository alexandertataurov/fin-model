import React from 'react';
import { tokens } from '../tokens';
import { getSpacing, responsiveSpacing } from '../utils/tokenHelpers';
import { DesignSystem } from '../utils/designSystem';

const meta = {
  title: 'Design System/Foundations/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive spacing system with consistent scale, use cases, and responsive patterns.'
      }
    }
  },
  tags: ['autodocs'],
};
export default meta;

// Spacing scale visualization
export const Scale = {
  render: () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Spacing Scale</h3>
        <p className="text-sm text-muted-foreground">
          Our spacing system uses a consistent 4px (0.25rem) base unit with a 1.5x multiplier for larger values.
        </p>
      </div>

      {Object.entries(tokens.spacing).map(([name, size]) => (
        <div key={name} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
          <div className="w-20 text-sm font-medium text-foreground">{name}</div>
          <div className="flex-1 bg-muted rounded-md overflow-hidden">
            <div
              className="bg-primary h-3 rounded"
              style={{ width: String(size) }}
            />
          </div>
          <div className="w-24 text-sm text-muted-foreground font-mono">
            {String(size)}
          </div>
          <div className="w-16 text-xs text-muted-foreground">
            {parseFloat(size) * 16}px
          </div>
        </div>
      ))}
    </div>
  ),
};

// Visual spacing examples
export const VisualExamples = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Visual Spacing Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(tokens.spacing).slice(0, 9).map(([name, size]) => (
            <div key={name} className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                gap: {name}
              </div>
              <div className="bg-muted/60 rounded p-3">
                <div className="flex flex-col" style={{ gap: String(size) }}>
                  <div className="h-6 rounded bg-primary/30" />
                  <div className="h-6 rounded bg-primary/30" />
                  <div className="h-6 rounded bg-primary/30" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono">
                {String(size)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Common use cases
export const UseCases = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Common Use Cases</h3>

        {/* Component spacing */}
        <div className="space-y-6">
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Component Spacing</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm text-muted-foreground">Button padding:</div>
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded">
                  Button (px-4 py-2)
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm text-muted-foreground">Card padding:</div>
                <div className="p-6 bg-muted rounded border">
                  Card content (p-6)
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm text-muted-foreground">Section spacing:</div>
                <div className="py-8 bg-muted rounded border">
                  Section (py-8)
                </div>
              </div>
            </div>
          </div>

          {/* Layout spacing */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Layout Spacing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-muted rounded">
                <div className="text-sm font-medium mb-2">Grid gap-6</div>
                <div className="text-xs text-muted-foreground">24px between items</div>
              </div>
              <div className="p-4 bg-muted rounded">
                <div className="text-sm font-medium mb-2">Container padding</div>
                <div className="text-xs text-muted-foreground">px-4 sm:px-6 lg:px-8</div>
              </div>
              <div className="p-4 bg-muted rounded">
                <div className="text-sm font-medium mb-2">Section margins</div>
                <div className="text-xs text-muted-foreground">my-8 lg:my-12</div>
              </div>
            </div>
          </div>

          {/* Typography spacing */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Typography Spacing</h4>
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Heading 1</h1>
                <p className="text-sm text-muted-foreground">mb-2 (8px) below heading</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">Heading 2</h2>
                <p className="text-sm text-muted-foreground">mb-3 (12px) below heading</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Heading 3</h3>
                <p className="text-sm text-muted-foreground">mb-4 (16px) below heading</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Responsive spacing patterns
export const ResponsivePatterns = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Responsive Spacing Patterns</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Spacing that adapts to different screen sizes for optimal user experience.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Container spacing */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Container Spacing</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Mobile:</span> px-4 (16px)
              </div>
              <div className="text-sm">
                <span className="font-medium">Tablet:</span> px-6 (24px)
              </div>
              <div className="text-sm">
                <span className="font-medium">Desktop:</span> px-8 (32px)
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded text-xs">
              <code>className="px-4 sm:px-6 lg:px-8"</code>
            </div>
          </div>

          {/* Section spacing */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Section Spacing</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Mobile:</span> py-8 (32px)
              </div>
              <div className="text-sm">
                <span className="font-medium">Tablet:</span> py-12 (48px)
              </div>
              <div className="text-sm">
                <span className="font-medium">Desktop:</span> py-16 (64px)
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded text-xs">
              <code>className="py-8 sm:py-12 lg:py-16"</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Design token usage
export const TokenUsage = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Design Token Usage</h3>
        <p className="text-sm text-muted-foreground mb-6">
          How to use spacing tokens programmatically in components.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Direct token usage */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Direct Token Usage</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">getSpacing('4'):</span> {getSpacing('4' as keyof typeof tokens.spacing)}
              </div>
              <div className="text-sm">
                <span className="font-medium">getSpacing('8'):</span> {getSpacing('8' as keyof typeof tokens.spacing)}
              </div>
              <div className="text-sm">
                <span className="font-medium">getSpacing('16'):</span> {getSpacing('16' as keyof typeof tokens.spacing)}
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded text-xs">
              <code>import {`{ getSpacing }`} from '../utils/tokenHelpers'</code>
            </div>
          </div>

          {/* Responsive spacing */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Responsive Spacing</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Base:</span> {getSpacing('4' as keyof typeof tokens.spacing)}
              </div>
              <div className="text-sm">
                <span className="font-medium">MD:</span> {getSpacing('6' as keyof typeof tokens.spacing)}
              </div>
              <div className="text-sm">
                <span className="font-medium">LG:</span> {getSpacing('8' as keyof typeof tokens.spacing)}
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded text-xs">
              <code>responsiveSpacing({`{ base: '4', md: '6', lg: '8' }`})</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Spacing guidelines
export const Guidelines = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Spacing Guidelines</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* When to use */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">When to Use Each Size</h4>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Tight spacing (1-3)</div>
                <div className="text-xs text-muted-foreground">
                  • Between related elements<br />
                  • Icon and text pairs<br />
                  • Form field labels
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Standard spacing (4-6)</div>
                <div className="text-xs text-muted-foreground">
                  • Component padding<br />
                  • Button spacing<br />
                  • Card content
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Loose spacing (8-12)</div>
                <div className="text-xs text-muted-foreground">
                  • Section spacing<br />
                  • Major content blocks<br />
                  • Page margins
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Extra loose (16+)</div>
                <div className="text-xs text-muted-foreground">
                  • Page sections<br />
                  • Hero areas<br />
                  • Footer spacing
                </div>
              </div>
            </div>
          </div>

          {/* Best practices */}
          <div className="p-6 rounded-lg border bg-card">
            <h4 className="text-base font-semibold mb-4">Best Practices</h4>
            <div className="space-y-4">
              <div className="text-sm">
                <span className="font-medium text-green-600">✓</span> Use consistent spacing scale
              </div>
              <div className="text-sm">
                <span className="font-medium text-green-600">✓</span> Prefer spacing tokens over hardcoded values
              </div>
              <div className="text-sm">
                <span className="font-medium text-green-600">✓</span> Use responsive spacing for mobile-first design
              </div>
              <div className="text-sm">
                <span className="font-medium text-red-600">✗</span> Don't mix different spacing systems
              </div>
              <div className="text-sm">
                <span className="font-medium text-red-600">✗</span> Don't use arbitrary pixel values
              </div>
              <div className="text-sm">
                <span className="font-medium text-red-600">✗</span> Don't create inconsistent spacing patterns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Semantic spacing tokens
export const SemanticTokens = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Semantic Spacing Tokens</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Semantic spacing tokens provide meaningful names for common spacing patterns.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map(size => (
            <div key={size} className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                {size.toUpperCase()}
              </div>
              <div className="bg-muted/60 rounded p-3">
                <div className="flex flex-col" style={{ gap: tokens.spacing[size as keyof typeof tokens.spacing] }}>
                  <div className="h-6 rounded bg-primary/30" />
                  <div className="h-6 rounded bg-primary/30" />
                  <div className="h-6 rounded bg-primary/30" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono">
                {tokens.spacing[size as keyof typeof tokens.spacing]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Interactive spacing playground
export const Playground = {
  render: () => {
    const [selectedSpacing, setSelectedSpacing] = React.useState('4');
    const [direction, setDirection] = React.useState<'p' | 'px' | 'py' | 'm' | 'mx' | 'my'>('p');

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Spacing Playground</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Experiment with different spacing values and directions.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="p-6 rounded-lg border bg-card">
              <h4 className="text-base font-semibold mb-4">Controls</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Spacing Size</label>
                  <select
                    value={selectedSpacing}
                    onChange={(e) => setSelectedSpacing(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  >
                    {Object.keys(tokens.spacing).map(size => (
                      <option key={size} value={size}>{size} ({tokens.spacing[size as keyof typeof tokens.spacing]})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Direction</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="p">Padding (all)</option>
                    <option value="px">Padding (horizontal)</option>
                    <option value="py">Padding (vertical)</option>
                    <option value="m">Margin (all)</option>
                    <option value="mx">Margin (horizontal)</option>
                    <option value="my">Margin (vertical)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-base font-semibold mb-4">Preview</h4>
                <div className="bg-muted rounded p-4">
                  <div
                    className="bg-primary text-primary-foreground rounded text-center"
                    style={{
                      [direction === 'p' ? 'padding' :
                        direction === 'px' ? 'paddingLeft' :
                          direction === 'py' ? 'paddingTop' :
                            direction === 'm' ? 'margin' :
                              direction === 'mx' ? 'marginLeft' : 'marginTop']: tokens.spacing[selectedSpacing as keyof typeof tokens.spacing]
                    }}
                  >
                    {direction === 'p' && `padding: ${tokens.spacing[selectedSpacing as keyof typeof tokens.spacing]}`}
                    {direction === 'px' && `padding-left/right: ${tokens.spacing[selectedSpacing as keyof typeof tokens.spacing]}`}
                    {direction === 'py' && `padding-top/bottom: ${tokens.spacing[selectedSpacing as keyof typeof tokens.spacing]}`}
                    {direction === 'm' && `margin: ${tokens.spacing[selectedSpacing as keyof typeof tokens.spacing]}`}
                    {direction === 'mx' && `margin-left/right: ${tokens.spacing[selectedSpacing as keyof typeof tokens.spacing]}`}
                    {direction === 'my' && `margin-top/bottom: ${tokens.spacing[selectedSpacing as keyof typeof tokens.spacing]}`}
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted rounded text-xs font-mono">
                  <code>className="{`${direction}-${selectedSpacing}`}"</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
