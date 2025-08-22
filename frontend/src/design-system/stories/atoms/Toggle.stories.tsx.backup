import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../../atoms';
import { Bold, Italic, Underline } from 'lucide-react';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Toggle> = {
  title: '2 - Atoms / Toggle',
  component: Toggle,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Toggle"
            subtitle="Single-state toggle button with variants, sizes, and icon support."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12h16m-8-8v16"
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
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'success', 'warning', 'destructive'],
    },
    disabled: {
      control: { type: 'boolean' },
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
        title="Toggle Variants"
        subtitle="Different toggle configurations and states."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Toggle</h4>
          <div className="space-y-3">
            <Toggle>Toggle</Toggle>
            <Toggle defaultPressed>Pressed</Toggle>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Icon Toggles</h4>
          <div className="space-y-3">
            <Toggle>
              <Bold />
            </Toggle>
            <Toggle defaultPressed>
              <Italic />
            </Toggle>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Size Variations</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Small:</p>
              <Toggle size="sm">
                <Bold />
              </Toggle>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Medium:</p>
              <Toggle size="md">
                <Bold />
              </Toggle>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Large:</p>
              <Toggle size="lg">
                <Bold />
              </Toggle>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Outline Variant</h4>
          <div className="space-y-3">
            <Toggle variant="outline">Outline</Toggle>
            <Toggle variant="outline" defaultPressed>Pressed</Toggle>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Color Variants</h4>
          <div className="space-y-3">
            <Toggle variant="success">Success</Toggle>
            <Toggle variant="warning">Warning</Toggle>
            <Toggle variant="destructive">Destructive</Toggle>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled States</h4>
          <div className="space-y-3">
            <Toggle disabled>Disabled</Toggle>
            <Toggle disabled defaultPressed>Disabled Pressed</Toggle>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: 'Toggle',
  },
};

export const WithIcon: Story = {
  args: {
    children: <Bold />,
  },
};

export const WithIconAndText: Story = {
  args: {
    children: (
      <>
        <Bold />
        Bold
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: <Bold />,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <Bold />
        Bold
      </>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
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
            'Use toggles for <strong>quick</strong> on/off formatting or modes.',
            'Include clear labels or tooltips for icon-only toggles.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={['Don’t use toggles for mutually exclusive options (use radios).']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Ensure toggles are keyboard operable and have visible focus.',
          'Provide text alternative for icon-only states via <code>aria-label</code>.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    size: 'md',
    variant: 'default',
    disabled: false,
    children: 'Toggle',
  },
  render: args => {
    const [pressed, setPressed] = React.useState(false);

    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Toggle"
          subtitle="Experiment with different toggle configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Toggle Preview</h3>
            <Toggle
              {...args}
              pressed={pressed}
              onPressedChange={setPressed}
            />
            <p className="text-sm text-gray-600 mt-2">
              State: {pressed ? 'Pressed' : 'Unpressed'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Size: {args.size}</li>
                <li>Variant: {args.variant}</li>
                <li>Disabled: {args.disabled ? 'Yes' : 'No'}</li>
                <li>State: {pressed ? 'Pressed' : 'Unpressed'}</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Text formatting (bold, italic)</li>
                <li>• View mode toggles</li>
                <li>• Filter activations</li>
                <li>• Quick actions</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Example:</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Formatting:</span>
                  <Toggle size="sm" variant="outline">
                    <Bold />
                  </Toggle>
                  <Toggle size="sm" variant="outline">
                    <Italic />
                  </Toggle>
                  <Toggle size="sm" variant="outline">
                    <Underline />
                  </Toggle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">View:</span>
                  <Toggle size="sm" variant="default">Grid</Toggle>
                  <Toggle size="sm" variant="default">List</Toggle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Filters:</span>
                  <Toggle size="sm" variant="success">Active</Toggle>
                  <Toggle size="sm" variant="warning">Pending</Toggle>
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
        story: 'Interactive toggle with configurable props. Use the controls to experiment with different toggle configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Toggle Documentation"
        subtitle="Comprehensive guide to using the Toggle component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use <code>size</code> and <code>variant</code> to match the visual context.</li>
          <li>Use toggles for quick on/off formatting or mode switches.</li>
          <li>Provide accessible labels or tooltips for icon-only toggles.</li>
          <li>Support keyboard and screen reader accessibility.</li>
        </ul>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const Pressed: Story = {
  args: {
    defaultPressed: true,
    children: 'Pressed',
  },
};

export const Controlled: Story = {
  args: {
    children: 'Controlled',
  },
  render: args => {
    const [pressed, setPressed] = React.useState(false);
    return (
      <>
        <SectionHeader
          title="Controlled Toggle"
          subtitle="Demonstrates a controlled Toggle component where its state is managed externally."
        />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Toggle {...args} pressed={pressed} onPressedChange={setPressed} />
          <span>Pressed: {pressed ? 'Yes' : 'No'}</span>
        </div>
      </>
    );
  },
};

export const ToggleGroup: Story = {
  args: {},
  render: () => {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(false);
    const [underline, setUnderline] = React.useState(false);

    return (
      <>
        <SectionHeader
          title="Toggle Group"
          subtitle="Example of multiple Toggle components used together in a group."
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Toggle pressed={bold} onPressedChange={setBold}>
            <Bold />
          </Toggle>
          <Toggle pressed={italic} onPressedChange={setItalic}>
            <Italic />
          </Toggle>
          <Toggle pressed={underline} onPressedChange={setUnderline}>
            <Underline />
          </Toggle>
        </div>
      </>
    );
  },
};
