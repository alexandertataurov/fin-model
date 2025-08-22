import * as React from 'react';

export type UserProfileVariant = 'default' | 'minimal' | 'elevated';
export type UserProfileSize = 'sm' | 'md' | 'lg';

export interface UserProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** User ID */
  userId?: string;

  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Visual variant of the user profile */
  variant?: UserProfileVariant;

  /** Size of the user profile */
  size?: UserProfileSize;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

// Ref types
export type UserProfileRef = HTMLDivElement;
