import React from 'react';

export interface FooterProps extends React.ComponentPropsWithoutRef<'footer'> {
  variant?: 'default' | 'minimal' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface FooterBrandProps
  extends React.ComponentPropsWithoutRef<'div'> {
  logo?: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface FooterLinksProps
  extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  className?: string;
}

export interface FooterSocialProps
  extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  links?: Array<{
    label: string;
    href: string;
    icon?: string;
    external?: boolean;
  }>;
  className?: string;
}

export interface FooterBottomProps
  extends React.ComponentPropsWithoutRef<'div'> {
  copyright?: string;
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  className?: string;
}

export interface FooterRef extends HTMLElement {}
