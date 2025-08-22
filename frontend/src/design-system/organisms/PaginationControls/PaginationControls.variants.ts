import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const paginationControlsVariantsConfig = {
  variant: {
    default: {
      padding: getToken('spacing.4'),
    },
    minimal: {
      padding: getToken('spacing.2'),
    },
    elevated: {
      padding: getToken('spacing.4'),
      backgroundColor: getToken('colors.muted'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.md'),
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
  alignment: {
    left: {},
    center: {},
    right: {},
    'space-between': {},
  },
};

const paginationInfoVariantsConfig = {
  variant: {
    default: {
      margin: 0,
    },
    minimal: {
      margin: 0,
    },
    elevated: {
      margin: 0,
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
};


// Export functions that can be called by styled-components
export const paginationControlsVariants = createVariantResolver(paginationControlsVariantsConfig);
export const paginationInfoVariants = createVariantResolver(paginationInfoVariantsConfig);