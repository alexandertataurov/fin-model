import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { toast } from 'sonner';
import { notificationsWebSocketService } from '../services/websocket';
import { makeApiCall, API_BASE_URL } from '../utils/apiUtils';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: string;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  read_at?: string;
  expires_at?: string;
  data: Record<string, any>;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_start_time?: string;
  quiet_end_time?: string;
  min_priority_email: string;
  min_priority_push: string;
  min_priority_in_app: string;
  type_preferences: Record<string, boolean>;
}

interface NotificationContextType {
  // State
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
  preferences: NotificationPreferences | null;

  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<boolean>;
  markAsReadOptimistic: (id: string) => void;
  markAllAsRead: () => Promise<boolean>;
  dismissNotification: (id: string) => Promise<boolean>;
  removeNotification: (id: string) => void;
  refreshNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;

  // Preferences
  updatePreferences: (
    updates: Partial<NotificationPreferences>
  ) => Promise<boolean>;

  // Connection management
  connect: () => Promise<void>;
  disconnect: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
  showToasts?: boolean;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  autoConnect = false, // Changed from true to false
  showToasts = true,
  maxNotifications = 100,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const unsubscribeRefs = useRef<Array<() => void>>([]);
  const initialized = useRef(false);

  // Get auth token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  // API calls
  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      return makeApiCall(`/notifications${endpoint}`, options);
    },
    []
  );

  // Load notifications from API
  const loadNotifications = useCallback(
    async (page = 1, append = false) => {
      // Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        console.log('User not authenticated, skipping notification load');
        return;
      }

      try {
        setIsLoading(true);
        const data = await apiCall(`/?page=${page}&limit=20`);

        if (append) {
          setNotifications(prev => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }

        setUnreadCount(data.unread_count);
        setHasMore(data.pagination.page < data.pagination.pages);
        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, getAuthToken]
  );

  // Load user preferences
  const loadPreferences = useCallback(async (): Promise<void> => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      console.log('User not authenticated, skipping preferences load');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/preferences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      } else if (response.status === 401) {
        console.log('User not authenticated, using default preferences');
        setPreferences(null);
      } else {
        console.error('Failed to fetch preferences:', response.status);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  }, []);

  // Handle real-time notification
  const handleNewNotification = useCallback(
    (data: any) => {
      const notification = data as Notification;

      // Add to notifications list
      setNotifications(prev => {
        const updated = [notification, ...prev];
        return updated.slice(0, maxNotifications); // Limit size
      });

      // Update unread count
      if (!notification.is_read) {
        setUnreadCount(prev => prev + 1);
      }

      // Show toast for high priority notifications
      if (
        showToasts &&
        (notification.priority === 'high' || notification.priority === 'urgent')
      ) {
        if (notification.priority === 'urgent') {
          toast.error(notification.title, {
            description: notification.message,
            duration: 10000,
          });
        } else {
          toast(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        }
      }
    },
    [maxNotifications, showToasts]
  );

  // Handle notification updates
  const handleNotificationUpdate = useCallback((data: any) => {
    const { id, action, status } = data;

    setNotifications(prev =>
      prev.map(notif => {
        if (notif.id === id) {
          const updated = { ...notif };

          if (action === 'read') {
            updated.is_read = true;
            updated.read_at = new Date().toISOString();
          } else if (action === 'dismissed') {
            updated.is_dismissed = true;
          }

          if (status) {
            updated.status = status;
          }

          return updated;
        }
        return notif;
      })
    );

    // Update unread count if notification was marked as read
    if (action === 'read') {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  // Handle bulk read update
  const handleBulkRead = useCallback((data: any) => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true, read_at: data.timestamp }))
    );
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const filtered = prev.filter(notif => notif.id !== id);

      // Update unread count if removed notification was unread
      if (notification && !notification.is_read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }

      return filtered;
    });
  }, []);

  const refreshNotifications = useCallback(async (): Promise<void> => {
    if (isLoading) return;

    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      console.log('User not authenticated, skipping notification refresh');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/?page=1&limit=${maxNotifications}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.items || []);
        setUnreadCount(data.unread_count || 0);
      } else if (response.status === 401) {
        console.log('User not authenticated, clearing notifications');
        setNotifications([]);
        setUnreadCount(0);
      } else if (response.status === 500) {
        console.log(
          'Server error (likely missing database tables), using empty notifications'
        );
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // On network errors, use empty state
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, maxNotifications]);

  // Show user-friendly notification about WebSocket limitations
  const showWebSocketLimitationNotification = useCallback(() => {
    if (showToasts) {
      console.warn(
        'WebSocket connection failed - notifications will use polling fallback'
      );
      // You can add a toast notification here if you have a toast system
    }
  }, [showToasts]);

  // Polling fallback
  const startPolling = useCallback(() => {
    console.log('Starting notification polling fallback');
    // Poll every 30 seconds as fallback
    const pollInterval = setInterval(() => {
      refreshNotifications();
    }, 30000);
    
    // Store interval for cleanup
    return () => clearInterval(pollInterval);
  }, [refreshNotifications]);

  // WebSocket connection management
  const connect = useCallback(async (): Promise<void> => {
    if (isConnected) {
      console.log('Already connected to notifications WebSocket');
      return;
    }

    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      console.log('User not authenticated, skipping WebSocket connection');
      return;
    }

    // Check if WebSocket service is available
    if (!notificationsWebSocketService.checkServiceAvailability()) {
      console.warn(
        'WebSocket service is unavailable, checking backend health...'
      );
      const isHealthy =
        await notificationsWebSocketService.checkBackendHealth();
      if (!isHealthy) {
        console.warn(
          'Backend health check failed, skipping WebSocket connection'
        );
        // Start polling as fallback
        startPolling();
        return;
      }
    }

    try {
      console.log('Attempting to connect to notifications WebSocket...');
      await notificationsWebSocketService.connect('/ws/notifications');
      setIsConnected(true);

      // Subscribe to different notification events
      notificationsWebSocketService.subscribe(
        'notification_created',
        handleNewNotification
      );
      notificationsWebSocketService.subscribe(
        'notification_updated',
        handleNotificationUpdate
      );
      notificationsWebSocketService.subscribe(
        'notification_deleted',
        handleBulkRead
      );

      console.log('Successfully connected to notifications WebSocket');
    } catch (error) {
      console.error('Failed to connect to notifications WebSocket:', error);
      setIsConnected(false);

      // Show user-friendly error message
      showWebSocketLimitationNotification();
      
      // Fallback to polling if WebSocket fails
      console.log('Falling back to polling for notifications');
      startPolling();
    }
  }, [handleNewNotification, handleNotificationUpdate, handleBulkRead, showWebSocketLimitationNotification, startPolling]);

  const disconnect = useCallback(() => {
    unsubscribeRefs.current.forEach(unsub => unsub());
    unsubscribeRefs.current = [];

    notificationsWebSocketService.disconnect();
    setIsConnected(false);
  }, []);

  // Actions
  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications(prev => {
        const updated = [notification, ...prev];
        return updated.slice(0, maxNotifications);
      });

      if (!notification.is_read) {
        setUnreadCount(prev => prev + 1);
      }
    },
    [maxNotifications]
  );

  const markAsReadOptimistic = useCallback(
    (id: string) => {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id && !notif.is_read
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );

      // Optimistically update unread count
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.is_read
          ? Math.max(0, prev - 1)
          : prev;
      });
    },
    [notifications]
  );

  const markAsRead = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await apiCall(`/${id}/read`, { method: 'POST' });

        // Update handled by WebSocket, but also update optimistically
        markAsReadOptimistic(id);

        return true;
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        return false;
      }
    },
    [apiCall, markAsReadOptimistic]
  );

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      await apiCall('/mark-all-read', { method: 'POST' });

      // Update optimistically
      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      );
      setUnreadCount(0);

      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }, [apiCall]);

  const dismissNotification = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await apiCall(`/${id}/dismiss`, { method: 'POST' });

        // Update optimistically
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, is_dismissed: true } : notif
          )
        );

        return true;
      } catch (error) {
        console.error('Failed to dismiss notification:', error);
        return false;
      }
    },
    [apiCall]
  );

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await loadNotifications(currentPage + 1, true);
    }
  }, [hasMore, isLoading, currentPage, loadNotifications]);

  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>): Promise<boolean> => {
      try {
        await apiCall('/preferences', {
          method: 'PUT',
          body: JSON.stringify(updates),
        });

        // Update local preferences
        setPreferences(prev => (prev ? { ...prev, ...updates } : null));

        return true;
      } catch (error) {
        console.error('Failed to update notification preferences:', error);
        return false;
      }
    },
    [apiCall]
  );

  // Initialize
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      // Only load data if user is authenticated
      const token = getAuthToken();
      if (token) {
        loadNotifications();
        loadPreferences();
      } else {
        console.log(
          'User not authenticated, skipping notification initialization'
        );
      }
    }

    return () => {
      disconnect();
    };
  }, [loadNotifications, loadPreferences, disconnect, getAuthToken]);

  // Auto-connect WebSocket when component mounts (only if authenticated)
  useEffect(() => {
    if (autoConnect) {
      // Check if user is authenticated before attempting connection
      const token = getAuthToken();
      if (token) {
        connect().catch(error => {
          console.warn('WebSocket connection failed:', error);
          // Show user-friendly notification about WebSocket unavailability
          showWebSocketLimitationNotification();
        });
      } else {
        console.log('User not authenticated, skipping WebSocket auto-connect');
      }
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect, showWebSocketLimitationNotification]);

  // Monitor connection state
  useEffect(() => {
    const checkConnection = () => {
      const wsConnected = notificationsWebSocketService.isConnectionReady();
      if (wsConnected !== isConnected) {
        setIsConnected(wsConnected);
      }
    };

    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Handle authentication state changes
  const handleAuthChange = useCallback(() => {
    const token = getAuthToken();
    if (token && !isConnected) {
      console.log('User authenticated, connecting WebSocket');
      connect();
    } else if (!token && isConnected) {
      console.log('User logged out, disconnecting WebSocket');
      disconnect();
    }
  }, [isConnected, connect, disconnect]);

  // Listen for authentication changes
  useEffect(() => {
    // Check auth state periodically
    const interval = setInterval(handleAuthChange, 5000);

    // Also check on storage events (when token is set/removed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        handleAuthChange();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleAuthChange]);

  const value: NotificationContextType = {
    // State
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    preferences,

    // Actions
    addNotification,
    markAsRead,
    markAsReadOptimistic,
    markAllAsRead,
    dismissNotification,
    removeNotification,
    refreshNotifications,
    loadMore,

    // Preferences
    updatePreferences,

    // Connection management
    connect,
    disconnect,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
