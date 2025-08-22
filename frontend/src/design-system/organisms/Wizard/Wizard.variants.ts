import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const wizardVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.lg'),
    },
    outline: {
      backgroundColor: 'transparent',
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.lg'),
    },
    filled: {
      backgroundColor: getToken('colors.muted'),
      border: `${getToken('borderWidth.sm')} solid transparent`,
      borderRadius: getToken('borderRadius.lg'),
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
  orientation: {
    horizontal: {
      flexDirection: 'column',
    },
    vertical: {
      flexDirection: 'row',
    },
  },
};

const wizardHeaderVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.6'),
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    outline: {
      padding: getToken('spacing.6'),
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    filled: {
      padding: getToken('spacing.6'),
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
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
};

const wizardContentVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.6'),
    },
    outline: {
      padding: getToken('spacing.6'),
    },
    filled: {
      padding: getToken('spacing.6'),
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
};

const wizardFooterVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.muted'),
    },
    outline: {
      backgroundColor: getToken('colors.background'),
    },
    filled: {
      backgroundColor: getToken('colors.muted'),
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
};


// Export functions that can be called by styled-components
export const wizardVariants = createVariantResolver(wizardVariantsConfig);
export const wizardHeaderVariants = createVariantResolver(wizardHeaderVariantsConfig);
export const wizardContentVariants = createVariantResolver(wizardContentVariantsConfig);
export const wizardFooterVariants = createVariantResolver(wizardFooterVariantsConfig);