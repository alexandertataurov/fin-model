import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary, AdminSectionErrorBoundary, useErrorBoundaryReset } from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
    title: 'Components/ErrorBoundary',
    component: ErrorBoundary,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

// Component that throws an error for testing
const BuggyComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error('This is a test error for the error boundary');
    }
    return <div>This component works normally</div>;
};

export const Default: Story = {
    args: {
        children: <BuggyComponent shouldThrow={false} />,
    },
};

export const WithError: Story = {
    args: {
        children: <BuggyComponent shouldThrow={true} />,
    },
};

export const WithCustomFallback: Story = {
    args: {
        children: <BuggyComponent shouldThrow={true} />,
        fallback: (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h3 className="text-red-800 font-medium">Custom Error UI</h3>
                <p className="text-red-600 text-sm">This is a custom fallback component</p>
            </div>
        ),
    },
};

export const WithDetails: Story = {
    args: {
        children: <BuggyComponent shouldThrow={true} />,
        showDetails: true,
    },
};

export const AdminSectionError: Story = {
    render: () => (
        <AdminSectionErrorBoundary sectionName="Dashboard Overview">
            <BuggyComponent shouldThrow={true} />
        </AdminSectionErrorBoundary>
    ),
};

export const WithResetKeys: Story = {
    render: () => {
        const { resetKey, resetErrorBoundary } = useErrorBoundaryReset();

        return (
            <div className="space-y-4">
                <ErrorBoundary resetKeys={[resetKey]}>
                    <BuggyComponent shouldThrow={true} />
                </ErrorBoundary>
                <button
                    onClick={resetErrorBoundary}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Reset Error Boundary
                </button>
            </div>
        );
    },
};
