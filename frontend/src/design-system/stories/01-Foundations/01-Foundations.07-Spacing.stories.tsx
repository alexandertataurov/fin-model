import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { getSpacing, responsiveSpacing } from '../../utils/tokenHelpers';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  Card,
  SectionHeader,
  applyTypographyStyle
} from '../components';

const meta: Meta = {
  title: 'Design System/1 - Foundations/7 - Spacing',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Spacing"
            subtitle="Comprehensive spacing system with consistent scale, use cases, and responsive patterns for optimal layout hierarchy."
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

export const Scale: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Spacing Scale"
          subtitle="Our spacing system uses a consistent 4px (0.25rem) base unit with a 1.5x multiplier for larger values."
        />
        
        <div className="space-y-6">
          {Object.entries(tokens.spacing).map(([name, size]) => (
            <Card key={name} className="p-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-20 text-sm font-medium"
                  style={{
                    width: tokens.spacing[20],
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground
                  }}
                >
                  {name}
                </div>
                <div className="flex-1 bg-muted rounded-md overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded"
                    style={{ 
                      width: String(size),
                      height: tokens.spacing[3],
                      background: tokens.colors.primary[500],
                      borderRadius: tokens.borderRadius.base
                    }}
                  />
                </div>
                <div 
                  className="w-24 text-sm font-mono"
                  style={{
                    width: tokens.spacing[24],
                    fontSize: tokens.typography.fontSize.sm,
                    fontFamily: tokens.typography.fontFamily.mono.join(', '),
                    color: tokens.colors.secondary[500]
                  }}
                >
                  {String(size)}
                </div>
                <div 
                  className="w-16 text-xs"
                  style={{
                    width: tokens.spacing[16],
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  {parseFloat(size) * 16}px
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const VisualExamples: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Visual Spacing Examples"
          subtitle="Interactive examples showing how spacing tokens create visual hierarchy and rhythm."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(tokens.spacing).slice(0, 9).map(([name, size]) => (
            <Card key={name} className="p-6">
              <div 
                className="text-sm font-medium mb-3"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: tokens.colors.secondary[500],
                  marginBottom: tokens.spacing[3]
                }}
              >
                gap: {name}
              </div>
              <div 
                className="bg-muted/60 rounded p-3"
                style={{
                  background: `${tokens.colors.secondary[100]}99`,
                  borderRadius: tokens.borderRadius.base,
                  padding: tokens.spacing[3]
                }}
              >
                <div className="flex flex-col" style={{ gap: String(size) }}>
                  <div 
                    className="h-6 rounded"
                    style={{
                      height: tokens.spacing[6],
                      borderRadius: tokens.borderRadius.base,
                      background: `${tokens.colors.primary[500]}4D`
                    }}
                  />
                  <div 
                    className="h-6 rounded"
                    style={{
                      height: tokens.spacing[6],
                      borderRadius: tokens.borderRadius.base,
                      background: `${tokens.colors.primary[500]}4D`
                    }}
                  />
                  <div 
                    className="h-6 rounded"
                    style={{
                      height: tokens.spacing[6],
                      borderRadius: tokens.borderRadius.base,
                      background: `${tokens.colors.primary[500]}4D`
                    }}
                  />
                </div>
              </div>
              <div 
                className="text-xs font-mono mt-2"
                style={{
                  fontSize: tokens.typography.fontSize.xs,
                  fontFamily: tokens.typography.fontFamily.mono.join(', '),
                  color: tokens.colors.secondary[500],
                  marginTop: tokens.spacing[2]
                }}
              >
                {String(size)}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Common Use Cases"
          subtitle="Practical applications of spacing tokens in real-world components and layouts."
        />

        <div className="space-y-12">
          {/* Component spacing */}
          <div>
            <h4 
              className="text-lg font-semibold mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6]
              }}
            >
              Component Spacing
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-32 text-sm"
                      style={{
                        width: tokens.spacing[32],
                        fontSize: tokens.typography.fontSize.sm,
                        color: tokens.colors.secondary[500]
                      }}
                    >
                      Button padding:
                    </div>
                    <div 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded"
                      style={{
                        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
                        background: tokens.colors.primary[500],
                        color: tokens.colors.background,
                        borderRadius: tokens.borderRadius.base
                      }}
                    >
                      Button (px-4 py-2)
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-32 text-sm"
                      style={{
                        width: tokens.spacing[32],
                        fontSize: tokens.typography.fontSize.sm,
                        color: tokens.colors.secondary[500]
                      }}
                    >
                      Card padding:
                    </div>
                    <div 
                      className="p-6 bg-muted rounded border"
                      style={{
                        padding: tokens.spacing[6],
                        background: tokens.colors.secondary[100],
                        borderRadius: tokens.borderRadius.base,
                        border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`
                      }}
                    >
                      Card content (p-6)
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-32 text-sm"
                      style={{
                        width: tokens.spacing[32],
                        fontSize: tokens.typography.fontSize.sm,
                        color: tokens.colors.secondary[500]
                      }}
                    >
                      Section spacing:
                    </div>
                    <div 
                      className="py-8 bg-muted rounded border"
                      style={{
                        padding: `${tokens.spacing[8]} 0`,
                        background: tokens.colors.secondary[100],
                        borderRadius: tokens.borderRadius.base,
                        border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`
                      }}
                    >
                      Section (py-8)
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Layout spacing */}
          <div>
            <h4 
              className="text-lg font-semibold mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6]
              }}
            >
              Layout Spacing
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div 
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Grid gap-6
                </div>
                <div 
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  24px between items
                </div>
              </Card>

              <Card className="p-6">
                <div 
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Container padding
                </div>
                <div 
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  px-4 sm:px-6 lg:px-8
                </div>
              </Card>

              <Card className="p-6">
                <div 
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Section margins
                </div>
                <div 
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  my-8 lg:my-12
                </div>
              </Card>
            </div>
          </div>

          {/* Typography spacing */}
          <div>
            <h4 
              className="text-lg font-semibold mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6]
              }}
            >
              Typography Spacing
            </h4>
            <div className="space-y-6">
              <div>
                <h1 
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize['2xl'],
                    fontWeight: tokens.typography.fontWeight.bold,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Heading 1
                </h1>
                <p 
                  className="text-sm"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  mb-2 (8px) below heading
                </p>
              </div>
              <div>
                <h2 
                  className="text-xl font-semibold mb-3"
                  style={{
                    fontSize: tokens.typography.fontSize.xl,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[3]
                  }}
                >
                  Heading 2
                </h2>
                <p 
                  className="text-sm"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  mb-3 (12px) below heading
                </p>
              </div>
              <div>
                <h3 
                  className="text-lg font-medium mb-4"
                  style={{
                    fontSize: tokens.typography.fontSize.lg,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[4]
                  }}
                >
                  Heading 3
                </h3>
                <p 
                  className="text-sm"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  mb-4 (16px) below heading
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ResponsivePatterns: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Responsive Spacing Patterns"
          subtitle="Spacing that adapts to different screen sizes for optimal user experience."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Container spacing */}
          <Card className="p-6">
            <h4 
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4]
              }}
            >
              Container Spacing
            </h4>
            <div className="space-y-3">
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  Mobile:
                </span> px-4 (16px)
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  Tablet:
                </span> px-6 (24px)
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  Desktop:
                </span> px-8 (32px)
              </div>
            </div>
            <div 
              className="mt-4 p-4 bg-muted rounded text-xs font-mono"
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[4],
                background: tokens.colors.secondary[100],
                borderRadius: tokens.borderRadius.base,
                fontSize: tokens.typography.fontSize.xs,
                fontFamily: tokens.typography.fontFamily.mono.join(', ')
              }}
            >
              <code>className="px-4 sm:px-6 lg:px-8"</code>
            </div>
          </Card>

          {/* Section spacing */}
          <Card className="p-6">
            <h4 
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4]
              }}
            >
              Section Spacing
            </h4>
            <div className="space-y-3">
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  Mobile:
                </span> py-8 (32px)
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  Tablet:
                </span> py-12 (48px)
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  Desktop:
                </span> py-16 (64px)
              </div>
            </div>
            <div 
              className="mt-4 p-4 bg-muted rounded text-xs font-mono"
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[4],
                background: tokens.colors.secondary[100],
                borderRadius: tokens.borderRadius.base,
                fontSize: tokens.typography.fontSize.xs,
                fontFamily: tokens.typography.fontFamily.mono.join(', ')
              }}
            >
              <code>className="py-8 sm:py-12 lg:py-16"</code>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const TokenUsage: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Design Token Usage"
          subtitle="How to use spacing tokens programmatically in components."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Direct token usage */}
          <Card className="p-6">
            <h4 
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4]
              }}
            >
              Direct Token Usage
            </h4>
            <div className="space-y-3">
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  getSpacing('4'):
                </span> {getSpacing('4' as keyof typeof tokens.spacing)}
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  getSpacing('8'):
                </span> {getSpacing('8' as keyof typeof tokens.spacing)}
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  getSpacing('16'):
                </span> {getSpacing('16' as keyof typeof tokens.spacing)}
              </div>
            </div>
            <div 
              className="mt-4 p-4 bg-muted rounded text-xs font-mono"
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[4],
                background: tokens.colors.secondary[100],
                borderRadius: tokens.borderRadius.base,
                fontSize: tokens.typography.fontSize.xs,
                fontFamily: tokens.typography.fontFamily.mono.join(', ')
              }}
            >
              <code>import {`{ getSpacing }`} from '../utils/tokenHelpers'</code>
            </div>
          </Card>

          {/* Responsive spacing */}
          <Card className="p-6">
            <h4 
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4]
              }}
            >
              Responsive Spacing
            </h4>
            <div className="space-y-3">
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  Base:
                </span> {getSpacing('4' as keyof typeof tokens.spacing)}
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  MD:
                </span> {getSpacing('6' as keyof typeof tokens.spacing)}
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium"
                  style={{ fontWeight: tokens.typography.fontWeight.medium }}
                >
                  LG:
                </span> {getSpacing('8' as keyof typeof tokens.spacing)}
              </div>
            </div>
            <div 
              className="mt-4 p-4 bg-muted rounded text-xs font-mono"
              style={{
                marginTop: tokens.spacing[4],
                padding: tokens.spacing[4],
                background: tokens.colors.secondary[100],
                borderRadius: tokens.borderRadius.base,
                fontSize: tokens.typography.fontSize.xs,
                fontFamily: tokens.typography.fontFamily.mono.join(', ')
              }}
            >
              <code>responsiveSpacing({`{ base: '4', md: '6', lg: '8' }`})</code>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Spacing Guidelines"
          subtitle="Best practices and recommendations for using our spacing system effectively."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* When to use */}
          <Card className="p-6">
            <h4 
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4]
              }}
            >
              When to Use Each Size
            </h4>
            <div className="space-y-4">
              <div>
                <div 
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Tight spacing (1-3)
                </div>
                <div 
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  • Between related elements<br />
                  • Icon and text pairs<br />
                  • Form field labels
                </div>
              </div>
              <div>
                <div 
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Standard spacing (4-6)
                </div>
                <div 
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  • Component padding<br />
                  • Button spacing<br />
                  • Card content
                </div>
              </div>
              <div>
                <div 
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Loose spacing (8-12)
                </div>
                <div 
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  • Section spacing<br />
                  • Major content blocks<br />
                  • Page margins
                </div>
              </div>
              <div>
                <div 
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2]
                  }}
                >
                  Extra loose (16+)
                </div>
                <div 
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500]
                  }}
                >
                  • Page sections<br />
                  • Hero areas<br />
                  • Footer spacing
                </div>
              </div>
            </div>
          </Card>

          {/* Best practices */}
          <Card className="p-6">
            <h4 
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4]
              }}
            >
              Best Practices
            </h4>
            <div className="space-y-4">
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium text-green-600"
                  style={{ 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.accent[600]
                  }}
                >
                  ✓
                </span> Use consistent spacing scale
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium text-green-600"
                  style={{ 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.accent[600]
                  }}
                >
                  ✓
                </span> Prefer spacing tokens over hardcoded values
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium text-green-600"
                  style={{ 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.accent[600]
                  }}
                >
                  ✓
                </span> Use responsive spacing for mobile-first design
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium text-red-600"
                  style={{ 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.destructive[500]
                  }}
                >
                  ✗
                </span> Don't mix different spacing systems
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium text-red-600"
                  style={{ 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.destructive[500]
                  }}
                >
                  ✗
                </span> Don't use arbitrary pixel values
              </div>
              <div 
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span 
                  className="font-medium text-red-600"
                  style={{ 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.destructive[500]
                  }}
                >
                  ✗
                </span> Don't create inconsistent spacing patterns
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const SemanticTokens: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Semantic Spacing Tokens"
          subtitle="Semantic spacing tokens provide meaningful names for common spacing patterns."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map(size => (
            <Card key={size} className="p-6">
              <div 
                className="text-sm font-medium mb-3"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: tokens.colors.secondary[500],
                  marginBottom: tokens.spacing[3]
                }}
              >
                {size.toUpperCase()}
              </div>
              <div 
                className="bg-muted/60 rounded p-3"
                style={{
                  background: `${tokens.colors.secondary[100]}99`,
                  borderRadius: tokens.borderRadius.base,
                  padding: tokens.spacing[3]
                }}
              >
                <div className="flex flex-col" style={{ gap: tokens.spacing[size as keyof typeof tokens.spacing] }}>
                  <div 
                    className="h-6 rounded"
                    style={{
                      height: tokens.spacing[6],
                      borderRadius: tokens.borderRadius.base,
                      background: `${tokens.colors.primary[500]}4D`
                    }}
                  />
                  <div 
                    className="h-6 rounded"
                    style={{
                      height: tokens.spacing[6],
                      borderRadius: tokens.borderRadius.base,
                      background: `${tokens.colors.primary[500]}4D`
                    }}
                  />
                  <div 
                    className="h-6 rounded"
                    style={{
                      height: tokens.spacing[6],
                      borderRadius: tokens.borderRadius.base,
                      background: `${tokens.colors.primary[500]}4D`
                    }}
                  />
                </div>
              </div>
              <div 
                className="text-xs font-mono mt-2"
                style={{
                  fontSize: tokens.typography.fontSize.xs,
                  fontFamily: tokens.typography.fontFamily.mono.join(', '),
                  color: tokens.colors.secondary[500],
                  marginTop: tokens.spacing[2]
                }}
              >
                {tokens.spacing[size as keyof typeof tokens.spacing]}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  render: () => {
    const [selectedSpacing, setSelectedSpacing] = React.useState('4');
    const [direction, setDirection] = React.useState<'p' | 'px' | 'py' | 'm' | 'mx' | 'my'>('p');

    return (
      <div className="space-y-16">
        <div>
          <SectionHeader
            title="Spacing Playground"
            subtitle="Experiment with different spacing values and directions."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <Card className="p-6">
              <h4 
                className="text-base font-semibold mb-4"
                style={{
                  fontSize: tokens.typography.fontSize.base,
                  fontWeight: tokens.typography.fontWeight.semibold,
                  color: tokens.colors.foreground,
                  marginBottom: tokens.spacing[4]
                }}
              >
                Controls
              </h4>
              <div className="space-y-4">
                <div>
                  <label 
                    className="text-sm font-medium mb-2 block"
                    style={{
                      fontSize: tokens.typography.fontSize.sm,
                      fontWeight: tokens.typography.fontWeight.medium,
                      color: tokens.colors.foreground,
                      marginBottom: tokens.spacing[2]
                    }}
                  >
                    Spacing Size
                  </label>
                  <select
                    value={selectedSpacing}
                    onChange={(e) => setSelectedSpacing(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    style={{
                      padding: tokens.spacing[2],
                      border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
                      borderRadius: tokens.borderRadius.base,
                      fontSize: tokens.typography.fontSize.sm
                    }}
                  >
                    {Object.keys(tokens.spacing).map(size => (
                      <option key={size} value={size}>{size} ({tokens.spacing[size as keyof typeof tokens.spacing]})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label 
                    className="text-sm font-medium mb-2 block"
                    style={{
                      fontSize: tokens.typography.fontSize.sm,
                      fontWeight: tokens.typography.fontWeight.medium,
                      color: tokens.colors.foreground,
                      marginBottom: tokens.spacing[2]
                    }}
                  >
                    Direction
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full p-2 border rounded text-sm"
                    style={{
                      padding: tokens.spacing[2],
                      border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
                      borderRadius: tokens.borderRadius.base,
                      fontSize: tokens.typography.fontSize.sm
                    }}
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
            </Card>

            {/* Preview */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h4 
                  className="text-base font-semibold mb-4"
                  style={{
                    fontSize: tokens.typography.fontSize.base,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[4]
                  }}
                >
                  Preview
                </h4>
                <div 
                  className="bg-muted rounded p-4"
                  style={{
                    background: tokens.colors.secondary[100],
                    borderRadius: tokens.borderRadius.base,
                    padding: tokens.spacing[4]
                  }}
                >
                  <div
                    className="bg-primary text-primary-foreground rounded text-center"
                    style={{
                      background: tokens.colors.primary[500],
                      color: tokens.colors.background,
                      borderRadius: tokens.borderRadius.base,
                      textAlign: 'center',
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
                <div 
                  className="mt-4 p-4 bg-muted rounded text-xs font-mono"
                  style={{
                    marginTop: tokens.spacing[4],
                    padding: tokens.spacing[4],
                    background: tokens.colors.secondary[100],
                    borderRadius: tokens.borderRadius.base,
                    fontSize: tokens.typography.fontSize.xs,
                    fontFamily: tokens.typography.fontFamily.mono.join(', ')
                  }}
                >
                  <code>className="{`${direction}-${selectedSpacing}`}"</code>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
