/**
 * Loading State Components for Dashboard
 * 
 * Provides consistent loading indicators across dashboard components
 */

import React from 'react';
import {
  Box,
  CircularProgress,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
} from '@mui/material';

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
      <Box sx={{ width: '100%', height }}>
        <LinearProgress />
        {message && (
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'skeleton') {
    return (
      <Box sx={{ height }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </Box>
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Card sx={{ height }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={getSize()} sx={{ mb: 2 }} />
            {message && (
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        height,
        p: 2 
      }}
    >
      <CircularProgress size={getSize()} />
      {message && (
        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export const MetricCardSkeleton: React.FC = () => (
  <Card>
    <CardContent sx={{ textAlign: 'center' }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" height={32} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={height} />
  </Box>
);

export const DashboardGridSkeleton: React.FC = () => (
  <Grid container spacing={3}>
    {[1, 2, 3].map((i) => (
      <Grid item xs={12} sm={4} key={i}>
        <MetricCardSkeleton />
      </Grid>
    ))}
    <Grid item xs={12} md={8}>
      <ChartSkeleton height={400} />
    </Grid>
    <Grid item xs={12} md={4}>
      <ChartSkeleton height={400} />
    </Grid>
    <Grid item xs={12} md={6}>
      <ChartSkeleton height={300} />
    </Grid>
    <Grid item xs={12} md={6}>
      <ChartSkeleton height={300} />
    </Grid>
  </Grid>
);

export default DashboardLoading;