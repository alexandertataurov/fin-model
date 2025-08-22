import React from 'react';

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
  icon?: string;
  badge?: React.ReactNode;
}

export interface NavigationProps extends React.ComponentPropsWithoutRef<'nav'> {
  variant?: 'horizontal' | 'vertical' | 'tabs' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  items?: NavigationItem[]; // Add items property
  className?: string;
}

export interface NavigationItemProps
  extends React.ComponentPropsWithoutRef<'a'> {
  active?: boolean;
  disabled?: boolean;
  icon?: string;
  badge?: React.ReactNode;
  className?: string;
}

export interface NavigationGroupProps
  extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  collapsed?: boolean;
  className?: string;
}

export interface NavigationRef extends HTMLElement {}
