import React from 'react';

export interface DashboardProps extends React.ComponentPropsWithoutRef<'div'> {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  children?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  className?: string;
}

export interface DashboardHeaderProps
  extends React.ComponentPropsWithoutRef<'header'> {
  className?: string;
}

export interface DashboardSidebarProps
  extends React.ComponentPropsWithoutRef<'aside'> {
  collapsed?: boolean;
  className?: string;
}

export interface DashboardMainProps
  extends React.ComponentPropsWithoutRef<'main'> {
  className?: string;
}

export interface DashboardContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface DashboardRef extends HTMLDivElement {}
