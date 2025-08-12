import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../design-system/tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    Card,
    StatusIndicator,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { Badge } from '../../design-system/components/Badge';
import { Server, Database, Globe, Wifi, Shield, FileText } from 'lucide-react';

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

// Optimized service data with stable keys
const serviceData = [
    {
        id: 'api-gateway',
        name: "API Gateway",
        icon: Wifi,
        status: "Online"
    },
    {
        id: 'auth-service',
        name: "Auth Service",
        icon: Shield,
        status: "Online"
    },
    {
        id: 'file-service',
        name: "File Service",
        icon: FileText,
        status: "Online"
    }
] as const;

// Optimized status indicator data with stable keys
const statusIndicatorData = [
    {
        id: 'api-gateway-status',
        title: "API Gateway",
        status: "online" as const,
        icon: Wifi,
        description: "Handling 1,247 requests/min",
        lastCheck: new Date()
    },
    {
        id: 'database-status',
        title: "Database",
        status: "online" as const,
        icon: Database,
        description: "45 active connections",
        lastCheck: new Date()
    },
    {
        id: 'auth-service-status',
        title: "Auth Service",
        status: "online" as const,
        icon: Shield,
        description: "Processing 89 auth requests",
        lastCheck: new Date()
    },
    {
        id: 'file-service-status',
        title: "File Service",
        status: "online" as const,
        icon: FileText,
        description: "2.3GB storage used",
        lastCheck: new Date()
    },
    {
        id: 'cache-service-status',
        title: "Cache Service",
        status: "warning" as const,
        icon: Server,
        description: "67% memory usage",
        lastCheck: new Date()
    },
    {
        id: 'email-service-status',
        title: "Email Service",
        status: "offline" as const,
        icon: Globe,
        description: "Connection timeout",
        lastCheck: new Date(Date.now() - 300000)
    }
] as const;

// Memoized banner icon
const BannerIcon = React.memo(() => <Icon icon={Server} size="lg" />);

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Health Monitoring',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="System Health Monitoring"
                        subtitle="Comprehensive health monitoring for system components, database, and network services"
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

// Optimized health card component with design system principles
const HealthCard = React.memo<{
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    iconBgColor: string;
    iconColor: string;
    children: React.ReactNode;
}>(({ title, description, icon, iconBgColor, iconColor, children }) => (
    <Card>
        <div style={{ padding: tokens.spacing[6] }} className="p-6">
            <div 
                className="flex items-center mb-4"
                style={{ marginBottom: tokens.spacing[4] }}
            >
                <div 
                    className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center mr-3`}
                    style={{ 
                        width: tokens.spacing[10],
                        height: tokens.spacing[10],
                        marginRight: tokens.spacing[3],
                        borderRadius: tokens.borderRadius.lg
                    }}
                >
                    <Icon icon={icon} className={iconColor} />
                </div>
                <div>
                    <h3 style={subtitleStyle}>{title}</h3>
                    <p style={captionStyle} className="text-muted-foreground">{description}</p>
                </div>
            </div>
            {children}
        </div>
    </Card>
));

// Optimized system health component with design system spacing
const SystemHealth = React.memo(() => (
    <HealthCard
        title="System Health"
        description="Core status"
        icon={Server}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
    >
        <div style={{ gap: tokens.spacing[4] }} className="space-y-4">
            <div 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                style={{ 
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.lg
                }}
            >
                <span style={captionStyle} className="font-medium">Status</span>
                <Badge variant="default" className="font-medium">HEALTHY</Badge>
            </div>
            <div 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                style={{ 
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.lg
                }}
            >
                <span style={captionStyle} className="font-medium">Last Check</span>
                <span style={captionStyle} className="text-muted-foreground">{new Date().toLocaleString()}</span>
            </div>
            <div 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                style={{ 
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.lg
                }}
            >
                <span style={captionStyle} className="font-medium">Uptime</span>
                <span style={captionStyle} className="text-muted-foreground">15 days, 8 hours</span>
            </div>
        </div>
    </HealthCard>
));

// Optimized database health component with design system spacing
const DatabaseHealth = React.memo(() => (
    <HealthCard
        title="Database Health"
        description="Connection status"
        icon={Database}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
    >
        <div style={{ gap: tokens.spacing[4] }} className="space-y-4">
            <div 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                style={{ 
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.lg
                }}
            >
                <span style={captionStyle} className="font-medium">Status</span>
                <Badge variant="default" className="font-medium">CONNECTED</Badge>
            </div>
            <div 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                style={{ 
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.lg
                }}
            >
                <span style={captionStyle} className="font-medium">Connection</span>
                <span style={captionStyle} className="text-muted-foreground">45 active</span>
            </div>
            <div 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                style={{ 
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.lg
                }}
            >
                <span style={captionStyle} className="font-medium">Response Time</span>
                <span style={captionStyle} className="text-muted-foreground">12 ms</span>
            </div>
        </div>
    </HealthCard>
));

// Optimized service item component with design system spacing and colors
const ServiceItem = React.memo<{ service: typeof serviceData[0] }>(({ service }) => (
    <div 
        className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors"
        style={{ 
            padding: tokens.spacing[4],
            borderRadius: tokens.borderRadius.lg
        }}
    >
        <div className="flex items-center gap-3">
            <div 
                className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
                style={{ 
                    width: tokens.spacing[8],
                    height: tokens.spacing[8],
                    borderRadius: tokens.borderRadius.lg
                }}
            >
                <Icon icon={service.icon} size="sm" className="text-green-600" />
            </div>
            <span style={captionStyle} className="font-medium">{service.name}</span>
        </div>
        <Badge variant="default" className="font-medium">{service.status}</Badge>
    </div>
));

// Optimized network services component with design system spacing
const NetworkServices = React.memo(() => (
    <HealthCard
        title="Network & Services"
        description="Connectivity status"
        icon={Globe}
        iconBgColor="bg-indigo-100"
        iconColor="text-indigo-600"
    >
        <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{ gap: tokens.spacing[4] }}
        >
            {serviceData.map((service) => (
                <ServiceItem key={service.id} service={service} />
            ))}
        </div>
    </HealthCard>
));

export const SystemHealthOverview: Story = {
    render: () => (
        <div style={{ gap: tokens.spacing[8] }} className="space-y-8">
            <SectionHeader
                title="System Health Monitoring"
                subtitle="Real-time monitoring of system components, database connections, and network services"
            />

            <Container>
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    style={{ gap: tokens.spacing[6], marginBottom: tokens.spacing[8] }}
                >
                    <SystemHealth />
                    <DatabaseHealth />
                </div>
                <NetworkServices />
            </Container>
        </div>
    ),
};

// Optimized status indicators component with stable keys and design system spacing
const StatusIndicators = React.memo(() => (
    <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ gap: tokens.spacing[6] }}
    >
        {statusIndicatorData.map((item) => (
            <StatusIndicator
                key={item.id}
                title={item.title}
                status={item.status}
                icon={<Icon icon={item.icon} />}
                description={item.description}
                lastCheck={item.lastCheck}
            />
        ))}
    </div>
));

export const ServiceStatus: Story = {
    render: () => (
        <div style={{ gap: tokens.spacing[8] }} className="space-y-8">
            <SectionHeader
                title="Service Status Dashboard"
                subtitle="Detailed status monitoring for all system services"
            />

            <Container>
                <StatusIndicators />
            </Container>
        </div>
    ),
};
