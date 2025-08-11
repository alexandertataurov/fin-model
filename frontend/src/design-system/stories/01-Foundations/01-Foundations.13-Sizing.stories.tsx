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
    title: 'Design System/1 - Foundations/Sizing',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Foundation: Sizing"
                        subtitle="Comprehensive sizing system with width/height tokens, min/max sizing utilities, aspect ratios, and viewport-based sizing. Includes accessibility considerations and real-world examples."
                        icon={
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
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

// Sizing System Components
const SizeSwatch = ({ name, width, height, className = '' }: {
    name: string;
    width: string;
    height: string;
    className?: string;
}) => (
    <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div
            className="bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs text-primary"
            style={{ width, height }}
        >
            {width} × {height}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
            w: {width} • h: {height}
        </div>
    </div>
);

const AspectRatioDemo = ({ ratio, name, className = '' }: {
    ratio: string;
    name: string;
    className?: string;
}) => (
    <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="relative w-full bg-accent/10 border border-accent/20 rounded overflow-hidden">
            <div
                className="absolute inset-0 flex items-center justify-center text-xs text-accent"
                style={{ aspectRatio: ratio }}
            >
                {ratio}
            </div>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
            aspect-ratio: {ratio}
        </div>
    </div>
);

const ViewportSizeDemo = ({ name, size, description, className = '' }: {
    name: string;
    size: string;
    description: string;
    className?: string;
}) => (
    <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        <div className="h-16 bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-xs text-secondary">
            {size}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
            {size}
        </div>
    </div>
);

// ============================================================================
// STORIES
// ============================================================================

export const WidthSystem: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Width System"
                    subtitle="Comprehensive width utilities for responsive layouts"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SizeSwatch
                        name="Auto Width"
                        width="auto"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Full Width"
                        width="100%"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Half Width"
                        width="50%"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Quarter Width"
                        width="25%"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Third Width"
                        width="33.333333%"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Two Thirds Width"
                        width="66.666667%"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Fixed Width (200px)"
                        width="200px"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Fixed Width (300px)"
                        width="300px"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Fixed Width (400px)"
                        width="400px"
                        height="40px"
                    />
                </div>
            </div>
        </div>
    ),
};

export const HeightSystem: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Height System"
                    subtitle="Height utilities for vertical sizing and layout"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SizeSwatch
                        name="Auto Height"
                        width="100px"
                        height="auto"
                    />

                    <SizeSwatch
                        name="Full Height"
                        width="100px"
                        height="100%"
                    />

                    <SizeSwatch
                        name="Screen Height"
                        width="100px"
                        height="100vh"
                    />

                    <SizeSwatch
                        name="Half Screen Height"
                        width="100px"
                        height="50vh"
                    />

                    <SizeSwatch
                        name="Fixed Height (40px)"
                        width="100px"
                        height="40px"
                    />

                    <SizeSwatch
                        name="Fixed Height (60px)"
                        width="100px"
                        height="60px"
                    />

                    <SizeSwatch
                        name="Fixed Height (80px)"
                        width="100px"
                        height="80px"
                    />

                    <SizeSwatch
                        name="Fixed Height (120px)"
                        width="100px"
                        height="120px"
                    />

                    <SizeSwatch
                        name="Fixed Height (200px)"
                        width="100px"
                        height="200px"
                    />
                </div>
            </div>
        </div>
    ),
};

export const MinMaxSizing: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Min/Max Sizing"
                    subtitle="Minimum and maximum sizing constraints for responsive design"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Min Width</div>
                        <div className="space-y-2">
                            <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary" style={{ minWidth: '200px' }}>
                                Min Width: 200px
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary" style={{ minWidth: '300px' }}>
                                Min Width: 300px
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary" style={{ minWidth: '400px' }}>
                                Min Width: 400px
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Max Width</div>
                        <div className="space-y-2">
                            <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent" style={{ maxWidth: '200px' }}>
                                Max Width: 200px
                            </div>
                            <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent" style={{ maxWidth: '300px' }}>
                                Max Width: 300px
                            </div>
                            <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent" style={{ maxWidth: '400px' }}>
                                Max Width: 400px
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Min Height</div>
                        <div className="space-y-2">
                            <div className="bg-secondary/10 border border-secondary/20 rounded p-2 text-xs text-secondary" style={{ minHeight: '60px' }}>
                                Min Height: 60px
                            </div>
                            <div className="bg-secondary/10 border border-secondary/20 rounded p-2 text-xs text-secondary" style={{ minHeight: '80px' }}>
                                Min Height: 80px
                            </div>
                            <div className="bg-secondary/10 border border-secondary/20 rounded p-2 text-xs text-secondary" style={{ minHeight: '100px' }}>
                                Min Height: 100px
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Max Height</div>
                        <div className="space-y-2">
                            <div className="bg-muted/10 border border-muted/20 rounded p-2 text-xs text-muted-foreground" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                                Max Height: 60px (with overflow hidden)
                            </div>
                            <div className="bg-muted/10 border border-muted/20 rounded p-2 text-xs text-muted-foreground" style={{ maxHeight: '80px', overflow: 'hidden' }}>
                                Max Height: 80px (with overflow hidden)
                            </div>
                            <div className="bg-muted/10 border border-muted/20 rounded p-2 text-xs text-muted-foreground" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                                Max Height: 100px (with overflow hidden)
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Combined Constraints</div>
                        <div className="space-y-2">
                            <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs text-primary" style={{ minWidth: '200px', maxWidth: '400px' }}>
                                Min: 200px, Max: 400px
                            </div>
                            <div className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent" style={{ minHeight: '60px', maxHeight: '120px' }}>
                                Min: 60px, Max: 120px
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Responsive Constraints</div>
                        <div className="space-y-2">
                            <div className="bg-secondary/10 border border-secondary/20 rounded p-2 text-xs text-secondary" style={{ minWidth: '200px', maxWidth: '100%' }}>
                                Min: 200px, Max: 100%
                            </div>
                            <div className="bg-muted/10 border border-muted/20 rounded p-2 text-xs text-muted-foreground" style={{ minHeight: '60px', maxHeight: '50vh' }}>
                                Min: 60px, Max: 50vh
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const AspectRatios: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Aspect Ratios"
                    subtitle="Common aspect ratios for images, videos, and containers"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AspectRatioDemo
                        name="Square (1:1)"
                        ratio="1"
                    />

                    <AspectRatioDemo
                        name="Landscape (16:9)"
                        ratio="16/9"
                    />

                    <AspectRatioDemo
                        name="Portrait (9:16)"
                        ratio="9/16"
                    />

                    <AspectRatioDemo
                        name="Wide (21:9)"
                        ratio="21/9"
                    />

                    <AspectRatioDemo
                        name="Standard (4:3)"
                        ratio="4/3"
                    />

                    <AspectRatioDemo
                        name="Golden Ratio (1.618:1)"
                        ratio="1.618"
                    />

                    <AspectRatioDemo
                        name="Photo (3:2)"
                        ratio="3/2"
                    />

                    <AspectRatioDemo
                        name="Mobile (2:3)"
                        ratio="2/3"
                    />

                    <AspectRatioDemo
                        name="Ultra Wide (32:9)"
                        ratio="32/9"
                    />
                </div>
            </div>
        </div>
    ),
};

export const ViewportSizing: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Viewport Sizing"
                    subtitle="Sizing based on viewport dimensions for responsive design"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ViewportSizeDemo
                        name="Viewport Width"
                        size="100vw"
                        description="Full viewport width"
                    />

                    <ViewportSizeDemo
                        name="Viewport Height"
                        size="100vh"
                        description="Full viewport height"
                    />

                    <ViewportSizeDemo
                        name="Half Viewport Width"
                        size="50vw"
                        description="Half viewport width"
                    />

                    <ViewportSizeDemo
                        name="Half Viewport Height"
                        size="50vh"
                        description="Half viewport height"
                    />

                    <ViewportSizeDemo
                        name="Quarter Viewport Width"
                        size="25vw"
                        description="Quarter viewport width"
                    />

                    <ViewportSizeDemo
                        name="Quarter Viewport Height"
                        size="25vh"
                        description="Quarter viewport height"
                    />

                    <ViewportSizeDemo
                        name="Small Viewport Unit"
                        size="100vmin"
                        description="100% of viewport's smaller dimension"
                    />

                    <ViewportSizeDemo
                        name="Large Viewport Unit"
                        size="100vmax"
                        description="100% of viewport's larger dimension"
                    />

                    <ViewportSizeDemo
                        name="Dynamic Viewport"
                        size="100dvh"
                        description="Dynamic viewport height (mobile-friendly)"
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
                    title="Practical Sizing Examples"
                    subtitle="Real-world applications of our sizing system"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Responsive Card */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Responsive Card</div>
                        <div className="space-y-4">
                            <div className="bg-primary/10 border border-primary/20 rounded p-4" style={{ minWidth: '200px', maxWidth: '400px' }}>
                                <div className="text-xs text-primary font-medium">Card Title</div>
                                <div className="text-xs text-primary mt-2">This card has min and max width constraints for responsive behavior.</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Min: 200px, Max: 400px
                            </div>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Image Container</div>
                        <div className="space-y-4">
                            <div className="bg-accent/10 border border-accent/20 rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                                <div className="w-full h-full flex items-center justify-center text-xs text-accent">
                                    16:9 Image Placeholder
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Aspect Ratio: 16:9
                            </div>
                        </div>
                    </div>

                    {/* Modal Overlay */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Modal Overlay</div>
                        <div className="space-y-4">
                            <div className="bg-secondary/10 border border-secondary/20 rounded" style={{ width: '90vw', maxWidth: '500px', height: '50vh', maxHeight: '400px' }}>
                                <div className="w-full h-full flex items-center justify-center text-xs text-secondary">
                                    Modal Content
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Width: 90vw (max 500px), Height: 50vh (max 400px)
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Sidebar</div>
                        <div className="space-y-4">
                            <div className="bg-muted/10 border border-muted/20 rounded" style={{ width: '250px', height: '100vh' }}>
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                    Sidebar Content
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Width: 250px, Height: 100vh
                            </div>
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
                    title="Sizing Guidelines"
                    subtitle="Best practices for implementing our sizing system"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <GuidelinesCard
                            title="Width Usage"
                            items={[
                                "• Use percentage for fluid layouts",
                                "• Use fixed pixels for precise control",
                                "• Combine min/max for responsive behavior",
                                "• Consider viewport units for full-screen elements"
                            ]}
                        />

                        <GuidelinesCard
                            title="Height Usage"
                            items={[
                                "• Use auto height for content-driven sizing",
                                "• Use viewport height for full-screen layouts",
                                "• Use fixed height sparingly",
                                "• Consider min-height for content areas"
                            ]}
                        />
                    </div>

                    <div className="space-y-4">
                        <GuidelinesCard
                            title="Aspect Ratios"
                            items={[
                                "• Use 16:9 for video content",
                                "• Use 1:1 for profile images",
                                "• Use 4:3 for traditional photos",
                                "• Consider content type when choosing ratios"
                            ]}
                        />

                        <GuidelinesCard
                            title="Responsive Design"
                            items={[
                                "• Use min/max constraints for flexibility",
                                "• Test across different screen sizes",
                                "• Consider mobile-first approach",
                                "• Use viewport units appropriately"
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">🚀 Usage Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GuidelinesSection
                        title="Width Units"
                        items={[
                            "• <strong>%</strong>: Percentage of parent container",
                            "• <strong>px</strong>: Fixed pixel values",
                            "• <strong>vw</strong>: Viewport width units",
                            "• <strong>rem</strong>: Root em units",
                            "• <strong>em</strong>: Relative em units",
                            "• <strong>auto</strong>: Automatic sizing"
                        ]}
                    />
                    <GuidelinesSection
                        title="Height Units"
                        items={[
                            "• <strong>%</strong>: Percentage of parent height",
                            "• <strong>px</strong>: Fixed pixel values",
                            "• <strong>vh</strong>: Viewport height units",
                            "• <strong>dvh</strong>: Dynamic viewport height",
                            "• <strong>rem</strong>: Root em units",
                            "• <strong>auto</strong>: Content-based height"
                        ]}
                    />
                    <GuidelinesSection
                        title="Common Patterns"
                        items={[
                            "• <strong>Full Width</strong>: w-full or 100%",
                            "• <strong>Responsive Width</strong>: min-w-0 max-w-full",
                            "• <strong>Fixed Aspect</strong>: aspect-ratio utility",
                            "• <strong>Full Screen</strong>: w-screen h-screen",
                            "• <strong>Container</strong>: max-w-7xl mx-auto",
                            "• <strong>Flexible</strong>: flex-1 for equal distribution"
                        ]}
                    />
                </div>
            </div>
        </div>
    ),
};
