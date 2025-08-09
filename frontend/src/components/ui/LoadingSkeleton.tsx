/**
 * Loading Skeleton Components
 * 
 * Reusable skeleton components for better loading states
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-muted',
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Card skeleton for dashboard cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4', className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
);

// Table skeleton for data tables
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string; 
}> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Stats skeleton for overview metrics
export const StatsSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-4 border rounded-lg space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

// Chart skeleton for metrics
export const ChartSkeleton: React.FC<{ 
  height?: string; 
  className?: string; 
}> = ({ 
  height = 'h-64', 
  className 
}) => (
  <div className={cn('space-y-4', className)}>
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className={cn('w-full rounded-lg', height)} />
  </div>
);

// Log entry skeleton
export const LogEntrySkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-3 border-b space-y-2', className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-3 w-3/4" />
  </div>
);

// System health skeleton
export const HealthSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-4', className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  </div>
);

