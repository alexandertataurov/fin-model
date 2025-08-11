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
import DataManagement from '../../components/AdminDashboard/DataManagement';
import { DashboardCustomization } from '../../components/AdminDashboard/DashboardCustomization';
import { MaintenanceTools } from '../../components/AdminDashboard/MaintenanceTools';
import UserManagement from '../../components/AdminDashboard/UserManagement';
import SystemMonitoring from '../../components/AdminDashboard/SystemMonitoring';
import LogFilterForm from '../../components/AdminDashboard/LogFilterForm';

// Memoized typography styles
const subtitleStyle = applyTypographyStyle('subtitle');

// Memoized icon for banner
const ComponentsIcon = React.memo(() => (
    <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
));

// Memoized log filter form props
const logFilterFormProps = {
    level: "all" as const,
    limit: 50,
    from: "",
    to: "",
    search: "",
    skip: 0,
    total: 0,
    onChange: () => { },
    onRefresh: () => { },
    onPrev: () => { },
    onNext: () => { }
};

// Memoized dashboard customization props
const dashboardCustomizationProps = {
    userRole: "admin" as const,
    onConfigChange: (config: any) => {
        console.log('Dashboard config changed:', config);
    }
};

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
                        icon={<ComponentsIcon />}
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

// Memoized data management component wrapper
const DataManagementWrapper = React.memo(() => (
    <div className="space-y-8">
        <SectionHeader
            title="Data Management Component"
            subtitle="Comprehensive data management and analytics tools"
        />
        <Container>
            <DataManagement />
        </Container>
    </div>
));

// Memoized dashboard customization component wrapper
const DashboardCustomizationWrapper = React.memo(() => (
    <div className="space-y-8">
        <SectionHeader
            title="Dashboard Customization Component"
            subtitle="Customize dashboard layout and preferences"
        />
        <Container>
            <Card>
                <div className="p-6">
                    <h2 style={subtitleStyle} className="mb-6">Dashboard Customization</h2>
                    <DashboardCustomization {...dashboardCustomizationProps} />
                </div>
            </Card>
        </Container>
    </div>
));

// Memoized maintenance tools component wrapper
const MaintenanceToolsWrapper = React.memo(() => (
    <div className="space-y-8">
        <SectionHeader
            title="Maintenance Tools Component"
            subtitle="System maintenance and administrative tools"
        />
        <Container>
            <MaintenanceTools />
        </Container>
    </div>
));

// Memoized user management component wrapper
const UserManagementWrapper = React.memo(() => (
    <div className="space-y-8">
        <SectionHeader
            title="User Management Component"
            subtitle="Complete user management interface"
        />
        <Container>
            <UserManagement />
        </Container>
    </div>
));

// Memoized system monitoring component wrapper
const SystemMonitoringWrapper = React.memo(() => (
    <div className="space-y-8">
        <SectionHeader
            title="System Monitoring Component"
            subtitle="Real-time system monitoring and metrics"
        />
        <Container>
            <SystemMonitoring refreshInterval={30000} />
        </Container>
    </div>
));

// Memoized log filter form component wrapper
const LogFilterFormWrapper = React.memo(() => (
    <div className="space-y-8">
        <SectionHeader
            title="Log Filter Form Component"
            subtitle="Advanced log filtering and search capabilities"
        />
        <Container>
            <Card>
                <div className="p-6">
                    <h2 style={subtitleStyle} className="mb-6">Log Filter Form</h2>
                    <LogFilterForm {...logFilterFormProps} />
                </div>
            </Card>
        </Container>
    </div>
));

export const DataManagementComponent: Story = {
    render: () => <DataManagementWrapper />
};

export const DashboardCustomizationComponent: Story = {
    render: () => <DashboardCustomizationWrapper />
};

export const MaintenanceToolsComponent: Story = {
    render: () => <MaintenanceToolsWrapper />
};

export const UserManagementComponent: Story = {
    render: () => <UserManagementWrapper />
};

export const SystemMonitoringComponent: Story = {
    render: () => <SystemMonitoringWrapper />
};

export const LogFilterFormComponent: Story = {
    render: () => <LogFilterFormWrapper />
};
