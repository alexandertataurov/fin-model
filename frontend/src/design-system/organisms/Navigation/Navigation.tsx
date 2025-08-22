import React from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Icon } from '../../atoms/Icon';
import {
  NavigationProps,
  NavigationItemProps,
  NavigationGroupProps,
} from './Navigation.types';

const StyledNavigation = styled.nav<NavigationProps>`
  display: flex;
  width: 100%;

  ${({ orientation = 'horizontal' }) =>
    orientation === 'horizontal'
      ? 'flex-direction: row;'
      : 'flex-direction: column;'}

  ${({ variant = 'horizontal' }) => {
    const variants = {
      horizontal: `
        gap: ${getToken('spacing.1')};
      `,
      vertical: `
        flex-direction: column;
        gap: ${getToken('spacing.1')};
      `,
      tabs: `
        border-bottom: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
        gap: 0;
      `,
      pills: `
        gap: ${getToken('spacing.1')};
      `,
    };
    return variants[variant];
  }}
  
  ${({ size = 'md' }) => {
    const sizes = {
      sm: getToken('spacing.2'),
      md: getToken('spacing.3'),
      lg: getToken('spacing.4'),
    };
    const padding = sizes[size];
    return `padding: ${padding};`;
  }}
`;

const StyledNavigationItem = styled.a<NavigationItemProps>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  padding: ${getToken('spacing.2')} ${getToken('spacing.3')};
  border-radius: ${getToken('borderRadius.md')};
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  text-decoration: none;
  transition: all ${getToken('motion.easing.easeInOut')}
    ${getToken('motion.duration.normal')};
  cursor: pointer;
  position: relative;

  ${({ variant = 'horizontal' }) => {
    const variants = {
      horizontal: `
        color: ${getToken('colors.muted.foreground')};
        
        &:hover {
          color: ${getToken('colors.foreground')};
          background-color: ${getToken('colors.muted.100')};
        }
      `,
      vertical: `
        color: ${getToken('colors.muted.foreground')};
        
        &:hover {
          color: ${getToken('colors.foreground')};
          background-color: ${getToken('colors.muted.100')};
        }
      `,
      tabs: `
        color: ${getToken('colors.muted.foreground')};
        border-bottom: ${getToken('borderWidth.md')} solid transparent;
        border-radius: 0;
        
        &:hover {
          color: ${getToken('colors.foreground')};
          background-color: ${getToken('colors.muted.100')};
        }
      `,
      pills: `
        color: ${getToken('colors.muted.foreground')};
        
        &:hover {
          color: ${getToken('colors.foreground')};
          background-color: ${getToken('colors.muted.100')};
        }
      `,
    };
    return variants[variant];
  }}

  ${({ active, variant = 'horizontal' }) => {
    if (!active) return '';

    const activeStyles = {
      horizontal: `
        color: ${getToken('colors.foreground')};
        background-color: ${getToken('colors.accent.500')};
        color: ${getToken('colors.accent.foreground')};
      `,
      vertical: `
        color: ${getToken('colors.foreground')};
        background-color: ${getToken('colors.accent.500')};
        color: ${getToken('colors.accent.foreground')};
      `,
      tabs: `
        color: ${getToken('colors.foreground')};
        border-bottom-color: ${getToken('colors.primary.500')};
        background-color: transparent;
      `,
      pills: `
        color: ${getToken('colors.foreground')};
        background-color: ${getToken('colors.primary.500')};
        color: ${getToken('colors.primary.foreground')};
      `,
    };
    return activeStyles[variant];
  }}
  
  ${({ disabled }) =>
    disabled &&
    `
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}
`;

const StyledNavigationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${getToken('spacing.5')};
  height: ${getToken('spacing.5')};
  padding: 0 ${getToken('spacing.1')};
  border-radius: ${getToken('borderRadius.full')};
  background-color: ${getToken('colors.primary.500')};
  color: ${getToken('colors.primary.foreground')};
  font-size: ${getToken('typography.fontSize.xs')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  line-height: 1;
`;

const StyledNavigationGroup = styled.div<NavigationGroupProps>`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.1')};

  ${({ title }) =>
    title &&
    `
      margin-bottom: ${getToken('spacing.2')};
    `}
`;

const StyledNavigationGroupTitle = styled.h3`
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.muted.foreground')};
  text-transform: uppercase;
  letter-spacing: ${getToken('typography.letterSpacing.wide') || '0.025em'};
  margin: 0;
  padding: ${getToken('spacing.2')} ${getToken('spacing.3')};
`;

export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  (
    {
      variant = 'horizontal',
      size = 'md',
      orientation = 'horizontal',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledNavigation
        ref={ref}
        variant={variant}
        size={size}
        orientation={orientation}
        className={className}
        role="navigation"
        {...props}
      >
        {children}
      </StyledNavigation>
    );
  }
);

export const NavigationItem = React.forwardRef<
  HTMLAnchorElement,
  NavigationItemProps
>(
  (
    {
      active = false,
      disabled = false,
      icon,
      badge,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledNavigationItem
        ref={ref}
        active={active}
        disabled={disabled}
        className={className}
        {...props}
      >
        <Icon name={icon as any} size="sm" />
        <span>{children}</span>
        {badge && <StyledNavigationBadge>{badge}</StyledNavigationBadge>}
      </StyledNavigationItem>
    );
  }
);

export const NavigationGroup = React.forwardRef<
  HTMLDivElement,
  NavigationGroupProps
>(({ title, collapsed = false, className, children, ...props }, ref) => {
  return (
    <StyledNavigationGroup ref={ref} className={className} {...props}>
      {title && (
        <StyledNavigationGroupTitle>{title}</StyledNavigationGroupTitle>
      )}
      {!collapsed && children}
    </StyledNavigationGroup>
  );
});

Navigation.displayName = 'Navigation';
NavigationItem.displayName = 'NavigationItem';
NavigationGroup.displayName = 'NavigationGroup';
