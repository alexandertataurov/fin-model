import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../molecules/Accordion/Accordion';
import { accordionVariants } from '../../molecules/Accordion/Accordion.variants';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, ChevronDown } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Accordion> = {
  title: 'Molecules / Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: Accordion"
            subtitle="A collapsible accordion component that supports single and multiple selection modes with smooth animations."
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
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether to allow single or multiple items to be open',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the accordion items can be collapsed',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when the open items change',
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
        title="Accordion Variants"
        subtitle="Different accordion configurations and selection modes."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Single Selection</h4>
          <Accordion type="single" collapsible={false}>
            <AccordionItem value="item-1">
              <AccordionTrigger>What is React?</AccordionTrigger>
              <AccordionContent>
                React is a JavaScript library for building user interfaces.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are Hooks?</AccordionTrigger>
              <AccordionContent>
                Hooks allow you to use state in functional components.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Multiple Selection</h4>
          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>Getting Started</AccordionTrigger>
              <AccordionContent>
                Learn the basics of React development.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Advanced Topics</AccordionTrigger>
              <AccordionContent>
                Explore advanced React concepts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Collapsible</h4>
          <Accordion type="single" collapsible={true}>
            <AccordionItem value="item-1">
              <AccordionTrigger>FAQ Section</AccordionTrigger>
              <AccordionContent>
                Frequently asked questions and answers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Help Topics</AccordionTrigger>
              <AccordionContent>
                Helpful resources and documentation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Nested Content</h4>
          <Accordion type="single">
            <AccordionItem value="item-1">
              <AccordionTrigger>Installation Guide</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Follow these steps to get started:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Install Node.js</li>
                    <li>Create a new project</li>
                    <li>Install dependencies</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">With Icons</h4>
          <Accordion type="single">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  Settings
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Configure your application settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Long Content</h4>
          <Accordion type="single">
            <AccordionItem value="item-1">
              <AccordionTrigger>Detailed Documentation</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>This is a longer content section that demonstrates how the accordion handles substantial amounts of text and complex layouts.</p>
                  <p>The accordion component automatically adjusts its height to accommodate the content while maintaining smooth animations.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  ),
};

// Basic Accordion
export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<string | string[]>('');

    return (
      <Accordion {...args} value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is React?</AccordionTrigger>
          <AccordionContent>
            React is a JavaScript library for building user interfaces. It lets
            you create reusable UI components and manage their state
            efficiently.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>What are React Hooks?</AccordionTrigger>
          <AccordionContent>
            React Hooks are functions that allow you to use state and other
            React features in functional components. They were introduced in
            React 16.8.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>What is JSX?</AccordionTrigger>
          <AccordionContent>
            JSX is a syntax extension for JavaScript that allows you to write
            HTML-like code in your JavaScript files. It makes it easier to
            create React elements.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
  args: {
    type: 'single',
    collapsible: false,
  },
};

// Multiple Selection Accordion
export const Multiple: Story = {
  render: args => {
    const [value, setValue] = useState<string | string[]>([]);

    return (
      <Accordion {...args} value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Getting Started</AccordionTrigger>
          <AccordionContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <p>Learn the basics of React development:</p>
              <ul style={{ marginLeft: '16px' }}>
                <li>Setting up your development environment</li>
                <li>Creating your first component</li>
                <li>Understanding props and state</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Advanced Concepts</AccordionTrigger>
          <AccordionContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <p>Dive deeper into React concepts:</p>
              <ul style={{ marginLeft: '16px' }}>
                <li>Context API and state management</li>
                <li>Performance optimization</li>
                <li>Testing strategies</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Best Practices</AccordionTrigger>
          <AccordionContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <p>Follow React best practices:</p>
              <ul style={{ marginLeft: '16px' }}>
                <li>Component composition patterns</li>
                <li>Error boundaries</li>
                <li>Code splitting and lazy loading</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
  args: {
    type: 'multiple',
    collapsible: true,
  },
};

// Collapsible Accordion
export const Collapsible: Story = {
  render: args => {
    const [value, setValue] = useState<string | string[]>('');

    return (
      <Accordion {...args} value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Collapsible Item 1</AccordionTrigger>
          <AccordionContent>
            This item can be collapsed by clicking on it again when it's open.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Collapsible Item 2</AccordionTrigger>
          <AccordionContent>
            Another collapsible item with some content.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
  args: {
    type: 'single',
    collapsible: true,
  },
};

// Accordion with custom styling
export const CustomStyling: Story = {
  render: args => {
    const [value, setValue] = useState<string | string[]>('');

    return (
      <Accordion {...args} value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          >
            Custom Styled Item
          </AccordionTrigger>
          <AccordionContent>
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              This accordion item has custom styling applied to both the trigger
              and content.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger
            style={{
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          >
            Another Custom Item
          </AccordionTrigger>
          <AccordionContent>
            <div
              style={{
                backgroundColor: '#fefce8',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #fde68a',
              }}
            >
              Each item can have its own unique styling.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
  args: {
    type: 'single',
    collapsible: true,
  },
};

// Accordion with disabled items
export const WithDisabledItems: Story = {
  render: args => {
    const [value, setValue] = useState<string | string[]>('');

    return (
      <Accordion {...args} value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Enabled Item</AccordionTrigger>
          <AccordionContent>
            This item is enabled and can be opened/closed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger disabled>Disabled Item</AccordionTrigger>
          <AccordionContent>
            This content won't be visible because the trigger is disabled.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Another Enabled Item</AccordionTrigger>
          <AccordionContent>
            This item is also enabled and functional.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
  args: {
    type: 'single',
    collapsible: true,
  },
};

// Accordion with controlled state
export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState<string | string[]>(['item-1']);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '400px',
        }}
      >
        <Accordion {...args} value={value} onValueChange={setValue}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Controlled Item 1</AccordionTrigger>
            <AccordionContent>
              This item is controlled externally.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Controlled Item 2</AccordionTrigger>
            <AccordionContent>
              This item is also controlled externally.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Controlled Item 3</AccordionTrigger>
            <AccordionContent>
              This item is controlled externally as well.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Current open items:{' '}
          {Array.isArray(value) ? value.join(', ') : value || 'none'}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setValue(['item-1'])}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
            }}
          >
            Open Item 1
          </button>
          <button
            onClick={() => setValue(['item-2'])}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
            }}
          >
            Open Item 2
          </button>
          <button
            onClick={() => setValue([])}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
            }}
          >
            Close All
          </button>
        </div>
      </div>
    );
  },
  args: {
    type: 'single',
    collapsible: true,
  },
};

// Accordion with nested content
export const WithNestedContent: Story = {
  render: args => {
    const [value, setValue] = useState<string | string[]>('');

    return (
      <Accordion {...args} value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Complex Content Structure</AccordionTrigger>
          <AccordionContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  Section 1
                </h4>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  This is the first section of content with some detailed
                  information.
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '16px',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  Section 2
                </h4>
                <ul
                  style={{ margin: 0, paddingLeft: '16px', color: '#6b7280' }}
                >
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>
              </div>

              <div
                style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '16px',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  Section 3
                </h4>
                <div
                  style={{
                    backgroundColor: '#f3f4f6',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                  }}
                >
                  Code block or special content area
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Another Complex Item</AccordionTrigger>
          <AccordionContent>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <p>This item contains various types of content:</p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f0f9ff',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #bae6fd',
                  }}
                >
                  <strong>Left Column</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    Some content in the left column.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <strong>Right Column</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    Some content in the right column.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
  args: {
    type: 'single',
    collapsible: true,
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
            'Use accordions to organize <strong>related content</strong> into collapsible sections.',
            'Choose <strong>single</strong> selection for mutually exclusive content.',
            'Use <strong>multiple</strong> selection when users need to compare sections.',
            'Provide clear, descriptive trigger labels.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Don\'t use accordions for navigation (use tabs or menus).',
            'Avoid nesting accordions within accordions.',
            'Don\'t hide critical information in collapsed sections.',
          ]}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Use proper ARIA attributes for screen readers.',
          'Ensure keyboard navigation works with arrow keys.',
          'Provide clear focus indicators for interactive elements.',
          'Use semantic HTML structure for better accessibility.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: args => {
    const [value, setValue] = useState<string | string[]>([]);
    
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Accordion"
          subtitle="Experiment with different accordion configurations using the controls."
        />
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accordion Preview</h3>
            <Accordion {...args} value={value} onValueChange={setValue}>
              <AccordionItem value="item-1">
                <AccordionTrigger>Getting Started</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p>Learn the basics of React development:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Install Node.js and npm</li>
                      <li>Create a new React project</li>
                      <li>Understand component structure</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Advanced Concepts</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p>Explore advanced React patterns:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Custom hooks</li>
                      <li>Context API</li>
                      <li>Performance optimization</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Type: {args.type}</li>
                <li>Collapsible: {args.collapsible ? 'Yes' : 'No'}</li>
                <li>Open Items: {Array.isArray(value) ? value.join(', ') : value || 'none'}</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FAQ sections</li>
                <li>• Documentation</li>
                <li>• Settings panels</li>
                <li>• Content organization</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Controls:</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setValue(['item-1'])}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Open Item 1
                </button>
                <button
                  onClick={() => setValue(['item-2'])}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Open Item 2
                </button>
                <button
                  onClick={() => setValue([])}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Close All
                </button>
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
        story: 'Interactive accordion with configurable props. Use the controls to experiment with different accordion configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Accordion Documentation"
        subtitle="Comprehensive guide to using the Accordion component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use <code>type="single"</code> for mutually exclusive content sections.
          </li>
          <li>
            Use <code>type="multiple"</code> when users need to compare multiple sections.
          </li>
          <li>
            Set <code>collapsible={true}</code> to allow closing all sections.
          </li>
          <li>
            Provide clear, descriptive trigger labels for better accessibility.
          </li>
          <li>
            Use proper ARIA attributes and keyboard navigation support.
          </li>
        </ul>
      </div>
    </div>
  ),
};
