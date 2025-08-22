import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const headerVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    minimal: {
      backgroundColor: 'transparent',
      borderBottom: 'none',
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      boxShadow: getToken('shadows.sm'),
    },
  },
  size: {
    sm: {
      padding: `0 ${getToken('spacing.4')}`,
      height: getToken('spacing.16'),
    },
    md: {
      padding: `0 ${getToken('spacing.6')}`,
      height: getToken('spacing.16'),
    },
    lg: {
      padding: `0 ${getToken('spacing.8')}`,
      height: getToken('spacing.20'),
    },
  },
  sticky: {
    true: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)',
      backgroundColor: `${getToken('colors.background')}cc`,
    },
    false: {},
  },
};

const headerLogoVariantsConfig = {
  size: {
    sm: {
      fontSize: getToken('typography.fontSize.base'),
      gap: getToken('spacing.2'),
    },
    md: {
      fontSize: getToken('typography.fontSize.lg'),
      gap: getToken('spacing.2'),
    },
    lg: {
      fontSize: getToken('typography.fontSize.xl'),
      gap: getToken('spacing.3'),
    },
  },
};

const headerNavigationVariantsConfig = {
  size: {
    sm: {
      gap: getToken('spacing.4'),
    },
    md: {
      gap: getToken('spacing.6'),
    },
    lg: {
      gap: getToken('spacing.8'),
    },
  },
};

const navItemVariantsConfig = {
  state: {
    active: {
      color: getToken('colors.foreground'),
      backgroundColor: getToken('colors.muted'),
    },
    inactive: {
      color: getToken('colors.muted.foreground'),
      backgroundColor: 'transparent',
    },
  },
  size: {
    sm: {
      padding: `${getToken('spacing.1')} ${getToken('spacing.2')}`,
      fontSize: getToken('typography.fontSize.sm'),
    },
    md: {
      padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
      fontSize: getToken('typography.fontSize.sm'),
    },
    lg: {
      padding: `${getToken('spacing.3')} ${getToken('spacing.4')}`,
      fontSize: getToken('typography.fontSize.base'),
    },
  },
};


// Export functions that can be called by styled-components
export const headerVariants = createVariantResolver(headerVariantsConfig);
export const headerLogoVariants = createVariantResolver(headerLogoVariantsConfig);
export const headerNavigationVariants = createVariantResolver(headerNavigationVariantsConfig);
export const navItemVariants = createVariantResolver(navItemVariantsConfig);