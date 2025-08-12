import React from 'react';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '../utils/designSystemHelpers';

interface AdminTypographyProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * AdminTitle - Uses title typography style following design system guidelines
 * Font: Sans, Size: xl, Weight: semibold, Line Height: snug
 */
export const AdminTitle: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <h3
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('title'),
            color: tokens.colors.secondary[800], // Following color hierarchy guidelines
            ...style
        }}
    >
        {children}
    </h3>
);

/**
 * AdminSubtitle - Uses subtitle typography style following design system guidelines
 * Font: Sans, Size: lg, Weight: medium, Line Height: normal
 */
export const AdminSubtitle: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <h4
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('subtitle'),
            color: tokens.colors.secondary[700], // Following color hierarchy guidelines
            ...style
        }}
    >
        {children}
    </h4>
);

/**
 * AdminBody - Uses body typography style following design system guidelines
 * Font: Sans, Size: base, Weight: normal, Line Height: relaxed
 */
export const AdminBody: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <p
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('body'),
            color: tokens.colors.secondary[600], // Following color hierarchy guidelines
            maxWidth: '65ch', // Optimal line length for readability
            ...style
        }}
    >
        {children}
    </p>
);

/**
 * AdminCaption - Uses caption typography style following design system guidelines
 * Font: Sans, Size: sm, Weight: normal, Line Height: normal, Letter Spacing: wide
 */
export const AdminCaption: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <span
        className={`text-muted-foreground ${className}`}
        style={{
            ...applyTypographyStyle('caption'),
            color: tokens.colors.secondary[500], // Following color hierarchy guidelines
            ...style
        }}
    >
        {children}
    </span>
);

/**
 * AdminHeadline - Uses headline typography style following design system guidelines
 * Font: Display, Size: 4xl, Weight: bold, Line Height: tight, Letter Spacing: tight
 */
export const AdminHeadline: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <h1
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('headline'),
            color: tokens.colors.secondary[900], // Following color hierarchy guidelines
            ...style
        }}
    >
        {children}
    </h1>
);

/**
 * AdminSubheadline - Uses subheadline typography style following design system guidelines
 * Font: Display, Size: 2xl, Weight: semibold, Line Height: snug
 */
export const AdminSubheadline: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <h2
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('subheadline'),
            color: tokens.colors.secondary[800], // Following color hierarchy guidelines
            ...style
        }}
    >
        {children}
    </h2>
);

/**
 * AdminCode - Uses code typography style following design system guidelines
 * Font: Mono, Size: sm, Weight: normal, Line Height: normal
 */
export const AdminCode: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <code
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('code'),
            color: tokens.colors.secondary[700], // Following color hierarchy guidelines
            backgroundColor: tokens.colors.secondary[50],
            padding: tokens.spacing[1],
            borderRadius: tokens.borderRadius.sm,
            ...style
        }}
    >
        {children}
    </code>
);

/**
 * AdminElegant - Uses elegant typography style following design system guidelines
 * Font: Elegant, Size: lg, Weight: light, Line Height: relaxed, Letter Spacing: wide
 */
export const AdminElegant: React.FC<AdminTypographyProps> = ({
    children,
    className = '',
    style = {}
}) => (
    <p
        className={`text-foreground ${className}`}
        style={{
            ...applyTypographyStyle('elegant'),
            color: tokens.colors.secondary[600], // Following color hierarchy guidelines
            ...style
        }}
    >
        {children}
    </p>
);
