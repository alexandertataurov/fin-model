import { apiClient } from './api';

export interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success' | 'system' | 'calculation' | 'collaboration' | 'security';
  category: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  user_id: number;
  is_read: boolean;
  is_dismissed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expires_at?: string;
  created_at: string;
  read_at?: string;
  dismissed_at?: string;
  action_url?: string;
  action_label?: string;
  source: string;
  reference_id?: string;
  reference_type?: 'file' | 'model' | 'scenario' | 'user' | 'system';
}

export interface NotificationPreferences {
  user_id: number;
  email_notifications: boolean;
  browser_notifications: boolean;
  sound_enabled: boolean;
  preferences: {
    calculation_complete: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
    error_occurred: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
    collaboration_invite: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
    system_maintenance: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
    security_alert: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
    file_processing: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
    model_shared: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
    parameter_changed: {
      enabled: boolean;
      email: boolean;
      browser: boolean;
      sound: boolean;
    };
  };
  quiet_hours: {
    enabled: boolean;
    start_time: string; // HH:MM format
    end_time: string;   // HH:MM format
    timezone: string;
  };
  digest_settings: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:MM format
    include_read: boolean;
  };
}

export interface NotificationStatistics {
  total_notifications: number;
  unread_count: number;
  notifications_by_type: Record<string, number>;
  notifications_by_priority: Record<string, number>;
  recent_activity: Array<{
    date: string;
    count: number;
    types: Record<string, number>;
  }>;
  engagement_stats: {
    read_rate: number;
    click_through_rate: number;
    average_time_to_read_hours: number;
  };
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  category: string;
  default_enabled: boolean;
  supports_email: boolean;
  supports_browser: boolean;
  supports_sound: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationTemplate {
  id: number;
  type: string;
  name: string;
  title_template: string;
  message_template: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminNotificationRequest {
  type: string;
  category: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target_users?: number[];
  target_roles?: string[];
  expires_at?: string;
  action_url?: string;
  action_label?: string;
  data?: Record<string, any>;
  schedule_at?: string;
}

export const notificationApi = {
  /**
   * Get notifications with pagination and filtering
   */
  async getNotifications(filters?: {
    is_read?: boolean;
    is_dismissed?: boolean;
    type?: string;
    category?: string;
    priority?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ notifications: Notification[]; total_count: number; unread_count: number }> {
    const response = await apiClient.get('/notifications/', { params: filters });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Dismiss notification
   */
  async dismissNotification(notificationId: number): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/notifications/${notificationId}/dismiss`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ marked_count: number }> {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },

  /**
   * Dismiss all notifications
   */
  async dismissAll(filters?: {
    type?: string;
    category?: string;
    older_than_days?: number;
  }): Promise<{ dismissed_count: number }> {
    const response = await apiClient.post('/notifications/dismiss-all', filters);
    return response.data;
  },

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get('/notifications/preferences');
    return response.data;
  },

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await apiClient.put('/notifications/preferences', preferences);
    return response.data;
  },

  /**
   * Get notification statistics
   */
  async getNotificationStatistics(timeRange?: string): Promise<NotificationStatistics> {
    const response = await apiClient.get('/notifications/stats', {
      params: timeRange ? { time_range: timeRange } : undefined,
    });
    return response.data;
  },

  /**
   * Get available notification types
   */
  async getNotificationTypes(): Promise<NotificationType[]> {
    const response = await apiClient.get('/notifications/types');
    return response.data;
  },

  /**
   * Test notification delivery
   */
  async testNotification(type: 'email' | 'browser' | 'sound', message?: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/notifications/test', {
      delivery_type: type,
      test_message: message,
    });
    return response.data;
  },

  /**
   * Get notification templates (admin)
   */
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    const response = await apiClient.get('/notifications/templates');
    return response.data;
  },

  /**
   * Create notification template (admin)
   */
  async createNotificationTemplate(template: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationTemplate> {
    const response = await apiClient.post('/notifications/templates', template);
    return response.data;
  },

  /**
   * Update notification template (admin)
   */
  async updateNotificationTemplate(templateId: number, updates: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const response = await apiClient.put(`/notifications/templates/${templateId}`, updates);
    return response.data;
  },

  /**
   * Delete notification template (admin)
   */
  async deleteNotificationTemplate(templateId: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/notifications/templates/${templateId}`);
    return response.data;
  },

  /**
   * Create admin notification
   */
  async createAdminNotification(notification: AdminNotificationRequest): Promise<{ notification_id: number; sent_to_count: number }> {
    const response = await apiClient.post('/notifications/admin/create', notification);
    return response.data;
  },

  /**
   * Subscribe to browser notifications
   */
  async subscribeToBrowserNotifications(subscriptionData: PushSubscription): Promise<{ success: boolean }> {
    const response = await apiClient.post('/notifications/browser-subscribe', {
      subscription: subscriptionData,
    });
    return response.data;
  },

  /**
   * Unsubscribe from browser notifications
   */
  async unsubscribeFromBrowserNotifications(): Promise<{ success: boolean }> {
    const response = await apiClient.post('/notifications/browser-unsubscribe');
    return response.data;
  },

  /**
   * Get notification delivery status
   */
  async getNotificationDeliveryStatus(notificationId: number): Promise<{
    email: { sent: boolean; delivered: boolean; opened: boolean; error?: string };
    browser: { sent: boolean; delivered: boolean; clicked: boolean; error?: string };
    sound: { played: boolean; error?: string };
  }> {
    const response = await apiClient.get(`/notifications/${notificationId}/delivery-status`);
    return response.data;
  },
};

/**
 * Browser notification utilities
 */
export const notificationUtils = {
  /**
   * Check if browser notifications are supported
   */
  isBrowserNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  },

  /**
   * Request browser notification permission
   */
  async requestBrowserNotificationPermission(): Promise<NotificationPermission> {
    if (!this.isBrowserNotificationSupported()) {
      throw new Error('Browser notifications not supported');
    }

    const permission = await Notification.requestPermission();
    return permission;
  },

  /**
   * Show browser notification
   */
  async showBrowserNotification(notification: Notification): Promise<void> {
    const permission = Notification.permission;
    if (permission !== 'granted') {
      console.warn('Browser notifications not permitted');
      return;
    }

    const options: NotificationOptions = {
      body: notification.message,
      icon: this.getNotificationIcon(notification.type),
      badge: '/icons/badge-icon.png',
      tag: `notification-${notification.id}`,
      requireInteraction: notification.priority === 'urgent',
      actions: notification.action_url ? [
        {
          action: 'view',
          title: notification.action_label || 'View',
        }
      ] : undefined,
      data: {
        notificationId: notification.id,
        url: notification.action_url,
      },
    };

    const browserNotification = new Notification(notification.title, options);

    browserNotification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      
      if (notification.action_url) {
        window.open(notification.action_url, '_blank');
      }
      
      // Mark as read
      notificationApi.markAsRead(notification.id);
      browserNotification.close();
    };

    // Auto-close after delay based on priority
    const autoCloseDelay = this.getAutoCloseDelay(notification.priority);
    if (autoCloseDelay > 0) {
      setTimeout(() => {
        browserNotification.close();
      }, autoCloseDelay);
    }
  },

  /**
   * Get notification icon based on type
   */
  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      info: '/icons/info-icon.png',
      warning: '/icons/warning-icon.png',
      error: '/icons/error-icon.png',
      success: '/icons/success-icon.png',
      system: '/icons/system-icon.png',
      calculation: '/icons/calculation-icon.png',
      collaboration: '/icons/collaboration-icon.png',
      security: '/icons/security-icon.png',
    };
    return icons[type] || '/icons/default-icon.png';
  },

  /**
   * Get auto-close delay based on priority
   */
  getAutoCloseDelay(priority: string): number {
    const delays: Record<string, number> = {
      low: 8000,    // 8 seconds
      medium: 12000, // 12 seconds
      high: 20000,   // 20 seconds
      urgent: 0,     // No auto-close
    };
    return delays[priority] || 10000;
  },

  /**
   * Play notification sound
   */
  async playNotificationSound(type: string, volume: number = 0.5): Promise<void> {
    try {
      const audio = new Audio(this.getNotificationSound(type));
      audio.volume = Math.max(0, Math.min(1, volume));
      await audio.play();
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  },

  /**
   * Get notification sound based on type
   */
  getNotificationSound(type: string): string {
    const sounds: Record<string, string> = {
      info: '/sounds/info.mp3',
      warning: '/sounds/warning.mp3',
      error: '/sounds/error.mp3',
      success: '/sounds/success.mp3',
      system: '/sounds/system.mp3',
      calculation: '/sounds/calculation.mp3',
      collaboration: '/sounds/collaboration.mp3',
      security: '/sounds/security.mp3',
    };
    return sounds[type] || '/sounds/default.mp3';
  },

  /**
   * Get notification type color
   */
  getNotificationTypeColor(type: string): string {
    const colors: Record<string, string> = {
      info: '#3B82F6',
      warning: '#F59E0B',
      error: '#EF4444',
      success: '#10B981',
      system: '#6B7280',
      calculation: '#8B5CF6',
      collaboration: '#06B6D4',
      security: '#DC2626',
    };
    return colors[type] || '#9CA3AF';
  },

  /**
   * Get priority badge
   */
  getPriorityBadge(priority: string): { color: string; icon: string; label: string } {
    const badges: Record<string, { color: string; icon: string; label: string }> = {
      low: { color: '#6B7280', icon: '🔵', label: 'Low' },
      medium: { color: '#F59E0B', icon: '🟡', label: 'Medium' },
      high: { color: '#EF4444', icon: '🟠', label: 'High' },
      urgent: { color: '#DC2626', icon: '🔴', label: 'Urgent' },
    };
    return badges[priority] || { color: '#9CA3AF', icon: '⚪', label: 'Unknown' };
  },

  /**
   * Format time ago
   */
  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  /**
   * Check if notification is in quiet hours
   */
  isInQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quiet_hours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const { start_time, end_time } = preferences.quiet_hours;
    
    // Handle same day quiet hours
    if (start_time < end_time) {
      return currentTime >= start_time && currentTime <= end_time;
    }
    
    // Handle overnight quiet hours (e.g., 22:00 to 06:00)
    return currentTime >= start_time || currentTime <= end_time;
  },

  /**
   * Group notifications by date
   */
  groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
    const groups: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return groups;
  },

  /**
   * Filter notifications by preference settings
   */
  filterNotificationsByPreferences(notifications: Notification[], preferences: NotificationPreferences): Notification[] {
    return notifications.filter(notification => {
      const categoryPrefs = preferences.preferences[notification.category as keyof typeof preferences.preferences];
      return categoryPrefs?.enabled !== false;
    });
  },
};

export default notificationApi;