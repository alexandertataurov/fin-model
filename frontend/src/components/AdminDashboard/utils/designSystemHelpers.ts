import { tokens } from '@/design-system/tokens';

/**
 * Comprehensive design system helper functions for AdminDashboard components
 * Follows design system foundations guidelines for typography, colors, spacing, and shadows
 */

// ============================================================================
// TYPOGRAPHY HELPERS (following 02-Typography.mdx guidelines)
// ============================================================================

/**
 * Apply typography styles following design system guidelines
 * Uses proper font families, sizes, weights, and line heights
 */
export const applyTypographyStyle = (styleName: keyof typeof tokens.typography.textStyles): React.CSSProperties => {
    const textStyle = tokens.typography.textStyles[styleName];

    return {
        fontFamily: tokens.typography.fontFamily[textStyle.fontFamily as keyof typeof tokens.typography.fontFamily].join(', '),
        fontSize: tokens.typography.fontSize[textStyle.fontSize as keyof typeof tokens.typography.fontSize],
        fontWeight: tokens.typography.fontWeight[textStyle.fontWeight as keyof typeof tokens.typography.fontWeight],
        lineHeight: tokens.typography.lineHeight[textStyle.lineHeight as keyof typeof tokens.typography.lineHeight],
        letterSpacing: tokens.typography.letterSpacing[textStyle.letterSpacing as keyof typeof tokens.typography.letterSpacing],
    };
};

/**
 * Create custom typography styles with proper font family usage
 */
export const createTypographyStyle = (
    fontFamily: 'display' | 'sans' | 'mono' | 'elegant',
    fontSize: keyof typeof tokens.typography.fontSize,
    fontWeight: keyof typeof tokens.typography.fontWeight,
    lineHeight: keyof typeof tokens.typography.lineHeight,
    letterSpacing: keyof typeof tokens.typography.letterSpacing = 'normal'
): React.CSSProperties => ({
    fontFamily: tokens.typography.fontFamily[fontFamily].join(', '),
    fontSize: tokens.typography.fontSize[fontSize],
    fontWeight: tokens.typography.fontWeight[fontWeight],
    lineHeight: tokens.typography.lineHeight[lineHeight],
    letterSpacing: tokens.typography.letterSpacing[letterSpacing],
});

// ============================================================================
// COLOR HELPERS (following 01-Colors.mdx guidelines)
// ============================================================================

/**
 * Get semantic color following design system color guidelines
 */
export const getSemanticColor = (type: 'success' | 'warning' | 'info' | 'danger'): string => {
    switch (type) {
        case 'success': return tokens.colors.success;
        case 'warning': return tokens.colors.warning;
        case 'info': return tokens.colors.info;
        case 'danger': return tokens.colors.destructive[500];
        default: return tokens.colors.secondary[500];
    }
};

/**
 * Get status color with proper semantic meaning
 */
export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'healthy':
        case 'success':
        case 'active':
            return tokens.colors.success;
        case 'warning':
        case 'pending':
            return tokens.colors.warning;
        case 'critical':
        case 'error':
        case 'inactive':
            return tokens.colors.destructive[500];
        case 'info':
            return tokens.colors.info;
        default:
            return tokens.colors.secondary[400];
    }
};

/**
 * Get interactive state colors following design system guidelines
 */
export const getInteractiveColors = (
    baseColor: 'primary' | 'secondary',
    state: 'default' | 'hover' | 'active' | 'focus' = 'default'
): string => {
    const colorMap = {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
    };

    const colors = colorMap[baseColor];

    switch (state) {
        case 'hover': return colors[600];
        case 'active': return colors[700];
        case 'focus': return colors[500];
        default: return colors[500];
    }
};

// ============================================================================
// SPACING HELPERS (following 07-Spacing.mdx guidelines)
// ============================================================================

/**
 * Apply design system spacing following 8px base unit
 */
export const applyDesignSystemSpacing = (size: keyof typeof tokens.spacing): string => tokens.spacing[size];

/**
 * Get semantic spacing for different contexts
 */
export const getSemanticSpacing = (context: 'component' | 'layout' | 'form'): Record<string, string> => {
    switch (context) {
        case 'component':
            return {
                padding: tokens.spacing[4], // 16px - Standard component padding
                margin: tokens.spacing[6], // 24px - Standard component margin
                gap: tokens.spacing[2], // 8px - Standard component gap
            };
        case 'layout':
            return {
                section: tokens.spacing[12], // 48px - Section spacing
                page: tokens.spacing[8], // 32px - Page spacing
                container: tokens.spacing[4], // 16px - Container padding
            };
        case 'form':
            return {
                field: tokens.spacing[4], // 16px - Form field spacing
                group: tokens.spacing[6], // 24px - Form group spacing
                section: tokens.spacing[8], // 32px - Form section spacing
            };
        default:
            return {
                padding: tokens.spacing[4],
                margin: tokens.spacing[6],
                gap: tokens.spacing[2],
            };
    }
};

// ============================================================================
// SHADOW HELPERS (following 05-Shadows.mdx guidelines)
// ============================================================================

/**
 * Apply design system shadows following elevation hierarchy
 */
export const applyDesignSystemShadow = (size: keyof typeof tokens.shadows): string => tokens.shadows[size];

/**
 * Get semantic shadows for different component types
 */
export const getSemanticShadow = (type: 'card' | 'button' | 'modal' | 'dropdown' | 'hover' | 'active' | 'focus'): string => {
    switch (type) {
        case 'card': return tokens.shadows.base;
        case 'button': return tokens.shadows.sm;
        case 'modal': return tokens.shadows.xl;
        case 'dropdown': return tokens.shadows.lg;
        case 'hover': return tokens.shadows.md;
        case 'active': return tokens.shadows.sm;
        case 'focus': return `0 0 0 3px ${tokens.colors.ring}`;
        default: return tokens.shadows.base;
    }
};

// ============================================================================
// MOTION HELPERS
// ============================================================================

export const applyDesignSystemRadius = (size: keyof typeof tokens.borderRadius): string => tokens.borderRadius[size];

export const applyDesignSystemMotion = (
    type: 'duration' | 'easing',
    value: keyof typeof tokens.motion.duration | keyof typeof tokens.motion.easing
): string =>
    type === 'duration'
        ? tokens.motion.duration[value as keyof typeof tokens.motion.duration]
        : tokens.motion.easing[value as keyof typeof tokens.motion.easing];

// ============================================================================
// UTILITY HELPERS
// ============================================================================

export const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return 'N/A';
    }
    return `${value.toFixed(1)}%`;
};

export const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || Number.isNaN(num as number)) {
        return '0';
    }
    return (num as number).toLocaleString();
};

export const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'destructive';
    if (!isVerified) return 'secondary';
    return 'default';
};

export const getMetricTrend = (
    current: number | null,
    previous: number | null
): 'up' | 'down' | 'stable' => {
    if (current === null || previous === null) return 'stable';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
};

export const getTrendIcon = (
    trend: 'up' | 'down' | 'stable',
    isGoodTrend = false
) => {
    switch (trend) {
        case 'up':
            return isGoodTrend ? '↗️' : '↗️';
        case 'down':
            return isGoodTrend ? '↘️' : '↘️';
        default:
            return '→';
    }
};

export const formatTimestamp = (date: Date): string => {
    return date.toLocaleString();
};

export const formatFileSize = (sizeInMB: number): string => {
    if (sizeInMB < 1024) {
        return `${sizeInMB.toFixed(1)} MB`;
    }
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
};
