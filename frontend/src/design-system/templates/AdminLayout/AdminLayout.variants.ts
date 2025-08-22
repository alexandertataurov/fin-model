import { getToken } from '../../tokens';

export const adminLayoutVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
    },
    minimal: {
      backgroundColor: getToken('colors.background'),
    },
    elevated: {
      backgroundColor: getToken('colors.muted'),
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
      '--sidebar-width': getToken('spacing.16'),
    },
    false: {
      '--sidebar-width': getToken('spacing.64'),
    },
  },
};

export const adminContentVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
    },
    minimal: {
      backgroundColor: getToken('colors.background'),
    },
    elevated: {
      backgroundColor: getToken('colors.muted'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.2'),
    },
    md: {
      padding: getToken('spacing.4'),
    },
    lg: {
      padding: getToken('spacing.6'),
    },
  },
  sidebarCollapsed: {
    true: {
      marginLeft: getToken('spacing.16'),
    },
    false: {
      marginLeft: getToken('spacing.64'),
    },
  },
};
