import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../components/ComponentName';

/**
 * ComponentName - Brief description of what this component does
 * 
 * ## Usage
 * ```tsx
 * import { ComponentName } from '@/design-system/components/ComponentName';
 * 
 * <ComponentName prop1="value" prop2={true} />
 * ```
 * 
 * ## Accessibility
 * - Screen reader friendly
 * - Keyboard navigation support
 * - ARIA labels included
 * 
 * ## Design Tokens
 * - Uses design system tokens for spacing, colors, typography
 * - Responsive design patterns
 * - Consistent with design system guidelines
 */
const meta: Meta<typeof ComponentName> = {
    title: 'Design System/ComponentName',
    component: ComponentName,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Detailed description of the component, its purpose, and key features.',
            },
        },
    },
    argTypes: {
        // Define all props with proper controls and descriptions
        prop1: {
            control: { type: 'text' },
            description: 'Description of prop1',
        },
        prop2: {
            control: { type: 'boolean' },
            description: 'Description of prop2',
        },
        // Add more props as needed
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story - shows the most common use case
export const Default: Story = {
    args: {
        prop1: 'Default Value',
        prop2: false,
    },
};

// Secondary story - shows an alternative state
export const Secondary: Story = {
    args: {
        prop1: 'Secondary Value',
        prop2: true,
    },
};

// Interactive story - demonstrates user interactions
export const Interactive: Story = {
    args: {
        prop1: 'Interactive',
        prop2: false,
    },
    play: async ({ canvasElement }) => {
        // Add interaction tests here
    },
};

// States story - shows different states
export const States: Story = {
    render: () => (
        <div className="space-y-4">
            <ComponentName prop1="Normal State" prop2={false} />
            <ComponentName prop1="Active State" prop2={true} />
            <ComponentName prop1="Disabled State" prop2={false} disabled />
        </div>
    ),
};

// Usage examples story - shows real-world usage patterns
export const UsageExamples: Story = {
    render: () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
                <ComponentName prop1="Basic Example" prop2={false} />
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">With Custom Styling</h3>
                <ComponentName
                    prop1="Custom Styled"
                    prop2={true}
                    className="border-2 border-blue-500 rounded-lg"
                />
            </div>
        </div>
    ),
};
