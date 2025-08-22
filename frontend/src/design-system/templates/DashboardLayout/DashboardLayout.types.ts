import * as React from 'react';

export type DashboardLayoutVariant = 'default' | 'minimal' | 'elevated';
export type DashboardLayoutSize = 'sm' | 'md' | 'lg';

export interface DashboardLayoutAction {
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
  onClick?: () => void;
}

export interface DashboardLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Header component */
  header?: React.ReactElement;

  /** Sidebar component */
  sidebar?: React.ReactElement;

  /** Footer component */
  footer?: React.ReactElement;

  /** Page title */
  title?: string;

  /** Breadcrumb navigation items */
  breadcrumb?: string[];

  /** Page actions */
  actions?: DashboardLayoutAction[];

  /** Visual variant of the layout */
  variant?: DashboardLayoutVariant;

  /** Size of the layout */
  size?: DashboardLayoutSize;

  /** Whether the sidebar is collapsed */
  sidebarCollapsed?: boolean;

  /** Callback when sidebar is toggled */
  onSidebarToggle?: (collapsed: boolean) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface DashboardLayoutContextValue {
  /** Whether the sidebar is collapsed */
  isSidebarCollapsed: boolean;

  /** Function to set sidebar collapsed state */
  setIsSidebarCollapsed: (collapsed: boolean) => void;

  /** Visual variant */
  variant: DashboardLayoutVariant;

  /** Size */
  size: DashboardLayoutSize;

  /** Sidebar toggle handler */
  onSidebarToggle: () => void;
}

// Ref types
export type DashboardLayoutRef = HTMLDivElement;
