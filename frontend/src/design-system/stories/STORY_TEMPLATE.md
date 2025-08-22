# Standardized Story Template

## File Structure

```typescript
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../../path/to/component';
import {
  SectionHeader,
  AnimatedBanner,
  GuidelinesSection,
  GuidelinesCard,
  Card
} from '../components';
import { Check, AlertTriangle, IconName } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof ComponentName> = {
  title: 'Category / ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Category: ComponentName"
            subtitle="A sophisticated component for [purpose]. Perfect for [use case]."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="[SVG path]"
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
    // Component-specific props
  },
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
        title="ComponentName Variants"
        subtitle="Explore the different visual styles and states available for the ComponentName component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <IconName className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="space-y-3">
            <ComponentName />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Description</p>
              <p className="text-gray-600">Use case</p>
              <p className="text-xs font-mono text-gray-500 mt-1">props: values</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="ComponentName Sizes and Shapes"
        subtitle="Comprehensive demonstration of all available sizes and styling options."
      />
      {/* Size demonstrations */}
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Common Use Cases"
        subtitle="Real-world examples of ComponentName usage in typical UI patterns."
      />
      {/* Use case examples */}
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive States"
        subtitle="Demonstrates how ComponentName behaves in different interactive contexts."
      />
      {/* Interactive examples */}
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Usage Guidelines"
        subtitle="Guidelines for using the ComponentName component effectively."
      />
      <Card className="p-8">
        <GuidelinesSection title="Do">
          <GuidelinesCard
            title="Do"
            variant="success"
            icon={<Check />}
            items={[
              'Guideline 1',
              'Guideline 2',
            ]}
          />
        </GuidelinesSection>
        <GuidelinesSection title="Don't">
          <GuidelinesCard
            title="Don't"
            variant="warning"
            icon={<AlertTriangle />}
            items={[
              'Anti-pattern 1',
              'Anti-pattern 2',
            ]}
          />
        </GuidelinesSection>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <IconName className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Interactive ComponentName</h3>
        </div>

        <div className="flex items-center justify-center mb-6">
          <ComponentName {...args} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Prop</p>
            <p className="font-mono text-gray-600">{args.propName}</p>
          </div>
        </div>
      </Card>
    </div>
  ),
  args: {
    // Default props
  },
  argTypes: {
    // Interactive controls
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete ComponentName Documentation"
        subtitle="Comprehensive guide to using the sophisticated ComponentName component."
      />
      {/* Documentation content */}
    </div>
  ),
};
```

## Standardization Rules

1. **Import Structure**: Always import React, Meta/StoryObj, component, and shared components
2. **Meta Configuration**: Use consistent title format, layout, and docs structure
3. **Story Organization**: Follow the standard story order: Variants, SizesAndShapes, UseCases, InteractiveStates, Guidelines, Interactive, Documentation
4. **Component Structure**: Use Card components with consistent spacing and styling
5. **Icon Usage**: Use Lucide icons with consistent sizing and colors
6. **Typography**: Use consistent text classes and hierarchy
7. **Color Scheme**: Use consistent color tokens (indigo-500, gray-900, etc.)
8. **Spacing**: Use consistent spacing classes (space-y-16, gap-8, p-6, etc.)
