import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportsIcon,
  AccountBalance as PLIcon,
} from '@mui/icons-material';

interface NavigationItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    value: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'P&L',
    value: '/dashboards/pl',
    icon: <PLIcon />,
  },
  {
    label: 'Upload',
    value: '/files',
    icon: <UploadIcon />,
  },
  {
    label: 'Reports',
    value: '/reports',
    icon: <ReportsIcon />,
  },
  {
    label: 'Analytics',
    value: '/analytics',
    icon: <AnalyticsIcon />,
  },
];

export interface BottomNavigationProps {
  show?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ show = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Only show on mobile and when show prop is true
  if (!isMobile || !show) {
    return null;
  }

  const getCurrentValue = () => {
    const path = location.pathname;
    
    // Find exact match first
    const exactMatch = navigationItems.find(item => item.value === path);
    if (exactMatch) return exactMatch.value;
    
    // Find best match for nested routes
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      const parentPath = `/${pathSegments[0]}/${pathSegments[1]}`;
      const parentMatch = navigationItems.find(item => item.value === parentPath);
      if (parentMatch) return parentMatch.value;
    }
    
    return '/dashboard'; // Default fallback
  };

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderTop: 1,
        borderColor: 'divider',
      }}
      elevation={8}
    >
      <MuiBottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            paddingTop: 1,
            paddingBottom: 1,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            marginTop: 0.5,
          },
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            disabled={item.disabled}
            icon={
              item.badge ? (
                <Badge
                  badgeContent={item.badge}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                    },
                  }}
                >
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )
            }
            sx={{
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation; 