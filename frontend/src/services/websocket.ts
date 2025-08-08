/**
 * WebSocket Service for Real-time Notifications
 * Enhanced implementation with better error handling
 */

interface WebSocketEventHandler {
  (data: any): void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private url = '';
  private originalEndpoint = '';
  private subscriptions = new Map<string, WebSocketEventHandler[]>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isServiceAvailable = true;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;

  async connect(endpoint: string): Promise<void> {
    try {
      // Prevent multiple simultaneous connections
      if (this.isConnecting) {
        console.log('WebSocket connection already in progress');
        return;
      }

      // Don't connect if service is marked as unavailable
      if (!this.isServiceAvailable) {
        console.warn('WebSocket service is marked as unavailable, skipping connection');
        throw new Error('WebSocket service unavailable');
      }

      // Don't connect if already connected
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
      }

      this.isConnecting = true;

      // Store the original endpoint for reconnection
      this.originalEndpoint = endpoint;

      // Get auth token from localStorage
      const token = localStorage.getItem('access_token');

      // Check if authentication is required for this endpoint
      const requiresAuth = endpoint !== '/ws/health';

      if (requiresAuth && !token) {
        console.warn('WebSocket connection requires authentication but no token found');
        this.isConnecting = false;
        throw new Error('Authentication required');
      }

      // Use Railway backend URL for WebSocket connections
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = 'fin-model-production.up.railway.app';

      // Add token as query parameter if available and required
      const baseUrl = `${protocol}//${host}${
        endpoint.startsWith('/') ? endpoint : '/' + endpoint
      }`;

      this.url =
        token && requiresAuth
          ? `${baseUrl}?token=${encodeURIComponent(token)}`
          : baseUrl;

      console.log(`Connecting to WebSocket: ${this.url}`);
      
      // Close existing connection if any
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      // Create new WebSocket connection
      this.ws = new WebSocket(this.url);

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout');
          this.ws.close();
          this.isConnecting = false;
        }
      }, 20000); // 20 second timeout

      return new Promise((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('Failed to create WebSocket'));
          return;
        }

        this.ws.onopen = () => {
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          console.log('WebSocket connected successfully');
          this.reconnectAttempts = 0;
          this.isServiceAvailable = true;
          this.isConnecting = false;
          resolve();
        };

        this.ws.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = event => {
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
          this.isConnecting = false;
          
          // Handle specific error codes
          if (event.code === 4001) {
            console.warn('WebSocket authentication failed');
            this.isServiceAvailable = false;
            reject(new Error('Authentication failed'));
            return;
          }
          
          if (event.code === 1006) {
            console.warn('WebSocket connection aborted');
            this.isServiceAvailable = false;
            reject(new Error('Connection aborted'));
            return;
          }
          
          // Only attempt reconnect for certain error codes
          if (event.code !== 1000 && 
              event.code !== 4001 && 
              event.code !== 1006 && 
              this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = error => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.isServiceAvailable = false;
          reject(error);
        };
      });

    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect to WebSocket:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    console.log('WebSocket disconnected');
  }

  subscribe(event: string, handler: WebSocketEventHandler): () => void {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, []);
    }

    this.subscriptions.get(event)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.subscriptions.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  private handleMessage(data: any): void {
    const { event, payload } = data;
    const handlers = this.subscriptions.get(event);

    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error('Error in WebSocket event handler:', error);
        }
      });
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      this.connect(this.originalEndpoint);
    }, delay);
  }

  isConnectionReady(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  send(event: string, data: any): void {
    if (this.isConnectionReady()) {
      this.ws!.send(JSON.stringify({ event, data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }

  checkServiceAvailability(): boolean {
    return this.isServiceAvailable;
  }

  resetServiceAvailability(): void {
    this.isServiceAvailable = true;
  }

  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(
        'https://fin-model-production.up.railway.app/health',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Short timeout to avoid hanging
          signal: AbortSignal.timeout(5000),
        }
      );

      if (response.ok) {
        this.isServiceAvailable = true;
        return true;
      } else {
        console.warn('Backend health check failed:', response.status);
        this.isServiceAvailable = false;
        return false;
      }
    } catch (error) {
      console.warn('Backend health check error:', error);
      this.isServiceAvailable = false;
      return false;
    }
  }
}

// Export singleton instances
export const notificationsWebSocketService = new WebSocketService();
export const dashboardWebSocketService = new WebSocketService();
