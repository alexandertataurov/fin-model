import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Textarea> = {
  title: '2 - Atoms / Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Textarea"
            subtitle="Multi-line text input with variants, sizes, resize behavior, and validation states."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h10M4 14h14M4 18h8"
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
      options: ['default', 'filled', 'outline'],
      description: 'The visual variant of the textarea',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the textarea',
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'The resize behavior of the textarea',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is in an error state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is disabled',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the textarea',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message here...',
    rows: 4,
  },
};

export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your message here...',
    helperText: 'This is a helpful message below the textarea.',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter your message here...',
    error: true,
    helperText: 'This field is required.',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
    rows: 4,
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
            'Use for <strong>multi-line</strong> input like comments and descriptions.',
            'Enable appropriate <strong>resize</strong> behavior.',
            'Provide <strong>helper text</strong> and character guidance if needed.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={['Don’t use for short, single-value inputs.', 'Avoid unbounded growth; set sensible <strong>rows</strong> and max height.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Associate with a visible label; use <code>aria-describedby</code> for helper text.',
          'Preserve keyboard accessibility and visible focus.',
        ]}
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Textarea Variants"
        subtitle="Explore the different visual styles available for the Textarea component."
      />
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Default</h3>
          <Textarea placeholder="Default variant" rows={3} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Filled</h3>
          <Textarea variant="filled" placeholder="Filled variant" rows={3} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Outline</h3>
          <Textarea variant="outline" placeholder="Outline variant" rows={3} />
        </div>
      </div>
    </>
  ),
};

export const Sizes: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Textarea Sizes"
        subtitle="Adjust the size of the textarea to fit different layouts and content needs."
      />
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Small</h3>
          <Textarea size="sm" placeholder="Small textarea" rows={3} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Medium</h3>
          <Textarea size="md" placeholder="Medium textarea" rows={3} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Large</h3>
          <Textarea size="lg" placeholder="Large textarea" rows={3} />
        </div>
      </div>
    </>
  ),
};

export const ResizeOptions: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Textarea Resize Options"
        subtitle="Control how the textarea can be resized by the user."
      />
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">None</h3>
          <Textarea resize="none" placeholder="Cannot be resized" rows={3} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Vertical</h3>
          <Textarea
            resize="vertical"
            placeholder="Can be resized vertically"
            rows={3}
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Horizontal</h3>
          <Textarea
            resize="horizontal"
            placeholder="Can be resized horizontally"
            rows={3}
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Both</h3>
          <Textarea
            resize="both"
            placeholder="Can be resized in both directions"
            rows={3}
          />
        </div>
      </div>
    </>
  ),
};

export const WithValue: Story = {
  args: {
    defaultValue:
      'This is some pre-filled text in the textarea. It demonstrates how the component looks with content.',
    rows: 4,
  },
};

export const CharacterCount: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const maxLength = 500;
    const remaining = maxLength - value.length;

    return (
      <div className="space-y-2">
        <Textarea
          placeholder="Enter your message (max 500 characters)..."
          value={value}
          onChange={e => setValue(e.target.value)}
          maxLength={maxLength}
          rows={4}
        />
        <div className="text-sm text-muted-foreground">
          {remaining} characters remaining
        </div>
      </div>
    );
  },
};
