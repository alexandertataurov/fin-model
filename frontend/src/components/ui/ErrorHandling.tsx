import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { toast } from 'sonner';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Home,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error
    // Removed console.error (no-console lint rule)

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorDisplay
          title="Something went wrong"
          message={this.state.error?.message || 'An unexpected error occurred'}
          onRetry={this.handleRetry}
          details={this.state.errorInfo?.componentStack || undefined}
        />
      );
    }

    return this.props.children;
  }
}

// Error Display Component
export interface ErrorDisplayProps {
  title?: string;
  message?: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  details?: string;
  actions?: ReactNode;
  fullHeight?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Error',
  message = 'An error occurred',
  type = 'error',
  onRetry,
  onDismiss,
  details,
  actions,
  fullHeight = false,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case 'info':
        return <Info className="h-12 w-12 text-blue-500" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-destructive" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'warning':
      case 'info':
        return 'default';
      default:
        return 'destructive';
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center p-8',
        fullHeight && 'min-h-[400px]'
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}

            {onDismiss && (
              <Button variant="outline" onClick={onDismiss} className="w-full">
                Dismiss
              </Button>
            )}

            {actions}
          </div>

          {details && (
            <div className="w-full">
              <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full">
                    {showDetails ? 'Hide' : 'Show'} Details
                    {showDetails ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Alert variant={getVariant()} className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Details</AlertTitle>
                    <AlertDescription className="mt-2 font-mono text-xs whitespace-pre-wrap max-h-48 overflow-auto">
                      {details}
                    </AlertDescription>
                  </Alert>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Inline Error Component
export interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  onRetry,
  onDismiss,
  severity = 'error',
}) => {
  const variant = severity === 'error' ? 'destructive' : 'default';

  return (
    <Alert variant={variant} className="mb-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex-1">{message}</AlertDescription>
      <div className="flex gap-1 ml-auto">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-6 w-6 p-0"
            aria-label="retry"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0"
            aria-label="close"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  );
};

// Toast Hook using Sonner
export const useToast = () => {
  const showToast = React.useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      duration?: number
    ) => {
      switch (type) {
        case 'success':
          toast.success(message, { duration });
          break;
        case 'error':
          toast.error(message, { duration });
          break;
        case 'warning':
          toast.warning(message, { duration });
          break;
        case 'info':
        default:
          toast.info(message, { duration });
          break;
      }
    },
    []
  );

  return { showToast };
};

// For backwards compatibility, export ToastProvider as a pass-through
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

// Network Error Component
export interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  message = 'Network connection failed. Please check your internet connection and try again.',
}) => {
  return (
    <ErrorDisplay
      title="Connection Error"
      message={message}
      type="warning"
      onRetry={onRetry}
    />
  );
};

// Not Found Component
export interface NotFoundProps {
  title?: string;
  message?: string;
  onGoHome?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({
  title = '404 - Page Not Found',
  message = 'The page you are looking for does not exist.',
  onGoHome,
}) => {
  return (
    <ErrorDisplay
      title={title}
      message={message}
      type="info"
      actions={
        onGoHome && (
          <Button onClick={onGoHome} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
        )
      }
    />
  );
};

export default {
  ErrorBoundary,
  ErrorDisplay,
  InlineError,
  ToastProvider,
  useToast,
  NetworkError,
  NotFound,
};
