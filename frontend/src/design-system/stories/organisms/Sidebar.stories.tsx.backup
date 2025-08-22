import React from 'react';
import { Sidebar } from '../../organisms/Sidebar/Sidebar';

export default {
    title: 'Organisms/Sidebar',
    component: Sidebar,
};

export const Default = () => (
    <Sidebar>
        <div>Default Sidebar Content</div>
    </Sidebar>
);

export const Collapsible = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
        <Sidebar collapsed={collapsed} onCollapseToggle={setCollapsed}>
            <div>Collapsible Sidebar</div>
        </Sidebar>
    );
};

export const Fixed = () => (
    <Sidebar fixed>
        <div>Fixed Sidebar</div>
    </Sidebar>
);

export const Mini = () => (
    <Sidebar mini>
        <div>Mini Sidebar</div>
    </Sidebar>
);

export const CustomWidths = () => (
    <Sidebar expandedWidth="320px" miniWidth="48px">
        <div>Custom Widths Sidebar</div>
    </Sidebar>
);

export const Accessible = () => (
    <Sidebar ariaLabel="Main navigation sidebar">
        <div>Accessible Sidebar</div>
    </Sidebar>
);

export const WithCustomContent = () => (
    <Sidebar>
        <ul>
            <li>Dashboard</li>
            <li>Users</li>
            <li>Settings</li>
        </ul>
    </Sidebar>
);
