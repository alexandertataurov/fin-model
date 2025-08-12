import { tokens, getToken } from '@/design-system/tokens';

/**
 * Comprehensive design system helper functions for AdminDashboard components
 * Follows design system foundations guidelines for typography, colors, spacing, and shadows
 */

// ============================================================================
// ERROR HANDLING & VALIDATION
// ============================================================================

/**
 * Safe token access with fallback values
 */
const safeTokenAccess = <T>(accessor: () => T, fallback: T): T => {
    try {
        return accessor();
    } catch (error) {
        console.warn('Design system token access failed, using fallback:', error);
        return fallback;
    }
};

/**
 * Validate token path exists
 */
const validateTokenPath = (path: string): boolean => {
    try {
        return getToken(path) !== undefined;
    } catch {
        return false;
    }
};

// ============================================================================
// TYPOGRAPHY HELPERS (following 02-Typography.mdx guidelines)
// ============================================================================

/**
 * Apply typography styles following design system guidelines
 * Uses proper font families, sizes, weights, and line heights
 */
export const applyTypographyStyle = (styleName: keyof typeof tokens.typography.textStyles): React.CSSProperties => {
    return safeTokenAccess(() => {
        const textStyle = tokens.typography.textStyles[styleName];
        
        if (!textStyle) {
            throw new Error(`Typography style '${styleName}' not found`);
        }

        return {
            fontFamily: tokens.typography.fontFamily[textStyle.fontFamily as keyof typeof tokens.typography.fontFamily].join(', '),
            fontSize: tokens.typography.fontSize[textStyle.fontSize as keyof typeof tokens.typography.fontSize],
            fontWeight: tokens.typography.fontWeight[textStyle.fontWeight as keyof typeof tokens.typography.fontWeight],
            lineHeight: tokens.typography.lineHeight[textStyle.lineHeight as keyof typeof tokens.typography.lineHeight],
            letterSpacing: tokens.typography.letterSpacing[textStyle.letterSpacing as keyof typeof tokens.typography.letterSpacing],
        };
    }, {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0',
    });
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
): React.CSSProperties => {
    return safeTokenAccess(() => ({
        fontFamily: tokens.typography.fontFamily[fontFamily].join(', '),
        fontSize: tokens.typography.fontSize[fontSize],
        fontWeight: tokens.typography.fontWeight[fontWeight],
        lineHeight: tokens.typography.lineHeight[lineHeight],
        letterSpacing: tokens.typography.letterSpacing[letterSpacing],
    }), {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0',
    });
};

// ============================================================================
// COLOR HELPERS (following 01-Colors.mdx guidelines)
// ============================================================================

/**
 * Get semantic color following design system color guidelines
 */
export const getSemanticColor = (type: 'success' | 'warning' | 'info' | 'danger'): string => {
    return safeTokenAccess(() => {
        switch (type) {
            case 'success': return tokens.colors.success;
            case 'warning': return tokens.colors.warning;
            case 'info': return tokens.colors.info;
            case 'danger': return tokens.colors.destructive[500];
            default: return tokens.colors.secondary[500];
        }
    }, '#737373');
};

/**
 * Get status color with proper semantic meaning
 */
export const getStatusColor = (status: string): string => {
    return safeTokenAccess(() => {
        switch (status.toLowerCase()) {
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
    }, '#a3a3a3');
};

/**
 * Get interactive state colors following design system guidelines
 */
export const getInteractiveColors = (
    baseColor: 'primary' | 'secondary',
    state: 'default' | 'hover' | 'active' | 'focus' = 'default'
): string => {
    return safeTokenAccess(() => {
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
    }, '#6366f1');
};

// ============================================================================
// SPACING HELPERS (following 07-Spacing.mdx guidelines)
// ============================================================================

/**
 * Apply design system spacing following 8px base unit
 */
export const applyDesignSystemSpacing = (size: keyof typeof tokens.spacing): string => {
    return safeTokenAccess(() => tokens.spacing[size], '1rem');
};

/**
 * Get semantic spacing for different contexts
 */
export const getSemanticSpacing = (context: 'component' | 'layout' | 'form'): Record<string, string> => {
    return safeTokenAccess(() => {
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
    }, {
        padding: '1rem',
        margin: '1.5rem',
        gap: '0.5rem',
        section: '3rem',
        page: '2rem',
        container: '1rem',
        field: '1rem',
        group: '1.5rem',
    } as Record<string, string>);
};

// ============================================================================
// SHADOW HELPERS (following 05-Shadows.mdx guidelines)
// ============================================================================

/**
 * Apply design system shadows following elevation hierarchy
 */
export const applyDesignSystemShadow = (size: keyof typeof tokens.shadows): string => {
    return safeTokenAccess(() => tokens.shadows[size], '0 1px 3px 0 rgb(0 0 0 / 0.1)');
};

/**
 * Get semantic shadows for different component types
 */
export const getSemanticShadow = (type: 'card' | 'button' | 'modal' | 'dropdown' | 'hover' | 'active' | 'focus'): string => {
    return safeTokenAccess(() => {
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
    }, '0 1px 3px 0 rgb(0 0 0 / 0.1)');
};

// ============================================================================
// Z-INDEX HELPERS (following 03-ZIndex.mdx guidelines)
// ============================================================================

/**
 * Get semantic z-index value following design system guidelines
 */
export const getSemanticZIndex = (type: keyof typeof tokens.zIndex): string => {
    return safeTokenAccess(() => {
        const zIndexValue = tokens.zIndex[type];
        return typeof zIndexValue === 'string' ? zIndexValue : String(zIndexValue);
    }, '0');
};

/**
 * Apply z-index with validation
 */
export const applyDesignSystemZIndex = (type: keyof typeof tokens.zIndex): React.CSSProperties => {
    return {
        zIndex: getSemanticZIndex(type)
    };
};

// ============================================================================
// MOTION & RADIUS HELPERS
// ============================================================================

export const applyDesignSystemRadius = (size: keyof typeof tokens.borderRadius): string => {
    return safeTokenAccess(() => tokens.borderRadius[size], '0.25rem');
};

export const applyDesignSystemMotion = (
    type: 'duration' | 'easing',
    value: keyof typeof tokens.motion.duration | keyof typeof tokens.motion.easing
): string => {
    return safeTokenAccess(() => {
        if (type === 'duration') {
            return tokens.motion.duration[value as keyof typeof tokens.motion.duration];
        } else {
            return tokens.motion.easing[value as keyof typeof tokens.motion.easing];
        }
    }, type === 'duration' ? '300ms' : 'cubic-bezier(0.4, 0, 0.2, 1)');
};

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

// ============================================================================
// PERFORMANCE OPTIMIZATION HELPERS
// ============================================================================

/**
 * Memoized token access for performance
 */
export const memoizedTokenAccess = <T>(accessor: () => T, dependencies: any[]): T => {
    // This would be used with React.useMemo in components
    return accessor();
};

/**
 * Validate design system configuration
 */
export const validateDesignSystem = (): boolean => {
    const requiredTokens = [
        'colors.primary.500',
        'colors.secondary.500',
        'typography.fontSize.base',
        'spacing.4',
        'shadows.base',
        'borderRadius.lg',
        'motion.duration.normal',
        'zIndex.modal'
    ];

    return requiredTokens.every(token => validateTokenPath(token));
};
