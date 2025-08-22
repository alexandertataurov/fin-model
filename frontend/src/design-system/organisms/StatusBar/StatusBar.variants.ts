import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const statusBarVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    minimal: {
      backgroundColor: 'transparent',
      border: 'none',
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
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
  position: {
    top: {
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    bottom: {
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
  },
};

const statusBarContentVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.3'),
    },
    minimal: {
      padding: getToken('spacing.2'),
    },
    elevated: {
      padding: getToken('spacing.3'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.2'),
    },
    md: {
      padding: getToken('spacing.3'),
    },
    lg: {
      padding: getToken('spacing.4'),
    },
  },
};

const statusGroupVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.2'),
      borderRadius: getToken('borderRadius.md'),
    },
    minimal: {
      padding: getToken('spacing.1'),
    },
    elevated: {
      padding: getToken('spacing.2'),
      borderRadius: getToken('borderRadius.md'),
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
  expanded: {
    true: {
      backgroundColor: getToken('colors.muted'),
    },
    false: {},
  },
};


// Export functions that can be called by styled-components
export const statusBarVariants = createVariantResolver(statusBarVariantsConfig);
export const statusBarContentVariants = createVariantResolver(statusBarContentVariantsConfig);
export const statusGroupVariants = createVariantResolver(statusGroupVariantsConfig);