import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const footerVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    minimal: {
      backgroundColor: 'transparent',
      borderTop: 'none',
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      boxShadow: getToken('shadows.sm'),
    },
  },
  size: {
    sm: {
      padding: `${getToken('spacing.4')} 0`,
    },
    md: {
      padding: `${getToken('spacing.6')} 0`,
    },
    lg: {
      padding: `${getToken('spacing.8')} 0`,
    },
  },
};

const footerContentVariantsConfig = {
  size: {
    sm: {
      maxWidth: getToken('spacing.6xl'),
      padding: `0 ${getToken('spacing.4')}`,
      gap: getToken('spacing.6'),
    },
    md: {
      maxWidth: getToken('spacing.7xl'),
      padding: `0 ${getToken('spacing.6')}`,
      gap: getToken('spacing.8'),
    },
    lg: {
      maxWidth: getToken('spacing.8xl'),
      padding: `0 ${getToken('spacing.8')}`,
      gap: getToken('spacing.10'),
    },
  },
};

const footerBrandVariantsConfig = {
  size: {
    sm: {
      gap: getToken('spacing.3'),
    },
    md: {
      gap: getToken('spacing.4'),
    },
    lg: {
      gap: getToken('spacing.6'),
    },
  },
};

const footerLinksVariantsConfig = {
  size: {
    sm: {
      gap: getToken('spacing.3'),
    },
    md: {
      gap: getToken('spacing.4'),
    },
    lg: {
      gap: getToken('spacing.6'),
    },
  },
};

const footerSocialVariantsConfig = {
  size: {
    sm: {
      gap: getToken('spacing.2'),
    },
    md: {
      gap: getToken('spacing.3'),
    },
    lg: {
      gap: getToken('spacing.4'),
    },
  },
};


// Export functions that can be called by styled-components
export const footerVariants = createVariantResolver(footerVariantsConfig);
export const footerContentVariants = createVariantResolver(footerContentVariantsConfig);
export const footerBrandVariants = createVariantResolver(footerBrandVariantsConfig);
export const footerLinksVariants = createVariantResolver(footerLinksVariantsConfig);
export const footerSocialVariants = createVariantResolver(footerSocialVariantsConfig);