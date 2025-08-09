import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

/**
 * # Component Template
 * 
 * This is a comprehensive template demonstrating best practices for Storybook stories.
 * Use this as a reference when creating new component stories.
 */

const meta: Meta<typeof Card> = {
    title: 'Design System/Templates/ComponentTemplate',
    component: Card,
    tags: ['autodocs', 'template'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Purpose
This template shows how to create comprehensive, developer-friendly component stories.

## Anatomy
- **Overview**: Clear description of what the component does
- **Props Table**: Auto-generated from TypeScript with custom controls
- **Variants**: Different visual states and configurations
- **States**: Loading, error, empty, and interactive states
- **Accessibility**: Keyboard navigation, screen reader support
- **Examples**: Real-world usage patterns

## Best Practices
1. Use descriptive titles and descriptions
2. Include comprehensive argTypes for all props
3. Test all variants and edge cases
4. Document accessibility features
5. Provide real-world usage examples
        `,
            },
        },
    },
    argTypes: {
        className: {
            description: 'Additional CSS classes for custom styling',
            control: { type: 'text' },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Styling',
            },
        },
        variant: {
            description: 'Visual style variant of the card',
            control: { type: 'select' },
            options: ['default', 'outlined', 'elevated'],
            table: {
                type: { summary: 'CardVariant' },
                defaultValue: { summary: 'default' },
                category: 'Appearance',
            },
        },
        size: {
            description: 'Size of the card component',
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
            table: {
                type: { summary: 'CardSize' },
                defaultValue: { summary: 'md' },
                category: 'Layout',
            },
        },
        disabled: {
            description: 'Whether the card is disabled',
            control: { type: 'boolean' },
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            },
        },
    },
    args: {
        variant: 'default',
        size: 'md',
        disabled: false,
        className: '',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Default Card
 * 
 * Basic card with header, content, and footer. This is the most common usage pattern.
 */
export const Default: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This is the default card variant with standard styling.</p>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Basic card implementation with header and content sections.',
            },
        },
    },
};

/**
 * ## Outlined Variant
 * 
 * Card with border styling for subtle emphasis.
 */
export const Outlined: Story = {
    args: {
        variant: 'outlined',
        children: (
            <>
                <CardHeader>
                    <CardTitle>Outlined Card</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Outlined variant with border styling for subtle emphasis.</p>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Use outlined variant when you want subtle visual separation.',
            },
        },
    },
};

/**
 * ## Elevated Variant
 * 
 * Card with shadow for prominent display.
 */
export const Elevated: Story = {
    args: {
        variant: 'elevated',
        children: (
            <>
                <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Elevated variant with shadow for prominent display.</p>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Use elevated variant to draw attention to important content.',
            },
        },
    },
};

/**
 * ## Small Size
 * 
 * Compact card for space-constrained layouts.
 */
export const Small: Story = {
    args: {
        size: 'sm',
        children: (
            <>
                <CardHeader>
                    <CardTitle>Small Card</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Compact size for space-constrained layouts.</p>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Small size is ideal for dashboards and compact layouts.',
            },
        },
    },
};

/**
 * ## Large Size
 * 
 * Spacious card for content-heavy sections.
 */
export const Large: Story = {
    args: {
        size: 'lg',
        children: (
            <>
                <CardHeader>
                    <CardTitle>Large Card</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Large size provides ample space for content-heavy sections.</p>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Large size works well for detailed content and forms.',
            },
        },
    },
};

/**
 * ## Interactive Card
 * 
 * Card with interactive elements demonstrating real-world usage.
 */
export const Interactive: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>Interactive Card</CardTitle>
                    <Badge variant="secondary">Interactive</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>This card demonstrates interactive elements and real-world usage patterns.</p>
                    <div className="flex gap-2">
                        <Button size="sm">Primary Action</Button>
                        <Button variant="secondary" size="sm">Secondary</Button>
                    </div>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Real-world example showing card with interactive elements and proper spacing.',
            },
        },
    },
};

/**
 * ## Disabled State
 * 
 * Card in disabled state for form validation scenarios.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        children: (
            <>
                <CardHeader>
                    <CardTitle>Disabled Card</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This card is disabled and cannot be interacted with.</p>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Use disabled state when the card content is not available or interactive.',
            },
        },
    },
};

/**
 * ## Complex Layout
 * 
 * Advanced card layout with multiple sections and components.
 */
export const ComplexLayout: Story = {
    args: {
        variant: 'elevated',
        size: 'lg',
        children: (
            <>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Complex Layout</CardTitle>
                        <div className="flex gap-2">
                            <Badge variant="outline">Feature</Badge>
                            <Badge variant="secondary">New</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">Section 1</h4>
                            <p className="text-sm text-muted-foreground">
                                This demonstrates a complex layout with multiple sections.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Section 2</h4>
                            <p className="text-sm text-muted-foreground">
                                Grid layout with responsive behavior.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Advanced example showing complex layouts, responsive design, and multiple interactive elements.',
            },
        },
    },
};

/**
 * ## Accessibility Features
 * 
 * This section documents accessibility considerations and keyboard navigation.
 */
export const Accessibility: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>Accessibility Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Keyboard Navigation</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Tab: Navigate between interactive elements</li>
                            <li>• Enter/Space: Activate buttons and links</li>
                            <li>• Arrow keys: Navigate within card sections</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium">Screen Reader Support</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Semantic HTML structure</li>
                            <li>• Proper heading hierarchy</li>
                            <li>• ARIA labels where needed</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium">Color Contrast</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• WCAG AA compliant contrast ratios</li>
                            <li>• High contrast mode support</li>
                            <li>• Semantic color usage</li>
                        </ul>
                    </div>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Documentation of accessibility features and keyboard navigation patterns.',
            },
        },
    },
};

/**
 * ## Usage Guidelines
 * 
 * Best practices and common patterns for using this component.
 */
export const UsageGuidelines: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>Usage Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-green-600">✅ Do</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Use for grouping related content</li>
                            <li>• Maintain consistent spacing between cards</li>
                            <li>• Choose appropriate variant for context</li>
                            <li>• Include clear headings and descriptions</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-red-600">❌ Don't</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Nest cards more than 2 levels deep</li>
                            <li>• Use cards for simple text blocks</li>
                            <li>• Mix different variants in the same section</li>
                            <li>• Overload cards with too many elements</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-blue-600">💡 Tips</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Use elevated variant sparingly for hierarchy</li>
                            <li>• Consider card size based on content complexity</li>
                            <li>• Maintain consistent spacing with design tokens</li>
                            <li>• Test with different content lengths</li>
                        </ul>
                    </div>
                </CardContent>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Best practices, common patterns, and guidelines for effective card usage.',
            },
        },
    },
};
