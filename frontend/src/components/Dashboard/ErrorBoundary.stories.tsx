import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error for testing
const ErrorComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error('This is a test error for the ErrorBoundary component');
    }
    return <div className="p-4 bg-green-100 text-green-800 rounded">Component loaded successfully!</div>;
};

const meta: Meta<typeof ErrorBoundary> = {
    title: 'Dashboard/ErrorBoundary',
    component: ErrorBoundary,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Error boundary component for dashboard components providing consistent error handling and recovery options.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="max-w-2xl mx-auto p-6">
                <Story />
            </div>
        ),
    ],
    tags: ['autodocs'],
    argTypes: {
        children: {
            control: false,
        },
        fallback: {
            control: false,
        },
        onRetry: {
            action: 'retry clicked',
        },
        title: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

// DEFAULT STORIES
export const Default: Story = {
    args: {
        children: <ErrorComponent />,
    },
};

// ERROR STATE STORIES
export const WithError: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary when a child component throws an error.',
            },
        },
    },
};

export const WithCustomTitle: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
        title: 'Custom Error Title',
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary with a custom error title.',
            },
        },
    },
};

export const WithCustomFallback: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
        fallback: (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Custom Error Fallback</h3>
                <p className="text-red-600 mb-4">This is a custom fallback component.</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Custom Retry
                </button>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary with a custom fallback component.',
            },
        },
    },
};

// COMPLEX ERROR SCENARIOS
export const WithComplexError: Story = {
    args: {
        children: (
            <div>
                <ErrorComponent />
                <ErrorComponent shouldThrow={true} />
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary handling a complex component tree with mixed success and error states.',
            },
        },
    },
};

export const WithLongErrorMessage: Story = {
    args: {
        children: (
            <div>
                {(() => {
                    throw new Error('This is a very long error message that might cause layout issues in the error boundary component. It contains multiple sentences and should be handled gracefully by the component.');
                })()}
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary handling a long error message.',
            },
        },
    },
};

// INTERACTION STORIES
export const WithRetryHandler: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
        onRetry: () => {
            console.log('Retry handler called');
            // In a real scenario, this might reload data or reset state
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary with a custom retry handler.',
            },
        },
    },
};

export const WithReportIssueHandler: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
        onRetry: () => {
            console.log('Retry handler called');
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary with report issue functionality.',
            },
        },
    },
};

// INTEGRATION STORIES
export const WithDashboardComponent: Story = {
    args: {
        children: (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Dashboard Widget</h3>
                    <p>This is a normal dashboard component.</p>
                </div>
                <ErrorComponent shouldThrow={true} />
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Another Widget</h3>
                    <p>This component should still render normally.</p>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary integrated with dashboard components.',
            },
        },
    },
};

// RESPONSIVE DESIGN STORIES
export const MobileResponsive: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Shows how the error boundary adapts to mobile screen sizes.',
            },
        },
    },
};

export const TabletResponsive: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: 'Shows how the error boundary adapts to tablet screen sizes.',
            },
        },
    },
};

export const DesktopWide: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
        },
        docs: {
            description: {
                story: 'Shows the error boundary on wide desktop screens.',
            },
        },
    },
};

// ACCESSIBILITY STORIES
export const AccessibilityFocused: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary with accessibility features highlighted for testing.',
            },
        },
        a11y: {
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: true,
                    },
                    {
                        id: 'button-name',
                        enabled: true,
                    },
                    {
                        id: 'heading-order',
                        enabled: true,
                    },
                ],
            },
        },
    },
};

// THEME STORIES
export const DarkTheme: Story = {
    args: {
        children: <ErrorComponent shouldThrow={true} />,
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary with dark theme styling.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="max-w-2xl mx-auto p-6 bg-gray-900 min-h-screen">
                <Story />
            </div>
        ),
    ],
};

// PERFORMANCE STORIES
export const WithLargeErrorStack: Story = {
    args: {
        children: (
            <div>
                {(() => {
                    const error = new Error('Performance test error');
                    error.stack = Array.from({ length: 100 }, (_, i) =>
                        `    at Function${i} (test.js:${i + 1}:${i + 1})`
                    ).join('\n');
                    throw error;
                })()}
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary handling errors with large stack traces.',
            },
        },
    },
};

// RECOVERY STORIES
export const RecoveryAfterRetry: Story = {
    args: {
        children: <ErrorComponent />,
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the error boundary after successful recovery from an error.',
            },
        },
    },
    decorators: [
        (Story) => {
            // This story demonstrates the component in a recovered state
            return <Story />;
        },
    ],
};
