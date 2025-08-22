import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';

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

export const Sidebar: React.FC<SidebarProps> = ({
    collapsed: collapsedProp = false,
    fixed = false,
    mini = false,
    expandedWidth = '250px',
    miniWidth = '64px',
    onCollapseToggle,
    children,
    className,
    ariaLabel = 'Sidebar',
}) => {
    const [collapsed, setCollapsed] = useState(collapsedProp);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const tokens = useDesignTokens();

    useEffect(() => {
        setCollapsed(collapsedProp);
    }, [collapsedProp]);

    // Keyboard accessibility: toggle with Ctrl+[
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '[') {
                setCollapsed((prev) => {
                    onCollapseToggle?.(!prev);
                    return !prev;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCollapseToggle]);

    return (
        <nav
            ref={sidebarRef}
            className={cn(
                'sidebar',
                fixed && 'fixed left-0 top-0 h-full z-30',
                collapsed ? 'sidebar-collapsed' : '',
                mini ? 'sidebar-mini' : '',
                className
            )}
            aria-label={ariaLabel}
            tabIndex={0}
            style={{
                width: collapsed ? miniWidth : expandedWidth,
                minWidth: mini ? miniWidth : expandedWidth,
                background: tokens.getThemeColor('background'),
                color: tokens.getThemeColor('foreground'),
                borderRight: `1px solid ${tokens.getThemeColor('border')}`,
                transition: tokens.getMotion('duration', 'normal'),
                boxShadow: tokens.getBoxShadow('md'),
                outline: 'none',
            }}
        >
            <button
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => {
                    setCollapsed((prev) => {
                        onCollapseToggle?.(!prev);
                        return !prev;
                    });
                }}
                className="sidebar-toggle focus:outline-none absolute top-2 right-2"
                tabIndex={0}
            >
                {collapsed ? '→' : '←'}
            </button>
            <div className="sidebar-content p-4 overflow-y-auto" tabIndex={-1}>
                {children}
            </div>
        </nav>
    );
};

export default Sidebar;
