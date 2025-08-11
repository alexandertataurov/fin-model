import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../design-system/tokens';
import { Title, Stories } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    Card,
    GuidelinesSection,
    GuidelinesCard,
    PhilosophyItem,
    applyTypographyStyle,
} from '../../design-system/stories/components';

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
        <div className="space-y-12">
            <SectionHeader
                title="Complete Admin Dashboard Documentation"
                subtitle="Comprehensive guide to our sophisticated admin dashboard system"
            />

            <Container>
                <Card>
                    <div className="p-8">
                        <h4 style={applyTypographyStyle('title')} className="text-foreground mb-6 break-words">🌟 Design Philosophy</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <PhilosophyItem
                                    color={tokens.colors.primary[500]}
                                    title="Enterprise-Grade Monitoring"
                                    description="Real-time system monitoring with comprehensive metrics and alerting capabilities"
                                />
                                <PhilosophyItem
                                    color={tokens.colors.secondary[500]}
                                    title="Role-Based Access Control"
                                    description="Sophisticated user management with granular permissions and audit trails"
                                />
                            </div>
                            <div className="space-y-4">
                                <PhilosophyItem
                                    color={tokens.colors.accent[500]}
                                    title="Data-Driven Insights"
                                    description="Advanced analytics and reporting for informed decision-making"
                                />
                                <PhilosophyItem
                                    color={tokens.colors.danger}
                                    title="Security-First Approach"
                                    description="Comprehensive security monitoring and compliance management"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-8">
                        <h4 style={applyTypographyStyle('title')} className="text-foreground mb-6 break-words">🚀 Core Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    </div>
                </Card>

                <Card>
                    <div className="p-8">
                        <h4 style={applyTypographyStyle('title')} className="text-foreground mb-6 break-words">♿ Accessibility & Security</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                </Card>
            </Container>
        </div>
    ),
};

export const UsageGuidelines: Story = {
    render: () => (
        <div className="space-y-12">
            <SectionHeader
                title="Admin Dashboard Usage Guidelines"
                subtitle="Best practices for implementing and customizing our sophisticated admin dashboard system"
            />
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
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

                    <div className="space-y-4">
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
