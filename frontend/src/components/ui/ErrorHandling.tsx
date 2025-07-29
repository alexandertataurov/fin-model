import React, { Component, ReactNode } from 'react';
import {
  Box,
  Typography,
  Alert,

  Button,
  Paper,
  IconButton,
  Snackbar,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,

  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

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

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
        return <WarningIcon sx={{ fontSize: 48, color: 'warning.main' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 48, color: 'info.main' }} />;
      default:
        return <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />;
    }
  };



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        ...(fullHeight && { minHeight: '400px' }),
      }}
    >
      {getIcon()}
      
      <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
        {message}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {onRetry && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
        
        {onDismiss && (
          <Button variant="outlined" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
        
        {actions}
      </Box>

      {details && (
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => setShowDetails(!showDetails)}
            endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
          
          <Collapse in={showDetails}>
            <Paper
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: 'grey.100',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              {details}
            </Paper>
          </Collapse>
        </Box>
      )}
    </Box>
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
  return (
    <Alert
      severity={severity}
      action={
        <Box>
          {onRetry && (
            <IconButton
              color="inherit"
              size="small"
              onClick={onRetry}
              aria-label="retry"
            >
              <RefreshIcon />
            </IconButton>
          )}
          {onDismiss && (
            <IconButton
              color="inherit"
              size="small"
              onClick={onDismiss}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      }
      sx={{ mb: 2 }}
    >
      {message}
    </Alert>
  );
};

// Toast Notification Hook
export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  notifications: ToastNotification[];
  showToast: (message: string, type?: ToastNotification['type'], duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<ToastNotification[]>([]);

  const showToast = React.useCallback(
    (message: string, type: ToastNotification['type'] = 'info', duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const notification: ToastNotification = { id, message, type, duration };
      
      setNotifications(prev => [...prev, notification]);

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
      }
    },
    []
  );

  const hideToast = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const value = {
    notifications,
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer notifications={notifications} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
interface ToastContainerProps {
  notifications: ToastNotification[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onClose }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: 400,
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={null}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ position: 'relative', mb: 1 }}
        >
          <Alert
            severity={notification.type}
            onClose={() => onClose(notification.id)}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
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
          <Button variant="contained" onClick={onGoHome}>
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