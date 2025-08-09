/**
 * Error Boundary Components
 * 
 * Provides graceful error handling and fallback UI for admin dashboard sections
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Alert, AlertDescription } from '@/design-system/components/Alert';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: string | null;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: string) => void;
    showDetails?: boolean;
    resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo: errorInfo.componentStack,
        });

        if (this.props.onError) {
            this.props.onError(error, errorInfo.componentStack);
        }

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            console.error('Error caught by boundary:', error, errorInfo);
            // TODO: Send to monitoring service like Sentry
        }
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        // Reset error state if resetKeys change
        if (
            this.state.hasError &&
            prevProps.resetKeys !== this.props.resetKeys
        ) {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
            });
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center text-destructive">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Something went wrong
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertDescription>
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </AlertDescription>
                        </Alert>

                        {this.props.showDetails && this.state.errorInfo && (
                            <details className="text-sm">
                                <summary className="cursor-pointer font-medium mb-2">
                                    Technical Details
                                </summary>
                                <pre className="whitespace-pre-wrap text-xs text-muted-foreground bg-muted p-2 rounded">
                                    {this.state.error?.stack}
                                    {this.state.errorInfo}
                                </pre>
                            </details>
                        )}

                        <div className="flex space-x-2">
                            <Button onClick={this.handleReset} variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                                <Home className="h-4 w-4 mr-2" />
                                Reload Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}

// Specific error boundary for admin dashboard sections
export const AdminSectionErrorBoundary: React.FC<{
    children: ReactNode;
    sectionName: string;
    onRetry?: () => void;
}> = ({ children, sectionName, onRetry }) => (
    <ErrorBoundary
        fallback={
            <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <Bug className="h-4 w-4 text-destructive mr-2" />
                        <span className="font-medium text-destructive">
                            {sectionName} Error
                        </span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                    This section failed to load. Other parts of the dashboard may still work.
                </p>
                <div className="flex space-x-2">
                    {onRetry && (
                        <Button onClick={onRetry} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                        </Button>
                    )}
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        size="sm"
                    >
                        Reload Page
                    </Button>
                </div>
            </div>
        }
        onError={(error, errorInfo) => {
            console.error(`Error in ${sectionName}:`, error, errorInfo);
        }}
    >
        {children}
    </ErrorBoundary>
);

// Hook for error boundary reset
export const useErrorBoundaryReset = () => {
    const [resetKey, setResetKey] = React.useState(0);

    const resetErrorBoundary = React.useCallback(() => {
        setResetKey(prev => prev + 1);
    }, []);

    return { resetKey, resetErrorBoundary };
};
