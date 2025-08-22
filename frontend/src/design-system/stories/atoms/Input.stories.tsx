import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Input> = {
  title: 'Atoms / Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Input"
            subtitle="A flexible input component with validation states and helper text support."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
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
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The type of input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input has an error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The internal padding of the input',
    },
    margin: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The external margin of the input',
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
      description: 'The border radius of the input',
    },
    shadow: {
      control: 'select',
      options: [
        'none',
        'sm',
        'base',
        'md',
        'lg',
        'xl',
        '2xl',
        'inner',
        'card',
        'button',
        'modal',
        'dropdown',
        'hover',
        'active',
        'focus',
        'glow',
        'error',
        'success',
      ],
      description: 'The shadow elevation of the input',
    },
    layout: {
      control: 'select',
      options: ['flex', 'grid', 'block', 'inline'],
      description: 'The display layout of the input',
    },
    flexDirection: {
      control: 'select',
      options: ['row', 'col', 'rowReverse', 'colReverse'],
      description: 'Flex direction for flex layout',
    },
    flexJustify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Flex justify content for flex layout',
    },
    flexAlign: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Flex align items for flex layout',
    },
    gridColumns: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 12],
      description: 'Number of grid columns for grid layout',
    },
    gridGap: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid items for grid layout',
    },
    borderWidth: {
      control: 'select',
      options: ['none', 'thin', 'base', 'thick', 'extra'],
      description: 'Border width of the input',
    },
    motion: {
      control: 'select',
      options: ['none', 'fast', 'normal', 'slow', 'slower', 'slowest'],
      description: 'Motion duration for transitions',
    },
    transition: {
      control: 'select',
      options: [
        'none',
        'fast',
        'normal',
        'slow',
        'slower',
        'colors',
        'transform',
        'opacity',
        'shadow',
      ],
      description: 'Transition properties for animations',
    },
    elevation: {
      control: 'select',
      options: ['none', 'low', 'medium', 'high', 'overlay', 'modal', 'tooltip'],
      description: 'Z-index elevation of the input',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Input Variants"
        subtitle="Explore the different visual styles and states available for the Input component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="space-y-3">
            <Input placeholder="Enter text..." />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Standard input</p>
              <p className="text-gray-600">Basic text entry</p>
              <p className="text-xs font-mono text-gray-500 mt-1">type: text • size: md</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
          </div>
          <div className="space-y-3">
            <Input type="email" placeholder="Enter email..." />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Email input</p>
              <p className="text-gray-600">With validation</p>
              <p className="text-xs font-mono text-gray-500 mt-1">type: email • validation</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Password</h3>
          </div>
          <div className="space-y-3">
            <Input type="password" placeholder="Enter password..." />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Password input</p>
              <p className="text-gray-600">Secure entry</p>
              <p className="text-xs font-mono text-gray-500 mt-1">type: password • masked</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Error State</h3>
          </div>
          <div className="space-y-3">
            <Input 
              error 
              placeholder="Invalid input" 
              helperText="This field is required"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Error input</p>
              <p className="text-gray-600">With validation message</p>
              <p className="text-xs font-mono text-gray-500 mt-1">error: true • helperText</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Disabled</h3>
          </div>
          <div className="space-y-3">
            <Input disabled placeholder="Disabled input" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Disabled input</p>
              <p className="text-gray-600">Non-interactive</p>
              <p className="text-xs font-mono text-gray-500 mt-1">disabled: true</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">With Helper</h3>
          </div>
          <div className="space-y-3">
            <Input 
              placeholder="Username" 
              helperText="Must be at least 3 characters"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Helper text</p>
              <p className="text-gray-600">Guidance for users</p>
              <p className="text-xs font-mono text-gray-500 mt-1">helperText: string</p>
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
        title="Input Types"
        subtitle="Demonstrates various input types for different data entry needs."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input type="text" placeholder="Text input" />
        <Input type="email" placeholder="Email input" />
        <Input type="password" placeholder="Password input" />
        <Input type="number" placeholder="Number input" />
        <Input type="tel" placeholder="Phone input" />
        <Input type="url" placeholder="URL input" />
        <Input type="search" placeholder="Search input" />
      </div>

      <SectionHeader
        title="Input Sizes"
        subtitle="Adjust the size of the input field to fit different layouts and visual hierarchies."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input size="sm" placeholder="Small input" />
        <Input size="md" placeholder="Medium input" />
        <Input size="lg" placeholder="Large input" />
      </div>

      <SectionHeader
        title="Input States"
        subtitle="Showcases different states of the input field, including disabled, error, and success."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input placeholder="Default state" />
        <Input placeholder="Disabled state" disabled />
        <Input
          placeholder="Error state"
          error
          helperText="This field is required"
        />
        <Input placeholder="Success state" helperText="Input is valid" />
      </div>

      <SectionHeader
        title="Input with Helper Text"
        subtitle="Demonstrates how helper text can be used to provide additional information or validation messages."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input
          placeholder="Email address"
          helperText="We'll never share your email with anyone else."
        />
        <Input
          placeholder="Password"
          type="password"
          helperText="Must be at least 8 characters long"
        />
        <Input
          placeholder="Username"
          error
          helperText="Username is already taken"
        />
      </div>

      <SectionHeader
        title="Input Spacing"
        subtitle="Adjust the internal padding and external margin of the input field."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input padding="sm" placeholder="Small Padding" />
        <Input padding="md" placeholder="Medium Padding" />
        <Input padding="lg" placeholder="Large Padding" />
        <Input margin="sm" placeholder="Small Margin" />
        <Input margin="md" placeholder="Medium Margin" />
        <Input margin="lg" placeholder="Large Margin" />
      </div>

      <SectionHeader
        title="Input Border Radius"
        subtitle="Customize the roundness of the input field corners."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input borderRadius="none" placeholder="None" />
        <Input borderRadius="sm" placeholder="Small" />
        <Input borderRadius="md" placeholder="Medium" />
        <Input borderRadius="lg" placeholder="Large" />
        <Input borderRadius="full" placeholder="Full" />
      </div>

      <SectionHeader
        title="Input Shadow"
        subtitle="Apply different shadow elevations to the input field."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input shadow="none" placeholder="No Shadow" />
        <Input shadow="sm" placeholder="Small Shadow" />
        <Input shadow="md" placeholder="Medium Shadow" />
        <Input shadow="lg" placeholder="Large Shadow" />
        <Input shadow="glow" placeholder="Glow Shadow" />
      </div>

      <SectionHeader
        title="Input Layout"
        subtitle="Demonstrates how the input field can be arranged using different layout properties."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input
          layout="flex"
          flexDirection="row"
          flexJustify="center"
          placeholder="Flex Layout"
        />
        <Input
          layout="grid"
          gridColumns={2}
          gridGap="sm"
          placeholder="Grid Layout"
        />
        <Input layout="block" placeholder="Block Layout" />
      </div>

      <SectionHeader
        title="Input Motion"
        subtitle="Showcases motion and transition effects on the input field."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input
          motion="normal"
          className="hover:scale-105 transition-transform"
          placeholder="Hover Me"
        />
        <Input
          motion="slow"
          className="hover:opacity-75 transition-opacity"
          placeholder="Fade Me"
        />
      </div>

      <SectionHeader
        title="Input Elevation"
        subtitle="Control the z-index and visual elevation of the input field."
      />
      <div className="flex flex-col gap-4 w-80">
        <Input elevation="low" placeholder="Low Elevation" />
        <Input elevation="medium" placeholder="Medium Elevation" />
        <Input elevation="high" placeholder="High Elevation" />
        <Input elevation="modal" placeholder="Modal Elevation" />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive input with configurable props. Use the controls to experiment with different types, sizes, and states.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Input Documentation"
        subtitle="Comprehensive guide to using the Input component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Always use a descriptive `placeholder` to guide user input.</li>
          <li>
            Utilize `type` attribute for semantic input and browser-level
            validation (e.g., `email`, `number`, `password`).
          </li>
          <li>
            Provide clear `helperText` for instructions or validation messages.
          </li>
          <li>Implement `error` state to visually indicate invalid input.</li>
          <li>
            Consider `disabled` state when input is not applicable or
            temporarily unavailable.
          </li>
        </ul>
      </div>
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
            'Always pair inputs with a clear <strong>label</strong>.',
            'Provide <strong>helper text</strong> and <strong>error</strong> messages when needed.',
            'Use appropriate <code>type</code> (email, number, search, etc.).',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={["Don’t use placeholder as a label.", 'Avoid ambiguous validation without guidance.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Link label and input via <code>htmlFor</code>/<code>id</code>.',
          'Mark invalid state with <code>aria-invalid</code> and reference helper text using <code>aria-describedby</code>.',
          'Ensure sufficient color contrast for borders and text.',
        ]}
      />
    </div>
  ),
};
