import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Radio> = {
  title: '2 - Atoms / Radio',
  component: Radio,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Radio"
            subtitle="A radio button component for single selection from a group of options."
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
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
      description: {
        component:
          'A radio button component for single selection from a group of options.',
      },
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
        title="Radio Variants"
        subtitle="Different radio button configurations and states."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Radio</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio value="default1" />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio value="default2" defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Size Variations</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio value="small" size="sm" />
              <span className="text-sm">Small</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio value="medium" size="md" />
              <span className="text-sm">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio value="large" size="lg" />
              <span className="text-sm">Large</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Variant</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio value="success1" variant="success" />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio value="success2" variant="success" defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Warning Variant</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio value="warning1" variant="warning" />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio value="warning2" variant="warning" defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Destructive Variant</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio value="destructive1" variant="destructive" />
              <span className="text-sm">Unchecked</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio value="destructive2" variant="destructive" defaultChecked />
              <span className="text-sm">Checked</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled States</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio value="disabled1" disabled />
              <span className="text-sm text-gray-400">Disabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio value="disabled2" disabled defaultChecked />
              <span className="text-sm text-gray-400">Disabled Checked</span>
            </div>
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
        title="Radio Button States and Variants"
        subtitle="Explore the different states and visual styles available for the Radio component."
      />
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">Default</h3>
          <Radio value="option1" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Checked</h3>
          <Radio value="option1" defaultChecked />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Small</h3>
          <Radio value="option1" size="sm" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Large</h3>
          <Radio value="option1" size="lg" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Success</h3>
          <Radio value="option1" variant="success" defaultChecked />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Warning</h3>
          <Radio value="option1" variant="warning" defaultChecked />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Destructive</h3>
          <Radio value="option1" variant="destructive" defaultChecked />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Disabled</h3>
          <Radio value="option1" disabled />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Disabled Checked</h3>
          <Radio value="option1" disabled defaultChecked />
        </div>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'option1',
  },
  render: args => {
    const [checked, setChecked] = React.useState(false);
    return (
      <>
        <SectionHeader
          title="Controlled Radio Button"
          subtitle="Demonstrates a controlled Radio component where its state is managed externally."
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Radio {...args} checked={checked} onCheckedChange={setChecked} />
            <span>Option 1</span>
          </label>
          <span className="text-sm text-muted-foreground">
            Checked: {checked ? 'Yes' : 'No'}
          </span>
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
            'Use radios for <strong>single</strong> selection within a set.',
            'Group radios with a clear legend or group label.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={['Don’t use radios when multiple choices are allowed (use checkboxes).']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Wrap a group with <code>fieldset</code> and <code>legend</code> for context.',
          'Ensure keyboard support: Arrow keys move, Space selects.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    value: 'interactive',
    size: 'md',
    variant: 'default',
    disabled: false,
  },
  render: args => {
    const [selectedValue, setSelectedValue] = React.useState('option1');

    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Radio"
          subtitle="Experiment with different radio configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Radio Button Preview</h3>
            <div className="flex items-center gap-2">
              <Radio {...args} />
              <span className="text-sm">Interactive Radio Button</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Radio Group Example</h4>
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-gray-700 mb-2">Select your preference:</legend>
                {[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <Radio
                      value={opt.value}
                      checked={selectedValue === opt.value}
                      onCheckedChange={() => setSelectedValue(opt.value)}
                      size={args.size}
                      variant={args.variant}
                      disabled={args.disabled}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </fieldset>
              <p className="text-sm text-gray-600 mt-3">
                Selected: <span className="font-medium">{selectedValue}</span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Size: {args.size}</li>
                <li>Variant: {args.variant}</li>
                <li>Disabled: {args.disabled ? 'Yes' : 'No'}</li>
                <li>Value: {args.value}</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Form selections</li>
                <li>• Settings preferences</li>
                <li>• Filter options</li>
                <li>• Single choice questions</li>
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
        story: 'Interactive radio button with configurable props. Use the controls to experiment with different radio configurations.',
      },
    },
  },
};

export const RadioGroup: Story = {
  args: {},
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState('option1');
    return (
      <>
        <SectionHeader
          title="Radio Group"
          subtitle="Example of multiple radio buttons used together in a group."
        />
        <fieldset className="flex flex-col gap-3 w-80">
          <legend className="text-sm font-medium text-muted-foreground">
            Pick an option
          </legend>
          {[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ].map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <Radio
                value={opt.value}
                checked={selectedValue === opt.value}
                onCheckedChange={() => setSelectedValue(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
          <p className="text-sm text-muted-foreground">
            Selected: {selectedValue}
          </p>
        </fieldset>
      </>
    );
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Radio Documentation"
        subtitle="Comprehensive guide to using the Radio component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use radio buttons when the user must select exactly one option from
            a limited set.
          </li>
          <li>
            Ensure each radio button in a group has a unique `value` and shares
            the same `name` (though `name` is handled internally by Radix UI).
          </li>
          <li>Provide clear labels for each radio option.</li>
          <li>
            Consider `size` and `variant` for visual consistency and to convey
            status.
          </li>
        </ul>
      </div>
    </div>
  ),
};
