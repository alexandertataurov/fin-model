import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const formVariantsConfig = {
  variant: {
    default: {
      backgroundColor: 'transparent',
    },
    outline: {
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.lg'),
      padding: getToken('spacing.6'),
    },
    filled: {
      backgroundColor: getToken('colors.muted'),
      borderRadius: getToken('borderRadius.lg'),
      padding: getToken('spacing.6'),
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
  layout: {
    vertical: {
      display: 'flex',
      flexDirection: 'column',
      gap: getToken('spacing.4'),
    },
    horizontal: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: getToken('spacing.4'),
      alignItems: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: getToken('spacing.4'),
    },
  },
};

const formSectionVariantsConfig = {
  variant: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      gap: getToken('spacing.4'),
    },
    outline: {
      display: 'flex',
      flexDirection: 'column',
      gap: getToken('spacing.4'),
    },
    filled: {
      display: 'flex',
      flexDirection: 'column',
      gap: getToken('spacing.4'),
    },
  },
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

const formActionsVariantsConfig = {
  variant: {
    default: {
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      paddingTop: getToken('spacing.4'),
    },
    outline: {
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      paddingTop: getToken('spacing.4'),
    },
    filled: {
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      paddingTop: getToken('spacing.4'),
    },
  },
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
export const formVariants = createVariantResolver(formVariantsConfig);
export const formSectionVariants = createVariantResolver(formSectionVariantsConfig);
export const formActionsVariants = createVariantResolver(formActionsVariantsConfig);