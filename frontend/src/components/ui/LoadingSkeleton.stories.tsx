import type { Meta, StoryObj } from '@storybook/react';
import {
    Skeleton,
    CardSkeleton,
    TableSkeleton,
    StatsSkeleton,
    ChartSkeleton,
    LogEntrySkeleton,
    HealthSkeleton
} from './LoadingSkeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'UI/LoadingSkeleton',
    component: Skeleton,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Reusable skeleton components for better loading states across the application.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const BasicSkeleton: Story = {
    render: () => (
        <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-12 w-full" />
        </div>
    ),
};

export const CardSkeletonExample: Story = {
    render: () => <CardSkeleton />,
};

export const TableSkeletonExample: Story = {
    render: () => <TableSkeleton rows={5} columns={4} />,
};

export const StatsSkeletonExample: Story = {
    render: () => <StatsSkeleton />,
};

export const ChartSkeletonExample: Story = {
    render: () => <ChartSkeleton height="h-64" />,
};

export const LogEntrySkeletonExample: Story = {
    render: () => (
        <div className="max-w-2xl">
            <LogEntrySkeleton />
            <LogEntrySkeleton />
            <LogEntrySkeleton />
        </div>
    ),
};

export const HealthSkeletonExample: Story = {
    render: () => <HealthSkeleton />,
};

export const AllSkeletons: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium mb-4">Card Skeleton</h3>
                <CardSkeleton />
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Table Skeleton</h3>
                <TableSkeleton rows={3} columns={3} />
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Stats Skeleton</h3>
                <StatsSkeleton />
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Chart Skeleton</h3>
                <ChartSkeleton />
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Health Skeleton</h3>
                <HealthSkeleton />
            </div>
        </div>
    ),
};
