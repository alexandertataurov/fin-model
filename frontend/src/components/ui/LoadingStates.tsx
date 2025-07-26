import React from 'react';
import {
  Box,
  Skeleton,
  CircularProgress,
  LinearProgress,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

// Basic Loading Spinner
export interface LoadingSpinnerProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'primary',
  message,
  fullScreen = false,
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }),
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  return fullScreen ? content : <Box sx={{ p: 4 }}>{content}</Box>;
};

// Progress Bar with percentage
export interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary';
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = 'primary',
  height = 8,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {(label || showPercentage) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {label && (
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          )}
          {showPercentage && (
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          )}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={progress}
        color={color}
        sx={{ height, borderRadius: height / 2 }}
      />
    </Box>
  );
};

// Table Skeleton
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
}) => {
  return (
    <Box>
      {showHeader && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton
              key={`header-${index}`}
              variant="text"
              width={`${100 / columns}%`}
              height={40}
            />
          ))}
        </Box>
      )}
      
      {Array.from({ length: rows }, (_, rowIndex) => (
        <Box key={`row-${rowIndex}`} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              width={`${100 / columns}%`}
              height={32}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

// Card Skeleton
export interface CardSkeletonProps {
  showAvatar?: boolean;
  showActions?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showAvatar = false,
  showActions = false,
  lines = 3,
}) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {showAvatar && (
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
        
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={index === lines - 1 ? '80%' : '100%'}
            height={20}
            sx={{ mb: 1 }}
          />
        ))}
        
        {showActions && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Chart Skeleton
export interface ChartSkeletonProps {
  height?: number;
  showLegend?: boolean;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  height = 300,
  showLegend = true,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="rectangular" width={100} height={32} />
      </Box>
      
      <Skeleton variant="rectangular" width="100%" height={height} sx={{ mb: 2 }} />
      
      {showLegend && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {Array.from({ length: 4 }, (_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="circular" width={12} height={12} />
              <Skeleton variant="text" width={60} height={16} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Dashboard Grid Skeleton
export interface DashboardSkeletonProps {
  cards?: number;
  cardsPerRow?: number;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  cards = 6,
  cardsPerRow = 3,
}) => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
      
      {/* Quick Actions */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: 'grey.100', borderRadius: 2 }}>
        <Skeleton variant="text" width="20%" height={24} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={150} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>
      </Box>
      
      {/* Dashboard Cards */}
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {Array.from({ length: cards }, (_, index) => (
          <Grid item xs={12} sm={6} md={12 / cardsPerRow} key={index}>
            <CardSkeleton showActions />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Form Skeleton
export interface FormSkeletonProps {
  fields?: number;
  showSubmitButton?: boolean;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 5,
  showSubmitButton = true,
}) => {
  return (
    <Box sx={{ maxWidth: 600 }}>
      {Array.from({ length: fields }, (_, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Box>
      ))}
      
      {showSubmitButton && (
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={80} height={40} />
        </Box>
      )}
    </Box>
  );
};

// List Skeleton
export interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  showSecondaryAction?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  showAvatar = true,
  showSecondaryAction = true,
}) => {
  return (
    <Box>
      {Array.from({ length: items }, (_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            borderBottom: index < items - 1 ? 1 : 0,
            borderColor: 'divider',
          }}
        >
          {showAvatar && (
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="50%" height={16} />
          </Box>
          
          {showSecondaryAction && (
            <Skeleton variant="rectangular" width={32} height={32} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default {
  LoadingSpinner,
  ProgressBar,
  TableSkeleton,
  CardSkeleton,
  ChartSkeleton,
  DashboardSkeleton,
  FormSkeleton,
  ListSkeleton,
}; 