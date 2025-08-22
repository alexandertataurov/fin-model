import React from 'react';

export interface HeaderProps extends React.ComponentPropsWithoutRef<'header'> {
  variant?: 'default' | 'minimal' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  sticky?: boolean;
  className?: string;
}

export interface HeaderLogoProps extends React.ComponentPropsWithoutRef<'div'> {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface HeaderNavigationProps
  extends React.ComponentPropsWithoutRef<'nav'> {
  items?: Array<{
    label: string;
    href: string;
    active?: boolean;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export interface HeaderActionsProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface HeaderRef extends HTMLElement {}
