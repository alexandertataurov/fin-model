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
import { Badge } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';
import { Users, MoreHorizontal } from 'lucide-react';
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

// Optimized user activity item component with design system principles
const UserActivityItem = React.memo<{ user: typeof userActivityData[0] }>(({ user }) => (
    <div 
        className="flex items-center justify-between p-6 rounded-xl hover:bg-muted/50 transition-all duration-200"
        style={{ 
            padding: componentSpacing.padding,
            borderRadius: tokens.borderRadius.xl
        }}
    >
        <div className="flex items-center space-x-4">
            <div 
                className={`w-10 h-10 bg-gradient-to-br from-${user.color}-20 to-${user.color}-30 rounded-full flex items-center justify-center`}
                style={{ 
                    width: tokens.spacing[10],
                    height: tokens.spacing[10],
                    borderRadius: tokens.borderRadius.full
                }}
            >
                <span className={`text-${user.color}-700 font-semibold`}>{user.initial}</span>
            </div>
            <div>
                <AdminSubtitle className="text-foreground">{user.name}</AdminSubtitle>
                <AdminCaption className="text-muted-foreground">
                    Last login: {user.lastLogin.toLocaleString()}
                </AdminCaption>
            </div>
        </div>
        <div className="text-right">
            <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
            <AdminCaption 
                className="text-muted-foreground mt-2"
                style={{ marginTop: componentSpacing.gap }}
            >
                {user.logins} logins
            </AdminCaption>
        </div>
    </div>
));

// Optimized user activity component with design system spacing and typography
const UserActivity = React.memo(() => (
    <AdminCard
        title="User Activity"
        subtitle="Recent user interactions and system access"
        variant="elevated"
        size="lg"
    >
        <div 
            className="flex items-center justify-between mb-6"
            style={{ marginBottom: componentSpacing.padding }}
        >
            <div className="flex items-center">
                <div 
                    className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4"
                    style={{ 
                        width: tokens.spacing[12],
                        height: tokens.spacing[12],
                        marginRight: componentSpacing.gap,
                        borderRadius: tokens.borderRadius.xl
                    }}
                >
                    <Icon icon={Users} size="lg" className="text-accent" />
                </div>
                <div>
                    <AdminSubtitle>User Activity</AdminSubtitle>
                    <AdminCaption className="text-muted-foreground">Recent interactions</AdminCaption>
                </div>
            </div>
            <Button variant="ghost" size="sm">
                <Icon icon={MoreHorizontal} size="sm" />
            </Button>
        </div>
        <div style={{ gap: componentSpacing.padding }} className="space-y-6">
            {userActivityData.map((user) => (
                <UserActivityItem key={user.id} user={user} />
            ))}
        </div>
    </AdminCard>
));

// Optimized stat item component with design system spacing and colors
const StatItem = React.memo<{ stat: typeof userStatsData[0] }>(({ stat }) => (
    <div 
        className={`text-center p-4 bg-${stat.color}/5 rounded-lg`}
        style={{ 
            padding: componentSpacing.gap,
            borderRadius: tokens.borderRadius.lg
        }}
    >
        <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
        <AdminCaption className="text-muted-foreground">{stat.label}</AdminCaption>
    </div>
));

// Optimized user statistics component with design system spacing
const UserStatistics = React.memo(() => (
    <AdminCard
        title="User Statistics"
        subtitle="Overview of user distribution and status"
        variant="elevated"
        size="md"
    >
        <div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            style={{ gap: componentSpacing.gap }}
        >
            {userStatsData.map((stat) => (
                <StatItem key={stat.id} stat={stat} />
            ))}
        </div>
    </AdminCard>
));

// Optimized role item component with design system spacing and colors
const RoleItem = React.memo<{ role: typeof roleDistributionData[0] }>(({ role }) => (
    <div 
        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
        style={{ 
            padding: componentSpacing.gap,
            borderRadius: tokens.borderRadius.lg
        }}
    >
        <div className="flex items-center gap-3">
            <div 
                className={`w-3 h-3 bg-${role.color} rounded-full`}
                style={{ 
                    width: tokens.spacing[3],
                    height: tokens.spacing[3],
                    borderRadius: tokens.borderRadius.full
                }}
            ></div>
            <AdminBody className="font-medium">{role.role}</AdminBody>
        </div>
        <div className="flex items-center gap-2">
            <AdminCaption className="text-muted-foreground">{role.users} users</AdminCaption>
            <Badge variant="default">{role.percentage}</Badge>
        </div>
    </div>
));

// Optimized role distribution component with design system spacing
const RoleDistribution = React.memo(() => (
    <AdminCard
        title="Role Distribution"
        subtitle="User roles and permissions overview"
        variant="elevated"
        size="md"
    >
        <div style={{ gap: componentSpacing.gap }} className="space-y-4">
            {roleDistributionData.map((role) => (
                <RoleItem key={role.id} role={role} />
            ))}
        </div>
    </AdminCard>
));

export const UserActivityOverview: Story = {
    render: () => (
        <div style={{ gap: layoutSpacing.section }} className="space-y-8">
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
        <div style={{ gap: layoutSpacing.section }} className="space-y-8">
            <SectionHeader
                title="User Management System"
                subtitle="Complete user management interface with role-based access control"
            />

            <Container>
                <div style={{ gap: componentSpacing.padding }} className="space-y-6">
                    <UserStatistics />
                    <RoleDistribution />
                </div>
            </Container>
        </div>
    ),
};
