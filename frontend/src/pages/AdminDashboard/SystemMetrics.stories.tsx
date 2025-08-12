import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../design-system/tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    Card,
    MetricCard,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { Progress } from '../../design-system/components/Progress';
import { Cpu, HardDrive, Clock, Zap } from 'lucide-react';

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

// Memoized typography styles using design system
const subtitleStyle = applyTypographyStyle('subtitle');
const bodyStyle = applyTypographyStyle('body');
const captionStyle = applyTypographyStyle('caption');

// Optimized metric data with stable keys and design system colors
const metricData = [
    {
        id: 'cpu',
        title: "CPU Usage",
        value: "45.2%",
        status: "optimal" as const,
        icon: Cpu,
        color: tokens.colors.primary[500]
    },
    {
        id: 'memory',
        title: "Memory Usage",
        value: "67.8%",
        status: "warning" as const,
        icon: HardDrive,
        color: tokens.colors.warning[500]
    },
    {
        id: 'disk',
        title: "Disk Usage",
        value: "23.4%",
        status: "healthy" as const,
        icon: HardDrive,
        color: tokens.colors.accent[500]
    },
    {
        id: 'error',
        title: "Error Rate",
        value: "1.2%",
        status: "low" as const,
        icon: Cpu,
        color: tokens.colors.danger
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
        style={{ gap: tokens.spacing[6], marginBottom: tokens.spacing[8] }}
    >
        {metricData.map((metric) => (
            <MetricCard
                key={metric.id}
                title={metric.title}
                value={metric.value}
                status={metric.status}
                icon={<Icon icon={metric.icon} />}
                color={metric.color}
            />
        ))}
    </div>
));

// Optimized progress bars component with stable keys and design system typography
const ProgressBars = React.memo(() => (
    <div style={{ gap: tokens.spacing[4] }} className="space-y-4">
        {progressData.map((item) => (
            <div key={item.id}>
                <div 
                    className="flex justify-between text-sm mb-1"
                    style={{ marginBottom: tokens.spacing[1] }}
                >
                    <span style={captionStyle}>{item.label}</span>
                    <span style={captionStyle}>{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
            </div>
        ))}
    </div>
));

// Optimized system info component with stable keys and design system typography
const SystemInfo = React.memo(() => (
    <div style={{ gap: tokens.spacing[3] }} className="space-y-3">
        {systemInfoData.map((item) => (
            <div key={item.id} className="flex justify-between">
                <span style={captionStyle} className="text-muted-foreground">{item.label}</span>
                <span style={captionStyle} className="font-medium">{item.value}</span>
            </div>
        ))}
    </div>
));

// Optimized card wrapper component with design system spacing and typography
const CardWrapper = React.memo<{ title: string; children: React.ReactNode }>(
    ({ title, children }) => (
        <Card>
            <div style={{ padding: tokens.spacing[6] }} className="p-6">
                <h3 
                    style={{ ...subtitleStyle, marginBottom: tokens.spacing[4] }} 
                    className="mb-4"
                >
                    {title}
                </h3>
                {children}
            </div>
        </Card>
    )
);

export const SystemMetricsOverview: Story = {
    render: () => (
        <div style={{ gap: tokens.spacing[8] }} className="space-y-8">
            <SectionHeader
                title="System Performance Metrics"
                subtitle="Real-time monitoring of CPU, memory, disk usage and system performance"
            />

            <Container>
                <MetricCards />

                <div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    style={{ gap: tokens.spacing[6] }}
                >
                    <CardWrapper title="Performance Trends">
                        <ProgressBars />
                    </CardWrapper>

                    <CardWrapper title="System Information">
                        <SystemInfo />
                    </CardWrapper>
                </div>
            </Container>
        </div>
    ),
};

// Optimized performance metrics component with design system principles
const PerformanceMetrics = React.memo(() => (
    <div style={{ gap: tokens.spacing[8] }} className="space-y-8">
        <div style={{ gap: tokens.spacing[4] }} className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon icon={Cpu} size="sm" />
                    <span style={captionStyle}>CPU Usage</span>
                </div>
                <span style={subtitleStyle}>45.2%</span>
            </div>
            <Progress value={45.2} className="h-2" />
        </div>
        <div style={{ gap: tokens.spacing[4] }} className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon icon={HardDrive} size="sm" />
                    <span style={captionStyle}>Disk Usage</span>
                </div>
                <span style={subtitleStyle}>23.4%</span>
            </div>
            <Progress value={23.4} className="h-2" />
        </div>
        <div 
            className="pt-6 border-t border-border"
            style={{ 
                paddingTop: tokens.spacing[6],
                borderTop: `1px solid ${tokens.colors.border}`
            }}
        >
            <div 
                className="grid grid-cols-2 gap-6"
                style={{ gap: tokens.spacing[6] }}
            >
                <div>
                    <div 
                        className="flex items-center gap-3 text-muted-foreground mb-2"
                        style={{ marginBottom: tokens.spacing[2] }}
                    >
                        <Icon icon={Zap} size="sm" />
                        <span style={captionStyle}>Requests/24h</span>
                    </div>
                    <div style={subtitleStyle}>15,420</div>
                </div>
                <div>
                    <div 
                        className="flex items-center gap-3 text-muted-foreground mb-2"
                        style={{ marginBottom: tokens.spacing[2] }}
                    >
                        <Icon icon={Clock} size="sm" />
                        <span style={captionStyle}>Avg Response</span>
                    </div>
                    <div style={subtitleStyle}>245 ms</div>
                </div>
            </div>
        </div>
    </div>
));

// Optimized header component with design system spacing and colors
const PerformanceHeader = React.memo(() => (
    <div 
        className="flex items-center mb-6"
        style={{ marginBottom: tokens.spacing[6] }}
    >
        <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
            style={{ 
                width: tokens.spacing[12],
                height: tokens.spacing[12],
                marginRight: tokens.spacing[4],
                background: `${tokens.colors.primary[500]}10`,
                borderRadius: tokens.borderRadius.xl
            }}
        >
            <Icon icon={Cpu} size="lg" />
        </div>
        <div>
            <h3 style={subtitleStyle}>Performance</h3>
            <p style={captionStyle} className="text-muted-foreground">Key metrics</p>
        </div>
    </div>
));

export const PerformanceMonitoring: Story = {
    render: () => (
        <div style={{ gap: tokens.spacing[8] }} className="space-y-8">
            <SectionHeader
                title="Performance Monitoring"
                subtitle="Detailed performance metrics with real-time tracking"
            />

            <Container>
                <Card>
                    <div style={{ padding: tokens.spacing[6] }} className="p-6">
                        <PerformanceHeader />
                        <PerformanceMetrics />
                    </div>
                </Card>
            </Container>
        </div>
    ),
};
