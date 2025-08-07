/**
 * Loading State Components for Dashboard
 * 
 * Provides consistent loading indicators across dashboard components
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface LoadingProps {
  height?: number | string;
  variant?: 'circular' | 'linear' | 'skeleton' | 'card';
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const DashboardLoading: React.FC<LoadingProps> = ({
  height = 'auto',
  variant = 'circular',
  message,
  size = 'medium',
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 64;
      default: return 40;
    }
  };

  if (variant === 'linear') {
    return (
      <div className="w-full" style={{ height }}>
        <Progress value={undefined} className="h-2" />
        {message && (
          <p className="text-sm text-center mt-2 text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div style={{ height }}>
        <Skeleton className="w-full h-48" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card style={{ height }}>
        <CardContent>
          <div className="flex flex-col items-center py-8">
            <div 
              className="animate-spin rounded-full border-b-2 border-primary"
              style={{ width: getSize(), height: getSize() }}
            />
            {message && (
              <p className="text-sm text-muted-foreground mt-4">
                {message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      className="flex flex-col justify-center items-center p-4"
      style={{ height }}
    >
      <div 
        className="animate-spin rounded-full border-b-2 border-primary"
        style={{ width: getSize(), height: getSize() }}
      />
      {message && (
        <p className="text-sm text-muted-foreground mt-4">
          {message}
        </p>
      )}
    </div>
  );
};

export const MetricCardSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    </CardContent>
  </Card>
);

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <Card>
    <CardContent className="p-6">
      <Skeleton className="w-full" style={{ height }} />
    </CardContent>
  </Card>
);

export const DashboardGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <MetricCardSkeleton key={index} />
    ))}
  </div>
);

export default DashboardLoading;