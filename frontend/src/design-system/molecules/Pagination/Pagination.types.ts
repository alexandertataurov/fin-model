import React from 'react';

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export interface PaginationItemProps
  extends React.ComponentPropsWithoutRef<'li'> {
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface PaginationLinkProps
  extends React.ComponentPropsWithoutRef<'button'> {
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface PaginationRef extends HTMLElement {}
