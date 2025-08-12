import { tokens } from '@/design-system/tokens';

/**
 * Shared design system helper functions for AdminDashboard components
 * Eliminates code duplication across components
 */

export const applyDesignSystemSpacing = (size: keyof typeof tokens.spacing) => tokens.spacing[size];

export const applyDesignSystemRadius = (size: keyof typeof tokens.borderRadius) => tokens.borderRadius[size];

export const applyDesignSystemShadow = (size: keyof typeof tokens.shadows) => tokens.shadows[size];

export const applyDesignSystemMotion = (type: 'duration' | 'easing', value: string) =>
    type === 'duration' ? tokens.motion.duration[value] : tokens.motion.easing[value];

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'healthy': return tokens.colors.success;
        case 'warning': return tokens.colors.warning;
        case 'critical': return tokens.colors.destructive[500];
        default: return tokens.colors.muted[400];
    }
};

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

// Additional helper functions to eliminate duplication
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
