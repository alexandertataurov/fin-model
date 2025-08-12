import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { tokens } from '@/design-system/tokens';
import {
    applyDesignSystemRadius,
    applyDesignSystemShadow,
    applyDesignSystemMotion
} from '../utils/designSystemHelpers';

interface AdminCardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    variant?: 'default' | 'elevated' | 'outlined';
    size?: 'sm' | 'md' | 'lg';
}

export const AdminCard: React.FC<AdminCardProps> = ({
    title,
    subtitle,
    children,
    className = '',
    headerClassName = '',
    contentClassName = '',
    variant = 'default',
    size = 'md'
}) => {
    const getCardStyle = () => {
        const baseStyle = {
            background: tokens.colors.background,
            border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
            transition: `all ${applyDesignSystemMotion('duration', 'normal')} ${applyDesignSystemMotion('easing', 'smooth')}`
        };

        switch (variant) {
            case 'elevated':
                return {
                    ...baseStyle,
                    borderRadius: applyDesignSystemRadius('xl'),
                    boxShadow: applyDesignSystemShadow('lg'),
                };
            case 'outlined':
                return {
                    ...baseStyle,
                    borderRadius: applyDesignSystemRadius('lg'),
                    boxShadow: applyDesignSystemShadow('sm'),
                };
            default:
                return {
                    ...baseStyle,
                    borderRadius: applyDesignSystemRadius('xl'),
                    boxShadow: applyDesignSystemShadow('md'),
                };
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'sm': return 'p-4';
            case 'lg': return 'p-8';
            default: return 'p-6';
        }
    };

    return (
        <Card
            className={className}
            style={getCardStyle()}
        >
            {(title || subtitle) && (
                <CardHeader className={`${getPadding()} ${headerClassName}`}>
                    {title && (
                        <CardTitle className="text-lg font-semibold text-foreground">
                            {title}
                        </CardTitle>
                    )}
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {subtitle}
                        </p>
                    )}
                </CardHeader>
            )}
            <CardContent className={`${getPadding()} ${contentClassName}`}>
                {children}
            </CardContent>
        </Card>
    );
};
