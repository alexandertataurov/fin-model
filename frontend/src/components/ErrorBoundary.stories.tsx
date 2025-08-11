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
    argTypes: {
        children: {
            control: false,
            description: 'Child components to wrap with error boundary',
        },
        fallback: {
            control: false,
            description: 'Custom fallback component to display on error',
        },
        showDetails: {
            control: { type: 'boolean' },
            description: 'Whether to show error details',
        },
        resetKeys: {
            control: { type: 'object' },
            description: 'Keys to trigger error boundary reset',
        },
    },
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

export const FinancialModelError: Story = {
    render: () => (
        <ErrorBoundary
            fallback={(
                <div className="p-6 border border-red-200 rounded-lg bg-red-50 max-w-md">
                    <h3 className="text-red-800 font-medium mb-2">Financial Model Error</h3>
                    <p className="text-red-600 text-sm mb-4">
                        There was an error processing your financial model. Please check your input parameters and try again.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                        Retry Calculation
                    </button>
                </div>
            )}
        >
            <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
    ),
};

export const ChartError: Story = {
    render: () => (
        <ErrorBoundary
            fallback={(
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <h3 className="text-orange-800 font-medium">Chart Loading Error</h3>
                    <p className="text-orange-600 text-sm">
                        Unable to load chart data. Please refresh the page or contact support.
                    </p>
                </div>
            )}
        >
            <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
    ),
};
