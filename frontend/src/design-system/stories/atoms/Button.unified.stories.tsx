import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import {
    StoryBanner,
    StorySection,
    StoryCard,
    StoryGuidelines,
    StoryVariants,
    StoryPlayground,
    StorySizes,
    StoryUsage,
    createStoryMeta,
    storyIcons,
    commonArgTypes
} from '../shared';
import { Title, Stories } from '@storybook/blocks';
import { Settings, Plus, Download } from 'lucide-react';

// Unified meta configuration
const meta: Meta<typeof Button> = {
    ...createStoryMeta({
        title: 'Button',
        component: Button,
        category: 'atoms',
    }),
    parameters: {
        ...createStoryMeta({} as any).parameters,
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <StoryBanner
                        title="Button"
                        subtitle="A sophisticated button component with multiple variants, sizes, and states. Perfect for financial applications requiring clear call-to-actions and user interactions."
                        icon={storyIcons.atom}
                    />
                    <Stories includePrimary={false} />
                </>
            ),
        },
    },
    argTypes: {
        ...commonArgTypes,
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'warning', 'info'],
            description: 'The visual style variant of the button'
        },
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'],
            description: 'The size of the button'
        },
        loading: {
            control: 'boolean',
            description: 'Whether the button is in a loading state'
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the button is disabled'
        }
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// UNIFIED STORIES
// ============================================================================

export const Variants: Story = {
    render: () => (
        <StorySection
            title="Variants"
            subtitle="Different visual styles available for this component"
        >
            <StoryVariants>
                <StoryCard title="Default">
                    <Button>Default Button</Button>
                </StoryCard>
                <StoryCard title="Primary">
                    <Button variant="default">Primary Button</Button>
                </StoryCard>
                <StoryCard title="Secondary">
                    <Button variant="secondary">Secondary Button</Button>
                </StoryCard>
                <StoryCard title="Outline">
                    <Button variant="outline">Outline Button</Button>
                </StoryCard>
                <StoryCard title="Ghost">
                    <Button variant="ghost">Ghost Button</Button>
                </StoryCard>
                <StoryCard title="Destructive">
                    <Button variant="destructive">Destructive Button</Button>
                </StoryCard>
            </StoryVariants>
        </StorySection>
    ),
};

export const Sizes: Story = {
    render: () => (
        <StorySection
            title="Sizes"
            subtitle="Available size options"
        >
            <StorySizes
                items={[
                    {
                        name: 'Extra Small',
                        component: <Button size="xs">XS Button</Button>,
                        description: 'Very compact size for limited space'
                    },
                    {
                        name: 'Small',
                        component: <Button size="sm">Small Button</Button>,
                        description: 'Compact size for tight spaces'
                    },
                    {
                        name: 'Medium',
                        component: <Button size="md">Medium Button</Button>,
                        description: 'Default size for most use cases'
                    },
                    {
                        name: 'Large',
                        component: <Button size="lg">Large Button</Button>,
                        description: 'Prominent size for emphasis'
                    },
                    {
                        name: 'Extra Large',
                        component: <Button size="xl">XL Button</Button>,
                        description: 'Very prominent size for hero sections'
                    },
                    {
                        name: 'Icon',
                        component: <Button size="icon"><Settings /></Button>,
                        description: 'Square icon-only button'
                    }
                ]}
            />
        </StorySection>
    ),
};

export const States: Story = {
    render: () => (
        <StorySection
            title="Interactive States"
            subtitle="How the component behaves in different states"
        >
            <StoryVariants>
                <StoryCard title="Normal">
                    <Button>Normal Button</Button>
                </StoryCard>
                <StoryCard title="Loading">
                    <Button loading>Loading Button</Button>
                </StoryCard>
                <StoryCard title="Disabled">
                    <Button disabled>Disabled Button</Button>
                </StoryCard>
            </StoryVariants>
        </StorySection>
    ),
};

export const Usage: Story = {
    render: () => (
        <StorySection
            title="Usage Examples"
            subtitle="Common implementation patterns"
        >
            <div className="space-y-6">
                <StoryUsage
                    title="Basic Usage"
                    code={`<Button>Click me</Button>`}
                >
                    <Button>Click me</Button>
                </StoryUsage>

                <StoryUsage
                    title="With Icon"
                    code={`<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>`}
                >
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </StoryUsage>

                <StoryUsage
                    title="Loading State"
                    code={`<Button loading>Processing...</Button>`}
                >
                    <Button loading>Processing...</Button>
                </StoryUsage>
            </div>
        </StorySection>
    ),
};

export const Guidelines: Story = {
    render: () => (
        <StorySection
            title="Usage Guidelines"
            subtitle="Best practices for using this component"
        >
            <StoryGuidelines
                doItems={[
                    'Use primary variant for main call-to-action buttons',
                    'Use appropriate size for the context and hierarchy',
                    'Include loading states for async operations',
                    'Provide clear, action-oriented button text',
                    'Use icons to enhance button meaning when appropriate'
                ]}
                dontItems={[
                    'Use more than one primary button per section',
                    'Use destructive variant for non-destructive actions',
                    'Make buttons too small to be easily clickable',
                    'Use generic text like "Click here" or "Submit"',
                    'Overload buttons with too many icons or text'
                ]}
            />
        </StorySection>
    ),
};

export const Interactive: Story = {
    render: (args) => (
        <StorySection
            title="Interactive Playground"
            subtitle="Experiment with different props and configurations"
        >
            <StoryPlayground description="Adjust the controls to see how the component responds">
                <Button {...args} />
            </StoryPlayground>
        </StorySection>
    ),
    args: {
        children: 'Interactive Button',
        variant: 'default',
        size: 'md',
        disabled: false,
        loading: false,
    },
};
