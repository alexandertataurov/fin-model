import * as React from 'react';

export type AdminLayoutVariant = 'default' | 'minimal' | 'elevated';
export type AdminLayoutSize = 'sm' | 'md' | 'lg';

export interface AdminLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Logo icon name */
  logo?: string;

  /** Logo text */
  logoText?: string;

  /** Navigation items */
  navigationItems?: any[];

  /** User information */
  user?: any;

  /** Notifications */
  notifications?: any[];

  /** Status items */
  statusItems?: any[];

  /** Action items */
  actions?: any[];

  /** Visual variant of the layout */
  variant?: AdminLayoutVariant;

  /** Size of the layout */
  size?: AdminLayoutSize;

  /** Whether the sidebar is collapsed */
  sidebarCollapsed?: boolean;

  /** Whether to show the header */
  showHeader?: boolean;

  /** Whether to show the footer */
  showFooter?: boolean;

  /** Whether to show the sidebar */
  showSidebar?: boolean;

  /** Whether to show the status bar */
  showStatusBar?: boolean;

  /** Whether to show the notification center */
  showNotificationCenter?: boolean;

  /** Whether to show the user menu */
  showUserMenu?: boolean;

  /** Whether to show the action bar */
  showActionBar?: boolean;

  /** Header component props */
  headerProps?: any;

  /** Footer component props */
  footerProps?: any;

  /** Navigation component props */
  navigationProps?: any;

  /** Status bar component props */
  statusBarProps?: any;

  /** Notification center component props */
  notificationCenterProps?: any;

  /** User menu component props */
  userMenuProps?: any;

  /** Action bar component props */
  actionBarProps?: any;

  /** Callback when sidebar is toggled */
  onSidebarToggle?: (collapsed: boolean) => void;

  /** Callback when logo is clicked */
  onLogoClick?: () => void;

  /** Callback when navigation item is clicked */
  onNavigationItemClick?: (item: any) => void;

  /** Callback when user menu item is clicked */
  onUserMenuClick?: (item: any) => void;

  /** Callback when notification is clicked */
  onNotificationClick?: (notification: any) => void;

  /** Callback when status item is clicked */
  onStatusItemClick?: (item: any) => void;

  /** Callback when action is clicked */
  onActionClick?: (action: any) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface AdminLayoutContextValue {
  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Logo icon name */
  logo?: string;

  /** Logo text */
  logoText?: string;

  /** Navigation items */
  navigationItems: any[];

  /** User information */
  user?: any;

  /** Notifications */
  notifications: any[];

  /** Status items */
  statusItems: any[];

  /** Action items */
  actions: any[];

  /** Visual variant */
  variant: AdminLayoutVariant;

  /** Size */
  size: AdminLayoutSize;

  /** Whether sidebar is collapsed */
  sidebarCollapsed: boolean;

  /** Whether mobile menu is open */
  mobileMenuOpen: boolean;

  /** Sidebar toggle handler */
  onSidebarToggle: (collapsed: boolean) => void;

  /** Mobile menu toggle handler */
  onMobileMenuToggle: () => void;

  /** Logo click handler */
  onLogoClick: () => void;

  /** Navigation item click handler */
  onNavigationItemClick: (item: any) => void;

  /** User menu click handler */
  onUserMenuClick: (item: any) => void;

  /** Notification click handler */
  onNotificationClick: (notification: any) => void;

  /** Status item click handler */
  onStatusItemClick: (item: any) => void;

  /** Action click handler */
  onActionClick: (action: any) => void;
}

// Ref types
export type AdminLayoutRef = HTMLDivElement;
