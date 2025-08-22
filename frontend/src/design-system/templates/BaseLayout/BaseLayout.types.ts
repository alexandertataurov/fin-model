import React from 'react';

export interface BaseLayoutProps extends React.ComponentPropsWithoutRef<'div'> {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'default' | 'minimal' | 'dashboard' | 'landing';
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  className?: string;
}

export interface BaseLayoutHeaderProps
  extends React.ComponentPropsWithoutRef<'header'> {
  className?: string;
}

export interface BaseLayoutSidebarProps
  extends React.ComponentPropsWithoutRef<'aside'> {
  collapsed?: boolean;
  className?: string;
}

export interface BaseLayoutMainProps
  extends React.ComponentPropsWithoutRef<'main'> {
  className?: string;
}

export interface BaseLayoutFooterProps
  extends React.ComponentPropsWithoutRef<'footer'> {
  className?: string;
}

export interface BaseLayoutRef extends HTMLDivElement {}
