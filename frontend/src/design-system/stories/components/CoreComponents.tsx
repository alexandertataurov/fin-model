import React from 'react';
import { tokens } from '../../tokens';

// Typography helper using tokens
export const applyTypographyStyle = (styleName: string): React.CSSProperties => {
  const styles: Record<string, React.CSSProperties> = {
    headline: {
      fontFamily: tokens.typography.fontFamily.display.join(', '),
      fontSize: tokens.typography.fontSize['4xl'],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: tokens.typography.letterSpacing.tight
    },
    subheadline: {
      fontFamily: tokens.typography.fontFamily.display.join(', '),
      fontSize: tokens.typography.fontSize['2xl'],
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.snug,
      letterSpacing: tokens.typography.letterSpacing.normal
    },
    title: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.snug,
      letterSpacing: tokens.typography.letterSpacing.normal
    },
    subtitle: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.normal,
      letterSpacing: tokens.typography.letterSpacing.normal
    },
    body: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.relaxed,
      letterSpacing: tokens.typography.letterSpacing.normal
    },
    caption: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.normal,
      letterSpacing: tokens.typography.letterSpacing.wide
    }
  };

  return styles[styleName] || {};
};

// Reusable Container component
export const Container = ({ 
  children, 
  className = "", 
  padding = tokens.spacing[6],
  background = tokens.colors.background,
  border = tokens.colors.border,
  borderRadius = tokens.borderRadius.xl,
  shadow = tokens.shadows.md,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  background?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  [key: string]: any;
}) => (
  <div
    className={`group transition-all duration-200 hover:shadow-lg ${className}`}
    style={{
      padding,
      background,
      border: `${tokens.borderWidth.base} solid ${border}`,
      borderRadius,
      boxShadow: shadow,
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`,
      ...props
    }}
  >
    {children}
  </div>
);

// Reusable Card component
export const Card = ({ 
  children, 
  className = "",
  padding = tokens.spacing[6],
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  [key: string]: any;
}) => (
  <Container
    className={`hover:border-gray-300 ${className}`}
    padding={padding}
    {...props}
  >
    {children}
  </Container>
);

// Reusable Section Header component
export const SectionHeader = ({ 
  title, 
  subtitle,
  titleStyle = 'headline',
  subtitleStyle = 'subtitle'
}: { 
  title: string; 
  subtitle: string;
  titleStyle?: string;
  subtitleStyle?: string;
}) => (
  <div className="text-center mb-8">
    <h3
      style={applyTypographyStyle(titleStyle)}
      className="text-gray-900 mb-4"
    >
      {title}
    </h3>
    <p
      style={applyTypographyStyle(subtitleStyle)}
      className="text-gray-600 max-w-2xl mx-auto"
    >
      {subtitle}
    </p>
  </div>
);

// Reusable Button component
export const Button = ({ 
  children, 
  variant = 'primary',
  className = ""
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary';
  className?: string;
}) => {
  const isPrimary = variant === 'primary';
  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium ${className}`}
      style={{
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        borderRadius: tokens.borderRadius.lg,
        fontWeight: tokens.typography.fontWeight.medium,
        background: isPrimary ? tokens.colors.primary[500] : 'transparent',
        color: isPrimary ? tokens.colors.background : tokens.colors.secondary[700],
        border: isPrimary ? 'none' : `${tokens.borderWidth.base} solid ${tokens.colors.secondary[300]}`
      }}
    >
      {children}
    </button>
  );
};
