import * as React from 'react';

export type DashboardVariant = 'default' | 'minimal' | 'elevated';
export type DashboardSize = 'sm' | 'md' | 'lg';

export interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Visual variant of the dashboard */
  variant?: DashboardVariant;

  /** Size of the dashboard */
  size?: DashboardSize;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

// Ref types
export type DashboardRef = HTMLDivElement;
