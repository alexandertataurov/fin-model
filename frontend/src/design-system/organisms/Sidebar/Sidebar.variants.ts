import { getToken } from '../../tokens';
import { createVariantResolver } from '../../utils/variantHelpers';

const sidebarVariantsConfig = {
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      borderRight: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      boxShadow: getToken('shadows.md'),
    },
    minimal: {
      backgroundColor: getToken('colors.background'),
      borderRight: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      boxShadow: 'none',
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      borderRight: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      boxShadow: getToken('shadows.lg'),
    },
    dark: {
      backgroundColor: getToken('colors.foreground'),
      color: getToken('colors.background'),
      borderRight: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      boxShadow: getToken('shadows.md'),
    },
  },
  size: {
    sm: {
      expandedWidth: '200px',
      miniWidth: '48px',
      padding: getToken('spacing.3'),
    },
    md: {
      expandedWidth: '250px',
      miniWidth: '64px',
      padding: getToken('spacing.4'),
    },
    lg: {
      expandedWidth: '300px',
      miniWidth: '80px',
      padding: getToken('spacing.6'),
    },
  },
  state: {
    expanded: {
      width: 'var(--sidebar-expanded-width)',
      transform: 'translateX(0)',
      opacity: 1,
    },
    collapsed: {
      width: 'var(--sidebar-mini-width)',
      transform: 'translateX(0)',
      opacity: 1,
    },
    hidden: {
      width: '0px',
      transform: 'translateX(-100%)',
      opacity: 0,
    },
  },
  position: {
    left: {
      left: 0,
      top: 0,
      height: '100vh',
      borderRight: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderLeft: 'none',
    },
    right: {
      right: 0,
      top: 0,
      height: '100vh',
      borderLeft: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRight: 'none',
    },
  },
};

const sidebarContentVariantsConfig = {
  size: {
    sm: {
      padding: getToken('spacing.3'),
      gap: getToken('spacing.2'),
    },
    md: {
      padding: getToken('spacing.4'),
      gap: getToken('spacing.3'),
    },
    lg: {
      padding: getToken('spacing.6'),
      gap: getToken('spacing.4'),
    },
  },
  scroll: {
    enabled: {
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: `${getToken('colors.muted')} transparent`,
    },
    disabled: {
      overflow: 'hidden',
    },
  },
};

const sidebarToggleVariantsConfig = {
  size: {
    sm: {
      width: getToken('spacing.8'),
      height: getToken('spacing.8'),
      fontSize: getToken('typography.fontSize.sm'),
    },
    md: {
      width: getToken('spacing.10'),
      height: getToken('spacing.10'),
      fontSize: getToken('typography.fontSize.base'),
    },
    lg: {
      width: getToken('spacing.12'),
      height: getToken('spacing.12'),
      fontSize: getToken('typography.fontSize.lg'),
    },
  },
  variant: {
    default: {
      backgroundColor: getToken('colors.background'),
      color: getToken('colors.muted.foreground'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.md'),
    },
    minimal: {
      backgroundColor: 'transparent',
      color: getToken('colors.muted.foreground'),
      border: 'none',
      borderRadius: getToken('borderRadius.md'),
    },
    elevated: {
      backgroundColor: getToken('colors.background'),
      color: getToken('colors.foreground'),
      border: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      borderRadius: getToken('borderRadius.md'),
      boxShadow: getToken('shadows.sm'),
    },
  },
  state: {
    default: {
      opacity: 1,
      visibility: 'visible',
    },
    hover: {
      backgroundColor: getToken('colors.muted'),
      color: getToken('colors.foreground'),
    },
    focus: {
      outline: `2px solid ${getToken('colors.primary')}`,
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
};

const sidebarHeaderVariantsConfig = {
  size: {
    sm: {
      padding: `${getToken('spacing.3')} ${getToken('spacing.3')}`,
      fontSize: getToken('typography.fontSize.sm'),
      fontWeight: getToken('typography.fontWeight.medium'),
    },
    md: {
      padding: `${getToken('spacing.4')} ${getToken('spacing.4')}`,
      fontSize: getToken('typography.fontSize.base'),
      fontWeight: getToken('typography.fontWeight.semibold'),
    },
    lg: {
      padding: `${getToken('spacing.6')} ${getToken('spacing.6')}`,
      fontSize: getToken('typography.fontSize.lg'),
      fontWeight: getToken('typography.fontWeight.bold'),
    },
  },
  variant: {
    default: {
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      backgroundColor: 'transparent',
    },
    elevated: {
      borderBottom: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      backgroundColor: getToken('colors.muted'),
    },
    minimal: {
      borderBottom: 'none',
      backgroundColor: 'transparent',
    },
  },
};

const sidebarFooterVariantsConfig = {
  size: {
    sm: {
      padding: `${getToken('spacing.3')} ${getToken('spacing.3')}`,
      fontSize: getToken('typography.fontSize.sm'),
    },
    md: {
      padding: `${getToken('spacing.4')} ${getToken('spacing.4')}`,
      fontSize: getToken('typography.fontSize.base'),
    },
    lg: {
      padding: `${getToken('spacing.6')} ${getToken('spacing.6')}`,
      fontSize: getToken('typography.fontSize.lg'),
    },
  },
  variant: {
    default: {
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      backgroundColor: 'transparent',
    },
    elevated: {
      borderTop: `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`,
      backgroundColor: getToken('colors.muted'),
    },
    minimal: {
      borderTop: 'none',
      backgroundColor: 'transparent',
    },
  },
};

// Export functions that can be called by styled-components
export const sidebarVariants = createVariantResolver(sidebarVariantsConfig);
export const sidebarContentVariants = createVariantResolver(sidebarContentVariantsConfig);
export const sidebarToggleVariants = createVariantResolver(sidebarToggleVariantsConfig);
export const sidebarHeaderVariants = createVariantResolver(sidebarHeaderVariantsConfig);
export const sidebarFooterVariants = createVariantResolver(sidebarFooterVariantsConfig);
