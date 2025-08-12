import React, { Suspense, lazy } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title, Stories } from '@storybook/blocks';
import { tokens } from '../../design-system/tokens';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { BarChart3, Loader2 } from 'lucide-react';
import { AdminSectionErrorBoundary } from '../../components/ErrorBoundary';

// Lazy load the heavy AdminDashboard component
const AdminDashboard = lazy(() => import('../../components/AdminDashboard/AdminDashboard'));

// Optimized icon component with design system principles
const Icon = React.memo<{ icon: React.ComponentType<any>; size?: 'sm' | 'md' | 'lg'; className?: string }>(
    ({ icon: IconComponent, size = 'md', className = '' }) => {
        const sizeClasses = {
            sm: 'h-4 w-4',
            md: 'h-5 w-5',
            lg: 'h-6 w-6'
        };
        return <IconComponent className={`${sizeClasses[size]} ${className}`} />;
    }
);

// Memoized banner icon
const BannerIcon = React.memo(() => <Icon icon={BarChart3} size="lg" />);

// Stable callback function
const handleRetry = () => window.location.reload();

// Loading fallback component with design system spacing and typography
const LoadingFallback = React.memo(() => (
    <div 
        className="flex items-center justify-center"
        style={{ padding: tokens.spacing[12] }}
    >
        <div className="flex items-center gap-3">
            <Icon icon={Loader2} className="animate-spin" />
            <span 
                style={applyTypographyStyle('body')}
                className="text-muted-foreground"
            >
                Loading Admin Dashboard...
            </span>
        </div>
    </div>
));

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Overview',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Admin Dashboard Overview"
                        subtitle="Complete system monitoring and management interface with real-time metrics and comprehensive controls"
                        icon={<BannerIcon />}
                    />
                    <Stories includePrimary={false} />
                </>
            ),
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen bg-background">
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof meta>;

// Memoized dashboard overview component with design system principles
const DashboardOverviewComponent = React.memo(() => (
    <div style={{ gap: tokens.spacing[12] }} className="space-y-12">
        <SectionHeader
            title="Admin Dashboard Overview"
            subtitle="Complete system monitoring and management interface with real-time metrics and comprehensive controls"
        />

        <AdminSectionErrorBoundary
            sectionName="Admin Dashboard"
            onRetry={handleRetry}
        >
            <Container>
                <Suspense fallback={<LoadingFallback />}>
                    <AdminDashboard />
                </Suspense>
            </Container>
        </AdminSectionErrorBoundary>
    </div>
));

export const DashboardOverview: Story = {
    render: () => <DashboardOverviewComponent />,
    parameters: {
        // Add performance parameters to prevent freezing
        docs: {
            disable: true, // Disable docs for heavy components
        },
        controls: {
            disable: true, // Disable controls to reduce overhead
        },
    },
};
