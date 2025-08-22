import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  Card,
  SectionHeader,
  applyTypographyStyle,
} from '../components';

const meta: Meta = {
  title: '1 - Foundations / Transitions',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Transitions"
            subtitle="Predefined transition combinations for consistent animations across the application. Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
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

export const TimingAndEasing: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Timing and Easing"
          subtitle="Predefined transition combinations with optimal timing and easing functions for different use cases."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tokens.transitions).map(([name, transition]) => (
            <Card key={name} className="p-6">
              <div
                className="text-sm mb-3"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[500],
                  marginBottom: tokens.spacing[3],
                }}
              >
                {name}
              </div>
              <div
                className="h-20 flex items-center justify-center"
                style={{ height: tokens.spacing[20] }}
              >
                <div
                  className="size-12 rounded-md bg-primary/20 hover:bg-primary transition-all"
                  style={{
                    width: tokens.spacing[12],
                    height: tokens.spacing[12],
                    borderRadius: tokens.borderRadius.md,
                    background: `${tokens.colors.primary[500]}33`,
                    transition: `all ${transition as string}`,
                  }}
                />
              </div>
              <div
                className="text-xs font-mono mt-3"
                style={{
                  fontSize: tokens.typography.fontSize.xs,
                  fontFamily: tokens.typography.fontFamily.mono.join(', '),
                  color: tokens.colors.secondary[500],
                  marginTop: tokens.spacing[3],
                }}
              >
                {transition as string}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Interactive Examples"
          subtitle="Interactive demonstrations of transition tokens in action. Hover over the buttons to see the transitions."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tokens.transitions).map(([name, transition]) => (
            <Card key={name} className="p-6">
              <div
                className="text-sm mb-3"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[500],
                  marginBottom: tokens.spacing[3],
                }}
              >
                {name}
              </div>
              <button
                className="w-full h-20 rounded-md bg-primary/20 hover:bg-primary text-white font-medium transition-all"
                style={{
                  width: '100%',
                  height: tokens.spacing[20],
                  borderRadius: tokens.borderRadius.md,
                  background: `${tokens.colors.primary[500]}33`,
                  color: tokens.colors.background,
                  fontWeight: tokens.typography.fontWeight.medium,
                  transition: `all ${transition as string}`,
                }}
              >
                Hover me
              </button>
              <div
                className="text-xs font-mono mt-3"
                style={{
                  fontSize: tokens.typography.fontSize.xs,
                  fontFamily: tokens.typography.fontFamily.mono.join(', '),
                  color: tokens.colors.secondary[500],
                  marginTop: tokens.spacing[3],
                }}
              >
                {transition as string}
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
          subtitle="Practical applications of transition tokens in real-world components."
        />

        <div className="space-y-12">
          {/* Button Transitions */}
          <div>
            <h4
              className="text-lg font-medium mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6],
              }}
            >
              Button Transitions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(tokens.transitions)
                .slice(0, 3)
                .map(([name, transition]) => (
                  <Card key={name} className="p-6">
                    <div
                      className="text-sm font-medium mb-4"
                      style={{
                        fontSize: tokens.typography.fontSize.sm,
                        fontWeight: tokens.typography.fontWeight.medium,
                        color: tokens.colors.foreground,
                        marginBottom: tokens.spacing[4],
                      }}
                    >
                      {name}
                    </div>
                    <button
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium transition-all"
                      style={{
                        width: '100%',
                        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
                        background: tokens.colors.primary[500],
                        color: tokens.colors.background,
                        borderRadius: tokens.borderRadius.md,
                        fontWeight: tokens.typography.fontWeight.medium,
                        transition: `all ${transition as string}`,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Interactive Button
                    </button>
                  </Card>
                ))}
            </div>
          </div>

          {/* Card Transitions */}
          <div>
            <h4
              className="text-lg font-medium mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6],
              }}
            >
              Card Transitions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(tokens.transitions)
                .slice(3, 6)
                .map(([name, transition]) => (
                  <Card
                    key={name}
                    className="p-6 cursor-pointer transition-all"
                  >
                    <div
                      className="text-sm font-medium mb-4"
                      style={{
                        fontSize: tokens.typography.fontSize.sm,
                        fontWeight: tokens.typography.fontWeight.medium,
                        color: tokens.colors.foreground,
                        marginBottom: tokens.spacing[4],
                      }}
                    >
                      {name}
                    </div>
                    <div
                      className="h-32 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        height: tokens.spacing[32],
                        background: `linear-gradient(to bottom right, ${tokens.colors.primary[100]}, ${tokens.colors.primary[200]})`,
                        borderRadius: tokens.borderRadius.lg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: `all ${transition as string}`,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 25px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span
                        className="text-primary font-medium"
                        style={{
                          color: tokens.colors.primary[600],
                          fontWeight: tokens.typography.fontWeight.medium,
                        }}
                      >
                        Hover Card
                      </span>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* Form Element Transitions */}
          <div>
            <h4
              className="text-lg font-medium mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6],
              }}
            >
              Form Element Transitions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(tokens.transitions)
                .slice(6, 9)
                .map(([name, transition]) => (
                  <Card key={name} className="p-6">
                    <div
                      className="text-sm font-medium mb-4"
                      style={{
                        fontSize: tokens.typography.fontSize.sm,
                        fontWeight: tokens.typography.fontWeight.medium,
                        color: tokens.colors.foreground,
                        marginBottom: tokens.spacing[4],
                      }}
                    >
                      {name}
                    </div>
                    <input
                      type="text"
                      placeholder="Focus me..."
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      style={{
                        width: '100%',
                        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                        border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
                        borderRadius: tokens.borderRadius.md,
                        background: tokens.colors.background,
                        fontSize: tokens.typography.fontSize.sm,
                        transition: `all ${transition as string}`,
                      }}
                    />
                  </Card>
                ))}
            </div>
          </div>
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
          title="Transition Guidelines"
          subtitle="Best practices and recommendations for using transition tokens effectively."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* When to Use */}
          <Card className="p-6">
            <h4
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4],
              }}
            >
              When to Use Each Transition
            </h4>
            <div className="space-y-4">
              <div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2],
                  }}
                >
                  Fast transitions
                </div>
                <div
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500],
                  }}
                >
                  • Micro-interactions
                  <br />
                  • Hover states
                  <br />• Focus indicators
                </div>
              </div>
              <div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2],
                  }}
                >
                  Normal transitions
                </div>
                <div
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500],
                  }}
                >
                  • Button interactions
                  <br />
                  • Card hover effects
                  <br />• Form field focus
                </div>
              </div>
              <div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground,
                    marginBottom: tokens.spacing[2],
                  }}
                >
                  Slow transitions
                </div>
                <div
                  className="text-xs"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500],
                  }}
                >
                  • Page transitions
                  <br />
                  • Modal animations
                  <br />• Complex state changes
                </div>
              </div>
            </div>
          </Card>

          {/* Best Practices */}
          <Card className="p-6">
            <h4
              className="text-base font-semibold mb-4"
              style={{
                fontSize: tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4],
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
                    color: tokens.colors.accent[600],
                  }}
                >
                  ✓
                </span>{' '}
                Use consistent transition tokens
              </div>
              <div
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span
                  className="font-medium text-green-600"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.accent[600],
                  }}
                >
                  ✓
                </span>{' '}
                Match transition speed to interaction type
              </div>
              <div
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span
                  className="font-medium text-green-600"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.accent[600],
                  }}
                >
                  ✓
                </span>{' '}
                Consider user motion preferences
              </div>
              <div
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span
                  className="font-medium text-red-600"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.destructive[500],
                  }}
                >
                  ✗
                </span>{' '}
                Don't use transitions for critical feedback
              </div>
              <div
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span
                  className="font-medium text-red-600"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.destructive[500],
                  }}
                >
                  ✗
                </span>{' '}
                Don't mix different transition speeds
              </div>
              <div
                className="text-sm"
                style={{ fontSize: tokens.typography.fontSize.sm }}
              >
                <span
                  className="font-medium text-red-600"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.destructive[500],
                  }}
                >
                  ✗
                </span>{' '}
                Don't use transitions that cause motion sickness
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Accessibility Considerations"
          subtitle="Ensuring transitions are accessible to all users, including those with motion sensitivities."
        />

        <div className="space-y-6">
          <Card className="p-6">
            <h4
              className="text-lg font-medium mb-4"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4],
              }}
            >
              Motion Preferences
            </h4>
            <p
              className="mb-4"
              style={{
                fontSize: tokens.typography.fontSize.sm,
                color: tokens.colors.secondary[600],
                marginBottom: tokens.spacing[4],
              }}
            >
              Always respect the user's motion preferences by checking the{' '}
              <code
                className="bg-muted px-1 rounded"
                style={{
                  background: tokens.colors.secondary[100],
                  padding: `0 ${tokens.spacing[1]}`,
                  borderRadius: tokens.borderRadius.base,
                }}
              >
                prefers-reduced-motion
              </code>{' '}
              media query.
            </p>
            <div
              className="p-4 bg-muted rounded text-sm font-mono"
              style={{
                padding: tokens.spacing[4],
                background: tokens.colors.secondary[100],
                borderRadius: tokens.borderRadius.base,
                fontSize: tokens.typography.fontSize.sm,
                fontFamily: tokens.typography.fontFamily.mono.join(', '),
              }}
            >
              <code>
                @media (prefers-reduced-motion: reduce) {'{'}
                <br />
                &nbsp;&nbsp;transition: none !important;
                <br />
                {'}'}
              </code>
            </div>
          </Card>

          <Card className="p-6">
            <h4
              className="text-lg font-medium mb-4"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4],
              }}
            >
              Performance Considerations
            </h4>
            <ul className="space-y-2" style={{ gap: tokens.spacing[2] }}>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Use{' '}
                <code
                  className="bg-muted px-1 rounded"
                  style={{
                    background: tokens.colors.secondary[100],
                    padding: `0 ${tokens.spacing[1]}`,
                    borderRadius: tokens.borderRadius.base,
                  }}
                >
                  transform
                </code>{' '}
                and{' '}
                <code
                  className="bg-muted px-1 rounded"
                  style={{
                    background: tokens.colors.secondary[100],
                    padding: `0 ${tokens.spacing[1]}`,
                    borderRadius: tokens.borderRadius.base,
                  }}
                >
                  opacity
                </code>{' '}
                for smooth animations
              </li>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Avoid animating layout properties (width, height, margin)
              </li>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Keep transition durations under 500ms for optimal performance
              </li>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Test transitions on lower-end devices
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4
              className="text-lg font-medium mb-4"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4],
              }}
            >
              Keyboard and Screen Reader Support
            </h4>
            <ul className="space-y-2" style={{ gap: tokens.spacing[2] }}>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Ensure all interactive elements are keyboard accessible
              </li>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Provide focus indicators that work with transitions
              </li>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Don't rely solely on motion to convey information
              </li>
              <li
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[600],
                }}
              >
                • Test with screen readers to ensure content remains accessible
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  ),
};
