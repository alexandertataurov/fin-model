import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const userMenuVariantsConfig = {
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
      position: 'relative',
    },
    false: {},
  },
};

const userMenuHeaderVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.2'),
    },
    minimal: {
      padding: getToken('spacing.1'),
    },
    elevated: {
      padding: getToken('spacing.2'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.1'),
    },
    md: {
      padding: getToken('spacing.2'),
    },
    lg: {
      padding: getToken('spacing.3'),
    },
  },
};

const userMenuContentVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.lg'),
      boxShadow: getToken('shadows.lg'),
      position: 'absolute',
      top: '100%',
      right: 0,
      minWidth: getToken('spacing.80'),
      zIndex: 50,
    },
    minimal: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.md'),
      boxShadow: getToken('shadows.md'),
      position: 'absolute',
      top: '100%',
      right: 0,
      minWidth: getToken('spacing.72'),
      zIndex: 50,
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.lg'),
      boxShadow: getToken('shadows.xl'),
      position: 'absolute',
      top: '100%',
      right: 0,
      minWidth: getToken('spacing.80'),
      zIndex: 50,
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

const userMenuGroupVariantsConfig = {
  variant: {
    default: {
      marginBottom: getToken('spacing.2'),
    },
    minimal: {
      marginBottom: getToken('spacing.1'),
    },
    elevated: {
      marginBottom: getToken('spacing.3'),
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
      display: 'block',
    },
    false: {
      display: 'none',
    },
  },
};


// Export functions that can be called by styled-components
export const userMenuVariants = createVariantResolver(userMenuVariantsConfig);
export const userMenuHeaderVariants = createVariantResolver(userMenuHeaderVariantsConfig);
export const userMenuContentVariants = createVariantResolver(userMenuContentVariantsConfig);
export const userMenuGroupVariants = createVariantResolver(userMenuGroupVariantsConfig);