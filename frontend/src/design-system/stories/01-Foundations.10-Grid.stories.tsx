import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  SectionHeader,
  GuidelinesCard,
  GuidelinesSection
} from './components';

const meta: Meta = {
  title: 'Design System/Foundations/Grid System',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Grid System"
            subtitle="Comprehensive grid system with CSS Grid, Flexbox, responsive breakpoints, and layout patterns. Includes semantic tokens, accessibility considerations, and real-world examples."
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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

// Grid System Components
const GridSwatch = ({ name, cols, gap, className = '' }: {
  name: string;
  cols: string;
  gap: string;
  className?: string;
}) => (
  <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className={`grid ${cols} ${gap} h-32`}>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs font-medium text-primary"
        >
          {i + 1}
        </div>
      ))}
    </div>
    <div className="text-xs text-muted-foreground font-mono">
      {cols} • {gap}
    </div>
  </div>
);

const FlexSwatch = ({ name, direction, justify, align, className = '' }: {
  name: string;
  direction: string;
  justify: string;
  align: string;
  className?: string;
}) => (
  <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className={`flex ${direction} ${justify} ${align} h-24 border border-dashed border-muted rounded`}>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="bg-accent/10 border border-accent/20 rounded px-3 py-2 text-xs font-medium text-accent"
        >
          Item {i + 1}
        </div>
      ))}
    </div>
    <div className="text-xs text-muted-foreground font-mono">
      {direction} • {justify} • {align}
    </div>
  </div>
);

const ResponsiveGrid = ({ title, pattern }: { title: string; pattern: string }) => (
  <div className="p-6 rounded-xl border bg-card space-y-4">
    <div className="text-sm font-medium text-foreground">{title}</div>
    <div className={`${pattern} gap-4`}>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="bg-secondary/10 border border-secondary/20 rounded p-4 flex items-center justify-center text-sm font-medium text-secondary"
        >
          Card {i + 1}
        </div>
      ))}
    </div>
    <div className="text-xs text-muted-foreground font-mono">{pattern}</div>
  </div>
);

// ============================================================================
// STORIES
// ============================================================================

export const GridSystem: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="CSS Grid System"
          subtitle="Flexible grid layouts with responsive breakpoints and semantic tokens"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GridSwatch
            name="12-Column Grid"
            cols="grid-cols-12"
            gap="gap-2"
          />
          <GridSwatch
            name="6-Column Grid"
            cols="grid-cols-6"
            gap="gap-3"
          />
          <GridSwatch
            name="4-Column Grid"
            cols="grid-cols-4"
            gap="gap-4"
          />
          <GridSwatch
            name="3-Column Grid"
            cols="grid-cols-3"
            gap="gap-4"
          />
          <GridSwatch
            name="2-Column Grid"
            cols="grid-cols-2"
            gap="gap-6"
          />
          <GridSwatch
            name="1-Column Grid"
            cols="grid-cols-1"
            gap="gap-4"
          />
        </div>
      </div>

      <div>
        <SectionHeader
          title="Responsive Grid Patterns"
          subtitle="Mobile-first responsive grid layouts that adapt to different screen sizes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveGrid
            title="Cards Layout"
            pattern="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          />
          <ResponsiveGrid
            title="Dashboard Layout"
            pattern="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"
          />
          <ResponsiveGrid
            title="Sidebar Layout"
            pattern="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5"
          />
          <ResponsiveGrid
            title="Masonry Layout"
            pattern="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>
    </div>
  ),
};

export const FlexboxSystem: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Flexbox System"
          subtitle="Flexible box layouts for dynamic content arrangement"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FlexSwatch
            name="Row Center"
            direction="flex-row"
            justify="justify-center"
            align="items-center"
          />
          <FlexSwatch
            name="Row Between"
            direction="flex-row"
            justify="justify-between"
            align="items-center"
          />
          <FlexSwatch
            name="Row Around"
            direction="flex-row"
            justify="justify-around"
            align="items-center"
          />
          <FlexSwatch
            name="Column Center"
            direction="flex-col"
            justify="justify-center"
            align="items-center"
          />
          <FlexSwatch
            name="Column Start"
            direction="flex-col"
            justify="justify-start"
            align="items-start"
          />
          <FlexSwatch
            name="Column End"
            direction="flex-col"
            justify="justify-end"
            align="items-end"
          />
        </div>
      </div>

      <div>
        <SectionHeader
          title="Flex Properties"
          subtitle="Flex grow, shrink, and basis utilities"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Flex Grow</div>
            <div className="flex gap-2 h-16">
              <div className="flex-1 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs">flex-1</div>
              <div className="flex-2 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs">flex-2</div>
              <div className="flex-3 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs">flex-3</div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Flex Shrink</div>
            <div className="flex gap-2 h-16">
              <div className="flex-shrink-0 w-20 bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs">Fixed</div>
              <div className="flex-shrink bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs">Shrink</div>
              <div className="flex-shrink-0 w-20 bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs">Fixed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GridGaps: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Grid Gap System"
          subtitle="Consistent spacing between grid items using design tokens"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GridSwatch
            name="Tight Gap"
            cols="grid-cols-4"
            gap="gap-1"
          />
          <GridSwatch
            name="Small Gap"
            cols="grid-cols-4"
            gap="gap-2"
          />
          <GridSwatch
            name="Medium Gap"
            cols="grid-cols-4"
            gap="gap-4"
          />
          <GridSwatch
            name="Large Gap"
            cols="grid-cols-4"
            gap="gap-6"
          />
          <GridSwatch
            name="Extra Large Gap"
            cols="grid-cols-4"
            gap="gap-8"
          />
          <GridSwatch
            name="Huge Gap"
            cols="grid-cols-4"
            gap="gap-12"
          />
        </div>
      </div>

      <div>
        <SectionHeader
          title="Responsive Gaps"
          subtitle="Gaps that adapt to different screen sizes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Mobile-First Gaps</div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 h-32">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-xs"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              gap-2 sm:gap-4 lg:gap-6
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Adaptive Gaps</div>
            <div className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-4 lg:gap-6 h-32">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              gap-1 sm:gap-3 md:gap-4 lg:gap-6
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GridAlignment: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Grid Alignment"
          subtitle="Control how grid items are positioned within their containers"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Justify Start</div>
            <div className="grid grid-cols-3 gap-2 justify-start h-32">
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">1</div>
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">2</div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Justify Center</div>
            <div className="grid grid-cols-3 gap-2 justify-center h-32">
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">1</div>
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">2</div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Justify End</div>
            <div className="grid grid-cols-3 gap-2 justify-end h-32">
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">1</div>
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">2</div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Items Start</div>
            <div className="grid grid-cols-3 gap-2 items-start h-32">
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Short</div>
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Medium height content</div>
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Very tall content that wraps to multiple lines</div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Items Center</div>
            <div className="grid grid-cols-3 gap-2 items-center h-32">
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Short</div>
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Medium height content</div>
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Very tall content that wraps to multiple lines</div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Items End</div>
            <div className="grid grid-cols-3 gap-2 items-end h-32">
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Short</div>
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Medium height content</div>
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs">Very tall content that wraps to multiple lines</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const PracticalExamples: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Practical Grid Examples"
          subtitle="Real-world applications of our grid system"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dashboard Layout */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Dashboard Layout</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-primary/10 border border-primary/20 rounded p-4">
                <div className="text-xs font-medium text-primary">Metric 1</div>
                <div className="text-lg font-bold text-primary">$12,345</div>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded p-4">
                <div className="text-xs font-medium text-accent">Metric 2</div>
                <div className="text-lg font-bold text-accent">+23.4%</div>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded p-4">
                <div className="text-xs font-medium text-secondary">Metric 3</div>
                <div className="text-lg font-bold text-secondary">1,234</div>
              </div>
            </div>
          </div>

          {/* Card Grid */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Card Grid</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background border rounded p-4">
                <div className="text-sm font-medium">Card Title</div>
                <div className="text-xs text-muted-foreground mt-1">Card description</div>
              </div>
              <div className="bg-background border rounded p-4">
                <div className="text-sm font-medium">Card Title</div>
                <div className="text-xs text-muted-foreground mt-1">Card description</div>
              </div>
            </div>
          </div>

          {/* Form Layout */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Form Layout</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">First Name</label>
                <input className="w-full px-3 py-2 border rounded text-sm" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Last Name</label>
                <input className="w-full px-3 py-2 border rounded text-sm" placeholder="Enter last name" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-medium">Email</label>
                <input className="w-full px-3 py-2 border rounded text-sm" placeholder="Enter email" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Navigation</div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-background border rounded p-3 text-center text-sm">Home</div>
              <div className="flex-1 bg-background border rounded p-3 text-center text-sm">About</div>
              <div className="flex-1 bg-background border rounded p-3 text-center text-sm">Contact</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Grid System Guidelines"
          subtitle="Best practices for implementing our grid system"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="CSS Grid"
              items={[
                "• Use 12-column grid for complex layouts",
                "• Prefer grid-cols-1 for mobile-first design",
                "• Use semantic gap tokens for consistency",
                "• Leverage grid-template-areas for complex layouts"
              ]}
            />

            <GuidelinesCard
              title="Flexbox"
              items={[
                "• Use flex-row for horizontal layouts",
                "• Use flex-col for vertical layouts",
                "• Prefer justify-center for centered content",
                "• Use flex-1 for equal distribution"
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Responsive Design"
              items={[
                "• Start with mobile-first approach",
                "• Use breakpoint prefixes (sm:, md:, lg:)",
                "• Test layouts across all screen sizes",
                "• Consider content hierarchy"
              ]}
            />

            <GuidelinesCard
              title="Accessibility"
              items={[
                "• Maintain logical tab order",
                "• Ensure sufficient color contrast",
                "• Use semantic HTML elements",
                "• Test with screen readers"
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">🚀 Usage Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GuidelinesSection
            title="Grid Layouts"
            items={[
              "• <strong>12-column</strong>: Complex dashboards and forms",
              "• <strong>6-column</strong>: Content-heavy pages",
              "• <strong>4-column</strong>: Card galleries and portfolios",
              "• <strong>3-column</strong>: Sidebar layouts",
              "• <strong>2-column</strong>: Simple content splits",
              "• <strong>1-column</strong>: Mobile-first designs"
            ]}
          />
          <GuidelinesSection
            title="Flexbox Patterns"
            items={[
              "• <strong>Navigation</strong>: flex-row justify-between",
              "• <strong>Centered content</strong>: flex justify-center items-center",
              "• <strong>Form groups</strong>: flex-col space-y-2",
              "• <strong>Button groups</strong>: flex gap-2",
              "• <strong>Card headers</strong>: flex justify-between items-center",
              "• <strong>Responsive stacks</strong>: flex-col sm:flex-row"
            ]}
          />
          <GuidelinesSection
            title="Gap System"
            items={[
              "• <strong>gap-1</strong>: Tight spacing (4px)",
              "• <strong>gap-2</strong>: Small spacing (8px)",
              "• <strong>gap-4</strong>: Medium spacing (16px)",
              "• <strong>gap-6</strong>: Large spacing (24px)",
              "• <strong>gap-8</strong>: Extra large spacing (32px)",
              "• <strong>gap-12</strong>: Huge spacing (48px)"
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
