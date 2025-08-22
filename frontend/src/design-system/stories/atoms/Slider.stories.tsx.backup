import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Slider> = {
  title: '2 - Atoms / Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Slider"
            subtitle="Range slider with vertical/horizontal orientation, sizes, variants, and value display."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16M6 8v8m12-4v0"
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
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    showValue: {
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
        title="Slider Variants"
        subtitle="Different slider configurations and states."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Slider</h4>
          <div className="space-y-3">
            <Slider defaultValue={50} />
            <Slider defaultValue={75} showValue />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Size Variations</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Small:</p>
              <Slider defaultValue={60} size="sm" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Medium:</p>
              <Slider defaultValue={60} size="md" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Large:</p>
              <Slider defaultValue={60} size="lg" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Variant Colors</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Success:</p>
              <Slider defaultValue={80} variant="success" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Warning:</p>
              <Slider defaultValue={30} variant="warning" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Destructive:</p>
              <Slider defaultValue={20} variant="destructive" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Vertical Slider</h4>
          <div className="flex justify-center">
            <div style={{ height: '120px' }}>
              <Slider defaultValue={50} orientation="vertical" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Range Slider</h4>
          <div className="space-y-3">
            <Slider defaultValue={[25, 75]} showValue />
            <Slider defaultValue={[10, 90]} variant="success" showValue />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled State</h4>
          <div className="space-y-3">
            <Slider defaultValue={50} disabled />
            <Slider defaultValue={75} disabled showValue />
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    defaultValue: 50,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 75,
    showValue: true,
  },
};

export const Small: Story = {
  args: {
    defaultValue: 60,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    defaultValue: 40,
    size: 'lg',
  },
};

export const Success: Story = {
  args: {
    defaultValue: 80,
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    defaultValue: 30,
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    defaultValue: 20,
    variant: 'destructive',
  },
};

export const Vertical: Story = {
  args: {
    defaultValue: 50,
    orientation: 'vertical',
  },
  render: args => (
    <div style={{ height: '200px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: 50,
    disabled: true,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    showValue: true,
  },
};

export const CustomRange: Story = {
  args: {
    defaultValue: 5,
    min: 0,
    max: 10,
    step: 0.5,
    showValue: true,
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
            'Use sliders for <strong>approximate</strong> values and ranges.',
            'Show current value; allow fine-tuning with keyboard.',
            'Pick appropriate <code>step</code> and <code>min/max</code>.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={["Don’t use for precise numeric entry (use input).", 'Avoid tiny touch targets; ensure adequate size.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Support keyboard (Arrow/Page/Home/End).',
          'Expose <code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code>, and optional <code>aria-valuetext</code>.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    defaultValue: 50,
    size: 'md',
    variant: 'default',
    orientation: 'horizontal',
    showValue: true,
    disabled: false,
  },
  render: args => {
    const [value, setValue] = React.useState(args.defaultValue);

    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Slider"
          subtitle="Experiment with different slider configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Slider Preview</h3>
            <div className={args.orientation === 'vertical' ? 'flex justify-center' : ''}>
              <div style={args.orientation === 'vertical' ? { height: '120px' } : {}}>
                <Slider
                  {...args}
                  value={value}
                  onValueChange={setValue}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Value: {Array.isArray(value) ? value.join(' - ') : value}</li>
                <li>Size: {args.size}</li>
                <li>Variant: {args.variant}</li>
                <li>Orientation: {args.orientation}</li>
                <li>Show Value: {args.showValue ? 'Yes' : 'No'}</li>
                <li>Disabled: {args.disabled ? 'Yes' : 'No'}</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Volume controls</li>
                <li>• Brightness settings</li>
                <li>• Price range filters</li>
                <li>• Progress indicators</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Example:</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume Control</label>
                  <Slider defaultValue={75} size="sm" showValue />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <Slider defaultValue={[25, 75]} variant="success" showValue />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brightness</label>
                  <div className="flex justify-center">
                    <div style={{ height: '100px' }}>
                      <Slider defaultValue={60} orientation="vertical" />
                    </div>
                  </div>
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
        story: 'Interactive slider with configurable props. Use the controls to experiment with different slider configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Slider Documentation"
        subtitle="Comprehensive guide to using the Slider component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use <code>size</code> and <code>variant</code> to match the visual context.</li>
          <li>Set <code>min</code>, <code>max</code>, and <code>step</code> for the intended value range.</li>
          <li>Use <code>showValue</code> to display the current value for clarity.</li>
          <li>Support keyboard and screen reader accessibility.</li>
        </ul>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: 50,
  },
  render: args => {
    const [value, setValue] = React.useState(50);
    return (
      <>
        <SectionHeader
          title="Controlled Slider"
          subtitle="Demonstrates a controlled Slider component where its state is managed externally."
        />
        <div className="flex flex-col gap-4 w-80">
          <Slider {...args} value={value} onValueChange={setValue} showValue />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Value:</span>
            <span className="font-medium text-foreground">
              {Array.isArray(value) ? value.join(' - ') : value}
            </span>
          </div>
        </div>
      </>
    );
  },
};

export const Playground: Story = {
  args: {
    defaultValue: 40,
    size: 'md',
    variant: 'default',
    orientation: 'horizontal',
    showValue: true,
  },
  render: args => (
    <>
      <SectionHeader
        title="Slider Playground"
        subtitle="Interact with the controls to dynamically change the slider's properties."
      />
      <div className="flex flex-col gap-4 w-80">
        <Slider {...args} />
      </div>
    </>
  ),
};
