import React from 'react';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';

interface AdminTypographyProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const AdminTitle: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <h3
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('title'),
            color: tokens.colors.foreground,
            ...style
        }}
    >
        {children}
    </h3>
);

export const AdminSubtitle: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <h4
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('subtitle'),
            color: tokens.colors.foreground,
            ...style
        }}
    >
        {children}
    </h4>
);

export const AdminBody: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <p
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('body'),
            color: tokens.colors.foreground,
            ...style
        }}
    >
        {children}
    </p>
);

export const AdminCaption: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <span
        className={`text-muted-foreground ${className}`}
        style={{
            ...applyTypographyStyle('caption'),
            color: tokens.colors.secondary[500],
            ...style
        }}
    >
        {children}
    </span>
);

export const AdminHeadline: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <h1
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('headline'),
            color: tokens.colors.foreground,
            ...style
        }}
    >
        {children}
    </h1>
);
