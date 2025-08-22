import * as React from 'react';

export type StatusBarVariant = 'default' | 'minimal' | 'elevated';
export type StatusBarSize = 'sm' | 'md' | 'lg';
export type StatusBarPosition = 'top' | 'bottom';
export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusItem {
  key: string;
  label: string;
  value?: string;
  status: StatusType;
  icon?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export interface StatusGroup {
  id: string;
  title?: string;
  icon?: string;
  items: StatusItem[];
  expanded?: boolean;
}

export interface StatusBarProgress {
  value: number;
  max: number;
  variant?: StatusBarVariant;
  showLabel?: boolean;
  label?: string;
}

export interface StatusBarNotification {
  type: StatusType;
  message: string;
  icon?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export interface StatusBarAction {
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
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  disabled?: boolean;
}

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Status type */
  status?: StatusType; // Add status property

  /** Status message */
  message?: string; // Add message property

  /** Status groups */
  groups?: StatusGroup[];

  /** Progress information */
  progress?: StatusBarProgress;

  /** Notification information */
  notification?: StatusBarNotification;

  /** Action buttons */
  actions?: StatusBarAction[];

  /** Visual variant of the status bar */
  variant?: StatusBarVariant;

  /** Size of the status bar */
  size?: StatusBarSize;

  /** Position of the status bar */
  position?: StatusBarPosition;

  /** Callback when an action is clicked */
  onActionClick?: (action: StatusBarAction) => void;

  /** Callback when notification is clicked */
  onNotificationClick?: () => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface StatusBarContextValue {
  /** Currently expanded groups */
  expandedGroups: Set<string>;

  /** Action click handler */
  onActionClick: (action: StatusBarAction) => void;

  /** Notification click handler */
  onNotificationClick: () => void;

  /** Group toggle handler */
  onGroupToggle: (groupId: string) => void;

  /** Visual variant */
  variant: StatusBarVariant;

  /** Size */
  size: StatusBarSize;
}

// Ref types
export type StatusBarRef = HTMLDivElement;
