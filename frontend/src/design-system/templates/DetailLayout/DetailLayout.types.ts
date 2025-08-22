import * as React from 'react';

export type DetailLayoutVariant = 'default' | 'minimal' | 'elevated';
export type DetailLayoutSize = 'sm' | 'md' | 'lg';

export interface DetailLayoutAction {
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

export interface DetailLayoutSidebarSection {
  title?: string;
  content: React.ReactNode;
}

export interface DetailLayoutStatus {
  text: string;
  variant:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning';
  icon?: string;
}

export interface DetailLayoutMetaItem {
  label: string;
  value: string;
  icon?: string;
}

export interface DetailLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Header component */
  header?: React.ReactElement;

  /** Footer component */
  footer?: React.ReactElement;

  /** Form component */
  form?: React.ReactElement;

  /** Sidebar sections */
  sidebar?: DetailLayoutSidebarSection[];

  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Breadcrumb navigation items */
  breadcrumb?: string[];

  /** Status information */
  status?: DetailLayoutStatus;

  /** Meta information items */
  meta?: DetailLayoutMetaItem[];

  /** Page actions */
  actions?: DetailLayoutAction[];

  /** Visual variant of the layout */
  variant?: DetailLayoutVariant;

  /** Size of the layout */
  size?: DetailLayoutSize;

  /** Callback when an action is clicked */
  onActionClick?: (action: DetailLayoutAction) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface DetailLayoutContextValue {
  /** Whether the layout is in editing mode */
  isEditing: boolean;

  /** Function to set editing mode */
  setIsEditing: (editing: boolean) => void;

  /** Action click handler */
  onActionClick: (action: DetailLayoutAction) => void;

  /** Visual variant */
  variant: DetailLayoutVariant;

  /** Size */
  size: DetailLayoutSize;
}

// Ref types
export type DetailLayoutRef = HTMLDivElement;
