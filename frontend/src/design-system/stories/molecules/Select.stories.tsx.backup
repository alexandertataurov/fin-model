import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../../molecules/Select/Select';
import { Icon } from '../../atoms';
import { User, Mail, Settings, Check, AlertTriangle, ChevronDown } from 'lucide-react';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Select> = {
  title: 'Molecules / Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: Select"
            subtitle="A customizable select component for single value selection with comprehensive styling options."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
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
    value: {
      control: 'text',
      description: 'The currently selected value.',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when the selected value changes.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled.',
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
        title="Select Variants"
        subtitle="Different select configurations and use cases."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Select</h4>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">With Icons</h4>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profile">
                <Icon name="User" size="sm" className="mr-2" /> Profile
              </SelectItem>
              <SelectItem value="email">
                <Icon name="Mail" size="sm" className="mr-2" /> Email
              </SelectItem>
              <SelectItem value="settings">
                <Icon name="Settings" size="sm" className="mr-2" /> Settings
              </SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">With Groups</h4>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="carrot">Carrot</SelectItem>
                <SelectItem value="broccoli">Broccoli</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Small Size</h4>
          <Select>
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue placeholder="Small size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Large Size</h4>
          <Select>
            <SelectTrigger size="lg" className="w-[200px]">
              <SelectValue placeholder="Large size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled</h4>
          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Disabled select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    );
  },
  args: {},
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
            'Use selects for <strong>single value selection</strong> from a list of options.',
            'Provide clear, descriptive <strong>placeholder text</strong>.',
            'Group related options using <strong>SelectGroup</strong> and <strong>SelectLabel</strong>.',
            'Use icons to enhance visual recognition when appropriate.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Don\'t use selects for multiple selections (use checkboxes or multi-select).',
            'Avoid too many options in a single select (max 10-15 recommended).',
            'Don\'t use selects for navigation (use buttons or links).',
          ]}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Ensure proper ARIA labels and roles for screen readers.',
          'Provide keyboard navigation support (arrow keys, Enter, Escape).',
          'Use clear, descriptive option labels.',
          'Test with screen readers and keyboard-only navigation.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    disabled: false,
  },
  render: args => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Select"
          subtitle="Experiment with different select configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Preview</h3>
            <Select value={value} onValueChange={setValue} disabled={args.disabled}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Vegetables</SelectLabel>
                  <SelectItem value="carrot">Carrot</SelectItem>
                  <SelectItem value="broccoli">Broccoli</SelectItem>
                  <SelectItem value="spinach">Spinach</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Disabled: {args.disabled ? 'Yes' : 'No'}</li>
                <li>Selected Value: {value || 'None'}</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Form inputs</li>
                <li>• Filter controls</li>
                <li>• Settings panels</li>
                <li>• Data selection</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Examples:</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Country Selection:</p>
                  <Select>
                    <SelectTrigger size="sm" className="w-[150px]">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Category Filter:</p>
                  <Select>
                    <SelectTrigger size="sm" className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                    </SelectContent>
                  </Select>
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
        story: 'Interactive select with configurable props. Use the controls to experiment with different select configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Select Documentation"
        subtitle="Comprehensive guide to using the Select component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use <code>SelectTrigger</code> to define the trigger element and <code>SelectValue</code> to display the selected value.
          </li>
          <li>
            Wrap options in <code>SelectContent</code> and use <code>SelectItem</code> for individual options.
          </li>
          <li>
            Use <code>SelectGroup</code> and <code>SelectLabel</code> to organize related options.
          </li>
          <li>
            Set <code>disabled</code> prop to disable the select component.
          </li>
          <li>
            Provide clear placeholder text and ensure proper keyboard navigation support.
          </li>
        </ul>
      </div>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: args => {
    const [value, setValue] = useState('banana');
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    );
  },
  args: {},
};

export const Disabled: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );
  },
  args: {
    disabled: true,
  },
};

export const WithIcons: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="profile">
            <Icon name="User" size="sm" className="mr-2" /> Profile
          </SelectItem>
          <SelectItem value="email">
            <Icon name="Mail" size="sm" className="mr-2" /> Email
          </SelectItem>
          <SelectItem value="settings">
            <Icon name="Settings" size="sm" className="mr-2" /> Settings
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
  args: {},
};

export const WithGroupsAndSeparators: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">Carrot</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="spinach" disabled>
              Spinach (Disabled)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
  args: {},
};

export const SmallSize: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger size="sm" className="w-[150px]">
          <SelectValue placeholder="Small size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
  },
  args: {},
};

export const LargeSize: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger size="lg" className="w-[200px]">
          <SelectValue placeholder="Large size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
  },
  args: {},
};
