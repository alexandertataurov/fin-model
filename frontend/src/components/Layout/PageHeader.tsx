import React from 'react';

interface PageHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    children,
    className = ""
}) => {
    return (
        <div className={`bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
            {children}
        </div>
    );
};
