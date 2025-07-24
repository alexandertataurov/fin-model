import React from 'react';
import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Skeleton,
  Box,
} from '@mui/material';

export interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  actions?: React.ReactNode;
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  loading = false,
  actions,
  headerActions,
  children,
  padding = 'medium',
  hover = false,
  sx = {},
  ...props
}) => {
  const paddingMap = {
    none: 0,
    small: 1,
    medium: 2,
    large: 3,
  };

  const cardStyles = {
    transition: 'all 0.2s ease-in-out',
    ...(hover && {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: (theme: { shadows: string[] }) => theme.shadows[8],
      },
    }),
    ...sx,
  };

  if (loading) {
    return (
      <MuiCard sx={cardStyles} {...props}>
        {(title || subtitle) && (
          <CardHeader
            title={title && <Skeleton variant="text" width="60%" />}
            subheader={subtitle && <Skeleton variant="text" width="40%" />}
            action={headerActions && <Skeleton variant="circular" width={40} height={40} />}
          />
        )}
        <CardContent sx={{ pt: title || subtitle ? 0 : 2 }}>
          <Skeleton variant="rectangular" height={120} />
          <Box sx={{ pt: 2 }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </Box>
        </CardContent>
        {actions && (
          <CardActions>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </CardActions>
        )}
      </MuiCard>
    );
  }

  return (
    <MuiCard sx={cardStyles} {...props}>
      {(title || subtitle || headerActions) && (
        <CardHeader
          title={title && (
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          )}
          subheader={subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          action={headerActions}
        />
      )}
      
      {children && (
        <CardContent sx={{ pt: title || subtitle ? 0 : paddingMap[padding] }}>
          {children}
        </CardContent>
      )}

      {actions && (
        <CardActions sx={{ px: paddingMap[padding], pb: paddingMap[padding] }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card; 