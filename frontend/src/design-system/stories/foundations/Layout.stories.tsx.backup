import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  SectionHeader,
  GuidelinesCard,
  GuidelinesSection,
} from '../components';

const meta: Meta = {
  title: '1 - Foundations / Layout System',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Layout System"
            subtitle="Comprehensive layout system with container widths, layout patterns, responsive utilities, and semantic tokens. Includes accessibility considerations and real-world examples."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
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

// Layout System Components
const ContainerSwatch = ({
  name,
  maxWidth,
  padding,
  className = '',
}: {
  name: string;
  maxWidth: string;
  padding: string;
  className?: string;
}) => (
  <div className={`${className}`}>
    <div className={`${maxWidth} ${padding} mx-auto`}>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <div className="text-sm font-medium text-primary mb-2">{name}</div>
        <div className="text-xs text-muted-foreground font-mono">
          {maxWidth} • {padding}
        </div>
        <div className="mt-4 h-8 bg-primary/5 border border-primary/10 rounded flex items-center justify-center text-xs text-primary">
          Content Area
        </div>
      </div>
    </div>
  </div>
);

const LayoutPattern = ({
  name,
  pattern,
  description,
}: {
  name: string;
  pattern: string;
  description: string;
}) => (
  <div className="p-6 rounded-xl border bg-card space-y-4">
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className="text-xs text-muted-foreground">{description}</div>
    <div className={`${pattern} h-32 gap-4`}>
      <div className="bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs font-medium text-primary">
        Header
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs font-medium text-accent">
        Sidebar
      </div>
      <div className="bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-xs font-medium text-secondary">
        Main
      </div>
      <div className="bg-muted/10 border border-muted/20 rounded flex items-center justify-center text-xs font-medium text-muted-foreground">
        Footer
      </div>
    </div>
    <div className="text-xs text-muted-foreground font-mono">{pattern}</div>
  </div>
);

const ResponsiveLayout = ({
  title,
  mobilePattern,
  desktopPattern,
}: {
  title: string;
  mobilePattern: string;
  desktopPattern: string;
}) => (
  <div className="p-6 rounded-xl border bg-card space-y-4">
    <div className="text-sm font-medium text-foreground">{title}</div>

    <div className="space-y-4">
      <div>
        <div className="text-xs text-muted-foreground mb-2">Mobile Layout</div>
        <div className={`${mobilePattern} h-24 gap-2`}>
          <div className="bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs">
            Header
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs">
            Content
          </div>
          <div className="bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-xs">
            Footer
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-2">Desktop Layout</div>
        <div className={`${desktopPattern} h-24 gap-2`}>
          <div className="bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs">
            Header
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs">
            Sidebar
          </div>
          <div className="bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-xs">
            Main
          </div>
          <div className="bg-muted/10 border border-muted/20 rounded flex items-center justify-center text-xs">
            Footer
          </div>
        </div>
      </div>
    </div>

    <div className="text-xs text-muted-foreground font-mono break-words">
      Mobile: {mobilePattern} | Desktop: {desktopPattern}
    </div>
  </div>
);

// ============================================================================
// STORIES
// ============================================================================

export const ContainerSystem: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Container System"
          subtitle="Responsive container widths with consistent padding and max-widths"
        />

        <div className="space-y-8">
          <ContainerSwatch
            name="Extra Small Container"
            maxWidth="max-w-xs"
            padding="px-4"
          />

          <ContainerSwatch
            name="Small Container"
            maxWidth="max-w-sm"
            padding="px-4"
          />

          <ContainerSwatch
            name="Medium Container"
            maxWidth="max-w-md"
            padding="px-6"
          />

          <ContainerSwatch
            name="Large Container"
            maxWidth="max-w-lg"
            padding="px-6"
          />

          <ContainerSwatch
            name="Extra Large Container"
            maxWidth="max-w-xl"
            padding="px-8"
          />

          <ContainerSwatch
            name="2XL Container"
            maxWidth="max-w-2xl"
            padding="px-8"
          />

          <ContainerSwatch
            name="3XL Container"
            maxWidth="max-w-3xl"
            padding="px-8"
          />

          <ContainerSwatch
            name="4XL Container"
            maxWidth="max-w-4xl"
            padding="px-8"
          />

          <ContainerSwatch
            name="5XL Container"
            maxWidth="max-w-5xl"
            padding="px-8"
          />

          <ContainerSwatch
            name="6XL Container"
            maxWidth="max-w-6xl"
            padding="px-8"
          />

          <ContainerSwatch
            name="7XL Container"
            maxWidth="max-w-7xl"
            padding="px-8"
          />

          <ContainerSwatch
            name="Full Width"
            maxWidth="w-full"
            padding="px-4 sm:px-6 lg:px-8"
          />
        </div>
      </div>
    </div>
  ),
};

export const LayoutPatterns: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Layout Patterns"
          subtitle="Common layout patterns for different use cases"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LayoutPattern
            name="Single Column"
            pattern="grid grid-cols-1"
            description="Simple single column layout for content-focused pages"
          />

          <LayoutPattern
            name="Two Column"
            pattern="grid grid-cols-2"
            description="Equal width two column layout"
          />

          <LayoutPattern
            name="Three Column"
            pattern="grid grid-cols-3"
            description="Equal width three column layout"
          />

          <LayoutPattern
            name="Sidebar Layout"
            pattern="grid grid-cols-4"
            description="Sidebar with main content area"
          />

          <LayoutPattern
            name="Header + Content"
            pattern="grid grid-rows-2"
            description="Header with main content below"
          />

          <LayoutPattern
            name="Complex Layout"
            pattern="grid grid-cols-4 grid-rows-3"
            description="Complex multi-area layout"
          />
        </div>
      </div>
    </div>
  ),
};

export const ResponsiveLayouts: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Responsive Layouts"
          subtitle="Layouts that adapt to different screen sizes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveLayout
            title="Mobile-First Stack"
            mobilePattern="grid grid-cols-1"
            desktopPattern="grid grid-cols-3"
          />

          <ResponsiveLayout
            title="Sidebar Layout"
            mobilePattern="grid grid-cols-1"
            desktopPattern="grid grid-cols-4"
          />

          <ResponsiveLayout
            title="Card Grid"
            mobilePattern="grid grid-cols-1"
            desktopPattern="grid grid-cols-3"
          />

          <ResponsiveLayout
            title="Dashboard Layout"
            mobilePattern="grid grid-cols-1"
            desktopPattern="grid grid-cols-12"
          />
        </div>
      </div>
    </div>
  ),
};

export const LayoutUtilities: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Layout Utilities"
          subtitle="Utility classes for common layout patterns"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Centered Layout
            </div>
            <div className="flex items-center justify-center h-24 bg-primary/5 border border-primary/10 rounded">
              <div className="text-xs text-primary">Centered Content</div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              flex items-center justify-center
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Space Between
            </div>
            <div className="flex items-center justify-between h-24 bg-accent/5 border border-accent/10 rounded px-4">
              <div className="text-xs text-accent">Left</div>
              <div className="text-xs text-accent">Right</div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              flex items-center justify-between
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Space Around
            </div>
            <div className="flex items-center justify-around h-24 bg-secondary/5 border border-secondary/10 rounded">
              <div className="text-xs text-secondary">Item 1</div>
              <div className="text-xs text-secondary">Item 2</div>
              <div className="text-xs text-secondary">Item 3</div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              flex items-center justify-around
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Vertical Stack
            </div>
            <div className="flex flex-col items-center justify-center h-24 bg-muted/5 border border-muted/10 rounded space-y-2">
              <div className="text-xs text-muted-foreground">Item 1</div>
              <div className="text-xs text-muted-foreground">Item 2</div>
              <div className="text-xs text-muted-foreground">Item 3</div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              flex flex-col items-center justify-center
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Equal Width
            </div>
            <div className="flex h-24 bg-primary/5 border border-primary/10 rounded">
              <div className="flex-1 bg-primary/10 border-r border-primary/20 flex items-center justify-center text-xs text-primary">
                1/3
              </div>
              <div className="flex-1 bg-primary/10 border-r border-primary/20 flex items-center justify-center text-xs text-primary">
                1/3
              </div>
              <div className="flex-1 bg-primary/10 flex items-center justify-center text-xs text-primary">
                1/3
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              flex • flex-1
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Fixed + Flexible
            </div>
            <div className="flex h-24 bg-accent/5 border border-accent/10 rounded">
              <div className="w-20 bg-accent/10 border-r border-accent/20 flex items-center justify-center text-xs text-accent">
                Fixed
              </div>
              <div className="flex-1 bg-accent/5 flex items-center justify-center text-xs text-accent">
                Flexible
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              w-20 • flex-1
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
          title="Practical Layout Examples"
          subtitle="Real-world applications of our layout system"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Page Layout */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Page Layout
            </div>
            <div className="space-y-2">
              <div className="bg-primary/10 border border-primary/20 rounded p-3 text-xs text-primary">
                Header
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                <div className="bg-accent/10 border border-accent/20 rounded p-3 text-xs text-accent">
                  Sidebar
                </div>
                <div className="lg:col-span-3 bg-secondary/10 border border-secondary/20 rounded p-3 text-xs text-secondary">
                  Main Content
                </div>
              </div>
              <div className="bg-muted/10 border border-muted/20 rounded p-3 text-xs text-muted-foreground">
                Footer
              </div>
            </div>
          </div>

          {/* Dashboard Layout */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Dashboard Layout
            </div>
            <div className="space-y-2">
              <div className="bg-primary/10 border border-primary/20 rounded p-3 text-xs text-primary">
                Navigation
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="bg-accent/10 border border-accent/20 rounded p-3 text-xs text-accent">
                  Widget 1
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded p-3 text-xs text-accent">
                  Widget 2
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded p-3 text-xs text-accent">
                  Widget 3
                </div>
              </div>
            </div>
          </div>

          {/* Form Layout */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Form Layout
            </div>
            <div className="space-y-2">
              <div className="bg-primary/10 border border-primary/20 rounded p-3 text-xs text-primary">
                Form Header
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-secondary/10 border border-secondary/20 rounded p-3 text-xs text-secondary">
                  Field 1
                </div>
                <div className="bg-secondary/10 border border-secondary/20 rounded p-3 text-xs text-secondary">
                  Field 2
                </div>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded p-3 text-xs text-secondary">
                Full Width Field
              </div>
              <div className="flex justify-end gap-2">
                <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent">
                  Cancel
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary">
                  Submit
                </div>
              </div>
            </div>
          </div>

          {/* Card Layout */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Card Layout
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary">
                  Card Title
                </div>
                <div className="bg-muted/10 border border-muted/20 rounded p-2 text-xs text-muted-foreground">
                  Action
                </div>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded p-3 text-xs text-secondary">
                Card Content
              </div>
              <div className="flex justify-between items-center">
                <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent">
                  Meta
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent">
                  Status
                </div>
              </div>
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
          title="Layout System Guidelines"
          subtitle="Best practices for implementing our layout system"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="Container Usage"
              items={[
                '• Use max-w-7xl for main content areas',
                '• Use max-w-4xl for article content',
                '• Use max-w-2xl for forms and cards',
                '• Always include responsive padding',
              ]}
            />

            <GuidelinesCard
              title="Responsive Design"
              items={[
                '• Start with mobile-first approach',
                '• Use semantic breakpoint prefixes',
                '• Test layouts across all devices',
                '• Consider content hierarchy',
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Layout Patterns"
              items={[
                '• Use grid for complex layouts',
                '• Use flexbox for simple arrangements',
                '• Prefer semantic HTML structure',
                '• Maintain consistent spacing',
              ]}
            />

            <GuidelinesCard
              title="Accessibility"
              items={[
                '• Ensure logical tab order',
                '• Use proper heading hierarchy',
                '• Maintain sufficient contrast',
                '• Test with screen readers',
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          🚀 Usage Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GuidelinesSection
            title="Container Sizes"
            items={[
              '• max-w-xs: 320px - Small components',
              '• max-w-sm: 384px - Forms and cards',
              '• max-w-md: 448px - Medium content',
              '• max-w-lg: 512px - Large content',
              '• max-w-xl: 576px - Extra large content',
              '• max-w-2xl: 672px - Article content',
              '• max-w-3xl: 768px - Wide content',
              '• max-w-4xl: 896px - Very wide content',
              '• max-w-5xl: 1024px - Extra wide content',
              '• max-w-6xl: 1152px - Huge content',
              '• max-w-7xl: 1280px - Maximum content',
            ]}
          />
          <GuidelinesSection
            title="Layout Patterns"
            items={[
              '• Single Column: Content-focused pages',
              '• Two Column: Sidebar layouts',
              '• Three Column: Dashboard layouts',
              '• Grid Layout: Card galleries',
              '• Flexbox: Navigation and forms',
              '• CSS Grid: Complex layouts',
            ]}
          />
          <GuidelinesSection
            title="Responsive Patterns"
            items={[
              '• Mobile First: Start with mobile layout',
              '• Breakpoint Prefixes: sm:, md:, lg:, xl:, 2xl:',
              '• Container Queries: Component-level responsive',
              '• Fluid Typography: Responsive text sizing',
              '• Adaptive Spacing: Responsive margins/padding',
              '• Flexible Images: Responsive media',
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
