import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Text> = {
  title: '2 - Atoms / Text',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Text"
            subtitle="Typography component with variants, sizes, weights, alignment, and color options."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M10 6v12m-6 0h12"
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
    as: {
      control: 'select',
      options: [
        'p',
        'span',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'label',
      ],
      description: 'The HTML element to render',
    },
    variant: {
      control: 'select',
      options: [
        'body',
        'caption',
        'overline',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'headline',
        'subheadline',
        'title',
        'subtitle',
        'elegant',
        'code',
      ],
      description: 'The typography variant',
    },
    size: {
      control: 'select',
      options: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        '9xl',
      ],
      description: 'The font size',
    },
    weight: {
      control: 'select',
      options: [
        'thin',
        'extralight',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ],
      description: 'The font weight',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'muted',
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
      ],
      description: 'The text color',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'The text alignment',
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate the text',
    },
    fontFamily: {
      control: 'select',
      options: ['sans', 'serif', 'display', 'mono', 'elegant', 'modern'],
      description: 'The font family',
    },
    lineHeight: {
      control: 'select',
      options: [
        'none',
        'tight',
        'snug',
        'normal',
        'relaxed',
        'loose',
        'extra-loose',
      ],
      description: 'The line height',
    },
    letterSpacing: {
      control: 'select',
      options: [
        'tighter',
        'tight',
        'normal',
        'wide',
        'wider',
        'widest',
        'extra-wide',
      ],
      description: 'The letter spacing',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
  args: {
    children: 'This is a sample text component.',
  },
};

// Typography variants
export const Variants: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Typography Variants"
        subtitle="Showcases the different predefined typography variants for various semantic uses."
      />
      <div className="space-y-4">
        <Text variant="h1" size="4xl">
          Heading 1
        </Text>
        <Text variant="h2" size="3xl">
          Heading 2
        </Text>
        <Text variant="h3" size="2xl">
          Heading 3
        </Text>
        <Text variant="h4" size="xl">
          Heading 4
        </Text>
        <Text variant="h5" size="lg">
          Heading 5
        </Text>
        <Text variant="h6" size="md">
          Heading 6
        </Text>
        <Text variant="body" size="md">
          Body text with normal weight and size.
        </Text>
        <Text variant="caption" size="sm">
          Caption text for small details.
        </Text>
        <Text variant="overline" size="xs">
          OVERLINE TEXT FOR LABELS
        </Text>
        <Text variant="headline">Headline Example</Text>
        <Text variant="subheadline">Subheadline Example</Text>
        <Text variant="title">Title Example</Text>
        <Text variant="subtitle">Subtitle Example</Text>
        <Text variant="elegant">Elegant Example</Text>
        <Text variant="code">Code Example</Text>
      </div>
    </>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Text Sizes"
        subtitle="Demonstrates the various font sizes available for the Text component."
      />
      <div className="space-y-2">
        <Text size="xs">Extra Small Text (xs)</Text>
        <Text size="sm">Small Text (sm)</Text>
        <Text size="md">Medium Text (md)</Text>
        <Text size="lg">Large Text (lg)</Text>
        <Text size="xl">Extra Large Text (xl)</Text>
        <Text size="2xl">2XL Text (2xl)</Text>
        <Text size="3xl">3XL Text (3xl)</Text>
        <Text size="4xl">4XL Text (4xl)</Text>
        <Text size="5xl">5XL Text (5xl)</Text>
        <Text size="6xl">6XL Text (6xl)</Text>
        <Text size="7xl">7XL Text (7xl)</Text>
        <Text size="8xl">8XL Text (8xl)</Text>
        <Text size="9xl">9XL Text (9xl)</Text>
      </div>
    </>
  ),
};

// Weights
export const Weights: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Font Weights"
        subtitle="Illustrates the various font weights available for the Text component."
      />
      <div className="space-y-2">
        <Text weight="thin">Thin weight text</Text>
        <Text weight="extralight">Extralight weight text</Text>
        <Text weight="light">Light weight text</Text>
        <Text weight="normal">Normal weight text</Text>
        <Text weight="medium">Medium weight text</Text>
        <Text weight="semibold">Semibold weight text</Text>
        <Text weight="bold">Bold weight text</Text>
        <Text weight="extrabold">Extrabold weight text</Text>
        <Text weight="black">Black weight text</Text>
      </div>
    </>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Text Colors"
        subtitle="Displays the various color options for the Text component."
      />
      <div className="space-y-2">
        <Text color="default">Default color text</Text>
        <Text color="muted">Muted color text</Text>
        <Text color="primary">Primary color text</Text>
        <Text color="secondary">Secondary color text</Text>
        <Text color="destructive">Destructive color text</Text>
        <Text color="success">Success color text</Text>
        <Text color="warning">Warning color text</Text>
        <Text color="info">Info color text</Text>
      </div>
    </>
  ),
};

// Alignment
export const Alignment: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Text Alignment"
        subtitle="Demonstrates different text alignment options for the Text component."
      />
      <div className="space-y-4 w-full">
        <Text align="left">Left aligned text</Text>
        <Text align="center">Center aligned text</Text>
        <Text align="right">Right aligned text</Text>
        <Text align="justify">
          Justified text that spreads across the full width of the container.
          This demonstrates how text justification works in the component.
        </Text>
      </div>
    </>
  ),
};

// Font Families
export const FontFamilies: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Font Families"
        subtitle="Showcases the different font families available for the Text component."
      />
      <div className="space-y-2">
        <Text fontFamily="sans">Sans-serif Font Family</Text>
        <Text fontFamily="serif">Serif Font Family</Text>
        <Text fontFamily="display">Display Font Family</Text>
        <Text fontFamily="mono">Monospace Font Family</Text>
        <Text fontFamily="elegant">Elegant Font Family</Text>
        <Text fontFamily="modern">Modern Font Family</Text>
      </div>
    </>
  ),
};

// Line Heights
export const LineHeights: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Line Heights"
        subtitle="Demonstrates various line height options for improved readability."
      />
      <div className="space-y-2">
        <Text lineHeight="none">Line height: none</Text>
        <Text lineHeight="tight">Line height: tight</Text>
        <Text lineHeight="snug">Line height: snug</Text>
        <Text lineHeight="normal">Line height: normal</Text>
        <Text lineHeight="relaxed">Line height: relaxed</Text>
        <Text lineHeight="loose">Line height: loose</Text>
        <Text lineHeight="extra-loose">Line height: extra-loose</Text>
      </div>
    </>
  ),
};

// Letter Spacing
export const LetterSpacing: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Letter Spacing"
        subtitle="Illustrates different letter spacing options for typographic fine-tuning."
      />
      <div className="space-y-2">
        <Text letterSpacing="tighter">Letter spacing: tighter</Text>
        <Text letterSpacing="tight">Letter spacing: tight</Text>
        <Text letterSpacing="normal">Letter spacing: normal</Text>
        <Text letterSpacing="wide">Letter spacing: wide</Text>
        <Text letterSpacing="wider">Letter spacing: wider</Text>
        <Text letterSpacing="widest">Letter spacing: widest</Text>
        <Text letterSpacing="extra-wide">Letter spacing: extra-wide</Text>
      </div>
    </>
  ),
};

// Truncation
export const Truncation: Story = {
  render: () => (
    <>
      <SectionHeader
        title="Text Truncation"
        subtitle="Demonstrates how long text can be truncated to fit within a confined space."
      />
      <div className="space-y-2 w-64">
        <Text truncate>
          This is a very long text that will be truncated when it exceeds the
          container width.
        </Text>
        <Text>
          This is a very long text that will not be truncated and will wrap to
          multiple lines.
        </Text>
      </div>
    </>
  ),
};

// HTML elements
export const HTMLElements: Story = {
  render: () => (
    <>
      <SectionHeader
        title="HTML Elements"
        subtitle="Illustrates how the Text component can render different HTML semantic elements."
      />
      <div className="space-y-4">
        <Text as="h1" variant="h1" size="4xl">
          H1 Element
        </Text>
        <Text as="h2" variant="h2" size="3xl">
          H2 Element
        </Text>
        <Text as="h3" variant="h3" size="2xl">
          H3 Element
        </Text>
        <Text as="p" variant="body" size="md">
          Paragraph Element
        </Text>
        <Text as="span" variant="body" size="sm">
          Span Element
        </Text>
        <Text as="label" variant="body" size="sm">
          Label Element
        </Text>
      </div>
    </>
  ),
};

// Interactive
export const Interactive: Story = {
  args: {
    children: 'Interactive text component',
    variant: 'body',
    size: 'md',
    weight: 'normal',
    color: 'default',
    align: 'left',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive text component with configurable props. Use the controls to experiment with different variants, sizes, weights, and colors.',
      },
    },
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
            'Use the defined <strong>typography variants</strong> for hierarchy.',
            'Maintain logical <strong>heading order</strong> (h1 → h2 → h3...).',
            'Use <strong>muted</strong> color for secondary information.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={['Don’t skip heading levels for styling alone.', 'Avoid long line lengths; target ~60–80 characters per line.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Ensure sufficient color contrast for text (WCAG AA).',
          'Use semantic elements (<code>h1</code>–<code>h6</code>, <code>p</code>, <code>label</code>) for meaning, not just style.',
        ]}
      />
    </div>
  ),
};
