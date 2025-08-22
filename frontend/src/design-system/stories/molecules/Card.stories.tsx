import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../molecules/Card/Card';
import { Button } from '../../atoms/Button';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard } from '../components';
import { Check, AlertTriangle, Layout, Image } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Card> = {
  title: 'Molecules / Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: Card"
            subtitle="A flexible content container with various styling options for organizing and presenting content."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outline', 'ghost', 'interactive'],
      description: 'Visual variant of the card.',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Padding inside the card.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================ // STORIES // ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Card Variants"
        subtitle="Different card configurations and styling options."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Default Card</CardTitle>
            <CardDescription>
              This is a default card with a title and description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here. You can put any React nodes inside.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Elevated Card</CardTitle>
            <CardDescription>
              This card has a subtle shadow for elevation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>It lifts off the surface, indicating importance or interactivity.</p>
          </CardContent>
        </Card>

        <Card variant="outline">
          <CardHeader>
            <CardTitle>Outline Card</CardTitle>
            <CardDescription>
              This card has only a border, no background fill.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Useful for secondary content or to reduce visual clutter.</p>
          </CardContent>
        </Card>

        <Card variant="ghost">
          <CardHeader>
            <CardTitle>Ghost Card</CardTitle>
            <CardDescription>
              This card has no border, background, or shadow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Very subtle container, often used for grouping content without strong visual separation.</p>
          </CardContent>
        </Card>

        <Card variant="interactive">
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>
            <CardDescription>
              This card responds to hover, focus, and active states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click or hover over me!</p>
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Custom Padding</CardTitle>
            <CardDescription>
              This card uses a larger padding value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>The content inside has more breathing room.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>
            This is a default card with a title and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here. You can put any React nodes inside.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>
            This card has a subtle shadow for elevation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            It lifts off the surface, indicating importance or interactivity.
          </p>
        </CardContent>
      </>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
          <CardDescription>
            This card has only a border, no background fill.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Useful for secondary content or to reduce visual clutter.</p>
        </CardContent>
      </>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: (
      <>
        <CardHeader>
          <CardTitle>Ghost Card</CardTitle>
          <CardDescription>
            This card has no border, background, or shadow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            It's a very subtle container, often used for grouping content
            without strong visual separation.
          </p>
        </CardContent>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    children: (
      <>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>
            This card responds to hover, focus, and active states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Click or hover over me!</p>
        </CardContent>
      </>
    ),
  },
};

export const CustomPadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <>
        <CardHeader>
          <CardTitle>Card with Custom Padding</CardTitle>
          <CardDescription>
            This card uses a larger padding value.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>The content inside has more breathing room.</p>
        </CardContent>
      </>
    ),
  },
};

export const CardWithImage: Story = {
  args: {
    children: (
      <>
        <img
          src="https://via.placeholder.com/300x150"
          alt="Placeholder"
          className="rounded-t-lg w-full object-cover"
        />
        <CardContent>
          <CardTitle size="md">Card with Image</CardTitle>
          <CardDescription>
            A simple card demonstrating image integration.
          </CardDescription>
          <p className="mt-2 text-sm">
            This is some additional text below the description.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">
            Learn More
          </Button>
        </CardFooter>
      </>
    ),
  },
};

export const CardWithOnlyContent: Story = {
  args: {
    children: (
      <CardContent>
        <p className="text-center text-lg font-semibold">
          This card only has content.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          No header or footer sections.
        </p>
      </CardContent>
    ),
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <GuidelinesSection title="Usage Guidelines">
        <GuidelinesCard
          title="Do"
          variant="success"
          icon={<Check />}
          items={[
            'Use cards to <strong>group related content</strong> and create visual hierarchy.',
            'Choose appropriate <strong>variants</strong> based on content importance.',
            'Maintain consistent <strong>spacing and padding</strong> within cards.',
            'Use cards for content that benefits from visual separation.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Don\'t nest cards within cards unless necessary.',
            'Avoid using cards for simple text content that doesn\'t need grouping.',
            'Don\'t overuse elevated cards; reserve them for important content.',
          ]}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Ensure sufficient color contrast for all card variants.',
          'Use semantic HTML structure for better screen reader support.',
          'Provide clear focus indicators for interactive cards.',
          'Consider card layout in responsive designs.',
        ]}
      />
    </div>
  ),
};

export const InteractivePlayground: Story = {
  args: {
    variant: 'default',
    padding: 'md',
  },
  render: args => {
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Card Playground"
          subtitle="Experiment with different card configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Preview</h3>
            <Card variant={args.variant} padding={args.padding}>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>
                  This card demonstrates the current variant and padding configuration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Use the controls panel to experiment with different card styles and padding options.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Example Action</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Variant: {args.variant}</li>
                <li>Padding: {args.padding}</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Content organization</li>
                <li>• Dashboard widgets</li>
                <li>• Product displays</li>
                <li>• Information panels</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Examples:</h4>
              <div className="space-y-3">
                <Card variant="elevated" className="text-sm">
                  <CardContent className="p-3">
                    <CardTitle className="text-sm">Dashboard Widget</CardTitle>
                    <p className="text-xs text-gray-600">Important metrics display</p>
                  </CardContent>
                </Card>
                <Card variant="outline" className="text-sm">
                  <CardContent className="p-3">
                    <CardTitle className="text-sm">Secondary Info</CardTitle>
                    <p className="text-xs text-gray-600">Supporting content</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive card with configurable props. Use the controls to experiment with different card configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Card Documentation"
        subtitle="Comprehensive guide to using the Card component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use <code>variant</code> to control visual style: default, elevated, outline, ghost, interactive.
          </li>
          <li>
            Set <code>padding</code> to control internal spacing: none, sm, md, lg, xl.
          </li>
          <li>
            Combine <code>CardHeader</code>, <code>CardContent</code>, and <code>CardFooter</code> for structured layouts.
          </li>
          <li>
            Use elevated cards sparingly to maintain visual hierarchy.
          </li>
          <li>
            Ensure proper contrast and accessibility for all card variants.
          </li>
        </ul>
      </div>
    </div>
  ),
};
