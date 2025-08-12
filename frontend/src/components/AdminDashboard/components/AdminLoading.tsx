import React, { useMemo } from 'react';
import { tokens } from '@/design-system/tokens';
import {
    applyDesignSystemSpacing,
    getSemanticSpacing,
    applyDesignSystemRadius,
    getSemanticShadow,
    applyDesignSystemZIndex
} from '../utils/designSystemHelpers';
import { AdminBody, AdminCaption } from './AdminTypography';

interface AdminLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    zIndex?: keyof typeof tokens.zIndex;
}

export const AdminLoadingSpinner: React.FC<AdminLoadingProps> = ({
    message = 'Loading...',
    size = 'md',
    className = '',
    zIndex
}) => {
    const getSpinnerSize = useMemo(() => {
        switch (size) {
            case 'sm': return '16px';
            case 'lg': return '32px';
            default: return '24px';
        }
    }, [size]);

    const componentSpacing = useMemo(() => getSemanticSpacing('component'), []);
    const zIndexStyle = useMemo(() => zIndex ? applyDesignSystemZIndex(zIndex) : {}, [zIndex]);

    return (
        <div
            className={`flex items-center justify-center ${className}`}
            style={{
                gap: componentSpacing.gap, // 8px - Standard component gap
                padding: componentSpacing.padding, // 16px - Standard component padding
                ...zIndexStyle
            }}
        >
            <div
                style={{
                    width: getSpinnerSize,
                    height: getSpinnerSize,
                    border: `2px solid ${tokens.colors.secondary[200]}`,
                    borderTop: `2px solid ${tokens.colors.primary[500]}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            <AdminBody style={{ margin: 0, color: tokens.colors.secondary[600] }}>
                {message}
            </AdminBody>
        </div>
    );
};

export const AdminLoadingSkeleton: React.FC<{
    rows?: number;
    className?: string;
    zIndex?: keyof typeof tokens.zIndex;
}> = ({ rows = 3, className = '', zIndex }) => {
    const componentSpacing = useMemo(() => getSemanticSpacing('component'), []);
    const zIndexStyle = useMemo(() => zIndex ? applyDesignSystemZIndex(zIndex) : {}, [zIndex]);

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: componentSpacing.gap, // 8px - Standard component gap
                padding: componentSpacing.padding, // 16px - Standard component padding
                ...zIndexStyle
            }}
        >
            {Array.from({ length: rows }).map((_, index) => (
                <div
                    key={index}
                    style={{
                        height: '20px',
                        backgroundColor: tokens.colors.secondary[200],
                        borderRadius: applyDesignSystemRadius('sm'),
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                />
            ))}
        </div>
    );
};

export const AdminLoadingCard: React.FC<{
    title?: string;
    className?: string;
    zIndex?: keyof typeof tokens.zIndex;
}> = ({ title = 'Loading...', className = '', zIndex }) => {
    const componentSpacing = useMemo(() => getSemanticSpacing('component'), []);
    const zIndexStyle = useMemo(() => zIndex ? applyDesignSystemZIndex(zIndex) : {}, [zIndex]);

    return (
        <div
            className={className}
            style={{
                background: tokens.colors.background,
                border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
                borderRadius: applyDesignSystemRadius('xl'),
                boxShadow: getSemanticShadow('card'),
                padding: componentSpacing.padding, // 16px - Standard component padding
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: componentSpacing.gap, // 8px - Standard component gap
                ...zIndexStyle
            }}
        >
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    border: `3px solid ${tokens.colors.secondary[200]}`,
                    borderTop: `3px solid ${tokens.colors.primary[500]}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: tokens.spacing[4] // 16px - Bottom margin
                }}
            />
            <AdminCaption style={{ margin: 0, textAlign: 'center' }}>
                {title}
            </AdminCaption>
        </div>
    );
};
