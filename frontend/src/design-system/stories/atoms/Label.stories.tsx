import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label, Input } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Label> = {
  title: '2 - Atoms / Label',
  component: Label,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Label"
            subtitle="An accessible label component with support for required fields and different sizes."
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
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the label',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the label is disabled',
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
        title="Label Variants"
        subtitle="Different configurations and states of the Label component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Label</h4>
          <div className="space-y-2">
            <Label htmlFor="default">Default Label</Label>
            <Input id="default" placeholder="Default input" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Required Label</h4>
          <div className="space-y-2">
            <Label required htmlFor="required">Required Field</Label>
            <Input id="required" placeholder="Required input" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled Label</h4>
          <div className="space-y-2">
            <Label disabled htmlFor="disabled">Disabled Label</Label>
            <Input id="disabled" placeholder="Disabled input" disabled />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Small Size</h4>
          <div className="space-y-2">
            <Label size="sm" htmlFor="small">Small Label</Label>
            <Input id="small" size="sm" placeholder="Small input" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Medium Size</h4>
          <div className="space-y-2">
            <Label size="md" htmlFor="medium">Medium Label</Label>
            <Input id="medium" size="md" placeholder="Medium input" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Large Size</h4>
          <div className="space-y-2">
            <Label size="lg" htmlFor="large">Large Label</Label>
            <Input id="large" size="lg" placeholder="Large input" />
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
        title="Label Sizes"
        subtitle="Demonstrates different sizes for the Label component."
      />
      <div className="flex flex-col gap-4 w-80">
        <div>
          <Label size="sm" htmlFor="label-sm">
            Small Label
          </Label>
          <Input id="label-sm" placeholder="Small input" size="sm" />
        </div>
        <div>
          <Label size="md" htmlFor="label-md">
            Medium Label
          </Label>
          <Input id="label-md" placeholder="Medium input" size="md" />
        </div>
        <div>
          <Label size="lg" htmlFor="label-lg">
            Large Label
          </Label>
          <Input id="label-lg" placeholder="Large input" size="lg" />
        </div>
      </div>

      <SectionHeader
        title="Required Fields"
        subtitle="Illustrates how to mark fields as required using the Label component."
      />
      <div className="flex flex-col gap-4 w-80">
        <div>
          <Label required>Required Field</Label>
          <Input placeholder="This field is required" />
        </div>
        <div>
          <Label>Optional Field</Label>
          <Input placeholder="This field is optional" />
        </div>
      </div>

      <SectionHeader
        title="Labels with Form Fields"
        subtitle="Examples of Label components used in conjunction with various form input fields."
      />
      <div className="flex flex-col gap-4 w-80">
        <div>
          <Label required>Full Name</Label>
          <Input placeholder="Enter your full name" />
        </div>
        <div>
          <Label required>Email Address</Label>
          <Input type="email" placeholder="Enter your email" />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input type="tel" placeholder="Enter your phone number" />
        </div>
        <div>
          <Label required>Password</Label>
          <Input type="password" placeholder="Enter your password" />
        </div>
      </div>

      <SectionHeader
        title="Disabled Labels"
        subtitle="Demonstrates the disabled state for the Label component."
      />
      <div className="flex flex-col gap-4 w-80">
        <div>
          <Label disabled>Disabled Label</Label>
          <Input placeholder="Disabled input" disabled />
        </div>
        <div>
          <Label>Enabled Label</Label>
          <Input placeholder="Enabled input" />
        </div>
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
            'Place labels <strong>above</strong> inputs for better scanning.',
            'Indicate required fields with a clear <strong>*</strong> or text.',
            'Keep label text concise and specific.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={["Don’t rely on placeholder as the label.", 'Avoid vague labels like “Field”.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Use <code>htmlFor</code> to associate labels with inputs.',
          'Ensure labels remain visible when the field is focused or filled.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: 'Interactive Label',
    size: 'md',
  },
  render: args => {
    const id = 'email-interactive';
    return (
      <div className="w-80 space-y-2">
        <Label
          size={args.size}
          required={args.required}
          htmlFor={id}
          aria-disabled={args.disabled}
        >
          {args.children}
        </Label>
        <Input
          id={id}
          placeholder="name@example.com"
          disabled={args.disabled}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive label with configurable props. Use the controls to experiment with different sizes and states.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Label Documentation"
        subtitle="Comprehensive guide to using the Label component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Always associate a `Label` with its corresponding input field using
            the `htmlFor` prop.
          </li>
          <li>
            Use the `required` prop to visually indicate mandatory fields.
          </li>
          <li>
            Ensure labels are concise and clearly describe the input field's
            purpose.
          </li>
          <li>
            Consider the `size` prop to adjust the label's visual hierarchy
            within forms.
          </li>
        </ul>
      </div>
    </div>
  ),
};
