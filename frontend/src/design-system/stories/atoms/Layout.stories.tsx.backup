import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Layout> = {
  title: '2 - Atoms / Layout',
  component: Layout,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Layout"
            subtitle="A foundational layout component for structuring content with flexible container, padding, and alignment options."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
      description: {
        component:
          'A foundational layout component for structuring content with flexible container, padding, and alignment options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    container: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    maxWidth: {
      control: 'select',
      options: ['prose', 'content', 'wide', 'full'],
    },
    centered: {
      control: 'boolean',
    },
    layout: {
      control: 'select',
      options: ['flex', 'grid', 'block', 'inline'],
    },
    flexDirection: {
      control: 'select',
      options: ['row', 'col', 'rowReverse', 'colReverse'],
    },
    flexJustify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    flexAlign: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    flexWrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'wrapReverse'],
    },
    gridColumns: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 12],
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================ // STORIES // ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Layout Variants"
        subtitle="Different layout configurations and container types."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Layout</h4>
          <Layout>
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-sm">Default container with no constraints</p>
            </div>
          </Layout>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Centered Layout</h4>
          <Layout container="lg" centered>
            <div className="bg-green-100 p-4 rounded">
              <p className="text-sm">Centered with large container</p>
            </div>
          </Layout>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Flex Layout</h4>
          <Layout layout="flex" gap={4}>
            <div className="bg-red-100 p-2 rounded text-xs">Item 1</div>
            <div className="bg-red-100 p-2 rounded text-xs">Item 2</div>
            <div className="bg-red-100 p-2 rounded text-xs">Item 3</div>
          </Layout>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Grid Layout</h4>
          <Layout layout="grid" gridColumns={2} gap={4}>
            <div className="bg-purple-100 p-2 rounded text-xs">Grid 1</div>
            <div className="bg-purple-100 p-2 rounded text-xs">Grid 2</div>
          </Layout>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Prose Layout</h4>
          <Layout maxWidth="prose" centered>
            <div className="bg-yellow-100 p-4 rounded">
              <p className="text-sm">Optimized for reading content</p>
            </div>
          </Layout>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Padded Layout</h4>
          <Layout padding="lg">
            <div className="bg-teal-100 p-4 rounded">
              <p className="text-sm">With large padding</p>
            </div>
          </Layout>
        </Card>
      </div>
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Basic Layout Usage"
        subtitle="Demonstrates the default behavior and basic container usage."
      />
      <Layout>
        <div className="bg-blue-100 p-4">
          <p>This is a basic layout container.</p>
        </div>
      </Layout>

      <SectionHeader
        title="Centered Layout"
        subtitle="Illustrates how to center content within the layout."
      />
      <Layout container="lg" centered>
        <div className="bg-green-100 p-4">
          <p>This layout is centered on the page.</p>
        </div>
      </Layout>

      <SectionHeader
        title="Flex Layout"
        subtitle="Examples of using flexbox properties for content arrangement."
      />
      <Layout layout="flex" gap={4}>
        <div className="bg-red-100 p-4">Flex Item 1</div>
        <div className="bg-red-100 p-4">Flex Item 2</div>
        <div className="bg-red-100 p-4">Flex Item 3</div>
      </Layout>

      <SectionHeader
        title="Grid Layout"
        subtitle="Examples of using grid properties for content arrangement."
      />
      <Layout layout="grid" gridColumns={3} gap={4}>
        <div className="bg-purple-100 p-4">Grid Item 1</div>
        <div className="bg-purple-100 p-4">Grid Item 2</div>
        <div className="bg-purple-100 p-4">Grid Item 3</div>
      </Layout>

      <SectionHeader
        title="Layout Padding"
        subtitle="Demonstrates custom padding around the content."
      />
      <Layout padding="lg">
        <div className="bg-yellow-100 p-4">
          <p>This layout has custom padding.</p>
        </div>
      </Layout>

      <SectionHeader
        title="Max Width Layout"
        subtitle="Illustrates how to set a maximum width for the content."
      />
      <Layout maxWidth="prose" centered>
        <div className="bg-teal-100 p-4">
          <p>This layout has a maximum width for prose content.</p>
        </div>
      </Layout>

      <SectionHeader
        title="Flex Direction"
        subtitle="Controls the direction of flex items."
      />
      <Layout layout="flex" flexDirection="col" gap={4}>
        <div className="bg-orange-100 p-4">Item 1</div>
        <div className="bg-orange-100 p-4">Item 2</div>
      </Layout>

      <SectionHeader
        title="Flex Justify"
        subtitle="Controls the alignment of flex items along the main axis."
      />
      <Layout layout="flex" flexJustify="between">
        <div className="bg-pink-100 p-4">Start</div>
        <div className="bg-pink-100 p-4">End</div>
      </Layout>

      <SectionHeader
        title="Flex Align"
        subtitle="Controls the alignment of flex items along the cross axis."
      />
      <Layout layout="flex" flexAlign="center">
        <div className="bg-cyan-100 p-4 h-16">Tall</div>
        <div className="bg-cyan-100 p-4">Short</div>
      </Layout>

      <SectionHeader
        title="Flex Wrap"
        subtitle="Controls whether flex items are forced onto one line or can wrap onto multiple lines."
      />
      <Layout layout="flex" flexWrap="wrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-lime-100 p-2 w-24">
            Item {i + 1}
          </div>
        ))}
      </Layout>
    </div>
  ),
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
            'Use consistent <strong>containers</strong> and spacing tokens for rhythm.',
            'Prefer <strong>grid/flex</strong> layout utilities for responsiveness.',
            'Use <strong>maxWidth</strong> and <strong>centered</strong> to improve readability.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={['Avoid mixing too many layout paradigms in one region.', 'Don’t create custom spacing outside tokens.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={['Ensure sufficient spacing for touch targets and readability.', 'Maintain logical source order for keyboard and screen readers.']}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    container: 'md',
    padding: 'md',
    centered: false,
    layout: 'block',
    maxWidth: 'full',
  },
  render: args => (
    <div className="space-y-8">
      <SectionHeader
        title="Interactive Layout"
        subtitle="Experiment with different layout configurations using the controls."
      />

      <Layout {...args}>
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Layout Container</h3>
          <p className="text-gray-700 mb-4">
            This layout container is controlled by the Storybook controls. Try changing the container size,
            padding, layout type, and other properties to see how they affect the layout.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm font-medium">Container: {args.container}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm font-medium">Padding: {args.padding}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm font-medium">Layout: {args.layout}</p>
            </div>
          </div>
        </div>
      </Layout>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Current Configuration:</h4>
        <pre className="text-sm text-gray-600 bg-white p-2 rounded border">
          {JSON.stringify(args, null, 2)}
        </pre>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive layout with configurable props. Use the controls to experiment with different layout configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Layout Documentation"
        subtitle="Comprehensive guide to using the Layout component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use `container` to constrain content width, and `centered` to center
            it on the page.
          </li>
          <li>
            Leverage `layout` prop with `flex` or `grid` to control the
            arrangement of child elements.
          </li>
          <li>
            Utilize `padding` and `maxWidth` for consistent spacing and
            readability.
          </li>
          <li>
            Combine `flexDirection`, `flexJustify`, `flexAlign`, and `flexWrap`
            for precise control over flexbox layouts.
          </li>
          <li>
            Use `gridColumns` and `gap` for responsive grid-based designs.
          </li>
        </ul>
      </div>
    </div>
  ),
};
