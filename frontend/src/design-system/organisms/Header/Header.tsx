import React from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Icon } from '../../atoms/Icon';
import { ImageWithFallback } from '../../../components/molecules/ImageWithFallback';
import {
  HeaderProps,
  HeaderLogoProps,
  HeaderNavigationProps,
  HeaderActionsProps,
} from './Header.types';
import {
  headerVariants,
  headerLogoVariants,
  headerNavigationVariants,
  navItemVariants,
} from './Header.variants';

const StyledHeader = styled.header<{
  $variant: string;
  $size: string;
  $sticky: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  ${({ $variant, $size, $sticky }) =>
    headerVariants({ variant: $variant, size: $size, sticky: $sticky })}
`;

const StyledHeaderLogo = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};

  ${({ $size }) => headerLogoVariants({ size: $size })}
`;

const StyledLogoImage = styled(ImageWithFallback)`
  height: ${getToken('spacing.8')};
  width: auto;
`;

const StyledHeaderNavigation = styled.nav<{ $size: string }>`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ${({ $size }) => headerNavigationVariants({ size: $size })}
`;

const StyledNavItem = styled.a<{ $active: boolean; $size: string }>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
  border-radius: ${getToken('borderRadius.md')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  text-decoration: none;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  ${({ $active, $size }) =>
    navItemVariants({ state: $active ? 'active' : 'inactive', size: $size })}

  &:hover {
    background-color: ${getToken('colors.muted')};
    color: ${getToken('colors.foreground')};
  }

  svg {
    width: ${getToken('spacing.4')};
    height: ${getToken('spacing.4')};
  }
`;

const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledMobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  padding: ${getToken('spacing.2')};
  border: none;
  background: none;
  border-radius: ${getToken('borderRadius.md')};
  color: ${getToken('colors.muted.foreground')};
  cursor: pointer;

  &:hover {
    background-color: ${getToken('colors.muted')};
    color: ${getToken('colors.foreground')};
  }

  @media (max-width: 768px) {
    display: flex;
  }

  svg {
    width: ${getToken('spacing.5')};
    height: ${getToken('spacing.5')};
  }
`;

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      variant = 'default',
      size = 'md',
      sticky = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledHeader
        ref={ref}
        $variant={variant}
        $size={size}
        $sticky={sticky}
        className={className}
        {...props}
      >
        {children}
      </StyledHeader>
    );
  }
);

export const HeaderLogo = React.forwardRef<
  HTMLDivElement,
  HeaderLogoProps & { size?: string }
>(({ src, alt, className, children, size = 'md', ...props }, ref) => {
  return (
    <StyledHeaderLogo ref={ref} $size={size} className={className} {...props}>
      {src && (
        <StyledLogoImage
          src={src}
          alt={alt}
          fallback="/images/logo-fallback.png"
          onError={() => console.warn(`Failed to load logo: ${src}`)}
        />
      )}
      {children}
    </StyledHeaderLogo>
  );
});

export const HeaderNavigation = React.forwardRef<
  HTMLElement,
  HeaderNavigationProps & { size?: string }
>(({ items = [], className, size = 'md', ...props }, ref) => {
  return (
    <StyledHeaderNavigation
      ref={ref}
      $size={size}
      className={className}
      {...props}
    >
      {items.map((item, index) => (
        <StyledNavItem
          key={index}
          href={item.href}
          $active={item.active || false}
          $size={size}
        >
          {item.icon && typeof item.icon === 'string' ? <Icon name={item.icon} /> : item.icon}
          {item.label}
        </StyledNavItem>
      ))}
    </StyledHeaderNavigation>
  );
});

export const HeaderActions = React.forwardRef<
  HTMLDivElement,
  HeaderActionsProps
>(({ className, children, ...props }, ref) => {
  return (
    <StyledHeaderActions ref={ref} className={className} {...props}>
      {children}
    </StyledHeaderActions>
  );
});

export const HeaderMobileMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, children, ...props }, ref) => {
  return (
    <StyledMobileMenuButton
      ref={ref}
      className={className}
      aria-label="Toggle mobile menu"
      {...props}
    >
      {children || <Icon name="menu" size="md" />}
    </StyledMobileMenuButton>
  );
});

Header.displayName = 'Header';
HeaderLogo.displayName = 'HeaderLogo';
HeaderNavigation.displayName = 'HeaderNavigation';
HeaderActions.displayName = 'HeaderActions';
HeaderMobileMenuButton.displayName = 'HeaderMobileMenuButton';
