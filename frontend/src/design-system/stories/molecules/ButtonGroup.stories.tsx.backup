import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from '../../molecules/ButtonGroup/ButtonGroup';
import { Button } from '../../atoms/Button';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, Layers, ChevronDown } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Molecules / ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: ButtonGroup"
            subtitle="A component that groups related buttons together with consistent spacing and styling."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
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
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the button group.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the buttons in the group.',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual style of the button group.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire button group is disabled.',
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
        title="ButtonGroup Variants"
        subtitle="Different button group configurations and styling options."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Group</h4>
          <ButtonGroup>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Outline Group</h4>
          <ButtonGroup variant="outline">
            <Button variant="outline">Save</Button>
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Delete</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Ghost Group</h4>
          <ButtonGroup variant="ghost">
            <Button variant="ghost">View</Button>
            <Button variant="ghost">Download</Button>
            <Button variant="ghost">Share</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Vertical Group</h4>
          <ButtonGroup orientation="vertical">
            <Button>Top</Button>
            <Button>Middle</Button>
            <Button>Bottom</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Small Size</h4>
          <ButtonGroup size="sm">
            <Button size="sm">Small 1</Button>
            <Button size="sm">Small 2</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Large Size</h4>
          <ButtonGroup size="lg">
            <Button size="lg">Large 1</Button>
            <Button size="lg">Large 2</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled Group</h4>
          <ButtonGroup disabled>
            <Button>Action 1</Button>
            <Button>Action 2</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Mixed Variants</h4>
          <ButtonGroup>
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
          </ButtonGroup>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: (
      <>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Button variant="outline">Save</Button>
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Delete</Button>
      </>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: (
      <>
        <Button variant="ghost">View</Button>
        <Button variant="ghost">Download</Button>
        <Button variant="ghost">Share</Button>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    children: (
      <>
        <Button>Top</Button>
        <Button>Middle</Button>
        <Button>Bottom</Button>
      </>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: (
      <>
        <Button size="sm">Small 1</Button>
        <Button size="sm">Small 2</Button>
      </>
    ),
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <Button size="lg">Large 1</Button>
        <Button size="lg">Large 2</Button>
      </>
    ),
  },
};

export const DisabledGroup: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Button>Action 1</Button>
        <Button>Action 2</Button>
      </>
    ),
  },
};

export const MixedVariants: Story = {
  args: {
    children: (
      <>
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
      </>
    ),
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="ButtonGroup Guidelines"
        subtitle="Best practices and design principles for button group components."
      />

      <GuidelinesSection>
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Logical Grouping"
          description="Group related actions together to create clear action hierarchies and improve user workflow."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Consistent Styling"
          description="Use consistent button variants and sizes within a group to maintain visual harmony."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Accessibility"
          description="Ensure proper keyboard navigation and screen reader support for grouped buttons."
        />
        <GuidelinesCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          title="Action Hierarchy"
          description="Avoid mixing primary and destructive actions in the same group without clear visual separation."
        />
      </GuidelinesSection>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive ButtonGroup Examples"
        subtitle="Interactive button group patterns and real-world usage scenarios."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            File Actions
          </h4>
          <ButtonGroup>
            <Button>New</Button>
            <Button>Open</Button>
            <Button>Save</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ChevronDown className="w-5 h-5" />
            Navigation Controls
          </h4>
          <ButtonGroup orientation="vertical">
            <Button>Previous</Button>
            <Button>Next</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Operations</h4>
          <ButtonGroup variant="outline">
            <Button variant="outline">View</Button>
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Delete</Button>
          </ButtonGroup>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Toolbar Actions</h4>
          <ButtonGroup size="sm">
            <Button size="sm" variant="ghost">Bold</Button>
            <Button size="sm" variant="ghost">Italic</Button>
            <Button size="sm" variant="ghost">Underline</Button>
          </ButtonGroup>
        </Card>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="ButtonGroup Documentation"
        subtitle="Comprehensive documentation and usage examples for the ButtonGroup component."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Component Structure</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• ButtonGroup wrapper with orientation and styling props</p>
            <p>• Individual Button components as children</p>
            <p>• Consistent spacing and border radius handling</p>
            <p>• Support for all Button variants and sizes</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Props & Configuration</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• orientation: 'horizontal' | 'vertical'</p>
            <p>• size: 'sm' | 'md' | 'lg' (inherited by buttons)</p>
            <p>• variant: 'default' | 'outline' | 'ghost'</p>
            <p>• disabled: boolean (affects all buttons)</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Toolbar actions and controls</p>
            <p>• Form submission buttons</p>
            <p>• Navigation controls</p>
            <p>• Data operation buttons</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Group related actions logically</p>
            <p>• Use consistent styling within groups</p>
            <p>• Consider action hierarchy and importance</p>
            <p>• Test keyboard navigation thoroughly</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};
