import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../atoms';
import { AnimatedBanner, SectionHeader, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Skeleton> = {
  title: '2 - Atoms / Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Skeleton"
            subtitle="Placeholder loading component for content previews with optional animation."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h10M4 18h7"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'circular', 'text', 'rectangular'],
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Show pulse animation',
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
        title="Skeleton Variants"
        subtitle="Different skeleton configurations and shapes."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Skeleton</h4>
          <div className="space-y-3">
            <Skeleton className="h-24 w-48" animated={true} />
            <Skeleton className="h-16 w-32" animated={true} />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Circular Skeleton</h4>
          <div className="space-y-3">
            <Skeleton variant="circular" className="h-16 w-16" animated={true} />
            <Skeleton variant="circular" className="h-12 w-12" animated={true} />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Text Skeleton</h4>
          <div className="space-y-3">
            <Skeleton variant="text" className="h-6 w-64" animated={true} />
            <Skeleton variant="text" className="h-4 w-48" animated={true} />
            <Skeleton variant="text" className="h-4 w-32" animated={true} />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Rectangular Skeleton</h4>
          <div className="space-y-3">
            <Skeleton variant="rectangular" className="h-32 w-64" animated={true} />
            <Skeleton variant="rectangular" className="h-20 w-40" animated={true} />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Animated vs Static</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Animated:</p>
              <Skeleton className="h-8 w-32" animated={true} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Static:</p>
              <Skeleton className="h-8 w-32" animated={false} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-10 w-10" animated={true} />
              <div className="space-y-2 flex-1">
                <Skeleton variant="text" className="h-4 w-24" animated={true} />
                <Skeleton variant="text" className="h-3 w-32" animated={true} />
              </div>
            </div>
            <Skeleton variant="rectangular" className="h-20 w-full" animated={true} />
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    animated: true,
    className: 'h-24 w-48',
  },
  render: args => {
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Skeleton"
          subtitle="Experiment with different skeleton configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skeleton Preview</h3>
            <Skeleton
              variant={args.variant}
              className={args.className}
              animated={args.animated}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Variant: {args.variant}</li>
                <li>Animated: {args.animated ? 'Yes' : 'No'}</li>
                <li>Size: {args.className}</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Content loading states</li>
                <li>• Image placeholders</li>
                <li>• Text content previews</li>
                <li>• Form field placeholders</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Example:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="h-10 w-10" animated={args.animated} />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="text" className="h-4 w-24" animated={args.animated} />
                    <Skeleton variant="text" className="h-3 w-32" animated={args.animated} />
                  </div>
                </div>
                <Skeleton variant="rectangular" className="h-16 w-full" animated={args.animated} />
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-full" animated={args.animated} />
                  <Skeleton variant="text" className="h-3 w-3/4" animated={args.animated} />
                </div>
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
        story: 'Interactive skeleton with configurable props. Use the controls to experiment with different skeleton configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Skeleton Documentation"
        subtitle="Comprehensive guide to using the Skeleton component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use skeletons to indicate <strong>loading</strong> content structure.
          </li>
          <li>
            Match skeleton shape and size to the <strong>final content</strong>.
          </li>
          <li>
            Use <code>animated</code> prop to control pulse animation.
          </li>
          <li>
            Choose appropriate <code>variant</code> for different content types.
          </li>
          <li>
            Set parent container <code>aria-busy="true"</code> while loading.
          </li>
        </ul>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    className: 'h-24 w-48',
    animated: true,
  },
  render: args => (
    <Skeleton
      variant={args.variant}
      className={`${args.className ?? ''} ${args.animated === false ? 'animate-none' : ''}`}
    />
  ),
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    className: 'h-24 w-24',
    animated: true,
  },
  render: args => (
    <Skeleton
      variant={args.variant}
      className={`${args.className ?? ''} ${args.animated === false ? 'animate-none' : ''}`}
    />
  ),
};

export const Text: Story = {
  args: {
    variant: 'text',
    className: 'h-6 w-64',
    animated: true,
  },
  render: args => (
    <Skeleton
      variant={args.variant}
      className={`${args.className ?? ''} ${args.animated === false ? 'animate-none' : ''}`}
    />
  ),
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    className: 'h-32 w-64',
    animated: true,
  },
  render: args => (
    <Skeleton
      variant={args.variant}
      className={`${args.className ?? ''} ${args.animated === false ? 'animate-none' : ''}`}
    />
  ),
};

export const Animated: Story = {
  args: {
    className: 'h-24 w-48',
    animated: true,
  },
  render: args => (
    <Skeleton
      className={`${args.className ?? ''} ${args.animated === false ? 'animate-none' : ''}`}
    />
  ),
};

export const Static: Story = {
  args: {
    className: 'h-24 w-48',
    animated: false,
  },
  render: args => (
    <Skeleton
      className={`${args.className ?? ''} ${args.animated === false ? 'animate-none' : ''}`}
    />
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
            'Use skeletons to indicate <strong>loading</strong> content structure.',
            'Match skeleton shape and size to the <strong>final content</strong>.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={["Don’t block interaction longer than necessary.", 'Avoid using skeletons for very short loads; consider spinners.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Set parent container <code>aria-busy="true"</code> while loading.',
          'Announce data loaded state to screen readers when ready.',
        ]}
      />
    </div>
  ),
};
