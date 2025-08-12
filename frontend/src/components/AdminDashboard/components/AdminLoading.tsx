import React from 'react';
import { RefreshCw } from 'lucide-react';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';

interface AdminLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const AdminLoadingSpinner: React.FC<AdminLoadingProps> = ({
    message = 'Loading...',
    size = 'md',
    className = ''
}) => {
    const getSpinnerSize = () => {
        switch (size) {
            case 'sm': return 'h-4 w-4';
            case 'lg': return 'h-8 w-8';
            default: return 'h-6 w-6';
        }
    };

    return (
        <div className={`flex items-center justify-center gap-3 ${className}`}>
            <RefreshCw
                className={`${getSpinnerSize()} animate-spin`}
                style={{ color: tokens.colors.primary[500] }}
            />
            <span
                style={{
                    ...applyTypographyStyle('body'),
                    color: tokens.colors.secondary[500]
                }}
            >
                {message}
            </span>
        </div>
    );
};

export const AdminLoadingSkeleton: React.FC<{
    rows?: number;
    className?: string;
}> = ({ rows = 3, className = '' }) => (
    <div className={`space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

export const AdminLoadingCard: React.FC<{
    title?: string;
    className?: string;
}> = ({ title = 'Loading...', className = '' }) => (
    <div className={`p-6 border rounded-lg ${className}`}>
        <AdminLoadingSpinner message={title} />
    </div>
);
