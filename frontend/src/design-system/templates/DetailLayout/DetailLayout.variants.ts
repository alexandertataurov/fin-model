import { getToken } from '../../tokens';

export const detailLayoutVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
    },
    minimal: {
      backgroundColor: 'transparent',
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
  hasSidebar: {
    true: {
      flexDirection: 'row',
    },
    false: {
      flexDirection: 'column',
    },
  },
};

export const detailLayoutMainVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
    },
    minimal: {
      backgroundColor: 'transparent',
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
  hasSidebar: {
    true: {
      flexDirection: 'column',
    },
    false: {
      flexDirection: 'column',
    },
  },
};

export const detailLayoutSidebarVariants = {
  variant: {
    default: {
      backgroundColor: getToken('colors.muted'),
      borderLeft: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    minimal: {
      backgroundColor: 'transparent',
      borderLeft: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    elevated: {
      backgroundColor: getToken('colors.muted'),
      borderLeft: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
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
};
