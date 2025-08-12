import React, { memo, useMemo } from 'react';
import { Shield } from 'lucide-react';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';

interface AdminHeaderProps {
    title?: string;
    description?: string;
    showBreadcrumb?: boolean;
    showAdminBadge?: boolean;
    className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = memo(({
    title = "Admin Dashboard",
    description = "Monitor and manage system performance, user activity, and system health",
    showBreadcrumb = false,
    showAdminBadge = true,
    className = ""
}) => {
    const titleStyle = useMemo(() => applyTypographyStyle('headline'), []);
    const descriptionStyle = useMemo(() => ({
        ...applyTypographyStyle('body'),
        marginTop: tokens.spacing[3],
        color: tokens.colors.secondary[500]
    }), []);

    const badgeStyle = useMemo(() => ({
        border: `${tokens.borderWidth.base} solid ${tokens.colors.primary[200]}`,
        background: tokens.colors.primary[50],
        transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`
    }), []);

    const iconStyle = useMemo(() => ({ color: tokens.colors.primary[500] }), []);
    const textStyle = useMemo(() => ({
        ...applyTypographyStyle('caption'),
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.primary[500]
    }), []);

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 ${className}`}>
            <div className="space-y-2 sm:space-y-0 sm:flex-1">
                {showBreadcrumb && (
                    <nav aria-label="breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li className="inline-flex items-center gap-1.5">
                                <a
                                    className="transition-colors hover:text-foreground"
                                    href="/admin"
                                >
                                    Admin
                                </a>
                            </li>
                            <li className="inline-flex items-center gap-1.5">
                                <a
                                    className="transition-colors hover:text-foreground"
                                    href="/admin/dashboard"
                                    aria-current="page"
                                >
                                    Dashboard
                                </a>
                            </li>
                        </ol>
                    </nav>
                )}
                <div className="mt-2 sm:mt-4">
                    <div className="space-y-2 sm:space-y-3">
                        <h1
                            style={titleStyle}
                            className="text-foreground text-lg sm:text-xl lg:text-2xl"
                        >
                            {title}
                        </h1>
                        <p
                            style={descriptionStyle}
                            className="text-sm sm:text-base"
                        >
                            {description}
                        </p>
                    </div>
                </div>
            </div>
            {showAdminBadge && (
                <div className="flex items-center justify-center sm:justify-end">
                    <div
                        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border"
                        style={badgeStyle}
                    >
                        <Shield
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            style={iconStyle}
                            aria-hidden="true"
                        />
                        <span
                            style={textStyle}
                            className="text-xs sm:text-sm"
                        >
                            Admin Access
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
});

AdminHeader.displayName = 'AdminHeader';
