import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const navigationVariantsConfig = {
  variant: {
    horizontal: {
      flexDirection: 'row',
      gap: getToken('spacing.1'),
    },
    vertical: {
      flexDirection: 'column',
      gap: getToken('spacing.1'),
    },
    tabs: {
      flexDirection: 'row',
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      gap: 0,
    },
    pills: {
      flexDirection: 'row',
      gap: getToken('spacing.1'),
    },
  },
  size: {
    sm: {
      padding: getToken('spacing.2'),
      fontSize: getToken('typography.fontSize.sm'),
    },
    md: {
      padding: getToken('spacing.3'),
      fontSize: getToken('typography.fontSize.base'),
    },
    lg: {
      padding: getToken('spacing.4'),
      fontSize: getToken('typography.fontSize.lg'),
    },
  },
  orientation: {
    horizontal: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    vertical: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
};

const navigationItemVariantsConfig = {
  variant: {
    horizontal: {
      color: getToken('colors.muted.foreground'),
      padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
      borderRadius: getToken('borderRadius.md'),
      textDecoration: 'none',
      transition: `all ${getToken('motion.duration.normal')} ${getToken('motion.easing.inOut')}`,
      
      '&:hover': {
        color: getToken('colors.foreground'),
        backgroundColor: getToken('colors.muted.100'),
      },
    },
    vertical: {
      color: getToken('colors.muted.foreground'),
      padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
      borderRadius: getToken('borderRadius.md'),
      textDecoration: 'none',
      transition: `all ${getToken('motion.duration.normal')} ${getToken('motion.easing.inOut')}`,
      
      '&:hover': {
        color: getToken('colors.foreground'),
        backgroundColor: getToken('colors.muted.100'),
      },
    },
    tabs: {
      color: getToken('colors.muted.foreground'),
      padding: `${getToken('spacing.3')} ${getToken('spacing.4')}`,
      borderBottom: `${getToken('borderWidth.md')} solid transparent`,
      borderRadius: 0,
      textDecoration: 'none',
      transition: `all ${getToken('motion.duration.normal')} ${getToken('motion.easing.inOut')}`,
      
      '&:hover': {
        color: getToken('colors.foreground'),
        backgroundColor: getToken('colors.muted.100'),
      },
    },
    pills: {
      color: getToken('colors.muted.foreground'),
      padding: `${getToken('spacing.2')} ${getToken('spacing.4')}`,
      borderRadius: getToken('borderRadius.full'),
      textDecoration: 'none',
      transition: `all ${getToken('motion.duration.normal')} ${getToken('motion.easing.inOut')}`,
      
      '&:hover': {
        color: getToken('colors.foreground'),
        backgroundColor: getToken('colors.muted.100'),
      },
    },
  },
  state: {
    active: {
      color: getToken('colors.foreground'),
      backgroundColor: getToken('colors.muted'),
      fontWeight: getToken('typography.fontWeight.medium'),
    },
    inactive: {
      color: getToken('colors.muted.foreground'),
      backgroundColor: 'transparent',
      fontWeight: getToken('typography.fontWeight.normal'),
    },
    disabled: {
      color: getToken('colors.muted.foreground'),
      backgroundColor: 'transparent',
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  size: {
    sm: {
      padding: `${getToken('spacing.1')} ${getToken('spacing.2')}`,
      fontSize: getToken('typography.fontSize.sm'),
      gap: getToken('spacing.1'),
    },
    md: {
      padding: `${getToken('spacing.2')} ${getToken('spacing.3')}`,
      fontSize: getToken('typography.fontSize.base'),
      gap: getToken('spacing.2'),
    },
    lg: {
      padding: `${getToken('spacing.3')} ${getToken('spacing.4')}`,
      fontSize: getToken('typography.fontSize.lg'),
      gap: getToken('spacing.3'),
    },
  },
};

const navigationGroupVariantsConfig = {
  variant: {
    default: {
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      paddingBottom: getToken('spacing.3'),
      marginBottom: getToken('spacing.3'),
    },
    minimal: {
      borderBottom: 'none',
      paddingBottom: getToken('spacing.2'),
      marginBottom: getToken('spacing.2'),
    },
    elevated: {
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      paddingBottom: getToken('spacing.4'),
      marginBottom: getToken('spacing.4'),
      backgroundColor: getToken('colors.muted'),
      borderRadius: getToken('borderRadius.md'),
      padding: getToken('spacing.3'),
    },
  },
  size: {
    sm: {
      fontSize: getToken('typography.fontSize.sm'),
      fontWeight: getToken('typography.fontWeight.medium'),
      padding: getToken('spacing.2'),
    },
    md: {
      fontSize: getToken('typography.fontSize.base'),
      fontWeight: getToken('typography.fontWeight.semibold'),
      padding: getToken('spacing.3'),
    },
    lg: {
      fontSize: getToken('typography.fontSize.lg'),
      fontWeight: getToken('typography.fontWeight.bold'),
      padding: getToken('spacing.4'),
    },
  },
  collapsed: {
    true: {
      maxHeight: '0',
      overflow: 'hidden',
      opacity: 0,
      transition: `all ${getToken('motion.duration.normal')} ${getToken('motion.easing.inOut')}`,
    },
    false: {
      maxHeight: 'none',
      overflow: 'visible',
      opacity: 1,
      transition: `all ${getToken('motion.duration.normal')} ${getToken('motion.easing.inOut')}`,
    },
  },
};

const navigationBadgeVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.primary'),
      color: getToken('colors.primary.foreground'),
    },
    secondary: {
      backgroundColor: getToken('colors.muted'),
      color: getToken('colors.muted.foreground'),
    },
    destructive: {
      backgroundColor: getToken('colors.destructive'),
      color: getToken('colors.destructive.foreground'),
    },
    success: {
      backgroundColor: getToken('colors.success'),
      color: getToken('colors.success.foreground'),
    },
    warning: {
      backgroundColor: getToken('colors.warning'),
      color: getToken('colors.warning.foreground'),
    },
  },
  size: {
    sm: {
      fontSize: getToken('typography.fontSize.xs'),
      padding: `${getToken('spacing.0.5')} ${getToken('spacing.1')}`,
      borderRadius: getToken('borderRadius.sm'),
      minWidth: getToken('spacing.4'),
      height: getToken('spacing.4'),
    },
    md: {
      fontSize: getToken('typography.fontSize.sm'),
      padding: `${getToken('spacing.1')} ${getToken('spacing.2')}`,
      borderRadius: getToken('borderRadius.md'),
      minWidth: getToken('spacing.5'),
      height: getToken('spacing.5'),
    },
    lg: {
      fontSize: getToken('typography.fontSize.base'),
      padding: `${getToken('spacing.1.5')} ${getToken('spacing.3')}`,
      borderRadius: getToken('borderRadius.lg'),
      minWidth: getToken('spacing.6'),
      height: getToken('spacing.6'),
    },
  },
};

const navigationIconVariantsConfig = {
  size: {
    sm: {
      width: getToken('spacing.3'),
      height: getToken('spacing.3'),
    },
    md: {
      width: getToken('spacing.4'),
      height: getToken('spacing.4'),
    },
    lg: {
      width: getToken('spacing.5'),
      height: getToken('spacing.5'),
    },
  },
  state: {
    active: {
      color: getToken('colors.foreground'),
    },
    inactive: {
      color: getToken('colors.muted.foreground'),
    },
    disabled: {
      color: getToken('colors.muted.foreground'),
      opacity: 0.5,
    },
  },
};

// Export functions that can be called by styled-components
export const navigationVariants = createVariantResolver(navigationVariantsConfig);
export const navigationItemVariants = createVariantResolver(navigationItemVariantsConfig);
export const navigationGroupVariants = createVariantResolver(navigationGroupVariantsConfig);
export const navigationBadgeVariants = createVariantResolver(navigationBadgeVariantsConfig);
export const navigationIconVariants = createVariantResolver(navigationIconVariantsConfig);
