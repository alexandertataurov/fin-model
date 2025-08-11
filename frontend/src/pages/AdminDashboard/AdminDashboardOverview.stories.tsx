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
import { AdminDashboard } from '../../components/AdminDashboard/AdminDashboard';
import { AdminSectionErrorBoundary } from '../../components/ErrorBoundary';

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Overview',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <AnimatedBanner
                        title="Admin Dashboard Overview"
                        subtitle="Complete system monitoring and management interface with real-time metrics and comprehensive controls"
                        icon={
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

export const DashboardOverview: Story = {
    render: () => (
        <div className="space-y-12">
            <SectionHeader
                title="Admin Dashboard Overview"
                subtitle="Complete system monitoring and management interface with real-time metrics and comprehensive controls"
            />

            <AdminSectionErrorBoundary
                sectionName="Admin Dashboard"
                onRetry={() => window.location.reload()}
            >
                <Container>
                    <AdminDashboard />
                </Container>
            </AdminSectionErrorBoundary>
        </div>
    ),
};
