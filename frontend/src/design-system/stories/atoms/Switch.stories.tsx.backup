import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Switch> = {
  title: '2 - Atoms / Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Switch"
            subtitle="An accessible toggle switch supporting variants, sizes, controlled and uncontrolled states."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12a8 8 0 008-8m0 0a8 8 0 000 16m0-16a8 8 0 018 8"
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
      options: ['default', 'success', 'warning', 'destructive'],
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
        title="Switch Variants"
        subtitle="Different switch configurations and states."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Switch</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Size Variations</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch size="sm" />
              <span className="text-sm">Small</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch size="md" />
              <span className="text-sm">Medium</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch size="lg" />
              <span className="text-sm">Large</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Variant</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch variant="success" />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch variant="success" defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Warning Variant</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch variant="warning" />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch variant="warning" defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Destructive Variant</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch variant="destructive" />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch variant="destructive" defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled States</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch disabled />
              <span className="text-sm text-gray-400">Disabled</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch disabled defaultChecked />
              <span className="text-sm text-gray-400">Disabled Checked</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    defaultChecked: true,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    defaultChecked: true,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  args: {
    checked: true,
  },
  render: args => {
    const [checked, setChecked] = React.useState(false);
    return (
      <>
        <SectionHeader
          title="Controlled Switch"
          subtitle="Demonstrates a controlled Switch component where its state is managed externally."
        />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Switch {...args} checked={checked} onCheckedChange={setChecked} />
          <span>Checked: {checked ? 'Yes' : 'No'}</span>
        </div>
      </>
    );
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
            'Use switches for <strong>immediate</strong> on/off actions.',
            'Label should describe the target (e.g., “Notifications”).',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={['Don’t use switches for form submissions (use checkbox).', 'Avoid unclear negations like “Disable notifications”.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Use <code>role="switch"</code> semantics and <code>aria-checked</code>.',
          'Ensure keyboard toggle with Space; maintain visible focus.',
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
  },
  render: args => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Switch"
          subtitle="Experiment with different switch configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Switch Preview</h3>
            <div className="flex items-center gap-3">
              <Switch
                {...args}
                checked={checked}
                onCheckedChange={setChecked}
              />
              <span className="text-sm font-medium">
                {checked ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Size: {args.size}</li>
                <li>Variant: {args.variant}</li>
                <li>Disabled: {args.disabled ? 'Yes' : 'No'}</li>
                <li>State: {checked ? 'Checked' : 'Unchecked'}</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Feature toggles</li>
                <li>• Settings preferences</li>
                <li>• Notification controls</li>
                <li>• Dark mode toggle</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Example:</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Notifications</span>
                  <Switch size="sm" variant="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Push Notifications</span>
                  <Switch size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dark Mode</span>
                  <Switch size="sm" variant="default" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-save</span>
                  <Switch size="sm" variant="warning" />
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
        story: 'Interactive switch with configurable props. Use the controls to experiment with different switch configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Switch Documentation"
        subtitle="Comprehensive guide to using the Switch component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use <code>size</code> and <code>variant</code> to match the visual context.</li>
          <li>Switches are for immediate on/off actions, not form submissions.</li>
          <li>Label each switch clearly for accessibility.</li>
          <li>Support keyboard and screen reader accessibility.</li>
        </ul>
      </div>
    </div>
  ),
};
