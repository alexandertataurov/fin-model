import { getToken } from '../../tokens';

export const authLayoutVariants = {
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
  centered: {
    true: {
      justifyContent: 'center',
    },
    false: {
      justifyContent: 'flex-start',
    },
  },
};

export const authContentVariants = {
  variant: {
    default: {
      margin: 0,
    },
    minimal: {
      margin: 0,
    },
    elevated: {
      margin: getToken('spacing.4'),
    },
  },
  size: {
    sm: {
      maxWidth: getToken('spacing.80'),
    },
    md: {
      maxWidth: getToken('spacing.96'),
    },
    lg: {
      maxWidth: getToken('spacing.112'),
    },
  },
  centered: {
    true: {
      alignSelf: 'center',
    },
    false: {
      alignSelf: 'flex-start',
    },
  },
};
