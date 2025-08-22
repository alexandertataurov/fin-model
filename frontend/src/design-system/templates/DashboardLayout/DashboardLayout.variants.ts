import { getToken } from '../../tokens';

export const dashboardLayoutVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
    },
    minimal: {
      backgroundColor: getToken('colors.background'),
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      boxShadow: getToken('shadows.lg'),
    },
  },
  size: {
    sm: {
      fontSize: getToken('typography.fontSize.sm'),
    },
    md: {
      fontSize: getToken('typography.fontSize.base'),
    },
    lg: {
      fontSize: getToken('typography.fontSize.lg'),
    },
  },
  sidebarCollapsed: {
    true: {
      // Sidebar is collapsed
    },
    false: {
      // Sidebar is expanded
    },
  },
};

export const dashboardLayoutSidebarVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      borderRight: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    minimal: {
      backgroundColor: 'transparent',
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      borderRight: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      boxShadow: getToken('shadows.md'),
    },
  },
  size: {
    sm: {
      width: getToken('spacing.64'),
    },
    md: {
      width: getToken('spacing.72'),
    },
    lg: {
      width: getToken('spacing.80'),
    },
  },
  collapsed: {
    true: {
      width: getToken('spacing.16'),
    },
    false: {
      // Use size-based width
    },
  },
};

export const dashboardLayoutMainVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
    },
    minimal: {
      backgroundColor: getToken('colors.background'),
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.4'),
    },
    md: {
      padding: getToken('spacing.6'),
    },
    lg: {
      padding: getToken('spacing.8'),
    },
  },
  sidebarCollapsed: {
    true: {
      // Main content when sidebar is collapsed
    },
    false: {
      // Main content when sidebar is expanded
    },
  },
};
