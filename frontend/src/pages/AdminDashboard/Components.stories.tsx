import React, { Suspense, lazy } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title, Stories } from '@storybook/blocks';
import { tokens } from '../../design-system/tokens';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    Card,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { Settings, Loader2 } from 'lucide-react';

// Lazy load heavy components to prevent freezing
const DataManagement = lazy(() => import('../../components/AdminDashboard/DataManagement'));
const DashboardCustomization = lazy(() => import('../../components/AdminDashboard/DashboardCustomization').then(module => ({ default: module.DashboardCustomization })));
const MaintenanceTools = lazy(() => import('../../components/AdminDashboard/MaintenanceTools').then(module => ({ default: module.MaintenanceTools })));
const UserManagement = lazy(() => import('../../components/AdminDashboard/UserManagement'));
const SystemMonitoring = lazy(() => import('../../components/AdminDashboard/SystemMonitoring'));
const LogFilterForm = lazy(() => import('../../components/AdminDashboard/LogFilterForm'));

// Memoized typography styles using design system
const subtitleStyle = applyTypographyStyle('subtitle');
const bodyStyle = applyTypographyStyle('body');

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
const BannerIcon = React.memo(() => <Icon icon={Settings} size="lg" />);

// Stable callback functions (no hooks at module level)
const noop = () => { };
const handleConfigChange = (config: any) => {
    console.log('Dashboard config changed:', config);
};

// Static props objects (no hooks at module level)
const logFilterFormProps = {
    level: "all" as const,
    limit: 50,
    from: "",
    to: "",
    search: "",
    skip: 0,
    total: 0,
    onChange: noop,
    onRefresh: noop,
    onPrev: noop,
    onNext: noop
};

const dashboardCustomizationProps = {
    userRole: "admin" as const,
    onConfigChange: handleConfigChange
};

// Loading fallback component with design system spacing and typography
const LoadingFallback = React.memo(() => (
    <div
        className="flex items-center justify-center"
        style={{ padding: tokens.spacing[8] }}
    >
        <div className="flex items-center gap-3">
            <Icon icon={Loader2} className="animate-spin" />
            <span
                style={bodyStyle}
                className="text-muted-foreground"
            >
                Loading component...
            </span>
        </div>
    </div>
));

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Components',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Admin Dashboard Components"
                        subtitle="Individual components and tools for the admin dashboard system"
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

// Optimized component wrapper with props and lazy loading using design system
const ComponentWrapper = React.memo<{
    title: string;
    subtitle: string;
    children: React.ReactNode;
    useCard?: boolean;
    cardTitle?: string;
}>(({ title, subtitle, children, useCard = false, cardTitle }) => (
    <div style={{ gap: tokens.spacing[8] }} className="space-y-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <Container>
            {useCard ? (
                <Card>
                    <div style={{ padding: tokens.spacing[6] }} className="p-6">
                        {cardTitle && (
                            <h2
                                style={{ ...subtitleStyle, marginBottom: tokens.spacing[6] }}
                                className="mb-6"
                            >
                                {cardTitle}
                            </h2>
                        )}
                        <Suspense fallback={<LoadingFallback />}>
                            {children}
                        </Suspense>
                    </div>
                </Card>
            ) : (
                <Suspense fallback={<LoadingFallback />}>
                    {children}
                </Suspense>
            )}
        </Container>
    </div>
));

export const DataManagementComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Data Management Component"
            subtitle="Comprehensive data management and analytics tools"
        >
            <DataManagement />
        </ComponentWrapper>
    ),
    parameters: {
        docs: { disable: true },
        controls: { disable: true },
    },
};

export const DashboardCustomizationComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Dashboard Customization Component"
            subtitle="Customize dashboard layout and preferences"
            useCard={true}
            cardTitle="Dashboard Customization"
        >
            <DashboardCustomization {...dashboardCustomizationProps} />
        </ComponentWrapper>
    ),
    parameters: {
        docs: { disable: true },
        controls: { disable: true },
    },
};

export const MaintenanceToolsComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Maintenance Tools Component"
            subtitle="System maintenance and administrative tools"
        >
            <MaintenanceTools />
        </ComponentWrapper>
    ),
    parameters: {
        docs: { disable: true },
        controls: { disable: true },
    },
};

export const UserManagementComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="User Management Component"
            subtitle="Complete user management interface"
        >
            <UserManagement />
        </ComponentWrapper>
    ),
    parameters: {
        docs: { disable: true },
        controls: { disable: true },
    },
};

export const SystemMonitoringComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="System Monitoring Component"
            subtitle="Real-time system monitoring and metrics"
        >
            <SystemMonitoring refreshInterval={30000} />
        </ComponentWrapper>
    ),
    parameters: {
        docs: { disable: true },
        controls: { disable: true },
    },
};

export const LogFilterFormComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Log Filter Form Component"
            subtitle="Advanced log filtering and search capabilities"
            useCard={true}
            cardTitle="Log Filter Form"
        >
            <LogFilterForm {...logFilterFormProps} />
        </ComponentWrapper>
    ),
    parameters: {
        docs: { disable: true },
        controls: { disable: true },
    },
};
