import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export interface SkeletonRef extends HTMLDivElement {}

// Specialized skeleton components
export interface CardSkeletonProps {
  className?: string;
}

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export interface StatsSkeletonProps {
  className?: string;
}

export interface ChartSkeletonProps {
  height?: string;
  className?: string;
}

export interface LogEntrySkeletonProps {
  className?: string;
}

export interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

export interface ListSkeletonProps {
  items?: number;
  className?: string;
}

export interface SidebarSkeletonProps {
  className?: string;
}

export interface DashboardSkeletonProps {
  className?: string;
}
