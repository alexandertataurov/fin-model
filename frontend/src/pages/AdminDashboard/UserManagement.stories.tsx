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
import { Button } from '../../design-system/components/Button';
import { Users, MoreHorizontal } from 'lucide-react';

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

// Optimized user activity data with stable keys
const userActivityData = [
    {
        id: 'admin',
        name: "admin",
        initial: "A",
        color: "blue",
        lastLogin: new Date(),
        logins: 156,
        status: "Active"
    },
    {
        id: 'analyst',
        name: "analyst",
        initial: "A",
        color: "green",
        lastLogin: new Date(Date.now() - 3600000),
        logins: 89,
        status: "Active"
    },
    {
        id: 'manager',
        name: "manager",
        initial: "M",
        color: "purple",
        lastLogin: new Date(Date.now() - 7200000),
        logins: 45,
        status: "Inactive"
    }
] as const;

// Optimized user statistics data with stable keys
const userStatsData = [
    { id: 'total', label: "Total Users", value: "1,247", color: "primary" },
    { id: 'active', label: "Active Users", value: "1,156", color: "success" },
    { id: 'pending', label: "Pending Approval", value: "67", color: "warning" },
    { id: 'suspended', label: "Suspended", value: "24", color: "destructive" }
] as const;

// Optimized role distribution data with stable keys
const roleDistributionData = [
    { id: 'admins', role: "Administrators", users: 12, percentage: "1%", color: "primary" },
    { id: 'managers', role: "Managers", users: 89, percentage: "7%", color: "success" },
    { id: 'analysts', role: "Analysts", users: 234, percentage: "19%", color: "warning" },
    { id: 'regular', role: "Regular Users", users: 912, percentage: "73%", color: "muted-foreground" }
] as const;

// Memoized banner icon
const BannerIcon = React.memo(() => <Icon icon={Users} size="lg" />);

const meta: Meta = {
    title: 'Pages/Admin Dashboard/User Management',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="User Management & Activity"
                        subtitle="Comprehensive user management, activity tracking, and role-based access control"
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

// Optimized user activity item component
const UserActivityItem = React.memo<{ user: typeof userActivityData[0] }>(({ user }) => (
    <div className="flex items-center justify-between p-6 rounded-xl hover:bg-muted/50 transition-all duration-200">
        <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 bg-gradient-to-br from-${user.color}-20 to-${user.color}-30 rounded-full flex items-center justify-center`}>
                <span className={`text-${user.color}-700 font-semibold`}>{user.initial}</span>
            </div>
            <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                    Last login: {user.lastLogin.toLocaleString()}
                </p>
            </div>
        </div>
        <div className="text-right">
            <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
            <p className="text-sm text-muted-foreground mt-2">{user.logins} logins</p>
        </div>
    </div>
));

// Optimized user activity component
const UserActivity = React.memo(() => (
    <Card>
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4">
                        <Icon icon={Users} size="lg" className="text-accent" />
                    </div>
                    <div>
                        <h3 style={subtitleStyle}>User Activity</h3>
                        <p className="text-sm text-muted-foreground">Recent interactions</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm">
                    <Icon icon={MoreHorizontal} size="sm" />
                </Button>
            </div>
            <div className="space-y-6">
                {userActivityData.map((user) => (
                    <UserActivityItem key={user.id} user={user} />
                ))}
            </div>
        </div>
    </Card>
));

// Optimized stat item component
const StatItem = React.memo<{ stat: typeof userStatsData[0] }>(({ stat }) => (
    <div className={`text-center p-4 bg-${stat.color}/5 rounded-lg`}>
        <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
        <div className="text-sm text-muted-foreground">{stat.label}</div>
    </div>
));

// Optimized user statistics component
const UserStatistics = React.memo(() => (
    <Card>
        <div className="p-6">
            <h3 style={subtitleStyle} className="mb-4">User Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {userStatsData.map((stat) => (
                    <StatItem key={stat.id} stat={stat} />
                ))}
            </div>
        </div>
    </Card>
));

// Optimized role item component
const RoleItem = React.memo<{ role: typeof roleDistributionData[0] }>(({ role }) => (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 bg-${role.color} rounded-full`}></div>
            <span className="font-medium">{role.role}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{role.users} users</span>
            <Badge variant="default">{role.percentage}</Badge>
        </div>
    </div>
));

// Optimized role distribution component
const RoleDistribution = React.memo(() => (
    <Card>
        <div className="p-6">
            <h3 style={subtitleStyle} className="mb-4">Role Distribution</h3>
            <div className="space-y-4">
                {roleDistributionData.map((role) => (
                    <RoleItem key={role.id} role={role} />
                ))}
            </div>
        </div>
    </Card>
));

export const UserActivityOverview: Story = {
    render: () => (
        <div className="space-y-8">
            <SectionHeader
                title="User Management & Activity"
                subtitle="Monitor user activity, manage permissions, and track system access"
            />

            <Container>
                <UserActivity />
            </Container>
        </div>
    ),
};

export const UserManagementComponent: Story = {
    render: () => (
        <div className="space-y-8">
            <SectionHeader
                title="User Management System"
                subtitle="Complete user management interface with role-based access control"
            />

            <Container>
                <div className="space-y-6">
                    <UserStatistics />
                    <RoleDistribution />
                </div>
            </Container>
        </div>
    ),
};
