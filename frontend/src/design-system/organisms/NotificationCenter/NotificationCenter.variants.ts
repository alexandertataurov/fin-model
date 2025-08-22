import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const notificationCenterVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.lg'),
    },
    minimal: {
      backgroundColor: 'transparent',
      border: 'none',
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.lg'),
      boxShadow: getToken('shadows.md'),
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
  expanded: {
    true: {
      maxHeight: '600px',
      overflow: 'hidden',
    },
    false: {
      maxHeight: getToken('spacing.16'),
      overflow: 'hidden',
    },
  },
};

const notificationCenterHeaderVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.4'),
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    minimal: {
      padding: getToken('spacing.3'),
    },
    elevated: {
      padding: getToken('spacing.4'),
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      backgroundColor: getToken('colors.muted'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.3'),
    },
    md: {
      padding: getToken('spacing.4'),
    },
    lg: {
      padding: getToken('spacing.5'),
    },
  },
};

const notificationCenterContentVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.4'),
    },
    minimal: {
      padding: getToken('spacing.3'),
    },
    elevated: {
      padding: getToken('spacing.4'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.3'),
    },
    md: {
      padding: getToken('spacing.4'),
    },
    lg: {
      padding: getToken('spacing.5'),
    },
  },
};

const notificationGroupVariantsConfig = {
  variant: {
    default: {
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.md'),
    },
    minimal: {
      border: 'none',
    },
    elevated: {
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.md'),
      boxShadow: getToken('shadows.sm'),
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
  expanded: {
    true: {
      backgroundColor: getToken('colors.background'),
    },
    false: {
      backgroundColor: getToken('colors.muted'),
    },
  },
};


// Export functions that can be called by styled-components
export const notificationCenterVariants = createVariantResolver(notificationCenterVariantsConfig);
export const notificationCenterHeaderVariants = createVariantResolver(notificationCenterHeaderVariantsConfig);
export const notificationCenterContentVariants = createVariantResolver(notificationCenterContentVariantsConfig);
export const notificationGroupVariants = createVariantResolver(notificationGroupVariantsConfig);