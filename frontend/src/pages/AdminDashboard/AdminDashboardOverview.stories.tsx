import React, { Suspense, lazy } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { BarChart3, Loader2 } from 'lucide-react';
import { AdminSectionErrorBoundary } from '../../components/ErrorBoundary';
import { AdminCard } from '../../components/AdminDashboard/components/AdminCard';
import { AdminTitle, AdminCaption } from '../../components/AdminDashboard/components/AdminTypography';
import { tokens } from '../../design-system/tokens';
import { getSemanticSpacing } from '../../components/AdminDashboard/utils/designSystemHelpers';

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

// Pre-computed typography styles to prevent re-computation
const bodyStyle = applyTypographyStyle('body');

// Pre-computed spacing using design system helpers
const layoutSpacing = getSemanticSpacing('layout');

// Loading fallback component with design system spacing and typography
const LoadingFallback = React.memo(() => (
    <AdminCard
        title="Loading Admin Dashboard"
        subtitle="Please wait while we load the dashboard components"
        variant="elevated"
        size="lg"
    >
        <div 
            className="flex items-center justify-center"
            style={{ padding: layoutSpacing.section }}
        >
            <div className="flex items-center gap-3">
                <Icon icon={Loader2} className="animate-spin" />
                <span 
                    style={bodyStyle}
                    className="text-muted-foreground"
                >
                    Loading Admin Dashboard...
                </span>
            </div>
        </div>
    </AdminCard>
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
    <div style={{ gap: layoutSpacing.section }} className="space-y-12">
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
