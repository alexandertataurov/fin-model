import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { BottomNavigation, HelpButton } from '../ui';
import { ThemeToggle } from '../theme-toggle';
import Sidebar from './Sidebar';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
  };

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

    const breadcrumbMap: Record<string, { label: string }> = {
      dashboard: { label: 'Dashboard' },
      dashboards: { label: 'Financial Dashboards' },
      pl: { label: 'P&L Dashboard' },
      cashflow: { label: 'Cash Flow' },
      'balance-sheet': { label: 'Balance Sheet' },
      files: { label: 'File Upload' },
      reports: { label: 'Reports' },
      scenarios: { label: 'Scenario Modeling' },
      analytics: { label: 'Analytics' },
      admin: { label: 'Admin Panel' },
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
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {breadcrumb.label}
        </Link>
      );
    }).filter(Boolean);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            zIndex: theme.zIndex.drawer - 1,
            // DESIGN_FIX: use design system token instead of MUI background.paper
            backgroundColor: 'var(--card)',
            // DESIGN_FIX: use design system token for text color
            color: 'var(--card-foreground)',
            borderBottom: 1,
            // DESIGN_FIX: use design system border token
            borderColor: 'var(--border)',
          }}
        >
          <Toolbar>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleSidebarToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Title */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FinVision
            </Typography>

                      {/* Theme Toggle, Help, and User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpButton size="medium" />
            <ThemeToggle />
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
        {location.pathname !== '/' && location.pathname !== '/dashboard' && (
          <Box sx={{
            px: 3,
            py: 1.5,
            // DESIGN_FIX: replace MUI background.default with design token
            backgroundColor: 'var(--background)',
            borderBottom: 1,
            // DESIGN_FIX: use design system border token
            borderColor: 'var(--border)',
          }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                color="inherit"
                onClick={() => navigate('/dashboard')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            // DESIGN_FIX: use design token for page background
            backgroundColor: 'var(--background)',
            minHeight: 0, // Allow content to be scrollable
            pb: isMobile ? 10 : 3, // Add bottom padding for mobile navigation
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </Box>
  );
};

export default Layout;
