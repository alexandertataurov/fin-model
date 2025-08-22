import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Progress> = {
  title: '2 - Atoms / Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Progress"
            subtitle="A visual indicator of progress for tasks, uploads, or loading states."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
      description: {
        component:
          'A visual indicator of progress for tasks, uploads, or loading states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'destructive'],
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
        title="Progress Variants"
        subtitle="Different progress bar configurations and states."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Progress</h4>
          <div className="space-y-3">
            <Progress value={25} />
            <Progress value={50} />
            <Progress value={75} />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Progress</h4>
          <div className="space-y-3">
            <Progress value={25} variant="success" />
            <Progress value={50} variant="success" />
            <Progress value={75} variant="success" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Warning Progress</h4>
          <div className="space-y-3">
            <Progress value={25} variant="warning" />
            <Progress value={50} variant="warning" />
            <Progress value={75} variant="warning" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Destructive Progress</h4>
          <div className="space-y-3">
            <Progress value={25} variant="destructive" />
            <Progress value={50} variant="destructive" />
            <Progress value={75} variant="destructive" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">With Values</h4>
          <div className="space-y-3">
            <Progress value={25} showValue />
            <Progress value={50} showValue />
            <Progress value={75} showValue />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Complete State</h4>
          <div className="space-y-3">
            <Progress value={100} variant="success" showValue />
            <Progress value={0} showValue />
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Progress Variants and Sizes"
        subtitle="Explore different visual styles and sizes for the Progress component."
      />
      <div className="flex flex-col gap-4 w-80">
        <div>
          <h3 className="text-lg font-semibold mb-2">Default</h3>
          <Progress value={50} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Small</h3>
          <Progress value={75} size="sm" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Large</h3>
          <Progress value={25} size="lg" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">With Value</h3>
          <Progress value={60} showValue />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Success</h3>
          <Progress value={90} variant="success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Warning</h3>
          <Progress value={45} variant="warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Destructive</h3>
          <Progress value={20} variant="destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Complete</h3>
          <Progress value={100} variant="success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Empty</h3>
          <Progress value={0} />
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    value: 33,
    size: 'md',
    variant: 'default',
    showValue: true,
  },
  render: args => {
    const [value, setValue] = React.useState(args.value ?? 33);
    return (
      <>
        <SectionHeader
          title="Progress Playground"
          subtitle="Interact with the slider to dynamically change the progress value."
        />
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground w-10 text-right">
              {value}%
            </span>
          </div>
          <Progress {...args} value={value} />
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
            'Use <strong>determinate</strong> progress when the total work is known.',
            'Use <strong>indeterminate</strong> when timing is unknown.',
            'Display value as <strong>%</strong> when helpful.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={["Don’t animate indefinitely without context.", 'Avoid tiny bars that are hard to perceive.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Use <code>role="progressbar"</code> with <code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code>.',
          'Announce completion state to screen readers where appropriate.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    value: 50,
    size: 'md',
    variant: 'default',
    showValue: true,
  },
  render: args => {
    const [value, setValue] = React.useState(args.value ?? 50);

    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Progress"
          subtitle="Experiment with different progress configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Bar Preview</h3>
            <Progress {...args} value={value} />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Progress Value: {value}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Value: {value}%</li>
                <li>Size: {args.size}</li>
                <li>Variant: {args.variant}</li>
                <li>Show Value: {args.showValue ? 'Yes' : 'No'}</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• File uploads</li>
                <li>• Data processing</li>
                <li>• Form completion</li>
                <li>• Loading states</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive progress bar with configurable props. Use the controls and slider to experiment with different progress configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Progress Documentation"
        subtitle="Comprehensive guide to using the Progress component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use `value` to control the current progress, ranging from 0 to 100.
          </li>
          <li>
            Choose `size` and `variant` to match the visual context of the
            application.
          </li>
          <li>
            Consider `showValue` to display the numerical progress directly on
            the bar.
          </li>
          <li>
            Ensure that progress updates are smooth and provide clear feedback
            to the user.
          </li>
        </ul>
      </div>
    </div>
  ),
};
