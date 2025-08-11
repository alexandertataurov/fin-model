import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../design-system/tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    Card,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { Badge } from '../../design-system/components/Badge';
import { Shield, FileText, AlertCircle, CheckCircle } from 'lucide-react';

// Optimized icon component with props
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

// Memoized typography styles
const subtitleStyle = applyTypographyStyle('subtitle');

// Optimized security audit data with stable keys
const securityAuditData = [
    {
        id: 'failed-login',
        type: "Failed login attempt",
        description: "Multiple failed login attempts detected",
        severity: "medium" as const,
        timestamp: new Date(),
        status: "warning"
    },
    {
        id: 'data-access',
        type: "Data access",
        description: "Sensitive data accessed by admin user",
        severity: "low" as const,
        timestamp: new Date(Date.now() - 3600000),
        status: "success"
    }
] as const;

// Optimized audit logs data with stable keys
const auditLogsData = [
    {
        id: 'user-login',
        type: "User login",
        path: "/auth/login",
        status: "Success" as const,
        timestamp: new Date(),
        user: "A",
        color: "blue"
    },
    {
        id: 'data-export',
        type: "Data export",
        path: "/api/export",
        status: "Success" as const,
        timestamp: new Date(Date.now() - 1800000),
        user: "A",
        color: "green"
    }
] as const;

// Optimized security alerts data with stable keys
const securityAlertsData = [
    {
        id: 'high-cpu',
        title: "High CPU Usage",
        description: "CPU usage at 78.5%. Consider scaling up resources.",
        severity: "destructive" as const,
        icon: AlertCircle,
        badge: "Critical"
    },
    {
        id: 'disk-warning',
        title: "Disk Usage Warning",
        description: "Disk usage at 67.8%. Consider cleanup.",
        severity: "warning" as const,
        icon: AlertCircle,
        badge: "Warning"
    },
    {
        id: 'all-healthy',
        title: "All Systems Healthy",
        description: "All system metrics are within normal ranges.",
        severity: "success" as const,
        icon: CheckCircle,
        badge: "Info"
    }
] as const;

// Memoized banner icon
const BannerIcon = React.memo(() => <Icon icon={Shield} size="lg" />);

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Security Audit',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Security Audit & Logs"
                        subtitle="Comprehensive security monitoring, audit trails, and event logging"
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

// Optimized audit card component
const AuditCard = React.memo<{ 
    title: string; 
    description: string; 
    icon: React.ComponentType<any>;
    iconBgColor: string;
    iconColor: string;
    children: React.ReactNode;
}>(({ title, description, icon, iconBgColor, iconColor, children }) => (
    <Card>
        <div className="p-6">
            <div className="flex items-center mb-4">
                <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center mr-3`}>
                    <Icon icon={icon} className={iconColor} />
                </div>
                <div>
                    <h3 style={subtitleStyle}>{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            {children}
        </div>
    </Card>
));

// Optimized security audit item component
const SecurityAuditItem = React.memo<{ item: typeof securityAuditData[0] }>(({ item }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 bg-${item.status === "warning" ? "yellow" : "green"}-500 rounded-full`}></div>
            <div>
                <p className="font-medium text-foreground">{item.type}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
        </div>
        <div className="text-right">
            <Badge variant={item.severity === "medium" ? "secondary" : "default"}>{item.severity}</Badge>
            <p className="text-xs text-muted-foreground mt-1">{item.timestamp.toLocaleString()}</p>
        </div>
    </div>
));

// Optimized audit log item component
const AuditLogItem = React.memo<{ item: typeof auditLogsData[0] }>(({ item }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-${item.color}-100 rounded-full flex items-center justify-center`}>
                <span className={`text-sm font-medium text-${item.color}-700`}>{item.user}</span>
            </div>
            <div>
                <p className="font-medium text-foreground">{item.type}</p>
                <p className="text-sm text-muted-foreground">{item.path}</p>
            </div>
        </div>
        <div className="text-right">
            <Badge variant="default">{item.status}</Badge>
            <p className="text-xs text-muted-foreground mt-1">{item.timestamp.toLocaleString()}</p>
        </div>
    </div>
));

// Optimized security audit component
const SecurityAudit = React.memo(() => (
    <AuditCard
        title="Security Audit"
        description="Security events monitoring"
        icon={Shield}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
    >
        <div className="space-y-4">
            {securityAuditData.map((item) => (
                <SecurityAuditItem key={item.id} item={item} />
            ))}
        </div>
    </AuditCard>
));

// Optimized audit logs component
const AuditLogs = React.memo(() => (
    <AuditCard
        title="Audit Logs"
        description="User actions & changes"
        icon={FileText}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
    >
        <div className="space-y-4">
            {auditLogsData.map((item) => (
                <AuditLogItem key={item.id} item={item} />
            ))}
        </div>
    </AuditCard>
));

export const SecurityAuditOverview: Story = {
    render: () => (
        <div className="space-y-8">
            <SectionHeader
                title="Security Audit & Logs"
                subtitle="Comprehensive security monitoring, audit trails, and event logging"
            />

            <Container>
                <div className="space-y-6">
                    <SecurityAudit />
                    <AuditLogs />
                </div>
            </Container>
        </div>
    ),
};

// Optimized security alert item component
const SecurityAlertItem = React.memo<{ alert: typeof securityAlertsData[0] }>(({ alert }) => (
    <Card>
        <div className="p-6">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${alert.severity === "destructive" ? "text-destructive" : alert.severity === "warning" ? "text-warning" : "text-success"}`}>
                    <Icon icon={alert.icon} />
                </div>
                <div className="flex-1">
                    <div className={`font-semibold mb-2 ${alert.severity === "destructive" ? "text-destructive" : alert.severity === "warning" ? "text-warning" : "text-success"}`}>
                        {alert.title}
                    </div>
                    <p className={`${alert.severity === "destructive" ? "text-destructive/80" : alert.severity === "warning" ? "text-warning/80" : "text-success/80"}`}>
                        {alert.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <Badge variant={alert.severity === "destructive" ? "destructive" : alert.severity === "warning" ? "secondary" : "default"}>
                            {alert.badge}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{new Date().toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    </Card>
));

export const SecurityAlerts: Story = {
    render: () => (
        <div className="space-y-8">
            <SectionHeader
                title="Security Alerts"
                subtitle="Real-time security notifications and threat detection"
            />

            <Container>
                <div className="space-y-4">
                    {securityAlertsData.map((alert) => (
                        <SecurityAlertItem key={alert.id} alert={alert} />
                    ))}
                </div>
            </Container>
        </div>
    ),
};
