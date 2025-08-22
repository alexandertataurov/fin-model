import * as React from 'react';

export type BreadcrumbNavVariant = 'default' | 'minimal' | 'elevated';
export type BreadcrumbNavSize = 'sm' | 'md' | 'lg';

export interface BreadcrumbItem {
  key: string;
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export interface BreadcrumbNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items?: BreadcrumbItem[];

  /** Separator icon between items */
  separator?: string;

  /** Maximum number of items to show before collapsing */
  maxItems?: number;

  /** Whether to show home item */
  showHome?: boolean;

  /** Home item icon */
  homeIcon?: string;

  /** Home item label */
  homeLabel?: string;

  /** Visual variant of the breadcrumb */
  variant?: BreadcrumbNavVariant;

  /** Size of the breadcrumb */
  size?: BreadcrumbNavSize;

  /** Whether to collapse long breadcrumbs */
  collapsed?: boolean;

  /** Callback when a breadcrumb item is clicked */
  onItemClick?: (item: BreadcrumbItem) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface BreadcrumbNavContextValue {
  /** All breadcrumb items */
  items: BreadcrumbItem[];

  /** Whether collapsed menu is expanded */
  collapsedExpanded: boolean;

  /** Item click handler */
  onItemClick: (item: BreadcrumbItem) => void;

  /** Collapsed toggle handler */
  onCollapsedToggle: () => void;

  /** Visual variant */
  variant: BreadcrumbNavVariant;

  /** Size */
  size: BreadcrumbNavSize;
}

// Ref types
export type BreadcrumbNavRef = HTMLElement;
