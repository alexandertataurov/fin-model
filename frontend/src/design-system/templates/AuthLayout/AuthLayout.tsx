import React, { useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { Icon } from '../../atoms/Icon';
import {
  AuthLayoutProps,
  AuthLayoutRef,
  AuthLayoutContextValue,
} from './AuthLayout.types';
import { authLayoutVariants, authContentVariants } from './AuthLayout.variants';

const AuthLayoutContext = React.createContext<AuthLayoutContextValue | null>(
  null
);

const useAuthLayoutContext = () => {
  const context = React.useContext(AuthLayoutContext);
  if (!context) {
    throw new Error('AuthLayout components must be used within an AuthLayout');
  }
  return context;
};

const StyledAuthLayout = styled.div<{
  $variant: string;
  $size: string;
  $centered: boolean;
}>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  ${({ $variant, $size, $centered }) =>
    authLayoutVariants({ variant: $variant, size: $size, centered: $centered })}
`;

const StyledAuthHeader = styled.header<{ $variant: string; $size: string }>`
  flex-shrink: 0;
  z-index: 10;
`;

const StyledAuthMain = styled.main<{
  $variant: string;
  $size: string;
  $centered: boolean;
}>`
  flex: 1;
  display: flex;
  align-items: ${({ $centered }) => ($centered ? 'center' : 'flex-start')};
  justify-content: center;
  padding: ${getToken('spacing.8')} ${getToken('spacing.4')};
  min-height: ${({ $centered }) => ($centered ? '100vh' : 'auto')};
`;

const StyledAuthContent = styled.div<{
  $variant: string;
  $size: string;
  $centered: boolean;
}>`
  width: 100%;
  max-width: ${getToken('spacing.96')};
  ${({ $variant, $size, $centered }) =>
    authContentVariants({
      variant: $variant,
      size: $size,
      centered: $centered,
    })}
`;

const StyledAuthCard = styled.div<{ $variant: string; $size: string }>`
  width: 100%;
  background-color: ${getToken('colors.background')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  border-radius: ${getToken('borderRadius.lg')};
  box-shadow: ${getToken('shadows.lg')};
  overflow: hidden;
`;

const StyledAuthCardHeader = styled.div<{ $variant: string; $size: string }>`
  padding: ${getToken('spacing.6')} ${getToken('spacing.6')}
    ${getToken('spacing.4')};
  text-align: center;
  border-bottom: ${getToken('borderWidth.sm')} solid
    ${getToken('colors.border')};
  background-color: ${getToken('colors.muted')};
`;

const StyledAuthLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledAuthLogoIcon = styled.div`
  width: ${getToken('spacing.12')};
  height: ${getToken('spacing.12')};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${getToken('colors.primary')};
  color: ${getToken('colors.primary.foreground')};
  border-radius: ${getToken('borderRadius.lg')};
  margin-right: ${getToken('spacing.3')};
`;

const StyledAuthLogoText = styled.div`
  font-size: ${getToken('typography.fontSize.xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
`;

const StyledAuthTitle = styled.h1`
  font-size: ${getToken('typography.fontSize.2xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
  margin: 0 0 ${getToken('spacing.2')} 0;
`;

const StyledAuthSubtitle = styled.p`
  font-size: ${getToken('typography.fontSize.base')};
  color: ${getToken('colors.muted.foreground')};
  margin: 0;
  line-height: ${getToken('typography.lineHeight.relaxed')};
`;

const StyledAuthBody = styled.div<{ $variant: string; $size: string }>`
  padding: ${getToken('spacing.6')};
`;

const StyledAuthFooter = styled.div<{ $variant: string; $size: string }>`
  padding: ${getToken('spacing.4')} ${getToken('spacing.6')}
    ${getToken('spacing.6')};
  text-align: center;
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  background-color: ${getToken('colors.muted')};
`;

const StyledAuthFooterText = styled.p`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
  margin: 0 0 ${getToken('spacing.3')} 0;
`;

const StyledAuthFooterLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${getToken('spacing.4')};
  flex-wrap: wrap;
`;

const StyledAuthFooterLink = styled.button`
  background: none;
  border: none;
  color: ${getToken('colors.primary')};
  font-size: ${getToken('typography.fontSize.sm')};
  text-decoration: underline;
  cursor: pointer;
  transition: color ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:hover {
    color: ${getToken('colors.primary.foreground')};
  }

  &:focus {
    outline: 2px solid ${getToken('colors.primary')};
    outline-offset: 2px;
  }
`;

const StyledAuthBackground = styled.div<{ $variant: string; $size: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: linear-gradient(
    135deg,
    ${getToken('colors.primary')} 0%,
    ${getToken('colors.primary.foreground')} 100%
  );
  opacity: 0.1;
`;

const StyledAuthBackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(
      circle at 25% 25%,
      ${getToken('colors.primary')} 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 75% 75%,
      ${getToken('colors.primary.foreground')} 0%,
      transparent 50%
    );
  opacity: 0.05;
`;

const AuthLayout = React.forwardRef<AuthLayoutRef, AuthLayoutProps>(
  (
    {
      title,
      subtitle,
      logo,
      logoText,
      variant = 'default',
      size = 'md',
      centered = true,
      showHeader = true,
      showFooter = true,
      showBackground = true,
      headerProps,
      footerProps,
      onLogoClick,
      onFooterLinkClick,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Handle logo click
    const handleLogoClick = useCallback(() => {
      onLogoClick?.();
    }, [onLogoClick]);

    // Handle footer link click
    const handleFooterLinkClick = useCallback(
      (link: string) => {
        onFooterLinkClick?.(link);
      },
      [onFooterLinkClick]
    );

    const contextValue: AuthLayoutContextValue = {
      title,
      subtitle,
      logo,
      logoText,
      variant,
      size,
      centered,
      onLogoClick: handleLogoClick,
      onFooterLinkClick: handleFooterLinkClick,
    };

    return (
      <AuthLayoutContext.Provider value={contextValue}>
        <StyledAuthLayout
          ref={ref}
          $variant={variant}
          $size={size}
          $centered={centered}
          className={className}
          style={style}
          {...props}
        >
          {/* Background */}
          {showBackground && (
            <StyledAuthBackground $variant={variant} $size={size}>
              <StyledAuthBackgroundPattern />
            </StyledAuthBackground>
          )}

          {/* Header */}
          {showHeader && (
            <StyledAuthHeader $variant={variant} $size={size}>
              <Header
                variant={variant}
                size={size}
                logo={logo}
                logoText={logoText}
                onLogoClick={handleLogoClick}
                {...headerProps}
              />
            </StyledAuthHeader>
          )}

          {/* Main Content */}
          <StyledAuthMain $variant={variant} $size={size} $centered={centered}>
            <StyledAuthContent
              $variant={variant}
              $size={size}
              $centered={centered}
            >
              <StyledAuthCard $variant={variant} $size={size}>
                {/* Auth Header */}
                <StyledAuthCardHeader $variant={variant} $size={size}>
                  {logo && (
                    <StyledAuthLogo>
                      <StyledAuthLogoIcon>
                        <Icon name={logo} size="lg" />
                      </StyledAuthLogoIcon>
                      {logoText && (
                        <StyledAuthLogoText>{logoText}</StyledAuthLogoText>
                      )}
                    </StyledAuthLogo>
                  )}

                  {title && <StyledAuthTitle>{title}</StyledAuthTitle>}

                  {subtitle && (
                    <StyledAuthSubtitle>{subtitle}</StyledAuthSubtitle>
                  )}
                </StyledAuthCardHeader>

                {/* Auth Body */}
                <StyledAuthBody $variant={variant} $size={size}>
                  {children}
                </StyledAuthBody>

                {/* Auth Footer */}
                {showFooter && (
                  <StyledAuthFooter $variant={variant} $size={size}>
                    <StyledAuthFooterText>
                      By continuing, you agree to our Terms of Service and
                      Privacy Policy.
                    </StyledAuthFooterText>

                    <StyledAuthFooterLinks>
                      <StyledAuthFooterLink
                        onClick={() => handleFooterLinkClick('terms')}
                      >
                        Terms of Service
                      </StyledAuthFooterLink>

                      <StyledAuthFooterLink
                        onClick={() => handleFooterLinkClick('privacy')}
                      >
                        Privacy Policy
                      </StyledAuthFooterLink>

                      <StyledAuthFooterLink
                        onClick={() => handleFooterLinkClick('help')}
                      >
                        Help
                      </StyledAuthFooterLink>
                    </StyledAuthFooterLinks>
                  </StyledAuthFooter>
                )}
              </StyledAuthCard>
            </StyledAuthContent>
          </StyledAuthMain>

          {/* Footer */}
          {showFooter && (
            <Footer variant={variant} size={size} {...footerProps} />
          )}
        </StyledAuthLayout>
      </AuthLayoutContext.Provider>
    );
  }
);

AuthLayout.displayName = 'AuthLayout';

export { AuthLayout, useAuthLayoutContext };
