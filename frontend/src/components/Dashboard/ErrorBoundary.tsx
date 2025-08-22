/**
 * Error Boundary Component for Dashboard
 *
 * Provides consistent error handling across dashboard components
 */

import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription, Button } from '../ui';
import { RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  title?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      'Dashboard Error Boundary caught an error:',
      error,
      errorInfo
    );
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 text-center space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {this.props.title || 'Dashboard Error'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {this.state.error?.message ||
                    'Something went wrong while loading this component.'}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={this.handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                // Could open support modal or copy error details
                console.error('Error details:', this.state.error);
              }}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
