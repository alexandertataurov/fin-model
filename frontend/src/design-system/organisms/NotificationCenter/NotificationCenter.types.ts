import * as React from 'react';

export type NotificationCenterVariant = 'default' | 'minimal' | 'elevated';
export type NotificationCenterSize = 'sm' | 'md' | 'lg';
export type NotificationType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';
export type NotificationPriority = 'high' | 'medium' | 'low' | 'normal';

export interface NotificationAction {
  key: string;
  label: string;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  icon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  time: string;
  icon?: string;
  actions?: NotificationAction[];
}

export interface NotificationGroup {
  id: string;
  title: string;
  icon?: string;
  notifications: Notification[];
  expanded?: boolean;
}

export interface NotificationCenterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Center title */
  title?: string;

  /** Center subtitle */
  subtitle?: string;

  /** Notifications array */
  notifications?: Notification[];

  /** Notification groups */
  groups?: NotificationGroup[];

  /** Whether the center is searchable */
  searchable?: boolean;

  /** Whether the center has filters */
  filterable?: boolean;

  /** Visual variant of the center */
  variant?: NotificationCenterVariant;

  /** Size of the center */
  size?: NotificationCenterSize;

  /** Whether the center is expanded */
  expanded?: boolean;

  /** Callback when a notification is dismissed */
  onDismiss?: (notification: Notification) => void;

  /** Callback when a notification is clicked */
  onNotificationClick?: (notification: Notification) => void;

  /** Callback when a notification action is triggered */
  onNotificationAction?: (notification: Notification, action: string) => void;

  /** Callback when all notifications are marked as read */
  onMarkAllRead?: () => void;

  /** Callback when all notifications are cleared */
  onClearAll?: () => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface NotificationCenterContextValue {
  /** Current search term */
  searchTerm: string;

  /** Current active filters */
  activeFilters: Record<string, any>;

  /** Currently expanded groups */
  expandedGroups: Set<string>;

  /** Number of unread notifications */
  unreadCount: number;

  /** Notification click handler */
  onNotificationClick: (notification: Notification) => void;

  /** Notification action handler */
  onNotificationAction: (notification: Notification, action: string) => void;

  /** Mark all read handler */
  onMarkAllRead: () => void;

  /** Clear all handler */
  onClearAll: () => void;

  /** Group toggle handler */
  onGroupToggle: (groupId: string) => void;

  /** Visual variant */
  variant: NotificationCenterVariant;

  /** Size */
  size: NotificationCenterSize;
}

// Ref types
export type NotificationCenterRef = HTMLDivElement;
