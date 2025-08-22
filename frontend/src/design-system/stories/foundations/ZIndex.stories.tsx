import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  SectionHeader,
  applyTypographyStyle,
  Container,
} from '../components';
import { Card } from '../../molecules/Card';

const meta: Meta = {
  title: '1 - Foundations / Z - Index',
  parameters: {
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Z-Index"
            subtitle="Comprehensive z-index system for managing element stacking order. Includes semantic tokens for common UI patterns, accessibility considerations, and responsive design scenarios."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

// Enhanced layer visualization with tokens
export const ZIndexLayers: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <SectionHeader
          title="Z-Index Token System"
          subtitle="Our z-index tokens are organized into semantic layers, from base content to highest priority overlays."
        />

        {/* Base layers (0-50) */}
        <div className="space-y-4">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-foreground border-b pb-2"
          >
            Base Layers
          </h4>
          <div className="relative h-64 border-2 border-dashed border-muted rounded-xl overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            {Object.entries(tokens.zIndex)
              .filter(
                ([name, z]) =>
                  typeof z === 'string' && !isNaN(Number(z)) && Number(z) <= 50
              )
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
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-foreground border-b pb-2"
          >
            Semantic Layers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(tokens.zIndex)
              .filter(
                ([name, z]) =>
                  typeof z === 'string' &&
                  !isNaN(Number(z)) &&
                  Number(z) >= 1000
              )
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
                  <Card
                    key={name}
                    className={`relative h-32 bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
                    style={{ zIndex: Number(z as string) }}
                  >
                    <div className="text-center space-y-1">
                      <div className="font-bold text-sm capitalize">
                        {name.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-xs opacity-75 font-mono">
                        z-index: {z}
                      </div>
                      <div className="text-xs opacity-60">
                        {name === 'dropdown' && 'Navigation menus'}
                        {name === 'sticky' && 'Fixed headers'}
                        {name === 'fixed' && 'Fixed elements'}
                        {name === 'modal' && 'Dialog overlays'}
                        {name === 'popover' && 'Context menus'}
                        {name === 'tooltip' && 'Help text'}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Layer hierarchy visualization */}
        <div className="space-y-4">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-foreground border-b pb-2"
          >
            Layer Hierarchy
          </h4>
          <div className="relative h-48 bg-gradient-to-b from-muted/10 to-background rounded-lg border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-2">
                {Object.entries(tokens.zIndex)
                  .filter(
                    ([name, z]) =>
                      typeof z === 'string' &&
                      !isNaN(Number(z)) &&
                      Number(z) >= 1000
                  )
                  .reverse()
                  .map(([name, z], i) => (
                    <div
                      key={name}
                      className="flex items-center space-x-3 px-4 py-2 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm"
                      style={{
                        zIndex: Number(z as string),
                        transform: `translateX(${i * 20}px)`,
                        width: `${300 - i * 20}px`,
                      }}
                    >
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium text-sm capitalize">
                        {name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono ml-auto">
                        {z}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Enhanced use cases with more scenarios
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8">
      <SectionHeader
        title="Common Use Cases"
        subtitle="Real-world examples of z-index usage in UI patterns"
      />

      <div className="space-y-4">
        {/* Navigation with dropdown */}
        <Card className="p-6 overflow-hidden">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4 break-words"
          >
            Navigation with Dropdown (z-dropdown: {tokens.zIndex.dropdown})
          </h4>
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="bg-primary/10 px-4 py-2 rounded-md text-primary font-medium text-sm">
              Logo
            </div>
            <div className="bg-muted px-4 py-2 rounded-md text-sm">Home</div>
            <div className="relative">
              <div className="bg-muted px-4 py-2 rounded-md cursor-pointer hover:bg-muted/80 text-sm">
                Products ▼
              </div>
              <div
                className="absolute top-full mt-1 bg-background border rounded-md shadow-lg p-2 min-w-[120px]"
                style={{ zIndex: tokens.zIndex.dropdown }}
              >
                <div className="px-2 py-1 hover:bg-muted rounded text-sm break-words">
                  Product A
                </div>
                <div className="px-2 py-1 hover:bg-muted rounded text-sm break-words">
                  Product B
                </div>
                <div className="px-2 py-1 hover:bg-muted rounded text-sm break-words">
                  Product C
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sticky header */}
        <Card className="p-6 overflow-hidden">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4 break-words"
          >
            Sticky Header (z-sticky: {tokens.zIndex.sticky})
          </h4>
          <div className="space-y-4">
            <div
              className="bg-background border-b px-6 py-3 flex items-center justify-between"
              style={{ zIndex: tokens.zIndex.sticky }}
            >
              <div className="font-semibold text-sm break-words">
                Sticky Header
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-8 h-8 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="h-32 bg-gradient-to-b from-muted/20 to-transparent rounded-md"></div>
          </div>
        </Card>

        {/* Modal overlay */}
        <Card className="p-6 overflow-hidden">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4 break-words"
          >
            Modal with Backdrop (z-modal: {tokens.zIndex.modal})
          </h4>
          <div className="relative h-40 bg-muted/20 rounded-md overflow-hidden">
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              style={{ zIndex: tokens.zIndex.modal }}
            >
              <div className="bg-background border rounded-lg p-6 max-w-sm mx-4">
                <h5 className="font-semibold mb-2 break-words">Modal Title</h5>
                <p className="text-sm text-muted-foreground mb-4 break-words">
                  This modal appears above the backdrop.
                </p>
                <div className="flex space-x-2 flex-wrap">
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
                    Confirm
                  </button>
                  <button className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tooltip */}
        <Card className="p-6 overflow-hidden">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4 break-words"
          >
            Tooltip (z-tooltip: {tokens.zIndex.tooltip})
          </h4>
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="relative">
              <div className="bg-primary px-4 py-2 rounded-md text-primary-foreground cursor-help text-sm">
                Hover me
              </div>
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap"
                style={{ zIndex: tokens.zIndex.tooltip }}
              >
                This is a tooltip
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground break-words">
              Tooltips appear above all other elements
            </div>
          </div>
        </Card>

        {/* Fixed sidebar */}
        <Card className="p-6 overflow-hidden">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4 break-words"
          >
            Fixed Sidebar (z-fixed: {tokens.zIndex.fixed})
          </h4>
          <div className="relative h-40 bg-muted/20 rounded-md overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-48 bg-background border-r shadow-lg"
              style={{ zIndex: tokens.zIndex.fixed }}
            >
              <div className="p-4">
                <div className="font-semibold mb-4 text-sm break-words">
                  Sidebar
                </div>
                <div className="space-y-2">
                  <div className="px-2 py-1 hover:bg-muted rounded text-sm break-words">
                    Dashboard
                  </div>
                  <div className="px-2 py-1 hover:bg-muted rounded text-sm break-words">
                    Analytics
                  </div>
                  <div className="px-2 py-1 hover:bg-muted rounded text-sm break-words">
                    Settings
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-48 p-4">
              <div className="text-sm text-muted-foreground break-words">
                Main content area
              </div>
            </div>
          </div>
        </Card>

        {/* Popover menu */}
        <Card className="p-6 overflow-hidden">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4 break-words"
          >
            Popover Menu (z-popover: {tokens.zIndex.popover})
          </h4>
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="relative">
              <div className="bg-muted px-4 py-2 rounded-md cursor-pointer hover:bg-muted/80 text-sm">
                Actions ▼
              </div>
              <div
                className="absolute top-full mt-1 bg-background border rounded-md shadow-lg p-2 min-w-[150px]"
                style={{ zIndex: tokens.zIndex.popover }}
              >
                <div className="px-2 py-1 hover:bg-muted rounded text-sm flex items-center space-x-2">
                  <span>📝</span>
                  <span className="break-words">Edit</span>
                </div>
                <div className="px-2 py-1 hover:bg-muted rounded text-sm flex items-center space-x-2">
                  <span>📋</span>
                  <span className="break-words">Copy</span>
                </div>
                <div className="px-2 py-1 hover:bg-muted rounded text-sm flex items-center space-x-2 text-destructive">
                  <span>🗑️</span>
                  <span className="break-words">Delete</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground break-words">
              Context menus appear above dropdowns
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

// Advanced stacking scenarios
export const AdvancedScenarios: Story = {
  render: () => (
    <div className="space-y-8">
      <SectionHeader
        title="Advanced Stacking Scenarios"
        subtitle="Complex z-index patterns and considerations for sophisticated UI"
      />

      <div className="space-y-4">
        {/* Nested stacking contexts */}
        <Card className="p-6">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4"
          >
            Nested Stacking Contexts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Parent Container (z=10)
              </div>
              <div
                className="relative h-32 bg-blue-100 border-2 border-blue-300 rounded-lg p-4"
                style={{ zIndex: 10 }}
              >
                <div className="text-xs text-blue-700 mb-2">Parent (z=10)</div>
                <div
                  className="absolute top-2 right-2 w-16 h-16 bg-green-200 border-2 border-green-400 rounded flex items-center justify-center text-xs"
                  style={{ zIndex: 20 }}
                >
                  Child (z=20)
                </div>
                <div
                  className="absolute bottom-2 left-2 w-16 h-16 bg-red-200 border-2 border-red-400 rounded flex items-center justify-center text-xs"
                  style={{ zIndex: 30 }}
                >
                  Child (z=30)
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Sibling Containers
              </div>
              <div className="relative h-32">
                <div
                  className="absolute inset-0 bg-purple-100 border-2 border-purple-300 rounded-lg p-4"
                  style={{ zIndex: 20 }}
                >
                  <div className="text-xs text-purple-700">
                    Sibling A (z=20)
                  </div>
                </div>
                <div
                  className="absolute inset-4 bg-orange-100 border-2 border-orange-300 rounded-lg p-4"
                  style={{ zIndex: 40 }}
                >
                  <div className="text-xs text-orange-700">
                    Sibling B (z=40)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Responsive z-index behavior */}
        <Card className="p-6">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4"
          >
            Responsive Z-Index Behavior
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Mobile
                </div>
                <div className="relative h-24 bg-muted/20 rounded border">
                  <div
                    className="absolute top-2 left-2 w-16 h-16 bg-blue-200 border rounded flex items-center justify-center text-xs"
                    style={{ zIndex: 10 }}
                  >
                    Nav
                  </div>
                  <div
                    className="absolute bottom-2 right-2 w-16 h-16 bg-green-200 border rounded flex items-center justify-center text-xs"
                    style={{ zIndex: 20 }}
                  >
                    Menu
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Tablet
                </div>
                <div className="relative h-24 bg-muted/20 rounded border">
                  <div
                    className="absolute top-2 left-2 w-20 h-12 bg-blue-200 border rounded flex items-center justify-center text-xs"
                    style={{ zIndex: 10 }}
                  >
                    Header
                  </div>
                  <div
                    className="absolute top-2 right-2 w-12 h-12 bg-green-200 border rounded flex items-center justify-center text-xs"
                    style={{ zIndex: 20 }}
                  >
                    Menu
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Desktop
                </div>
                <div className="relative h-24 bg-muted/20 rounded border">
                  <div
                    className="absolute top-2 left-2 w-32 h-8 bg-blue-200 border rounded flex items-center justify-center text-xs"
                    style={{ zIndex: 10 }}
                  >
                    Navigation Bar
                  </div>
                  <div
                    className="absolute top-2 right-2 w-16 h-8 bg-green-200 border rounded flex items-center justify-center text-xs"
                    style={{ zIndex: 20 }}
                  >
                    Actions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Accessibility considerations */}
        <Card className="p-6">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-4"
          >
            Accessibility Considerations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Focus Management
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Modal traps focus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Tooltips don't block navigation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Dropdowns close on escape</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Screen Reader Support
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>aria-modal for dialogs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>aria-describedby for tooltips</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>aria-expanded for dropdowns</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

// Stacking context demonstration
export const StackingContext: Story = {
  render: () => (
    <div className="space-y-8">
      <SectionHeader
        title="Stacking Context Examples"
        subtitle="Elements with higher z-index values appear on top, regardless of DOM order."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic stacking */}
          <Card className="p-4">
            <h4
              style={applyTypographyStyle('subtitle')}
              className="text-muted-foreground mb-3"
            >
              Basic Stacking
            </h4>
            <div className="relative h-32">
              <div className="absolute inset-4 bg-blue-200 rounded border-2 border-blue-300 flex items-center justify-center text-sm">
                Base Layer (z=0)
              </div>
              <div
                className="absolute inset-8 bg-green-200 rounded border-2 border-green-300 flex items-center justify-center text-sm"
                style={{ zIndex: 10 }}
              >
                Middle (z=10)
              </div>
              <div
                className="absolute inset-12 bg-red-200 rounded border-2 border-red-300 flex items-center justify-center text-sm"
                style={{ zIndex: 50 }}
              >
                Top (z=50)
              </div>
            </div>
          </Card>

          {/* Overlapping elements */}
          <Card className="p-4">
            <h4
              style={applyTypographyStyle('subtitle')}
              className="text-muted-foreground mb-3"
            >
              Overlapping Elements
            </h4>
            <div className="relative h-32">
              <div
                className="absolute left-2 top-2 w-20 h-20 bg-purple-200 rounded border-2 border-purple-300 flex items-center justify-center text-xs"
                style={{ zIndex: 20 }}
              >
                Card 1 (z=20)
              </div>
              <div
                className="absolute left-8 top-8 w-20 h-20 bg-orange-200 rounded border-2 border-orange-300 flex items-center justify-center text-xs"
                style={{ zIndex: 30 }}
              >
                Card 2 (z=30)
              </div>
              <div
                className="absolute left-14 top-14 w-20 h-20 bg-pink-200 rounded border-2 border-pink-300 flex items-center justify-center text-xs"
                style={{ zIndex: 40 }}
              >
                Card 3 (z=40)
              </div>
            </div>
          </Card>
        </div>

        {/* Interactive stacking demo */}
        <Card className="p-4">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-muted-foreground mb-3"
          >
            Interactive Stacking Demo
          </h4>
          <div className="relative h-40 bg-muted/20 rounded border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Click elements to bring them to front
                </div>
                <div className="flex space-x-4">
                  <div
                    className="w-16 h-16 bg-blue-200 border-2 border-blue-400 rounded cursor-pointer hover:bg-blue-300 transition-colors flex items-center justify-center text-xs"
                    style={{ zIndex: 10 }}
                    onClick={e => {
                      e.currentTarget.style.zIndex = '50';
                    }}
                  >
                    Layer 1
                  </div>
                  <div
                    className="w-16 h-16 bg-green-200 border-2 border-green-400 rounded cursor-pointer hover:bg-green-300 transition-colors flex items-center justify-center text-xs"
                    style={{ zIndex: 20 }}
                    onClick={e => {
                      e.currentTarget.style.zIndex = '50';
                    }}
                  >
                    Layer 2
                  </div>
                  <div
                    className="w-16 h-16 bg-red-200 border-2 border-red-400 rounded cursor-pointer hover:bg-red-300 transition-colors flex items-center justify-center text-xs"
                    style={{ zIndex: 30 }}
                    onClick={e => {
                      e.currentTarget.style.zIndex = '50';
                    }}
                  >
                    Layer 3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

// Enhanced guidelines with tokens
export const Guidelines: Story = {
  render: () => (
    <div className="space-y-6">
      <SectionHeader
        title="Z-Index Guidelines"
        subtitle="Best practices for implementing our z-index system"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-foreground break-words"
          >
            Semantic Tokens
          </h4>
          <div className="space-y-2 text-sm">
            {Object.entries(tokens.zIndex)
              .filter(
                ([name, z]) =>
                  typeof z === 'string' &&
                  !isNaN(Number(z)) &&
                  Number(z) >= 1000
              )
              .map(([name, z]) => (
                <div key={name} className="flex justify-between items-center">
                  <span className="text-muted-foreground capitalize break-words">
                    {name.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {z}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-foreground break-words"
          >
            Numeric Tokens
          </h4>
          <div className="space-y-2 text-sm">
            {Object.entries(tokens.zIndex)
              .filter(
                ([name, z]) =>
                  typeof z === 'string' && !isNaN(Number(z)) && Number(z) <= 50
              )
              .map(([name, z]) => (
                <div key={name} className="flex justify-between items-center">
                  <span className="text-muted-foreground break-words">
                    {name}
                  </span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {z}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-foreground break-words"
          >
            Best Practices
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span className="break-words">
                Use semantic tokens for common UI patterns
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span className="break-words">
                Avoid arbitrary z-index values
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span className="break-words">
                Keep z-index values as low as possible
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span className="break-words">
                Consider stacking context when nesting elements
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span className="break-words">
                Test z-index behavior across different browsers
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4
            style={applyTypographyStyle('subtitle')}
            className="text-foreground break-words"
          >
            Common Pitfalls
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-destructive mt-1">•</span>
              <span className="break-words">
                Using values above {tokens.zIndex.tooltip} unless critical
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-destructive mt-1">•</span>
              <span className="break-words">
                Creating unnecessary stacking contexts
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-destructive mt-1">•</span>
              <span className="break-words">
                Forgetting about transform and opacity effects
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-destructive mt-1">•</span>
              <span className="break-words">
                Not considering mobile vs desktop behavior
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-destructive mt-1">•</span>
              <span className="break-words">
                Ignoring accessibility implications
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

// Add new unique real user case stories
export const GamingInterface: Story = {
  render: () => (
    <div className="space-y-8">
      <SectionHeader
        title="Gaming Interface Example"
        subtitle="Z-index system applied to complex gaming UI with multiple layers"
      />

      <div className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-700 rounded-xl overflow-hidden border">
        {/* Background layer (z=0) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/50 to-purple-800/50"></div>

        {/* Game world layer (z=10) */}
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-0 right-1/3 w-12 h-12 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-green-700 rounded-full"></div>
        </div>

        {/* Character layer (z=20) */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full"
          style={{ zIndex: 20 }}
        ></div>

        {/* UI elements layer (z=30) */}
        <div
          className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm"
          style={{ zIndex: 30 }}
        >
          Score: 12,450
        </div>
        <div
          className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm"
          style={{ zIndex: 30 }}
        >
          Level: 8
        </div>

        {/* Floating menu (z=dropdown) */}
        <div
          className="absolute top-16 right-4 bg-white border rounded-lg shadow-lg p-3"
          style={{ zIndex: tokens.zIndex.dropdown }}
        >
          <div className="text-sm font-medium text-gray-900 mb-2 break-words">
            Game Menu
          </div>
          <div className="space-y-1">
            <div className="px-2 py-1 hover:bg-gray-100 rounded text-sm cursor-pointer break-words">
              Resume
            </div>
            <div className="px-2 py-1 hover:bg-gray-100 rounded text-sm cursor-pointer break-words">
              Settings
            </div>
            <div className="px-2 py-1 hover:bg-gray-100 rounded text-sm cursor-pointer break-words">
              Save Game
            </div>
            <div className="px-2 py-1 hover:bg-red-100 rounded text-sm cursor-pointer text-red-600 break-words">
              Quit
            </div>
          </div>
        </div>

        {/* Notification (z=popover) */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg"
          style={{ zIndex: tokens.zIndex.popover }}
        >
          <div className="text-sm font-medium text-yellow-800 break-words">
            Achievement Unlocked!
          </div>
          <div className="text-xs text-yellow-700 break-words">
            Complete 10 levels
          </div>
        </div>

        {/* Pause overlay (z=modal) */}
        <div
          className="absolute inset-0 bg-black/70 flex items-center justify-center"
          style={{ zIndex: tokens.zIndex.modal }}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 break-words">
              Game Paused
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Resume
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm">
                Settings
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                Quit Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DataVisualization: Story = {
  render: () => (
    <div className="space-y-8">
      <SectionHeader
        title="Data Visualization Example"
        subtitle="Z-index system applied to complex data dashboards with overlapping charts"
      />

      <div className="relative h-80 bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Base chart layer (z=0) */}
        <div className="absolute inset-0 p-6">
          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg"></div>
        </div>

        {/* Chart grid lines (z=10) */}
        <div className="absolute inset-0 p-6" style={{ zIndex: 10 }}>
          <div className="h-full flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200"></div>
            ))}
          </div>
        </div>

        {/* Data bars (z=20) */}
        <div className="absolute inset-0 p-6" style={{ zIndex: 20 }}>
          <div className="h-full flex items-end justify-around">
            <div
              className="w-8 bg-blue-500 rounded-t"
              style={{ height: '60%' }}
            ></div>
            <div
              className="w-8 bg-blue-600 rounded-t"
              style={{ height: '80%' }}
            ></div>
            <div
              className="w-8 bg-blue-700 rounded-t"
              style={{ height: '45%' }}
            ></div>
            <div
              className="w-8 bg-blue-800 rounded-t"
              style={{ height: '90%' }}
            ></div>
            <div
              className="w-8 bg-blue-900 rounded-t"
              style={{ height: '70%' }}
            ></div>
          </div>
        </div>

        {/* Data labels (z=30) */}
        <div className="absolute inset-0 p-6" style={{ zIndex: 30 }}>
          <div className="h-full flex items-end justify-around">
            <div className="text-xs text-gray-600 text-center break-words">
              Jan
            </div>
            <div className="text-xs text-gray-600 text-center break-words">
              Feb
            </div>
            <div className="text-xs text-gray-600 text-center break-words">
              Mar
            </div>
            <div className="text-xs text-gray-600 text-center break-words">
              Apr
            </div>
            <div className="text-xs text-gray-600 text-center break-words">
              May
            </div>
          </div>
        </div>

        {/* Hover tooltip (z=tooltip) */}
        <div
          className="absolute top-1/4 left-1/3 bg-gray-900 text-white px-2 py-1 rounded text-xs shadow-lg"
          style={{ zIndex: tokens.zIndex.tooltip }}
        >
          <div className="break-words">Feb: 8,240 units</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Legend overlay (z=dropdown) */}
        <div
          className="absolute top-4 right-4 bg-white border rounded-lg shadow-lg p-3"
          style={{ zIndex: tokens.zIndex.dropdown }}
        >
          <div className="text-sm font-medium text-gray-900 mb-2 break-words">
            Legend
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600 break-words">Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600 break-words">Revenue</span>
            </div>
          </div>
        </div>

        {/* Chart controls (z=popover) */}
        <div
          className="absolute bottom-4 left-4 bg-white border rounded-lg shadow-lg p-2"
          style={{ zIndex: tokens.zIndex.popover }}
        >
          <div className="flex space-x-2">
            <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 break-words">
              Bar
            </button>
            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 break-words">
              Line
            </button>
            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 break-words">
              Area
            </button>
          </div>
        </div>

        {/* Fullscreen modal (z=modal) */}
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center"
          style={{ zIndex: tokens.zIndex.modal }}
        >
          <div className="bg-white rounded-lg p-6 max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 break-words">
              Chart Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 break-words">
                  Chart Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Bar Chart</option>
                  <option>Line Chart</option>
                  <option>Area Chart</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Apply
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
