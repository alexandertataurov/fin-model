// AdminDashboard Components with Design System Compliance
// Following typography, colors, spacing, shadows, and z-index guidelines

export { AdminCard } from './AdminCard';
export {
    AdminTitle,
    AdminSubtitle,
    AdminBody,
    AdminCaption,
    AdminHeadline,
    AdminSubheadline,
    AdminCode,
    AdminElegant
} from './AdminTypography';
export {
    AdminLoadingSpinner,
    AdminLoadingSkeleton,
    AdminLoadingCard
} from './AdminLoading';
export { AdminHeader } from './AdminHeader';

// Re-export design system helpers for convenience
export {
    applyTypographyStyle,
    getSemanticColor,
    getStatusColor,
    getInteractiveColors,
    applyDesignSystemSpacing,
    getSemanticSpacing,
    applyDesignSystemShadow,
    getSemanticShadow,
    getSemanticZIndex,
    applyDesignSystemZIndex,
    applyDesignSystemRadius,
    applyDesignSystemMotion,
    validateDesignSystem
} from '../utils/designSystemHelpers';
