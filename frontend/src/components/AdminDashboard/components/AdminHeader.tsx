import React, { useMemo } from 'react';
import { tokens } from '@/design-system/tokens';
import { getSemanticSpacing, applyDesignSystemZIndex } from '../utils/designSystemHelpers';
import { AdminHeadline, AdminBody } from './AdminTypography';

interface AdminHeaderProps {
    title?: string;
    description?: string;
    showBreadcrumb?: boolean;
    showAdminBadge?: boolean;
    className?: string;
    zIndex?: keyof typeof tokens.zIndex;
    variant?: 'default' | 'elevated' | 'subtle';
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    title,
    description,
    showBreadcrumb = false,
    showAdminBadge = false,
    className = '',
    zIndex,
    variant = 'default'
}) => {
    const layoutSpacing = useMemo(() => getSemanticSpacing('layout'), []);
    const zIndexStyle = useMemo(() => zIndex ? applyDesignSystemZIndex(zIndex) : {}, [zIndex]);

    // Enhanced container styles based on variant
    const containerStyles = useMemo(() => {
        const baseStyles = {
            padding: layoutSpacing.container,
            marginBottom: layoutSpacing.section,
            borderRadius: tokens.borderRadius.lg,
            transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`,
            ...zIndexStyle
        };

        switch (variant) {
            case 'elevated':
                return {
                    ...baseStyles,
                    background: tokens.colors.surface,
                    boxShadow: tokens.shadows.lg,
                    border: `1px solid ${tokens.colors.border}`,
                };
            case 'subtle':
                return {
                    ...baseStyles,
                    background: tokens.colors.muted[50],
                    border: `1px solid ${tokens.colors.muted[200]}`,
                };
            default:
                return baseStyles;
        }
    }, [layoutSpacing, zIndexStyle, variant]);

    return (
        <div
            className={className}
            style={containerStyles}
        >
            {showBreadcrumb && (
                <nav
                    style={{
                        marginBottom: tokens.spacing[6],
                        display: 'flex',
                        alignItems: 'center',
                        gap: tokens.spacing[3],
                        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
                        background: tokens.colors.muted[50],
                        borderRadius: tokens.borderRadius.md,
                        border: `1px solid ${tokens.colors.muted[200]}`,
                        fontSize: tokens.typography.fontSize.sm,
                        fontWeight: tokens.typography.fontWeight.medium
                    }}
                >
                    <AdminBody
                        style={{
                            margin: 0,
                            color: tokens.colors.secondary[500],
                            display: 'flex',
                            alignItems: 'center',
                            gap: tokens.spacing[2]
                        }}
                    >
                        <span style={{
                            color: tokens.colors.primary[500],
                            fontSize: tokens.typography.fontSize.lg
                        }}>
                            ⚙️
                        </span>
                        Admin Dashboard
                    </AdminBody>
                    <span style={{
                        color: tokens.colors.secondary[300],
                        fontWeight: tokens.typography.fontWeight.light
                    }}>
                        /
                    </span>
                    <AdminBody style={{
                        margin: 0,
                        color: tokens.colors.primary[600],
                        fontWeight: tokens.typography.fontWeight.semibold
                    }}>
                        {title}
                    </AdminBody>
                </nav>
            )}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: tokens.spacing[8]
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: tokens.spacing[4]
                    }}
                >
                    {title && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: tokens.spacing[4],
                                flexWrap: 'wrap'
                            }}
                        >
                            <AdminHeadline style={{
                                margin: 0,
                                background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.primary[700]} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: 'none'
                            }}>
                                {title}
                            </AdminHeadline>
                            {showAdminBadge && (
                                <span
                                    style={{
                                        background: `linear-gradient(135deg, ${tokens.colors.primary[100]} 0%, ${tokens.colors.primary[200]} 100%)`,
                                        color: tokens.colors.primary[700],
                                        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
                                        borderRadius: tokens.borderRadius.full,
                                        fontSize: tokens.typography.fontSize.xs,
                                        fontWeight: tokens.typography.fontWeight.bold,
                                        letterSpacing: tokens.typography.letterSpacing.wider,
                                        border: `1px solid ${tokens.colors.primary[200]}`,
                                        boxShadow: tokens.shadows.sm,
                                        transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.smooth}`,
                                        cursor: 'default',
                                        userSelect: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = tokens.shadows.md;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = tokens.shadows.sm;
                                    }}
                                >
                                    ADMIN
                                </span>
                            )}
                        </div>
                    )}
                    {description && (
                        <AdminBody style={{
                            margin: 0,
                            maxWidth: '70ch',
                            lineHeight: tokens.typography.lineHeight.relaxed,
                            color: tokens.colors.secondary[600],
                            fontSize: tokens.typography.fontSize.lg
                        }}>
                            {description}
                        </AdminBody>
                    )}
                </div>
            </div>
        </div>
    );
};
