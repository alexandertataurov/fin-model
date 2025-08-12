import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../design-system/tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { Progress } from '../../design-system/components/Progress';
import { Cpu, HardDrive, Clock, Zap } from 'lucide-react';
import { AdminCard } from '../../components/AdminDashboard/components/AdminCard';
import { AdminTitle, AdminSubtitle, AdminBody, AdminCaption } from '../../components/AdminDashboard/components/AdminTypography';
import { getSemanticSpacing, getSemanticColor, getStatusColor } from '../../components/AdminDashboard/utils/designSystemHelpers';

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

// Pre-computed spacing using design system helpers
const componentSpacing = getSemanticSpacing('component');
const layoutSpacing = getSemanticSpacing('layout');

// Optimized metric data with stable keys and design system colors
const metricData = [
    {
        id: 'cpu',
        title: "CPU Usage",
        value: "45.2%",
        status: "optimal" as const,
        icon: Cpu,
        color: getSemanticColor('success')
    },
    {
        id: 'memory',
        title: "Memory Usage",
        value: "67.8%",
        status: "warning" as const,
        icon: HardDrive,
        color: getSemanticColor('warning')
    },
    {
        id: 'disk',
        title: "Disk Usage",
        value: "23.4%",
        status: "healthy" as const,
        icon: HardDrive,
        color: getSemanticColor('info')
    },
    {
        id: 'error',
        title: "Error Rate",
        value: "1.2%",
        status: "low" as const,
        icon: Cpu,
        color: getSemanticColor('danger')
    }
] as const;

// Optimized progress data with stable keys
const progressData = [
    { id: 'cpu-progress', label: "CPU Usage", value: 45.2 },
    { id: 'memory-progress', label: "Memory Usage", value: 67.8 },
    { id: 'disk-progress', label: "Disk Usage", value: 23.4 }
] as const;

// Optimized system info data with stable keys
const systemInfoData = [
    { id: 'uptime', label: "Uptime", value: "15 days, 8 hours" },
    { id: 'users', label: "Active Users", value: "1,247" },
    { id: 'requests', label: "Total Requests (24h)", value: "15,420" },
    { id: 'response', label: "Avg Response Time", value: "245ms" }
] as const;

// Memoized banner icon
const BannerIcon = React.memo(() => <Icon icon={Cpu} size="lg" />);

const meta: Meta = {
    title: 'Pages/Admin Dashboard/System Metrics',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="System Performance Metrics"
                        subtitle="Real-time system monitoring with comprehensive metrics and performance tracking"
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

// Optimized metric cards component with stable keys and design system spacing
const MetricCards = React.memo(() => (
    <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        style={{ gap: componentSpacing.padding, marginBottom: layoutSpacing.page }}
    >
        {metricData.map((metric) => (
            <AdminCard
                key={metric.id}
                title={metric.title}
                subtitle={metric.status}
                variant="elevated"
                size="md"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon icon={metric.icon} />
                        <div>
                            <AdminTitle style={{ color: metric.color }}>{metric.value}</AdminTitle>
                            <AdminCaption>{metric.status}</AdminCaption>
                        </div>
                    </div>
                </div>
            </AdminCard>
        ))}
    </div>
));

// Optimized progress bars component with stable keys and design system typography
const ProgressBars = React.memo(() => (
    <div style={{ gap: componentSpacing.gap }} className="space-y-4">
        {progressData.map((item) => (
            <div key={item.id}>
                <div className="flex justify-between text-sm mb-1">
                    <AdminCaption>{item.label}</AdminCaption>
                    <AdminCaption>{item.value}%</AdminCaption>
                </div>
                <Progress value={item.value} className="h-2" />
            </div>
        ))}
    </div>
));

// Optimized system info component with stable keys and design system typography
const SystemInfo = React.memo(() => (
    <div style={{ gap: componentSpacing.gap }} className="space-y-3">
        {systemInfoData.map((item) => (
            <div key={item.id} className="flex justify-between">
                <AdminCaption className="text-muted-foreground">{item.label}</AdminCaption>
                <AdminCaption className="font-medium">{item.value}</AdminCaption>
            </div>
        ))}
    </div>
));

export const SystemMetricsOverview: Story = {
    render: () => (
        <div style={{ gap: layoutSpacing.section }} className="space-y-8">
            <SectionHeader
                title="System Performance Metrics"
                subtitle="Real-time monitoring of CPU, memory, disk usage and system performance"
            />

            <Container>
                <MetricCards />

                <div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    style={{ gap: componentSpacing.padding }}
                >
                    <AdminCard
                        title="Performance Trends"
                        subtitle="System performance over time"
                        variant="elevated"
                        size="md"
                    >
                        <ProgressBars />
                    </AdminCard>

                    <AdminCard
                        title="System Information"
                        subtitle="Current system status and metrics"
                        variant="elevated"
                        size="md"
                    >
                        <SystemInfo />
                    </AdminCard>
                </div>
            </Container>
        </div>
    ),
};

// Optimized performance metrics component with design system principles
const PerformanceMetrics = React.memo(() => (
    <div style={{ gap: layoutSpacing.section }} className="space-y-8">
        <div style={{ gap: componentSpacing.gap }} className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon icon={Cpu} size="sm" />
                    <AdminCaption>CPU Usage</AdminCaption>
                </div>
                <AdminSubtitle>45.2%</AdminSubtitle>
            </div>
            <Progress value={45.2} className="h-2" />
        </div>
        <div style={{ gap: componentSpacing.gap }} className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon icon={HardDrive} size="sm" />
                    <AdminCaption>Disk Usage</AdminCaption>
                </div>
                <AdminSubtitle>23.4%</AdminSubtitle>
            </div>
            <Progress value={23.4} className="h-2" />
        </div>
        <div className="pt-6 border-t border-border">
            <div 
                className="grid grid-cols-2 gap-6"
                style={{ gap: componentSpacing.padding }}
            >
                <div>
                    <div className="flex items-center gap-3 text-muted-foreground mb-2">
                        <Icon icon={Zap} size="sm" />
                        <AdminCaption>Requests/24h</AdminCaption>
                    </div>
                    <AdminSubtitle>15,420</AdminSubtitle>
                </div>
                <div>
                    <div className="flex items-center gap-3 text-muted-foreground mb-2">
                        <Icon icon={Clock} size="sm" />
                        <AdminCaption>Avg Response</AdminCaption>
                    </div>
                    <AdminSubtitle>245 ms</AdminSubtitle>
                </div>
            </div>
        </div>
    </div>
));

// Optimized header component with design system spacing and colors
const PerformanceHeader = React.memo(() => (
    <div className="flex items-center mb-6">
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
            style={{
                background: `${getSemanticColor('info')}10`,
                borderRadius: tokens.borderRadius.xl
            }}
        >
            <Icon icon={Cpu} size="lg" />
        </div>
        <div>
            <AdminSubtitle>Performance</AdminSubtitle>
            <AdminCaption className="text-muted-foreground">Key metrics</AdminCaption>
        </div>
    </div>
));

export const PerformanceMonitoring: Story = {
    render: () => (
        <div style={{ gap: layoutSpacing.section }} className="space-y-8">
            <SectionHeader
                title="Performance Monitoring"
                subtitle="Detailed performance metrics with real-time tracking"
            />

            <Container>
                <AdminCard
                    title="Performance Dashboard"
                    subtitle="Real-time system performance monitoring"
                    variant="elevated"
                    size="lg"
                >
                    <PerformanceHeader />
                    <PerformanceMetrics />
                </AdminCard>
            </Container>
        </div>
    ),
};
