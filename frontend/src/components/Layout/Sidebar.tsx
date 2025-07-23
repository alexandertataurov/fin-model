import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  Collapse,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportsIcon,
  AccountBalance as PLIcon,
  TrendingUp as CashFlowIcon,
  BarChart as BalanceSheetIcon,

  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings as AdminIcon,
  ModelTraining as ModelsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  width?: number;
  collapsedWidth?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  roles?: string[];
  badge?: string | number;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    id: 'financial-dashboards',
    label: 'Financial Dashboards',
    icon: <AnalyticsIcon />,
    children: [
      {
        id: 'pl-dashboard',
        label: 'P&L Dashboard',
        icon: <PLIcon />,
        path: '/dashboards/pl',
      },
      {
        id: 'cashflow-dashboard',
        label: 'Cash Flow',
        icon: <CashFlowIcon />,
        path: '/dashboards/cashflow',
      },
      {
        id: 'balance-sheet',
        label: 'Balance Sheet',
        icon: <BalanceSheetIcon />,
        path: '/dashboards/balance-sheet',
      },
    ],
  },
  {
    id: 'files',
    label: 'File Upload',
    icon: <UploadIcon />,
    path: '/files',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <ReportsIcon />,
    path: '/reports',
  },
  {
    id: 'scenario-modeling',
    label: 'Scenario Modeling',
    icon: <ModelsIcon />,
    path: '/scenarios',
    roles: ['analyst', 'admin'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/analytics',
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    icon: <AdminIcon />,
    path: '/admin',
    roles: ['admin'],
    badge: 'Admin',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  width = 280,
  collapsedWidth = 64,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const [expandedItems, setExpandedItems] = useState<string[]>(['financial-dashboards']);

  const drawerWidth = open ? width : collapsedWidth;

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      // Toggle expansion for parent items
      setExpandedItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else if (item.path) {
      // Navigate to the path
      navigate(item.path);
      
      // Close sidebar on mobile after navigation
      if (isMobile && open) {
        onToggle();
      }
    }
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.path) {
      return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    }
    
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    
    return false;
  };

  const hasPermission = (item: NavItem): boolean => {
    if (!item.roles || !user?.roles) return true;
    return item.roles.some(role => user.roles.includes(role));
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    if (!hasPermission(item)) return null;

    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title={!open ? item.label : ''} placement="right">
            <ListItemButton
              onClick={() => handleItemClick(item)}
              selected={isActive && !hasChildren}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                pl: level > 0 ? 4 : 2.5,
                color: isActive ? 'primary.main' : 'inherit',
                backgroundColor: isActive && !hasChildren ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              
              <ListItemText
                primary={item.label}
                sx={{
                  opacity: open ? 1 : 0,
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                  },
                }}
              />
              
              {item.badge && open && (
                <Box
                  sx={{
                    fontSize: '0.75rem',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  {item.badge}
                </Box>
              )}
              
              {hasChildren && open && (
                isExpanded ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: 2,
          py: 1.5,
          minHeight: 64,
        }}
      >
        {open && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            FinVision
          </Typography>
        )}
        
        {!isMobile && (
          <IconButton onClick={onToggle} size="small">
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {navigationItems.map(item => renderNavItem(item))}
        </List>
      </Box>

      {/* Footer */}
      {open && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Version 1.0.0
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: width,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 