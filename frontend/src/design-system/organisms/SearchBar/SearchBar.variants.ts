import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const searchBarVariantsConfig = {
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
      padding: getToken('spacing.3'),
    },
    md: {
      padding: getToken('spacing.4'),
    },
    lg: {
      padding: getToken('spacing.5'),
    },
  },
  expanded: {
    true: {
      boxShadow: getToken('shadows.lg'),
    },
    false: {},
  },
};

const searchBarFiltersVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.muted'),
    },
    outline: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    filled: {
      backgroundColor: getToken('colors.muted'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.2'),
      gap: getToken('spacing.2'),
    },
    md: {
      padding: getToken('spacing.3'),
      gap: getToken('spacing.3'),
    },
    lg: {
      padding: getToken('spacing.4'),
      gap: getToken('spacing.4'),
    },
  },
};

const searchBarResultsVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    outline: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
    },
    filled: {
      backgroundColor: getToken('colors.background'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
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


// Export functions that can be called by styled-components
export const searchBarVariants = createVariantResolver(searchBarVariantsConfig);
export const searchBarFiltersVariants = createVariantResolver(searchBarFiltersVariantsConfig);
export const searchBarResultsVariants = createVariantResolver(searchBarResultsVariantsConfig);