import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    SectionHeader,
    GuidelinesCard,
    GuidelinesSection
} from './components';

const meta: Meta = {
    title: 'Design System/Foundations/Breakpoints',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Foundation: Breakpoints"
                        subtitle="Comprehensive breakpoint system with responsive design tokens, mobile-first approach, and media query patterns. Includes accessibility considerations and real-world examples."
                        icon={
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
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

// Breakpoint System Components
const BreakpointSwatch = ({ name, width, description, className = '' }: {
    name: string;
    width: string;
    description: string;
    className?: string;
}) => (
    <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-foreground">{name}</div>
            <div className="text-xs font-mono text-muted-foreground">{width}</div>
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
        <div className="h-16 bg-primary/5 border border-primary/10 rounded flex items-center justify-center">
            <div className="text-xs text-primary">Preview Area</div>
        </div>
    </div>
);

const ResponsiveDemo = ({ title, mobileContent, tabletContent, desktopContent }: {
    title: string;
    mobileContent: string;
    tabletContent: string;
    desktopContent: string;
}) => (
    <div className="p-6 rounded-xl border bg-card space-y-4">
        <div className="text-sm font-medium text-foreground">{title}</div>

        <div className="space-y-4">
            <div>
                <div className="text-xs text-muted-foreground mb-2">Mobile (Default)</div>
                <div className="h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-xs text-primary">
                    {mobileContent}
                </div>
            </div>

            <div>
                <div className="text-xs text-muted-foreground mb-2">Tablet (md:)</div>
                <div className="h-12 bg-accent/10 border border-accent/20 rounded flex items-center justify-center text-xs text-accent">
                    {tabletContent}
                </div>
            </div>

            <div>
                <div className="text-xs text-muted-foreground mb-2">Desktop (lg:)</div>
                <div className="h-12 bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-xs text-secondary">
                    {desktopContent}
                </div>
            </div>
        </div>
    </div>
);

const DevicePreview = ({ device, width, height, content }: {
    device: string;
    width: string;
    height: string;
    content: React.ReactNode;
}) => (
    <div className="p-6 rounded-xl border bg-card space-y-4">
        <div className="text-sm font-medium text-foreground">{device}</div>
        <div className="text-xs text-muted-foreground font-mono">{width} × {height}</div>
        <div
            className="border-2 border-muted rounded-lg bg-background overflow-hidden"
            style={{ width, height }}
        >
            {content}
        </div>
    </div>
);

// ============================================================================
// STORIES
// ============================================================================

export const BreakpointSystem: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Breakpoint System"
                    subtitle="Responsive breakpoints for mobile-first design"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BreakpointSwatch
                        name="Small (sm)"
                        width="640px"
                        description="Small tablets and large phones"
                    />

                    <BreakpointSwatch
                        name="Medium (md)"
                        width="768px"
                        description="Tablets and small laptops"
                    />

                    <BreakpointSwatch
                        name="Large (lg)"
                        width="1024px"
                        description="Laptops and desktops"
                    />

                    <BreakpointSwatch
                        name="Extra Large (xl)"
                        width="1280px"
                        description="Large desktops and monitors"
                    />

                    <BreakpointSwatch
                        name="2XL (2xl)"
                        width="1536px"
                        description="Ultra-wide monitors and displays"
                    />

                    <BreakpointSwatch
                        name="Custom"
                        width="1400px"
                        description="Custom breakpoint for specific needs"
                    />
                </div>
            </div>
        </div>
    ),
};

export const DeviceBreakpoints: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Device Breakpoints"
                    subtitle="Common device sizes and their corresponding breakpoints"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DevicePreview
                        device="Mobile"
                        width="320px"
                        height="568px"
                        content={
                            <div className="h-full bg-primary/5 flex items-center justify-center">
                                <div className="text-xs text-primary text-center">
                                    Mobile Layout<br />
                                    <span className="text-muted-foreground">Default</span>
                                </div>
                            </div>
                        }
                    />

                    <DevicePreview
                        device="Tablet"
                        width="768px"
                        height="1024px"
                        content={
                            <div className="h-full bg-accent/5 flex items-center justify-center">
                                <div className="text-xs text-accent text-center">
                                    Tablet Layout<br />
                                    <span className="text-muted-foreground">md: breakpoint</span>
                                </div>
                            </div>
                        }
                    />

                    <DevicePreview
                        device="Laptop"
                        width="1024px"
                        height="768px"
                        content={
                            <div className="h-full bg-secondary/5 flex items-center justify-center">
                                <div className="text-xs text-secondary text-center">
                                    Laptop Layout<br />
                                    <span className="text-muted-foreground">lg: breakpoint</span>
                                </div>
                            </div>
                        }
                    />

                    <DevicePreview
                        device="Desktop"
                        width="1280px"
                        height="720px"
                        content={
                            <div className="h-full bg-muted/5 flex items-center justify-center">
                                <div className="text-xs text-muted-foreground text-center">
                                    Desktop Layout<br />
                                    <span className="text-muted-foreground">xl: breakpoint</span>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    ),
};

export const ResponsivePatterns: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Responsive Patterns"
                    subtitle="Common responsive design patterns and their implementations"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveDemo
                        title="Grid Columns"
                        mobileContent="1 Column"
                        tabletContent="2 Columns"
                        desktopContent="3 Columns"
                    />

                    <ResponsiveDemo
                        title="Typography"
                        mobileContent="Small Text"
                        tabletContent="Medium Text"
                        desktopContent="Large Text"
                    />

                    <ResponsiveDemo
                        title="Spacing"
                        mobileContent="Tight Spacing"
                        tabletContent="Medium Spacing"
                        desktopContent="Loose Spacing"
                    />

                    <ResponsiveDemo
                        title="Navigation"
                        mobileContent="Hamburger Menu"
                        tabletContent="Compact Nav"
                        desktopContent="Full Navigation"
                    />
                </div>
            </div>
        </div>
    ),
};

export const MediaQueryExamples: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Media Query Examples"
                    subtitle="Common media query patterns and their CSS implementations"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">CSS Media Queries</div>
                        <div className="space-y-3">
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                @media (min-width: 640px) {'{'}
                                <br />
                                &nbsp;&nbsp;/* Small devices and up */
                                <br />
                                {'}'}
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                @media (min-width: 768px) {'{'}
                                <br />
                                &nbsp;&nbsp;/* Medium devices and up */
                                <br />
                                {'}'}
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                @media (min-width: 1024px) {'{'}
                                <br />
                                &nbsp;&nbsp;/* Large devices and up */
                                <br />
                                {'}'}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Tailwind Classes</div>
                        <div className="space-y-3">
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                text-sm md:text-base lg:text-lg
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                px-4 sm:px-6 lg:px-8
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                hidden md:block
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">JavaScript Breakpoints</div>
                        <div className="space-y-3">
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                const isMobile = window.innerWidth {'<'} 640;
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                const isTablet = window.innerWidth {'>='} 768;
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                const isDesktop = window.innerWidth {'>='} 1024;
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">React Hooks</div>
                        <div className="space-y-3">
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                const isMobile = useMediaQuery('(max-width: 639px)');
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                const isTablet = useMediaQuery('(min-width: 768px)');
                            </div>
                            <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                                const isDesktop = useMediaQuery('(min-width: 1024px)');
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const ResponsiveComponents: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Responsive Components"
                    subtitle="Components that adapt to different screen sizes"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Responsive Navigation */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Responsive Navigation</div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded">
                                <div className="text-xs text-primary">Logo</div>
                                <div className="hidden md:flex space-x-2">
                                    <div className="text-xs text-primary px-2 py-1 bg-primary/20 rounded">Home</div>
                                    <div className="text-xs text-primary px-2 py-1 bg-primary/20 rounded">About</div>
                                    <div className="text-xs text-primary px-2 py-1 bg-primary/20 rounded">Contact</div>
                                </div>
                                <div className="md:hidden text-xs text-primary">☰</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Mobile: Hamburger menu | Desktop: Full navigation
                            </div>
                        </div>
                    </div>

                    {/* Responsive Grid */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Responsive Grid</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {Array.from({ length: 6 }, (_, i) => (
                                <div key={i} className="bg-accent/10 border border-accent/20 rounded p-2 text-xs text-accent text-center">
                                    Card {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Mobile: 1 column | Tablet: 2 columns | Desktop: 3 columns
                        </div>
                    </div>

                    {/* Responsive Typography */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Responsive Typography</div>
                        <div className="space-y-2">
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary">
                                Responsive Heading
                            </div>
                            <div className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                                This text adapts to different screen sizes for optimal readability.
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Mobile: Small | Tablet: Medium | Desktop: Large
                        </div>
                    </div>

                    {/* Responsive Spacing */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Responsive Spacing</div>
                        <div className="space-y-2 sm:space-y-4 lg:space-y-6">
                            <div className="bg-secondary/10 border border-secondary/20 rounded p-2 sm:p-4 lg:p-6">
                                <div className="text-xs text-secondary">Content with responsive padding</div>
                            </div>
                            <div className="bg-secondary/10 border border-secondary/20 rounded p-2 sm:p-4 lg:p-6">
                                <div className="text-xs text-secondary">More content with responsive padding</div>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Padding and spacing increase with screen size
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const MobileFirstDesign: Story = {
    render: () => (
        <div className="space-y-16">
            <div>
                <SectionHeader
                    title="Mobile-First Design"
                    subtitle="Design approach that starts with mobile and scales up"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Mobile-First Approach</div>
                        <div className="space-y-3">
                            <div className="text-xs text-muted-foreground">
                                • Start with mobile layout (default styles)
                            </div>
                            <div className="text-xs text-muted-foreground">
                                • Add tablet styles with md: prefix
                            </div>
                            <div className="text-xs text-muted-foreground">
                                • Add desktop styles with lg: prefix
                            </div>
                            <div className="text-xs text-muted-foreground">
                                • Add large desktop styles with xl: prefix
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Benefits</div>
                        <div className="space-y-3">
                            <div className="text-xs text-muted-foreground">
                                • Better performance on mobile devices
                            </div>
                            <div className="text-xs text-muted-foreground">
                                • Forces content prioritization
                            </div>
                            <div className="text-xs text-muted-foreground">
                                • Progressive enhancement approach
                            </div>
                            <div className="text-xs text-muted-foreground">
                                • Easier to maintain and scale
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <div className="text-sm font-medium text-foreground">Example: Mobile-First Layout</div>
                    <div className="space-y-4">
                        <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                            {/* Mobile first - single column */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>Header</div>
                                <div>Content</div>
                                <div>Footer</div>
                            </div>
                        </div>

                        <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                            {/* Tablet - two columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>Header</div>
                                <div>Content</div>
                                <div>Footer</div>
                            </div>
                        </div>

                        <div className="text-xs font-mono bg-muted/10 p-3 rounded">
                            {/* Desktop - three columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>Header</div>
                                <div>Content</div>
                                <div>Footer</div>
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
                    title="Breakpoint Guidelines"
                    subtitle="Best practices for implementing responsive design"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <GuidelinesCard
                            title="Mobile-First Design"
                            items={[
                                "• Start with mobile layout as default",
                                "• Use min-width media queries",
                                "• Progressive enhancement approach",
                                "• Test on actual devices"
                            ]}
                        />

                        <GuidelinesCard
                            title="Breakpoint Usage"
                            items={[
                                "• Use semantic breakpoint names",
                                "• Avoid arbitrary breakpoint values",
                                "• Consider content over device size",
                                "• Test across all breakpoints"
                            ]}
                        />
                    </div>

                    <div className="space-y-4">
                        <GuidelinesCard
                            title="Performance"
                            items={[
                                "• Optimize for mobile performance",
                                "• Use responsive images",
                                "• Minimize layout shifts",
                                "• Consider loading strategies"
                            ]}
                        />

                        <GuidelinesCard
                            title="Accessibility"
                            items={[
                                "• Maintain touch targets on mobile",
                                "• Ensure readable text at all sizes",
                                "• Test with screen readers",
                                "• Consider motion preferences"
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">🚀 Usage Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GuidelinesSection
                        title="Breakpoint Tokens"
                        items={[
                            "• <strong>sm:</strong> 640px - Small tablets",
                            "• <strong>md:</strong> 768px - Tablets",
                            "• <strong>lg:</strong> 1024px - Laptops",
                            "• <strong>xl:</strong> 1280px - Desktops",
                            "• <strong>2xl:</strong> 1536px - Large displays"
                        ]}
                    />
                    <GuidelinesSection
                        title="Common Patterns"
                        items={[
                            "• <strong>Grid Layouts</strong>: grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                            "• <strong>Typography</strong>: text-sm md:text-base lg:text-lg",
                            "• <strong>Spacing</strong>: px-4 md:px-6 lg:px-8",
                            "• <strong>Navigation</strong>: hidden md:block",
                            "• <strong>Images</strong>: w-full md:w-auto"
                        ]}
                    />
                    <GuidelinesSection
                        title="Best Practices"
                        items={[
                            "• <strong>Content First</strong>: Design for content, not devices",
                            "• <strong>Touch Friendly</strong>: 44px minimum touch targets",
                            "• <strong>Performance</strong>: Optimize for mobile networks",
                            "• <strong>Testing</strong>: Test on real devices",
                            "• <strong>Progressive</strong>: Enhance from mobile up"
                        ]}
                    />
                </div>
            </div>
        </div>
    ),
};
