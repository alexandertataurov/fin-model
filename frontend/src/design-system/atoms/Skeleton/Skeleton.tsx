import React from 'react';
import { cn } from '../../../utils/cn';
import { SkeletonProps, SkeletonRef } from './Skeleton.types';
import { skeletonVariants } from './Skeleton.variants';

export const Skeleton = React.forwardRef<SkeletonRef, SkeletonProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Simple specialized skeletons built from the base Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={className}>
    <Skeleton className="h-6 w-40 mb-2" />
    <Skeleton className="h-8 w-24 mb-3" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 4, columns = 4, className }) => (
  <div className={className}>
    <div className="mb-2 flex gap-2">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-24" />
      ))}
    </div>
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(4rem, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const StatsSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className ?? ''}`}
  >
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton: React.FC<{
  height?: string;
  className?: string;
}> = ({ height = '200px', className }) => (
  <div className={className}>
    <Skeleton className="h-5 w-40 mb-3" />
    <Skeleton className="w-full" style={{ height }} />
  </div>
);

export const LogEntrySkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={`flex items-center gap-3 ${className ?? ''}`}>
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-3 w-16" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const HealthSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={`flex items-center gap-2 ${className ?? ''}`}>
    <Skeleton className="h-3 w-3" variant="circular" />
    <Skeleton className="h-3 w-24" />
  </div>
);
