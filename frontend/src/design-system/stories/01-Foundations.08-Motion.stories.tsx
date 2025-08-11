import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  Card,
  SectionHeader,
  applyTypographyStyle
} from './components';

const meta: Meta = {
  title: 'Design System/Foundations/Motion',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Motion"
            subtitle="Motion tokens define easing functions and durations for consistent animations across the application. Use these tokens for hover states, transitions, and micro-interactions."
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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

// Interactive demo component for easing functions
const EasingDemo = ({ easing, name }: { easing: string; name: string }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Card className="p-6">
      <div 
        className="text-sm font-medium mb-3"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.foreground,
          marginBottom: tokens.spacing[3]
        }}
      >
        {name}
      </div>
      <div 
        className="h-20 flex items-center justify-center relative"
        style={{ height: tokens.spacing[20] }}
      >
        <div
          className={`w-12 h-12 rounded-md transition-all duration-1000 ${
            isAnimating ? 'translate-x-16 scale-110' : ''
          }`}
          style={{
            width: tokens.spacing[12],
            height: tokens.spacing[12],
            borderRadius: tokens.borderRadius.md,
            background: tokens.colors.primary[500],
            transitionTimingFunction: easing,
            transitionDuration: tokens.motion.duration.slow
          }}
          onMouseEnter={() => setIsAnimating(true)}
          onMouseLeave={() => setIsAnimating(false)}
        />
      </div>
      <div 
        className="text-xs font-mono mt-3"
        style={{
          fontSize: tokens.typography.fontSize.xs,
          fontFamily: tokens.typography.fontFamily.mono.join(', '),
          color: tokens.colors.secondary[500],
          marginTop: tokens.spacing[3]
        }}
      >
        {easing}
      </div>
    </Card>
  );
};

// Interactive demo component for durations
const DurationDemo = ({ duration, name }: { duration: string; name: string }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Card className="p-6">
      <div 
        className="text-sm font-medium mb-3"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.foreground,
          marginBottom: tokens.spacing[3]
        }}
      >
        {name}
      </div>
      <div 
        className="h-20 flex items-center justify-center relative"
        style={{ height: tokens.spacing[20] }}
      >
        <div
          className={`w-12 h-12 rounded-md transition-all ${
            isAnimating ? 'rotate-180 scale-125' : ''
          }`}
          style={{
            width: tokens.spacing[12],
            height: tokens.spacing[12],
            borderRadius: tokens.borderRadius.md,
            background: tokens.colors.accent[500],
            transitionDuration: duration
          }}
          onMouseEnter={() => setIsAnimating(true)}
          onMouseLeave={() => setIsAnimating(false)}
        />
      </div>
      <div 
        className="text-xs font-mono mt-3"
        style={{
          fontSize: tokens.typography.fontSize.xs,
          fontFamily: tokens.typography.fontFamily.mono.join(', '),
          color: tokens.colors.secondary[500],
          marginTop: tokens.spacing[3]
        }}
      >
        {duration}
      </div>
    </Card>
  );
};

// Interactive demo component for delays
const DelayDemo = ({ delay, name }: { delay: string; name: string }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Card className="p-6">
      <div 
        className="text-sm font-medium mb-3"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.foreground,
          marginBottom: tokens.spacing[3]
        }}
      >
        {name}
      </div>
      <div 
        className="h-20 flex items-center justify-center relative"
        style={{ height: tokens.spacing[20] }}
      >
        <div
          className={`w-12 h-12 rounded-md transition-all duration-500 ${
            isAnimating ? 'translate-x-16 scale-110' : ''
          }`}
          style={{
            width: tokens.spacing[12],
            height: tokens.spacing[12],
            borderRadius: tokens.borderRadius.md,
            background: tokens.colors.secondary[500],
            transitionDelay: delay,
            transitionDuration: tokens.motion.duration.normal
          }}
          onMouseEnter={() => setIsAnimating(true)}
          onMouseLeave={() => setIsAnimating(false)}
        />
      </div>
      <div 
        className="text-xs font-mono mt-3"
        style={{
          fontSize: tokens.typography.fontSize.xs,
          fontFamily: tokens.typography.fontFamily.mono.join(', '),
          color: tokens.colors.secondary[500],
          marginTop: tokens.spacing[3]
        }}
      >
        {delay}
      </div>
    </Card>
  );
};

// Use case components
const ButtonWithMotion = ({ easing, duration }: { easing: string; duration: string }) => (
  <button
    className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium transition-all"
    style={{
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      background: tokens.colors.primary[500],
      color: tokens.colors.background,
      borderRadius: tokens.borderRadius.md,
      fontWeight: tokens.typography.fontWeight.medium,
      transitionTimingFunction: easing,
      transitionDuration: duration
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
  >
    Interactive Button
  </button>
);

const CardWithMotion = ({ easing, duration }: { easing: string; duration: string }) => (
  <div
    className="p-6 bg-background border rounded-lg shadow-sm cursor-pointer transition-all"
    style={{
      padding: tokens.spacing[6],
      background: tokens.colors.background,
      border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
      borderRadius: tokens.borderRadius.lg,
      boxShadow: tokens.shadows.sm,
      transitionTimingFunction: easing,
      transitionDuration: duration
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
  >
    <h3 
      className="font-semibold mb-2"
      style={{
        fontWeight: tokens.typography.fontWeight.semibold,
        color: tokens.colors.foreground,
        marginBottom: tokens.spacing[2]
      }}
    >
      Card Title
    </h3>
    <p 
      className="text-sm"
      style={{
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.secondary[600]
      }}
    >
      Hover to see motion in action
    </p>
  </div>
);

export const Easing: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Easing Functions"
          subtitle="Easing functions control the acceleration curve of animations. Hover over each demo to see the motion in action."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tokens.motion.easing).map(([name, easing]) => (
            <EasingDemo key={name} name={name} easing={easing as string} />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Duration: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Duration Values"
          subtitle="Duration values define how long animations take to complete. Hover over each demo to see the timing in action."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tokens.motion.duration).map(([name, duration]) => (
            <DurationDemo key={name} name={name} duration={duration as string} />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Delay: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Delay Values"
          subtitle="Delay values define when animations start after a trigger. Hover over each demo to see the delay in action."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(tokens.motion.delay).map(([name, delay]) => (
            <DelayDemo key={name} name={name} delay={delay as string} />
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
          subtitle="Examples of how motion tokens are used in real components."
        />

        <div className="space-y-12">
          <div>
            <h4 
              className="text-lg font-medium mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6]
              }}
            >
              Button Interactions
            </h4>
            <div className="flex gap-6 flex-wrap">
              <ButtonWithMotion 
                easing={tokens.motion.easing['ease-out']} 
                duration={tokens.motion.duration.normal} 
              />
              <ButtonWithMotion 
                easing={tokens.motion.easing.bounce} 
                duration={tokens.motion.duration.slow} 
              />
            </div>
          </div>

          <div>
            <h4 
              className="text-lg font-medium mb-6"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[6]
              }}
            >
              Card Hover Effects
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardWithMotion 
                easing={tokens.motion.easing['ease-in-out']} 
                duration={tokens.motion.duration.normal} 
              />
              <CardWithMotion 
                easing={tokens.motion.easing['ease-out']} 
                duration={tokens.motion.duration.fast} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Scenarios: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Motion Scenarios"
          subtitle="Different scenarios where motion tokens should be applied."
        />

        <div className="space-y-6">
          <Card className="p-6">
            <h4 
              className="text-lg font-medium mb-3"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[3]
              }}
            >
              Micro-interactions
            </h4>
            <p 
              className="mb-3"
              style={{
                fontSize: tokens.typography.fontSize.sm,
                color: tokens.colors.secondary[600],
                marginBottom: tokens.spacing[3]
              }}
            >
              Use <code 
                className="bg-muted px-1 rounded"
                style={{
                  background: tokens.colors.secondary[100],
                  padding: `0 ${tokens.spacing[1]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                fast
              </code> duration with <code 
                className="bg-muted px-1 rounded"
                style={{
                  background: tokens.colors.secondary[100],
                  padding: `0 ${tokens.spacing[1]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                ease-out
              </code> for subtle feedback.
            </p>
            <div className="flex gap-2">
              <span 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[500]
                }}
              >
                Example:
              </span>
              <code 
                className="text-sm bg-primary/10 px-2 py-1 rounded"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  background: `${tokens.colors.primary[500]}1A`,
                  padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                transition: all {tokens.motion.duration.fast} {tokens.motion.easing['ease-out']}
              </code>
            </div>
          </Card>

          <Card className="p-6">
            <h4 
              className="text-lg font-medium mb-3"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[3]
              }}
            >
              Page Transitions
            </h4>
            <p 
              className="mb-3"
              style={{
                fontSize: tokens.typography.fontSize.sm,
                color: tokens.colors.secondary[600],
                marginBottom: tokens.spacing[3]
              }}
            >
              Use <code 
                className="bg-muted px-1 rounded"
                style={{
                  background: tokens.colors.secondary[100],
                  padding: `0 ${tokens.spacing[1]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                slow
              </code> duration with <code 
                className="bg-muted px-1 rounded"
                style={{
                  background: tokens.colors.secondary[100],
                  padding: `0 ${tokens.spacing[1]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                ease-in-out
              </code> for smooth page changes.
            </p>
            <div className="flex gap-2">
              <span 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[500]
                }}
              >
                Example:
              </span>
              <code 
                className="text-sm bg-primary/10 px-2 py-1 rounded"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  background: `${tokens.colors.primary[500]}1A`,
                  padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                transition: all {tokens.motion.duration.slow} {tokens.motion.easing['ease-in-out']}
              </code>
            </div>
          </Card>

          <Card className="p-6">
            <h4 
              className="text-lg font-medium mb-3"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[3]
              }}
            >
              Attention-grabbing Elements
            </h4>
            <p 
              className="mb-3"
              style={{
                fontSize: tokens.typography.fontSize.sm,
                color: tokens.colors.secondary[600],
                marginBottom: tokens.spacing[3]
              }}
            >
              Use <code 
                className="bg-muted px-1 rounded"
                style={{
                  background: tokens.colors.secondary[100],
                  padding: `0 ${tokens.spacing[1]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                bounce
              </code> easing for playful, attention-grabbing animations.
            </p>
            <div className="flex gap-2">
              <span 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.secondary[500]
                }}
              >
                Example:
              </span>
              <code 
                className="text-sm bg-primary/10 px-2 py-1 rounded"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  background: `${tokens.colors.primary[500]}1A`,
                  padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                  borderRadius: tokens.borderRadius.base
                }}
              >
                transition: all {tokens.motion.duration.normal} {tokens.motion.easing.bounce}
              </code>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const ComprehensiveExample: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Comprehensive Motion Example"
          subtitle="A complete example showing how to combine easing, duration, and delay tokens for complex animations."
        />

        <Card className="p-6">
          <h4 
            className="text-lg font-medium mb-6"
            style={{
              fontSize: tokens.typography.fontSize.lg,
              fontWeight: tokens.typography.fontWeight.medium,
              color: tokens.colors.foreground,
              marginBottom: tokens.spacing[6]
            }}
          >
            Staggered Animation Grid
          </h4>
          <div className="grid grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-20 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg shadow-md cursor-pointer transition-all duration-700 hover:scale-110 hover:rotate-3"
                style={{
                  height: tokens.spacing[20],
                  background: `linear-gradient(to bottom right, ${tokens.colors.primary[200]}, ${tokens.colors.primary[300]})`,
                  borderRadius: tokens.borderRadius.lg,
                  boxShadow: tokens.shadows.md,
                  transitionTimingFunction: tokens.motion.easing.elastic,
                  transitionDelay: tokens.motion.delay[['none', 'fast', 'normal', 'slow'][index] as keyof typeof tokens.motion.delay],
                  transitionDuration: tokens.motion.duration.slow
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.1) rotate(3deg)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div 
                  className="h-full flex items-center justify-center text-primary font-semibold"
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tokens.colors.primary[600],
                    fontWeight: tokens.typography.fontWeight.semibold
                  }}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <div 
            className="mt-6 text-sm"
            style={{
              marginTop: tokens.spacing[6],
              fontSize: tokens.typography.fontSize.sm,
              color: tokens.colors.secondary[600]
            }}
          >
            <p>Hover over each card to see elastic easing with staggered delays:</p>
            <ul 
              className="mt-2 space-y-1"
              style={{
                marginTop: tokens.spacing[2],
                gap: tokens.spacing[1]
              }}
            >
              <li>• Card 1: No delay</li>
              <li>• Card 2: {tokens.motion.delay.fast} delay</li>
              <li>• Card 3: {tokens.motion.delay.normal} delay</li>
              <li>• Card 4: {tokens.motion.delay.slow} delay</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Motion Guidelines"
          subtitle="Best practices and accessibility considerations for implementing motion in your applications."
        />

        <div className="space-y-6">
          <Card className="p-6">
            <h4 
              className="text-lg font-medium mb-4"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.primary[700],
                marginBottom: tokens.spacing[4]
              }}
            >
              When to Use Motion
            </h4>
            <ul 
              className="space-y-1"
              style={{ gap: tokens.spacing[1] }}
            >
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.primary[800]
                }}
              >
                • Provide feedback for user interactions
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.primary[800]
                }}
              >
                • Guide user attention to important elements
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.primary[800]
                }}
              >
                • Create smooth transitions between states
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.primary[800]
                }}
              >
                • Enhance the overall user experience
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 
              className="text-lg font-medium mb-4"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.warning,
                marginBottom: tokens.spacing[4]
              }}
            >
              Accessibility Considerations
            </h4>
            <ul 
              className="space-y-1"
              style={{ gap: tokens.spacing[1] }}
            >
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.warning
                }}
              >
                • Respect user's motion preferences (prefers-reduced-motion)
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.warning
                }}
              >
                • Ensure animations don't cause motion sickness
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.warning
                }}
              >
                • Keep animations under 500ms for optimal performance
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.warning
                }}
              >
                • Provide alternative states for users with disabilities
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 
              className="text-lg font-medium mb-4"
              style={{
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.accent[700],
                marginBottom: tokens.spacing[4]
              }}
            >
              Performance Best Practices
            </h4>
            <ul 
              className="space-y-1"
              style={{ gap: tokens.spacing[1] }}
            >
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.accent[800]
                }}
              >
                • Use transform and opacity for smooth animations
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.accent[800]
                }}
              >
                • Avoid animating layout properties (width, height, margin)
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.accent[800]
                }}
              >
                • Use will-change CSS property sparingly
              </li>
              <li 
                className="text-sm"
                style={{
                  fontSize: tokens.typography.fontSize.sm,
                  color: tokens.colors.accent[800]
                }}
              >
                • Test animations on lower-end devices
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  ),
};
