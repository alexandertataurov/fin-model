import {
  globalWebSocketErrorHandler,
  EnhancedConnectionManager,
  type WebSocketError,
  type ConnectionState,
} from '../utils/websocket-error-handler';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export interface WebSocketSubscription {
  id: string;
  callback: (data: any) => void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting = false;
  private isConnected = false;
  private lastEndpoint = '';
  private pingInterval: NodeJS.Timeout | null = null;
  private connectionPromise: Promise<void> | null = null;
  private connectionManager: EnhancedConnectionManager;

  constructor(
    private baseUrl: string,
    private getToken: () => string | null
  ) {
    this.connectionManager = new EnhancedConnectionManager(
      globalWebSocketErrorHandler
    );
  }

  async connect(endpoint: string): Promise<void> {
    // If already connecting to the same endpoint, return existing promise
    if (
      this.isConnecting &&
      this.lastEndpoint === endpoint &&
      this.connectionPromise
    ) {
      return this.connectionPromise;
    }

    // If connected to different endpoint, disconnect first
    if (this.isConnected && this.lastEndpoint !== endpoint) {
      this.disconnect();
    }

    this.lastEndpoint = endpoint;
    this.isConnecting = true;

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const token = this.getToken();
        if (!token) {
          reject(new Error('No authentication token available'));
          return;
        }

        const wsUrl = `${this.baseUrl}${endpoint}?token=${encodeURIComponent(token)}`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;

          // Notify connection manager
          this.connectionManager.handleConnectionOpen(endpoint);

          // Start ping interval
          this.startPingInterval();

          resolve();
        };

        this.ws.onmessage = event => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            // console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = event => {
          this.isConnected = false;
          this.isConnecting = false;
          this.stopPingInterval();

          // Notify connection manager
          this.connectionManager.handleConnectionClose(event, endpoint);

          // Don't reconnect if it was a clean close or authentication error
          if (
            event.code !== 1000 &&
            event.code !== 4001 &&
            this.connectionManager.shouldReconnect()
          ) {
            this.handleReconnect();
          }
        };

        this.ws.onerror = error => {
          // console.error('WebSocket error:', error);
          this.isConnecting = false;

          // Notify connection manager
          this.connectionManager.handleConnectionError(error, endpoint);

          if (this.reconnectAttempts === 0) {
            reject(error);
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private handleMessage(message: WebSocketMessage) {
    const { type, data } = message;

    // Handle system messages
    switch (type) {
      case 'pong':
        // Pong response to ping
        return;
      case 'connection_established':
        return;
      case 'error':
        return;
    }

    // Notify subscribers
    if (this.subscribers.has(type)) {
      this.subscribers.get(type)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // console.error('Error in WebSocket message handler:', error);
        }
      });
    }

    // Also notify global subscribers
    if (this.subscribers.has('*')) {
      this.subscribers.get('*')?.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          // console.error('Error in global WebSocket message handler:', error);
        }
      });
    }
  }

  subscribe(messageType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(messageType)) {
      this.subscribers.set(messageType, new Set());
    }
    this.subscribers.get(messageType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(messageType)?.delete(callback);
      if (this.subscribers.get(messageType)?.size === 0) {
        this.subscribers.delete(messageType);
      }
    };
  }

  send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        // console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      // console.warn('WebSocket is not connected. Message not sent:', message);
      return false;
    }
  }

  private handleReconnect() {
    if (this.connectionManager.shouldReconnect()) {
      this.reconnectAttempts++;

      // Notify connection manager about reconnection attempt
      this.connectionManager.handleReconnectionAttempt(this.reconnectAttempts);

      const delay = this.connectionManager.getNextRetryDelay();

      // console.log(
      //   `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
      // );

      setTimeout(() => {
        if (this.lastEndpoint) {
          this.connect(this.lastEndpoint).catch(_error => {
            // console.error('Reconnection failed:', error);
          });
        }
      }, delay);
    } else {
      // console.error('Max reconnection attempts reached or non-recoverable error. Giving up.');
      this.notifyConnectionLost();
    }
  }

  private notifyConnectionLost() {
    // Notify subscribers about connection loss
    if (this.subscribers.has('connection_lost')) {
      this.subscribers.get('connection_lost')?.forEach(callback => {
        try {
          callback({
            attempts: this.reconnectAttempts,
            maxAttempts: this.maxReconnectAttempts,
          });
        } catch (error) {
          // console.error('Error in connection lost handler:', error);
        }
      });
    }
  }

  private startPingInterval() {
    this.stopPingInterval(); // Clear any existing interval

    this.pingInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping', data: { timestamp: Date.now() } });
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect() {
    this.stopPingInterval();

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.connectionPromise = null;
  }

  getConnectionState(): 'connecting' | 'connected' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.isConnected) return 'connected';
    return 'disconnected';
  }

  isConnectionReady(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  getMaxReconnectAttempts(): number {
    return this.maxReconnectAttempts;
  }

  setMaxReconnectAttempts(attempts: number) {
    this.maxReconnectAttempts = attempts;
    this.connectionManager.setMaxReconnectAttempts(attempts);
  }

  getErrorHistory(): WebSocketError[] {
    return this.connectionManager.getErrorHandler().getErrorHistory();
  }

  getErrorStats() {
    return this.connectionManager.getErrorHandler().getErrorStats();
  }

  addErrorListener(listener: (error: WebSocketError) => void): () => void {
    return this.connectionManager.getErrorHandler().addErrorListener(listener);
  }

  addConnectionListener(
    listener: (state: ConnectionState) => void
  ): () => void {
    return this.connectionManager
      .getErrorHandler()
      .addConnectionListener(listener);
  }

  shouldShowHealthWarning(): boolean {
    return this.connectionManager.getErrorHandler().shouldShowHealthWarning();
  }
}

// Create singleton instances for different endpoints
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const wsBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'wss://your-api-domain.com/api/v1/ws'
    : 'ws://localhost:8000/api/v1/ws';

// Dashboard WebSocket service
export const dashboardWebSocketService = new WebSocketService(
  wsBaseUrl,
  getAuthToken
);

// Notifications WebSocket service
export const notificationsWebSocketService = new WebSocketService(
  wsBaseUrl,
  getAuthToken
);

// Financial data WebSocket service
export const financialDataWebSocketService = new WebSocketService(
  wsBaseUrl,
  getAuthToken
);

// Parameters WebSocket service
export const parametersWebSocketService = new WebSocketService(
  wsBaseUrl,
  getAuthToken
);

// Generic WebSocket service for other uses
export const websocketService = new WebSocketService(wsBaseUrl, getAuthToken);

// Connection manager for handling multiple WebSocket connections
export class WebSocketConnectionManager {
  private connections: Map<string, WebSocketService> = new Map();
  private connectionStates: Map<
    string,
    'connecting' | 'connected' | 'disconnected'
  > = new Map();

  async connectToDashboard(fileId: number): Promise<WebSocketService> {
    const key = `dashboard-${fileId}`;

    if (!this.connections.has(key)) {
      const service = new WebSocketService(wsBaseUrl, getAuthToken);
      this.connections.set(key, service);
    }

    const service = this.connections.get(key)!;

    try {
      await service.connect(`/dashboard/${fileId}`);
      this.connectionStates.set(key, 'connected');
    } catch (error) {
      this.connectionStates.set(key, 'disconnected');
      throw error;
    }

    return service;
  }

  async connectToNotifications(): Promise<WebSocketService> {
    const key = 'notifications';

    if (!this.connections.has(key)) {
      const service = new WebSocketService(wsBaseUrl, getAuthToken);
      this.connections.set(key, service);
    }

    const service = this.connections.get(key)!;

    try {
      await service.connect('/notifications');
      this.connectionStates.set(key, 'connected');
    } catch (error) {
      this.connectionStates.set(key, 'disconnected');
      throw error;
    }

    return service;
  }

  async connectToFinancialData(fileId: number): Promise<WebSocketService> {
    const key = `financial-data-${fileId}`;

    if (!this.connections.has(key)) {
      const service = new WebSocketService(wsBaseUrl, getAuthToken);
      this.connections.set(key, service);
    }

    const service = this.connections.get(key)!;

    try {
      await service.connect(`/financial-data/${fileId}`);
      this.connectionStates.set(key, 'connected');
    } catch (error) {
      this.connectionStates.set(key, 'disconnected');
      throw error;
    }

    return service;
  }

  async connectToParameters(fileId: number): Promise<WebSocketService> {
    const key = `parameters-${fileId}`;

    if (!this.connections.has(key)) {
      const service = new WebSocketService(wsBaseUrl, getAuthToken);
      this.connections.set(key, service);
    }

    const service = this.connections.get(key)!;

    try {
      await service.connect(`/parameters/${fileId}`);
      this.connectionStates.set(key, 'connected');
    } catch (error) {
      this.connectionStates.set(key, 'disconnected');
      throw error;
    }

    return service;
  }

  disconnect(_key: string) {
    const service = this.connections.get(_key);
    if (service) {
      service.disconnect();
      this.connections.delete(_key);
      this.connectionStates.delete(_key);
    }
  }

  disconnectAll() {
    this.connections.forEach((service, _key) => {
      service.disconnect();
    });
    this.connections.clear();
    this.connectionStates.clear();
  }

  // Overloads:
  getConnectionState(): 'connecting' | 'connected' | 'disconnected';
  getConnectionState(_key: string): 'connecting' | 'connected' | 'disconnected';
  getConnectionState(): ConnectionState;
  // Implementation:
  getConnectionState(_key?: string): any {
    if (typeof _key === 'string') {
      return this.connectionStates.get(_key) || 'disconnected';
    } else if (_key === undefined) {
      if (this.isConnecting) return 'connecting';
      if (this.isConnected) return 'connected';
      return 'disconnected';
    }
    return this.connectionManager.getConnectionState();
  }

  getAllConnectionStates(): Record<
    string,
    'connecting' | 'connected' | 'disconnected'
  > {
    const states: Record<string, 'connecting' | 'connected' | 'disconnected'> =
      {};
    this.connectionStates.forEach((state, key) => {
      states[key] = state;
    });
    return states;
  }
}

// Global connection manager instance
export const wsConnectionManager = new WebSocketConnectionManager();
