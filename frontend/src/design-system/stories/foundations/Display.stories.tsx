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
  title: '1 - Foundations / Display',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Display"
            subtitle="Display properties, visibility utilities, and overflow handling"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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

// Display System Components
const DisplayDemo = ({
  name,
  display,
  description,
}: {
  name: string;
  display: string;
  description: string;
}) => (
  <div className="p-6 rounded-xl border bg-card space-y-4">
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className="text-xs text-muted-foreground">{description}</div>
    <div className="space-y-2">
      <div
        className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary"
        style={{ display: display as any }}
      >
        <span className="bg-primary/20 px-1 rounded">Item 1</span>
        <span className="bg-primary/20 px-1 rounded">Item 2</span>
        <span className="bg-primary/20 px-1 rounded">Item 3</span>
      </div>
    </div>
    <div className="text-xs text-muted-foreground font-mono">
      display: {display}
    </div>
  </div>
);

// ============================================================================
// STORIES
// ============================================================================

export const DisplayTypes: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Display Types"
          subtitle="Different display properties and their effects on layout"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DisplayDemo
            name="Block"
            display="block"
            description="Elements stack vertically and take full width"
          />

          <DisplayDemo
            name="Inline"
            display="inline"
            description="Elements flow horizontally and respect content width"
          />

          <DisplayDemo
            name="Inline Block"
            display="inline-block"
            description="Elements flow horizontally but can have block properties"
          />

          <DisplayDemo
            name="Flex"
            display="flex"
            description="Flexbox layout with horizontal alignment"
          />

          <DisplayDemo
            name="Grid"
            display="grid"
            description="CSS Grid layout system"
          />

          <DisplayDemo
            name="None"
            display="none"
            description="Element is completely removed from layout"
          />
        </div>
      </div>
    </div>
  ),
};

export const VisibilitySystem: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Visibility System"
          subtitle="Controlling element visibility while maintaining layout"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Visible</div>
            <div className="text-xs text-muted-foreground">
              Element is visible and takes up space
            </div>
            <div className="space-y-2">
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent">
                <span className="bg-accent/20 px-1 rounded">Item 1</span>
                <span className="bg-accent/20 px-1 rounded">Visible</span>
                <span className="bg-accent/20 px-1 rounded">Item 3</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Hidden</div>
            <div className="text-xs text-muted-foreground">
              Element is hidden but still takes up space
            </div>
            <div className="space-y-2">
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent">
                <span className="bg-accent/20 px-1 rounded">Item 1</span>
                <span className="bg-accent/20 px-1 rounded invisible">
                  Hidden
                </span>
                <span className="bg-accent/20 px-1 rounded">Item 3</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Display None
            </div>
            <div className="text-xs text-muted-foreground">
              Element is completely removed
            </div>
            <div className="space-y-2">
              <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent">
                <span className="bg-accent/20 px-1 rounded">Item 1</span>
                <span className="bg-accent/20 px-1 rounded hidden">Hidden</span>
                <span className="bg-accent/20 px-1 rounded">Item 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ResponsiveDisplay: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Responsive Display"
          subtitle="Display properties that adapt to different screen sizes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Responsive Grid
            </div>
            <div className="text-xs text-muted-foreground">
              Grid that adapts to screen size
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary text-center"
                >
                  Item {i + 1}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Responsive Visibility
            </div>
            <div className="text-xs text-muted-foreground">
              Elements that show/hide based on screen size
            </div>
            <div className="space-y-2">
              <div className="bg-secondary/10 border border-secondary/20 rounded p-2 text-xs text-secondary">
                <span className="bg-secondary/20 px-1 rounded">
                  Always Visible
                </span>
                <span className="bg-secondary/20 px-1 rounded block sm:hidden">
                  Mobile Only
                </span>
                <span className="bg-secondary/20 px-1 rounded hidden sm:block lg:hidden">
                  Tablet Only
                </span>
                <span className="bg-secondary/20 px-1 rounded hidden lg:block">
                  Desktop Only
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              responsive visibility classes
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
          title="Display Guidelines"
          subtitle="Best practices for implementing display properties"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="Display Types"
              items={[
                '• Use block for full-width elements',
                '• Use inline for text-level elements',
                '• Use flex for flexible layouts',
                '• Use grid for complex layouts',
              ]}
            />

            <GuidelinesCard
              title="Visibility"
              items={[
                '• Use hidden for conditional display',
                '• Use invisible for maintaining layout',
                '• Use opacity for gradual transitions',
                '• Consider accessibility implications',
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Responsive Design"
              items={[
                '• Use responsive display classes',
                '• Test across all screen sizes',
                '• Consider content hierarchy',
                '• Maintain usability on all devices',
              ]}
            />

            <GuidelinesCard
              title="Performance"
              items={[
                '• Use display: none for hidden elements',
                '• Avoid frequent display changes',
                '• Consider CSS transitions',
                '• Optimize for mobile performance',
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
            title="Display Values"
            items={[
              '• <strong>block</strong>: Full-width block elements',
              '• <strong>inline</strong>: Text-level elements',
              '• <strong>inline-block</strong>: Inline with block properties',
              '• <strong>flex</strong>: Flexible box layout',
              '• <strong>grid</strong>: CSS Grid layout',
              '• <strong>none</strong>: Completely hidden',
            ]}
          />
          <GuidelinesSection
            title="Visibility Classes"
            items={[
              '• <strong>visible</strong>: Element is visible',
              '• <strong>invisible</strong>: Hidden but maintains space',
              '• <strong>hidden</strong>: Completely hidden',
              '• <strong>opacity-*</strong>: Transparency levels',
              '• <strong>responsive</strong>: sm:, md:, lg: prefixes',
            ]}
          />
          <GuidelinesSection
            title="Common Patterns"
            items={[
              '• <strong>Responsive Grid</strong>: grid-cols-1 md:grid-cols-2',
              '• <strong>Flexible Layout</strong>: flex flex-col md:flex-row',
              '• <strong>Conditional Display</strong>: hidden md:block',
              '• <strong>Modal Overlays</strong>: fixed + hidden/block',
              '• <strong>Responsive Navigation</strong>: flex-col sm:flex-row',
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
