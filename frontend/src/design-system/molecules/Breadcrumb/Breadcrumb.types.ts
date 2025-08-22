import React from 'react';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  separator?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<'li'> {
  current?: boolean;
  className?: string;
}

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<'a'> {
  current?: boolean;
  className?: string;
}

export interface BreadcrumbRef extends HTMLElement {}
