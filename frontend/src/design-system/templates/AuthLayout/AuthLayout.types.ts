import * as React from 'react';

export type AuthLayoutVariant = 'default' | 'minimal' | 'elevated';
export type AuthLayoutSize = 'sm' | 'md' | 'lg';

export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Logo icon name */
  logo?: string;

  /** Logo text */
  logoText?: string;

  /** Visual variant of the layout */
  variant?: AuthLayoutVariant;

  /** Size of the layout */
  size?: AuthLayoutSize;

  /** Whether to center the content vertically */
  centered?: boolean;

  /** Whether to show the header */
  showHeader?: boolean;

  /** Whether to show the footer */
  showFooter?: boolean;

  /** Whether to show the background */
  showBackground?: boolean;

  /** Header component props */
  headerProps?: any;

  /** Footer component props */
  footerProps?: any;

  /** Callback when logo is clicked */
  onLogoClick?: () => void;

  /** Callback when footer link is clicked */
  onFooterLinkClick?: (link: string) => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface AuthLayoutContextValue {
  /** Page title */
  title?: string;

  /** Page subtitle */
  subtitle?: string;

  /** Logo icon name */
  logo?: string;

  /** Logo text */
  logoText?: string;

  /** Visual variant */
  variant: AuthLayoutVariant;

  /** Size */
  size: AuthLayoutSize;

  /** Whether content is centered */
  centered: boolean;

  /** Logo click handler */
  onLogoClick: () => void;

  /** Footer link click handler */
  onFooterLinkClick: (link: string) => void;
}

// Ref types
export type AuthLayoutRef = HTMLDivElement;
