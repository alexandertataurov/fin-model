import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload,
  Analytics as AnalyticsIcon,
  Settings,
  Logout,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/login');
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbMap: Record<string, { label: string; icon?: React.ReactNode }> = {
      dashboard: { label: 'Dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      files: { label: 'File Upload', icon: <CloudUpload sx={{ mr: 0.5 }} fontSize="inherit" /> },
      analytics: { label: 'Analytics', icon: <AnalyticsIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      admin: { label: 'Admin', icon: <Settings sx={{ mr: 0.5 }} fontSize="inherit" /> },
      models: { label: 'Models', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    };

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const breadcrumb = breadcrumbMap[segment];
      
      if (!breadcrumb) return null;

      return (
        <Link
          key={path}
          color="inherit"
          onClick={() => navigate(path)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {breadcrumb.icon}
          {breadcrumb.label}
        </Link>
      );
    }).filter(Boolean);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {/* Logo/Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FinVision
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ 
                backgroundColor: location.pathname === '/dashboard' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<CloudUpload />}
              onClick={() => navigate('/files')}
              sx={{ 
                backgroundColor: location.pathname === '/files' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              Upload Files
            </Button>
            <Button
              color="inherit"
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate('/analytics')}
              sx={{ 
                backgroundColor: location.pathname === '/analytics' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              Analytics
            </Button>
          </Box>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.first_name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      {location.pathname !== '/' && (
        <Box sx={{ px: 3, py: 1, backgroundColor: 'grey.50' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            {getBreadcrumbs()}
          </Breadcrumbs>
        </Box>
      )}

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
