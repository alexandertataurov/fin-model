import { toast } from 'sonner';

export interface WebSocketError {
  code: number;
  reason: string;
  wasClean: boolean;
  timestamp: Date;
  endpoint?: string;
  reconnectAttempt?: number;
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  lastError?: WebSocketError;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  backoffDelay: number;
  lastSuccessfulConnection?: Date;
}

export class WebSocketErrorHandler {
  private listeners: Set<(error: WebSocketError) => void> = new Set();
  private connectionListeners: Set<(state: ConnectionState) => void> = new Set();
  private errorHistory: WebSocketError[] = [];
  private maxErrorHistory = 50;

  // Error codes and their meanings
  private static readonly ERROR_CODES = {
    1000: 'Normal Closure',
    1001: 'Going Away',
    1002: 'Protocol Error',
    1003: 'Unsupported Data',
    1005: 'No Status Received',
    1006: 'Abnormal Closure',
    1007: 'Invalid Frame Payload Data',
    1008: 'Policy Violation',
    1009: 'Message Too Big',
    1010: 'Mandatory Extension',
    1011: 'Internal Server Error',
    1015: 'TLS Handshake',
    4001: 'Authentication Failed',
    4002: 'Authorization Failed',
    4003: 'Rate Limited',
    4004: 'Invalid Request',
    4005: 'Service Unavailable'
  };

  constructor(private showToasts = true) {}

  /**
   * Handle WebSocket error event
   */
  handleError(error: Event | Error, endpoint?: string) {
    const wsError: WebSocketError = {
      code: -1,
      reason: error instanceof Error ? error.message : 'Unknown WebSocket error',
      wasClean: false,
      timestamp: new Date(),
      endpoint
    };

    this.recordError(wsError);
    this.notifyListeners(wsError);

    if (this.showToasts) {
      this.showErrorToast(wsError);
    }

    console.error('WebSocket Error:', wsError);
  }

  /**
   * Handle WebSocket close event
   */
  handleClose(
    event: CloseEvent, 
    endpoint?: string, 
    reconnectAttempt?: number
  ) {
    const wsError: WebSocketError = {
      code: event.code,
      reason: event.reason || this.getErrorMessage(event.code),
      wasClean: event.wasClean,
      timestamp: new Date(),
      endpoint,
      reconnectAttempt
    };

    this.recordError(wsError);
    this.notifyListeners(wsError);

    // Only show toast for abnormal closures
    if (!event.wasClean && this.showToasts && !this.isReconnectableError(event.code)) {
      this.showErrorToast(wsError);
    }

    console.warn('WebSocket Closed:', wsError);
  }

  /**
   * Handle connection state changes
   */
  handleConnectionStateChange(state: ConnectionState) {
    this.connectionListeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in connection state listener:', error);
      }
    });

    // Show connection status toasts
    if (this.showToasts) {
      if (state.isConnected && state.reconnectAttempts > 0) {
        toast.success('Connection restored', {
          description: 'Real-time updates are now active'
        });
      } else if (!state.isConnected && state.reconnectAttempts >= state.maxReconnectAttempts) {
        toast.error('Connection failed', {
          description: 'Real-time updates are unavailable. Please refresh the page.',
          duration: 10000
        });
      }
    }
  }

  /**
   * Add error listener
   */
  addErrorListener(listener: (error: WebSocketError) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Add connection state listener
   */
  addConnectionListener(listener: (state: ConnectionState) => void): () => void {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  /**
   * Get error history
   */
  getErrorHistory(): WebSocketError[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  clearErrorHistory() {
    this.errorHistory = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const lastMinute = new Date(now.getTime() - 60 * 1000);

    const errorsLastHour = this.errorHistory.filter(e => e.timestamp >= lastHour);
    const errorsLastMinute = this.errorHistory.filter(e => e.timestamp >= lastMinute);

    const errorsByCode = this.errorHistory.reduce((acc, error) => {
      acc[error.code] = (acc[error.code] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      total: this.errorHistory.length,
      lastHour: errorsLastHour.length,
      lastMinute: errorsLastMinute.length,
      byCode: errorsByCode,
      mostRecent: this.errorHistory[this.errorHistory.length - 1]
    };
  }

  /**
   * Check if error code indicates a reconnectable error
   */
  isReconnectableError(code: number): boolean {
    // Don't reconnect for authentication/authorization errors
    if (code === 4001 || code === 4002) return false;
    
    // Don't reconnect for policy violations
    if (code === 1008) return false;
    
    // Reconnect for network issues, server errors, etc.
    return code !== 1000; // Normal closure
  }

  /**
   * Get retry delay with exponential backoff and jitter
   */
  getRetryDelay(attempt: number, baseDelay = 1000, maxDelay = 30000): number {
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 0.3; // 30% jitter
    return Math.floor(exponentialDelay * (1 + jitter));
  }

  /**
   * Determine if we should show connection health warning
   */
  shouldShowHealthWarning(): boolean {
    const recentErrors = this.errorHistory.filter(
      error => error.timestamp > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    );

    return recentErrors.length >= 3;
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: WebSocketError): string {
    switch (error.code) {
      case 4001:
        return 'Authentication failed. Please log in again.';
      case 4002:
        return 'You do not have permission to access this feature.';
      case 4003:
        return 'Too many connection attempts. Please wait before trying again.';
      case 4005:
        return 'Service is temporarily unavailable. Please try again later.';
      case 1006:
        return 'Connection lost unexpectedly. Attempting to reconnect...';
      case 1011:
        return 'Server error occurred. Attempting to reconnect...';
      default:
        if (error.code >= 1000 && error.code <= 1015) {
          return `Connection closed: ${error.reason}`;
        }
        return 'Connection issue occurred. Attempting to reconnect...';
    }
  }

  private recordError(error: WebSocketError) {
    this.errorHistory.push(error);
    
    // Limit history size
    if (this.errorHistory.length > this.maxErrorHistory) {
      this.errorHistory = this.errorHistory.slice(-this.maxErrorHistory);
    }
  }

  private notifyListeners(error: WebSocketError) {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in WebSocket error listener:', listenerError);
      }
    });
  }

  private showErrorToast(error: WebSocketError) {
    const message = this.getUserFriendlyMessage(error);
    
    if (error.code === 4001 || error.code === 4002) {
      // Authentication/authorization errors
      toast.error('Connection Error', {
        description: message,
        duration: 10000
      });
    } else if (error.code >= 4000) {
      // Other client errors
      toast.warning('Connection Issue', {
        description: message,
        duration: 5000
      });
    } else {
      // Network/server errors - less intrusive
      toast('Connection Status', {
        description: message,
        duration: 3000
      });
    }
  }

  private getErrorMessage(code: number): string {
    return WebSocketErrorHandler.ERROR_CODES[code] || `Unknown error code: ${code}`;
  }
}

// Global error handler instance
export const globalWebSocketErrorHandler = new WebSocketErrorHandler();

/**
 * Enhanced connection manager with error handling
 */
export class EnhancedConnectionManager {
  private errorHandler: WebSocketErrorHandler;
  private connectionState: ConnectionState = {
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    backoffDelay: 1000
  };

  constructor(errorHandler?: WebSocketErrorHandler) {
    this.errorHandler = errorHandler || new WebSocketErrorHandler();
  }

  /**
   * Handle WebSocket connection events
   */
  handleConnectionOpen(endpoint: string) {
    this.connectionState = {
      ...this.connectionState,
      isConnected: true,
      isConnecting: false,
      reconnectAttempts: 0,
      lastSuccessfulConnection: new Date(),
      lastError: undefined
    };

    this.errorHandler.handleConnectionStateChange(this.connectionState);
  }

  /**
   * Handle WebSocket connection close
   */
  handleConnectionClose(event: CloseEvent, endpoint: string) {
    this.connectionState = {
      ...this.connectionState,
      isConnected: false,
      isConnecting: false
    };

    const wsError: WebSocketError = {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
      timestamp: new Date(),
      endpoint
    };

    this.connectionState.lastError = wsError;

    this.errorHandler.handleClose(event, endpoint);
    this.errorHandler.handleConnectionStateChange(this.connectionState);
  }

  /**
   * Handle WebSocket error
   */
  handleConnectionError(error: Event | Error, endpoint: string) {
    this.connectionState = {
      ...this.connectionState,
      isConnecting: false
    };

    this.errorHandler.handleError(error, endpoint);
    this.errorHandler.handleConnectionStateChange(this.connectionState);
  }

  /**
   * Handle reconnection attempt
   */
  handleReconnectionAttempt(attempt: number) {
    this.connectionState = {
      ...this.connectionState,
      isConnecting: true,
      reconnectAttempts: attempt
    };

    this.errorHandler.handleConnectionStateChange(this.connectionState);
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Get error handler
   */
  getErrorHandler(): WebSocketErrorHandler {
    return this.errorHandler;
  }

  /**
   * Set maximum reconnection attempts
   */
  setMaxReconnectAttempts(max: number) {
    this.connectionState.maxReconnectAttempts = max;
  }

  /**
   * Calculate next retry delay
   */
  getNextRetryDelay(): number {
    return this.errorHandler.getRetryDelay(
      this.connectionState.reconnectAttempts,
      this.connectionState.backoffDelay
    );
  }

  /**
   * Check if reconnection should be attempted
   */
  shouldReconnect(): boolean {
    return (
      this.connectionState.reconnectAttempts < this.connectionState.maxReconnectAttempts &&
      (!this.connectionState.lastError || 
       this.errorHandler.isReconnectableError(this.connectionState.lastError.code))
    );
  }
}