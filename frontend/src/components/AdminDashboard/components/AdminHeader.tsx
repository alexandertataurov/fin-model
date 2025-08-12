import React from 'react';
import { tokens } from '@/design-system/tokens';
import { getSemanticSpacing } from '../utils/designSystemHelpers';
import { AdminHeadline, AdminSubheadline, AdminBody } from './AdminTypography';

interface AdminHeaderProps {
    title?: string;
    description?: string;
    showBreadcrumb?: boolean;
    showAdminBadge?: boolean;
    className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    title,
    description,
    showBreadcrumb = false,
    showAdminBadge = false,
    className = ''
}) => {
    const layoutSpacing = getSemanticSpacing('layout');

    return (
        <div
            className={className}
            style={{
                padding: layoutSpacing.container, // 16px - Container padding
                marginBottom: layoutSpacing.section // 48px - Section spacing
            }}
        >
            {showBreadcrumb && (
                <nav
                    style={{
                        marginBottom: tokens.spacing[4], // 16px - Breadcrumb bottom margin
                        display: 'flex',
                        alignItems: 'center',
                        gap: tokens.spacing[2] // 8px - Breadcrumb item gap
                    }}
                >
                    <AdminBody style={{ margin: 0, color: tokens.colors.secondary[500] }}>
                        Admin Dashboard
                    </AdminBody>
                    <span style={{ color: tokens.colors.secondary[300] }}>/</span>
                    <AdminBody style={{ margin: 0, color: tokens.colors.primary[600] }}>
                        {title}
                    </AdminBody>
                </nav>
            )}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: tokens.spacing[6] // 24px - Header content gap
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: tokens.spacing[3] // 12px - Title and description gap
                    }}
                >
                    {title && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: tokens.spacing[3] // 12px - Title and badge gap
                            }}
                        >
                            <AdminHeadline style={{ margin: 0 }}>
                                {title}
                            </AdminHeadline>
                            {showAdminBadge && (
                                <span
                                    style={{
                                        background: tokens.colors.primary[100],
                                        color: tokens.colors.primary[700],
                                        padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                                        borderRadius: tokens.borderRadius.full,
                                        fontSize: tokens.typography.fontSize.xs,
                                        fontWeight: tokens.typography.fontWeight.medium,
                                        letterSpacing: tokens.typography.letterSpacing.wide
                                    }}
                                >
                                    ADMIN
                                </span>
                            )}
                        </div>
                    )}
                    {description && (
                        <AdminBody style={{ margin: 0, maxWidth: '65ch' }}>
                            {description}
                        </AdminBody>
                    )}
                </div>
            </div>
        </div>
    );
};
