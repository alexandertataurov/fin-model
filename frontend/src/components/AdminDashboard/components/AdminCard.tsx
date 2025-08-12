import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { tokens } from '@/design-system/tokens';
import {
    applyDesignSystemRadius,
    getSemanticShadow,
    applyDesignSystemMotion,
    getSemanticSpacing
} from '../utils/designSystemHelpers';
import { AdminTitle, AdminCaption } from './AdminTypography';

interface AdminCardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    variant?: 'default' | 'elevated' | 'outlined';
    size?: 'sm' | 'md' | 'lg';
    zIndex?: keyof typeof tokens.zIndex;
}

export const AdminCard: React.FC<AdminCardProps> = ({
    title,
    subtitle,
    children,
    className = '',
    headerClassName = '',
    contentClassName = '',
    variant = 'default',
    size = 'md',
    zIndex
}) => {
    const getCardStyle = useMemo(() => {
        const baseStyle = {
            background: tokens.colors.background,
            border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
            transition: `all ${applyDesignSystemMotion('duration', 'normal')} ${applyDesignSystemMotion('easing', 'smooth')}`,
            ...(zIndex && { zIndex: tokens.zIndex[zIndex] })
        };

        switch (variant) {
            case 'elevated':
                return {
                    ...baseStyle,
                    borderRadius: applyDesignSystemRadius('xl'),
                    boxShadow: getSemanticShadow('modal'), // Following shadow hierarchy
                };
            case 'outlined':
                return {
                    ...baseStyle,
                    borderRadius: applyDesignSystemRadius('lg'),
                    boxShadow: getSemanticShadow('card'), // Following shadow hierarchy
                };
            default:
                return {
                    ...baseStyle,
                    borderRadius: applyDesignSystemRadius('xl'),
                    boxShadow: getSemanticShadow('card'), // Following shadow hierarchy
                };
        }
    }, [variant, zIndex]);

    const padding = useMemo(() => {
        const componentSpacing = getSemanticSpacing('component');

        switch (size) {
            case 'sm':
                return {
                    padding: tokens.spacing[3], // 12px - Small component padding
                    gap: tokens.spacing[2] // 8px - Small component gap
                };
            case 'lg':
                return {
                    padding: tokens.spacing[8], // 32px - Large component padding
                    gap: tokens.spacing[4] // 16px - Large component gap
                };
            default:
                return {
                    padding: componentSpacing.padding, // 16px - Standard component padding
                    gap: componentSpacing.gap // 8px - Standard component gap
                };
        }
    }, [size]);

    return (
        <Card
            className={className}
            style={{
                ...getCardStyle,
                padding: padding.padding,
                gap: padding.gap
            }}
        >
            {(title || subtitle) && (
                <CardHeader
                    className={headerClassName}
                    style={{
                        padding: 0,
                        marginBottom: tokens.spacing[4] // 16px - Header bottom margin
                    }}
                >
                    {title && (
                        <CardTitle style={{ padding: 0, margin: 0 }}>
                            <AdminTitle>{title}</AdminTitle>
                        </CardTitle>
                    )}
                    {subtitle && (
                        <div style={{ marginTop: tokens.spacing[2] }}> {/* 8px - Subtitle top margin */}
                            <AdminCaption>{subtitle}</AdminCaption>
                        </div>
                    )}
                </CardHeader>
            )}
            <CardContent
                className={contentClassName}
                style={{
                    padding: 0,
                    margin: 0
                }}
            >
                {children}
            </CardContent>
        </Card>
    );
};
