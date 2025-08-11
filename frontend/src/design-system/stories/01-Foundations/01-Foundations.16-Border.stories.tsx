import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    SectionHeader,
    GuidelinesCard,
    GuidelinesSection
} from '../components';

const meta: Meta = {
    title: 'Design System/1 - Foundations/Border',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Foundation: Border"
                        subtitle="Comprehensive border system with border styles, radius, colors, and utilities"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        }
                    />
                    <Stories includePrimary={false} />
                </>
            ),
        },
    },
};
export default meta;

type Story = StoryObj<typeof meta>;

// Border System Components
const BorderDemo = ({ name, borderClass, description }: {
    name: string;
    borderClass: string;
    description: string;
}) => (
    <div className="p-6 rounded-xl border bg-card space-y-4">
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        <div className={`h-16 bg-background ${borderClass} flex items-center justify-center text-xs text-foreground`}>
            Border Example
        </div>
        <div className="text-xs text-muted-foreground font-mono">
            {borderClass}
        </div>
    </div>
);

const BorderRadiusDemo = ({ name, radiusClass, description }: {
    name: string;
    radiusClass: string;
    description: string;
}) => (
    <div className="p-6 rounded-xl border bg-card space-y-4">
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        <div className={`h-16 bg-primary/10 ${radiusClass} flex items-center justify-center text-xs text-primary`}>
            Radius Example
        </div>
        <div className="text-xs text-muted-foreground font-mono">
            {radiusClass}
        </div>
    </div>
);

// ============================================================================
// STORIES
// ============================================================================

export const BorderStyles: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Border Styles"
                    subtitle="Different border styles and their visual effects"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BorderDemo
                        name="Solid Border"
                        borderClass="border border-solid"
                        description="Standard solid border line"
                    />

                    <BorderDemo
                        name="Dashed Border"
                        borderClass="border border-dashed"
                        description="Dashed line border pattern"
                    />

                    <BorderDemo
                        name="Dotted Border"
                        borderClass="border border-dotted"
                        description="Dotted line border pattern"
                    />

                    <BorderDemo
                        name="Double Border"
                        borderClass="border-2 border-double"
                        description="Double line border effect"
                    />

                    <BorderDemo
                        name="No Border"
                        borderClass="border-0"
                        description="No border applied"
                    />

                    <BorderDemo
                        name="Hidden Border"
                        borderClass="border border-transparent"
                        description="Invisible border that maintains spacing"
                    />
                </div>
            </div>
        </div>
    ),
};

export const BorderWidths: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Border Widths"
                    subtitle="Different border thickness values"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BorderDemo
                        name="Thin Border"
                        borderClass="border border-gray-300"
                        description="1px border width (default)"
                    />

                    <BorderDemo
                        name="Medium Border"
                        borderClass="border-2 border-gray-300"
                        description="2px border width"
                    />

                    <BorderDemo
                        name="Thick Border"
                        borderClass="border-4 border-gray-300"
                        description="4px border width"
                    />

                    <BorderDemo
                        name="Extra Thick Border"
                        borderClass="border-8 border-gray-300"
                        description="8px border width"
                    />

                    <BorderDemo
                        name="Variable Width"
                        borderClass="border-l-4 border-l-blue-500"
                        description="Left border only with custom width"
                    />

                    <BorderDemo
                        name="Mixed Widths"
                        borderClass="border-t-2 border-r-4 border-b-1 border-l-8 border-gray-300"
                        description="Different widths on each side"
                    />
                </div>
            </div>
        </div>
    ),
};

export const BorderRadius: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Border Radius"
                    subtitle="Different border radius values for rounded corners"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BorderRadiusDemo
                        name="No Radius"
                        radiusClass="rounded-none"
                        description="Sharp corners, no rounding"
                    />

                    <BorderRadiusDemo
                        name="Small Radius"
                        radiusClass="rounded-sm"
                        description="2px border radius"
                    />

                    <BorderRadiusDemo
                        name="Default Radius"
                        radiusClass="rounded"
                        description="4px border radius"
                    />

                    <BorderRadiusDemo
                        name="Medium Radius"
                        radiusClass="rounded-md"
                        description="6px border radius"
                    />

                    <BorderRadiusDemo
                        name="Large Radius"
                        radiusClass="rounded-lg"
                        description="8px border radius"
                    />

                    <BorderRadiusDemo
                        name="Extra Large Radius"
                        radiusClass="rounded-xl"
                        description="12px border radius"
                    />

                    <BorderRadiusDemo
                        name="2XL Radius"
                        radiusClass="rounded-2xl"
                        description="16px border radius"
                    />

                    <BorderRadiusDemo
                        name="3XL Radius"
                        radiusClass="rounded-3xl"
                        description="24px border radius"
                    />

                    <BorderRadiusDemo
                        name="Full Radius"
                        radiusClass="rounded-full"
                        description="50% border radius (circular)"
                    />
                </div>
            </div>
        </div>
    ),
};

export const BorderColors: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Border Colors"
                    subtitle="Different border color options using our color system"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BorderDemo
                        name="Primary Border"
                        borderClass="border border-primary"
                        description="Primary brand color border"
                    />

                    <BorderDemo
                        name="Secondary Border"
                        borderClass="border border-secondary"
                        description="Secondary color border"
                    />

                    <BorderDemo
                        name="Accent Border"
                        borderClass="border border-accent"
                        description="Accent color border"
                    />

                    <BorderDemo
                        name="Muted Border"
                        borderClass="border border-muted"
                        description="Muted color border"
                    />

                    <BorderDemo
                        name="Destructive Border"
                        borderClass="border border-destructive"
                        description="Error/destructive color border"
                    />

                    <BorderDemo
                        name="Success Border"
                        borderClass="border border-green-500"
                        description="Success state border"
                    />

                    <BorderDemo
                        name="Warning Border"
                        borderClass="border border-yellow-500"
                        description="Warning state border"
                    />

                    <BorderDemo
                        name="Info Border"
                        borderClass="border border-blue-500"
                        description="Information state border"
                    />

                    <BorderDemo
                        name="Transparent Border"
                        borderClass="border border-transparent"
                        description="Invisible border for spacing"
                    />
                </div>
            </div>
        </div>
    ),
};

export const BorderPositions: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Border Positions"
                    subtitle="Applying borders to specific sides of elements"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BorderDemo
                        name="Top Border"
                        borderClass="border-t border-t-primary"
                        description="Border on top only"
                    />

                    <BorderDemo
                        name="Right Border"
                        borderClass="border-r border-r-primary"
                        description="Border on right only"
                    />

                    <BorderDemo
                        name="Bottom Border"
                        borderClass="border-b border-b-primary"
                        description="Border on bottom only"
                    />

                    <BorderDemo
                        name="Left Border"
                        borderClass="border-l border-l-primary"
                        description="Border on left only"
                    />

                    <BorderDemo
                        name="Horizontal Borders"
                        borderClass="border-y border-y-primary"
                        description="Top and bottom borders"
                    />

                    <BorderDemo
                        name="Vertical Borders"
                        borderClass="border-x border-x-primary"
                        description="Left and right borders"
                    />
                </div>
            </div>
        </div>
    ),
};

export const PracticalExamples: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Practical Border Examples"
                    subtitle="Real-world applications of border styles"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Card with Border */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Card with Border</div>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                <div className="text-sm font-medium text-gray-900">Card Title</div>
                                <div className="text-xs text-gray-600 mt-1">Card content with subtle border</div>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Subtle border for content separation
                        </div>
                    </div>

                    {/* Input Field */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Input Field</div>
                        <div className="space-y-4">
                            <div className="border border-gray-300 rounded-md px-3 py-2 bg-white">
                                <div className="text-sm text-gray-900">Input text here</div>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Border for form input styling
                        </div>
                    </div>

                    {/* Alert Box */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Alert Box</div>
                        <div className="space-y-4">
                            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                                <div className="text-sm font-medium text-red-800">Error Alert</div>
                                <div className="text-xs text-red-600 mt-1">Something went wrong</div>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Colored border for status indication
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Divider</div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="text-xs text-gray-600">Content above</div>
                                <div className="border-t border-gray-200"></div>
                                <div className="text-xs text-gray-600">Content below</div>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Single border line as divider
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const Guidelines: Story = {
    render: () => (
        <div className="space-y-12">
            <div>
                <SectionHeader
                    title="Border Guidelines"
                    subtitle="Best practices for implementing border styles"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <GuidelinesCard
                            title="Border Usage"
                            items={[
                                "• Use borders for content separation",
                                "• Use subtle borders for form elements",
                                "• Use colored borders for status indication",
                                "• Consider accessibility and contrast"
                            ]}
                        />

                        <GuidelinesCard
                            title="Border Radius"
                            items={[
                                "• Use consistent radius values",
                                "• Match radius to design system",
                                "• Consider content type when choosing radius",
                                "• Use full radius for circular elements"
                            ]}
                        />
                    </div>

                    <div className="space-y-4">
                        <GuidelinesCard
                            title="Border Colors"
                            items={[
                                "• Use semantic colors for status",
                                "• Use muted colors for subtle borders",
                                "• Ensure sufficient contrast ratios",
                                "• Consider dark mode compatibility"
                            ]}
                        />

                        <GuidelinesCard
                            title="Border Widths"
                            items={[
                                "• Use thin borders for subtle separation",
                                "• Use thicker borders for emphasis",
                                "• Be consistent with width choices",
                                "• Consider mobile touch targets"
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">🚀 Usage Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GuidelinesSection
                        title="Border Styles"
                        items={[
                            "• <strong>solid</strong>: Standard border line",
                            "• <strong>dashed</strong>: Dashed line pattern",
                            "• <strong>dotted</strong>: Dotted line pattern",
                            "• <strong>double</strong>: Double line effect",
                            "• <strong>none</strong>: No border",
                            "• <strong>transparent</strong>: Invisible border"
                        ]}
                    />
                    <GuidelinesSection
                        title="Border Widths"
                        items={[
                            "• <strong>border</strong>: 1px (default)",
                            "• <strong>border-2</strong>: 2px width",
                            "• <strong>border-4</strong>: 4px width",
                            "• <strong>border-8</strong>: 8px width",
                            "• <strong>border-x/y</strong>: Horizontal/vertical only",
                            "• <strong>border-t/r/b/l</strong>: Individual sides"
                        ]}
                    />
                    <GuidelinesSection
                        title="Border Radius"
                        items={[
                            "• <strong>rounded-none</strong>: Sharp corners",
                            "• <strong>rounded-sm</strong>: 2px radius",
                            "• <strong>rounded</strong>: 4px radius",
                            "• <strong>rounded-lg</strong>: 8px radius",
                            "• <strong>rounded-xl</strong>: 12px radius",
                            "• <strong>rounded-full</strong>: 50% radius"
                        ]}
                    />
                </div>
            </div>
        </div>
    ),
};
