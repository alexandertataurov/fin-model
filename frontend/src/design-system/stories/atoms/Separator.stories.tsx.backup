import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '../../atoms';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Separator> = {
  title: '2 - Atoms / Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Separator"
            subtitle="A visually and semantically meaningful separator to distinguish content."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
      description: {
        component:
          'A visually and semantically meaningful separator to distinguish content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    decorative: {
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
        title="Separator Variants"
        subtitle="Different separator configurations and orientations."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Horizontal Separator</h4>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Content above</p>
            <Separator orientation="horizontal" decorative={false} />
            <p className="text-sm text-gray-600">Content below</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Decorative Horizontal</h4>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Content above</p>
            <Separator orientation="horizontal" decorative={true} />
            <p className="text-sm text-gray-600">Content below</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Vertical Separator</h4>
          <div className="flex items-center gap-3 h-20">
            <span className="text-sm text-gray-600">Left</span>
            <Separator orientation="vertical" decorative={false} />
            <span className="text-sm text-gray-600">Right</span>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Decorative Vertical</h4>
          <div className="flex items-center gap-3 h-20">
            <span className="text-sm text-gray-600">Left</span>
            <Separator orientation="vertical" decorative={true} />
            <span className="text-sm text-gray-600">Right</span>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Navigation Separator</h4>
          <div className="flex items-center gap-3">
            <span className="text-sm">Home</span>
            <Separator orientation="vertical" decorative={true} />
            <span className="text-sm">About</span>
            <Separator orientation="vertical" decorative={true} />
            <span className="text-sm">Contact</span>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Section Separator</h4>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm">Section 1 content</p>
            </div>
            <Separator orientation="horizontal" decorative={false} />
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm">Section 2 content</p>
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
        title="Separator Orientations"
        subtitle="Demonstrates horizontal and vertical orientations of the Separator component."
      />
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Default (Horizontal)</h3>
          <div style={{ width: '300px' }}>
            <p>Content above</p>
            <Separator orientation="horizontal" decorative={false} />
            <p>Content below</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Horizontal Decorative</h3>
          <div style={{ width: '300px' }}>
            <p>Content above</p>
            <Separator orientation="horizontal" decorative={true} />
            <p>Content below</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Vertical</h3>
          <div
            style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span>Content Left</span>
            <Separator orientation="vertical" decorative={false} />
            <span>Content Right</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Decorative Vertical</h3>
          <div
            style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span>Content Left</span>
            <Separator orientation="vertical" decorative={true} />
            <span>Content Right</span>
          </div>
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
            'Use horizontal separators to group content <strong>within a section</strong>.',
            'Use vertical separators between <strong>inline</strong> items.',
            'Set <strong>decorative</strong> to true for purely visual separators.',
            'Use semantic separators for content that needs screen reader context.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Don\'t overuse separators; favor whitespace when possible.',
            'Don\'t use separators as the only visual hierarchy.',
            'Avoid decorative separators in high-contrast situations.',
          ]}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'If purely decorative, set <code>decorative</code> to true.',
          'Otherwise, expose semantics (role="separator").',
          'Ensure sufficient contrast for visual separators.',
          'Use semantic separators for content that needs screen reader context.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    orientation: 'horizontal',
    decorative: false,
  },
  render: args => {
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Separator"
          subtitle="Experiment with different separator configurations using the controls."
        />
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Separator Preview</h3>
            <div className={args.orientation === 'vertical' ? 'flex items-center gap-3 h-20' : 'space-y-3'}>
              <span className="text-sm text-gray-600">Content before</span>
              <Separator {...args} />
              <span className="text-sm text-gray-600">Content after</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Orientation: {args.orientation}</li>
                <li>Decorative: {args.decorative ? 'Yes' : 'No'}</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Navigation breadcrumbs</li>
                <li>• Content sections</li>
                <li>• Form field groups</li>
                <li>• Menu items</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Example:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Settings</span>
                  <Separator orientation="vertical" decorative={true} />
                  <span className="text-sm">Profile</span>
                  <Separator orientation="vertical" decorative={true} />
                  <span className="text-sm">Security</span>
                </div>
                <Separator orientation="horizontal" decorative={false} />
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm">Settings content area</p>
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
        story: 'Interactive separator with configurable props. Use the controls to experiment with different separator configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Separator Documentation"
        subtitle="Comprehensive guide to using the Separator component."
      />
      <GuidelinesSection title="Usage Guidelines">
        <GuidelinesCard
          title="Do"
          variant="success"
          icon={<Check />}
          items={[
            'Use horizontal separators to group content <strong>within a section</strong>.',
            'Use vertical separators between <strong>inline</strong> items.',
          ]}
        />
        <GuidelinesCard
          title="Don’t"
          variant="warning"
          icon={<AlertTriangle />}
          items={['Don’t overuse separators; favor whitespace when possible.']}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'If purely decorative, set <code>decorative</code> to true.',
          'Otherwise, expose semantics (role="separator").',
        ]}
      />
    </div>
  ),
};
