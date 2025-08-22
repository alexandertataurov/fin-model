import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const filterPanelVariantsConfig = {
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
  collapsed: {
    true: {
      maxHeight: getToken('spacing.16'),
      overflow: 'hidden',
    },
    false: {},
  },
};

const filterPanelHeaderVariantsConfig = {
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

const filterPanelContentVariantsConfig = {
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

const filterGroupVariantsConfig = {
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
export const filterPanelVariants = createVariantResolver(filterPanelVariantsConfig);
export const filterPanelHeaderVariants = createVariantResolver(filterPanelHeaderVariantsConfig);
export const filterPanelContentVariants = createVariantResolver(filterPanelContentVariantsConfig);
export const filterGroupVariants = createVariantResolver(filterGroupVariantsConfig);