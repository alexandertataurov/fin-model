import * as React from 'react';

export type UserMenuVariant = 'default' | 'minimal' | 'elevated';
export type UserMenuSize = 'sm' | 'md' | 'lg';

export interface User {
  name: string;
  email: string;
  role?: string; // Make optional
  status?: string; // Make optional
  avatar?: string;
}

export interface UserMenuItem {
  key: string;
  label: string;
  description?: string;
  icon: string;
  danger?: boolean;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export interface UserMenuGroup {
  id: string;
  title?: string;
  icon?: string;
  items: UserMenuItem[];
}

export interface UserMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** User information */
  user: User;

  /** Menu groups */
  groups?: UserMenuGroup[];

  /** Whether to show theme toggle */
  themeToggle?: boolean;

  /** Visual variant of the menu */
  variant?: UserMenuVariant;

  /** Size of the menu */
  size?: UserMenuSize;

  /** Whether the menu is expanded */
  expanded?: boolean;

  /** Callback when a menu item is clicked */
  onItemClick?: (item: UserMenuItem) => void;

  /** Callback when theme toggle is clicked */
  onThemeToggle?: () => void;

  /** Callback when logout is clicked */
  onLogout?: () => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface UserMenuContextValue {
  /** Whether the menu is expanded */
  isExpanded: boolean;

  /** Currently active item */
  activeItem: string | null;

  /** Menu toggle handler */
  onMenuToggle: () => void;

  /** Item click handler */
  onItemClick: (item: UserMenuItem) => void;

  /** Theme toggle handler */
  onThemeToggle: () => void;

  /** Logout handler */
  onLogout: () => void;

  /** Visual variant */
  variant: UserMenuVariant;

  /** Size */
  size: UserMenuSize;
}

// Ref types
export type UserMenuRef = HTMLDivElement;
