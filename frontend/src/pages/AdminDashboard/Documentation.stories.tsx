import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../design-system/tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    GuidelinesSection,
    GuidelinesCard,
    PhilosophyItem,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { AdminCard } from '../../components/AdminDashboard/components/AdminCard';
import { AdminTitle, AdminSubtitle, AdminBody, AdminCaption } from '../../components/AdminDashboard/components/AdminTypography';
import { getSemanticSpacing, getSemanticColor } from '../../components/AdminDashboard/utils/designSystemHelpers';

// Pre-computed spacing using design system helpers
const componentSpacing = getSemanticSpacing('component');
const layoutSpacing = getSemanticSpacing('layout');

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Documentation',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Admin Dashboard Documentation"
                        subtitle="Comprehensive guide to our sophisticated admin dashboard system"
                        icon={
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }
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

export const CompleteDocumentation: Story = {
    render: () => (
        <div style={{ gap: layoutSpacing.section }} className="space-y-12">
            <SectionHeader
                title="Complete Admin Dashboard Documentation"
                subtitle="Comprehensive guide to our sophisticated admin dashboard system"
            />

            <Container>
                <AdminCard
                    title="🌟 Design Philosophy"
                    subtitle="Core principles and design approach"
                    variant="elevated"
                    size="lg"
                >
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        style={{ gap: componentSpacing.padding }}
                    >
                        <div style={{ gap: componentSpacing.gap }} className="space-y-4">
                            <PhilosophyItem
                                color={getSemanticColor('success')}
                                title="Enterprise-Grade Monitoring"
                                description="Real-time system monitoring with comprehensive metrics and alerting capabilities"
                            />
                            <PhilosophyItem
                                color={getSemanticColor('info')}
                                title="Role-Based Access Control"
                                description="Sophisticated user management with granular permissions and audit trails"
                            />
                        </div>
                        <div style={{ gap: componentSpacing.gap }} className="space-y-4">
                            <PhilosophyItem
                                color={getSemanticColor('warning')}
                                title="Data-Driven Insights"
                                description="Advanced analytics and reporting for informed decision-making"
                            />
                            <PhilosophyItem
                                color={getSemanticColor('danger')}
                                title="Security-First Approach"
                                description="Comprehensive security monitoring and compliance management"
                            />
                        </div>
                    </div>
                </AdminCard>

                <AdminCard
                    title="🚀 Core Features"
                    subtitle="Key functionality and capabilities"
                    variant="elevated"
                    size="lg"
                >
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        style={{ gap: componentSpacing.padding }}
                    >
                        <GuidelinesSection
                            title="System Monitoring"
                            items={[
                                "• Real-time CPU, memory, and disk usage",
                                "• Network connectivity and service health",
                                "• Performance metrics and response times",
                                "• Automated alerting and notifications"
                            ]}
                        />
                        <GuidelinesSection
                            title="User Management"
                            items={[
                                "• Role-based access control (RBAC)",
                                "• User activity tracking and audit logs",
                                "• Permission management and delegation",
                                "• Security event monitoring"
                            ]}
                        />
                        <GuidelinesSection
                            title="Data Analytics"
                            items={[
                                "• Comprehensive reporting and insights",
                                "• Data visualization and charts",
                                "• Export capabilities and scheduling",
                                "• Historical data analysis"
                            ]}
                        />
                    </div>
                </AdminCard>

                <AdminCard
                    title="♿ Accessibility & Security"
                    subtitle="Accessibility features and security measures"
                    variant="elevated"
                    size="lg"
                >
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        style={{ gap: componentSpacing.padding }}
                    >
                        <GuidelinesSection
                            title="Accessibility Features"
                            items={[
                                "• WCAG 2.1 AA compliant interface",
                                "• Keyboard navigation support",
                                "• Screen reader compatibility",
                                "• High contrast mode support"
                            ]}
                        />
                        <GuidelinesSection
                            title="Security Measures"
                            items={[
                                "• Multi-factor authentication (MFA)",
                                "• Session management and timeout",
                                "• Audit logging and compliance",
                                "• Data encryption and privacy"
                            ]}
                        />
                    </div>
                </AdminCard>
            </Container>
        </div>
    ),
};

export const UsageGuidelines: Story = {
    render: () => (
        <div style={{ gap: layoutSpacing.section }} className="space-y-12">
            <SectionHeader
                title="Admin Dashboard Usage Guidelines"
                subtitle="Best practices for implementing and customizing our sophisticated admin dashboard system"
            />
            <Container>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    style={{ gap: layoutSpacing.page }}
                >
                    <div style={{ gap: componentSpacing.gap }} className="space-y-4">
                        <GuidelinesCard
                            title="System Monitoring"
                            items={[
                                "• Monitor CPU, memory, and disk usage in real-time",
                                "• Set up automated alerts for critical thresholds",
                                "• Use performance metrics for capacity planning",
                                "• Implement health checks for all services"
                            ]}
                        />

                        <GuidelinesCard
                            title="User Management"
                            items={[
                                "• Implement role-based access control (RBAC)",
                                "• Regular audit of user permissions and activities",
                                "• Monitor failed login attempts and security events",
                                "• Maintain comprehensive audit trails"
                            ]}
                        />
                    </div>

                    <div style={{ gap: componentSpacing.gap }} className="space-y-4">
                        <GuidelinesCard
                            title="Data Analytics"
                            items={[
                                "• Use data visualization for trend analysis",
                                "• Implement automated reporting schedules",
                                "• Export data in multiple formats (CSV, JSON, PDF)",
                                "• Maintain data retention policies"
                            ]}
                        />

                        <GuidelinesCard
                            title="Security & Compliance"
                            items={[
                                "• Enable multi-factor authentication (MFA)",
                                "• Regular security audits and penetration testing",
                                "• Compliance monitoring and reporting",
                                "• Data encryption at rest and in transit"
                            ]}
                        />
                    </div>
                </div>
            </Container>
        </div>
    ),
};
