import React from 'react';

export interface SidebarProps {
    collapsed?: boolean;
    fixed?: boolean;
    mini?: boolean;
    expandedWidth?: string;
    miniWidth?: string;
    onCollapseToggle?: (collapsed: boolean) => void;
    children?: React.ReactNode;
    className?: string;
    ariaLabel?: string;
}
