import React from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import {
  LandingPageProps,
  LandingPageHeaderProps,
  LandingPageHeroProps,
  LandingPageSectionProps,
  LandingPageFooterProps,
} from './LandingPage.types';

const StyledLandingPage = styled.div<LandingPageProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${getToken('colors.background')};

  ${({ variant = 'default' }) => {
    const variants = {
      default: '',
      minimal: `
        background-color: ${getToken('colors.muted.50')};
      `,
      marketing: `
        background-color: ${getToken('colors.background')};
      `,
      product: `
        background-color: ${getToken('colors.muted.50')};
      `,
    };
    return variants[variant];
  }}
`;

const StyledHeader = styled.header<LandingPageHeaderProps>`
  background-color: ${getToken('colors.background')};
  border-bottom: ${getToken('borderWidths.1')} solid
    ${getToken('colors.border')};
  z-index: 100;
  position: sticky;
  top: 0;
`;

const StyledHero = styled.section<LandingPageHeroProps>`
  background-color: ${getToken('colors.background')};
  padding: ${getToken('space.20')} 0;

  @media (max-width: 768px) {
    padding: ${getToken('space.12')} 0;
  }
`;

const StyledSection = styled.section<LandingPageSectionProps>`
  padding: ${getToken('space.16')} 0;

  @media (max-width: 768px) {
    padding: ${getToken('space.12')} 0;
  }

  &:nth-child(even) {
    background-color: ${getToken('colors.muted.50')};
  }
`;

const StyledFooter = styled.footer<LandingPageFooterProps>`
  background-color: ${getToken('colors.background')};
  border-top: ${getToken('borderWidths.1')} solid ${getToken('colors.border')};
  margin-top: auto;
`;

export const LandingPage = React.forwardRef<HTMLDivElement, LandingPageProps>(
  (
    {
      header,
      hero,
      features,
      testimonials,
      pricing,
      contact,
      footer,
      children,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <StyledLandingPage
        ref={ref}
        variant={variant}
        className={className}
        {...props}
      >
        {header && <StyledHeader>{header}</StyledHeader>}

        {hero && <StyledHero>{hero}</StyledHero>}

        {features && <StyledSection>{features}</StyledSection>}

        {testimonials && <StyledSection>{testimonials}</StyledSection>}

        {pricing && <StyledSection>{pricing}</StyledSection>}

        {contact && <StyledSection>{contact}</StyledSection>}

        {children}

        {footer && <StyledFooter>{footer}</StyledFooter>}
      </StyledLandingPage>
    );
  }
);

export const LandingPageHeader = React.forwardRef<
  HTMLElement,
  LandingPageHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <header ref={ref} className={className} {...props}>
      {children}
    </header>
  );
});

export const LandingPageHero = React.forwardRef<
  HTMLElement,
  LandingPageHeroProps
>(({ className, children, ...props }, ref) => {
  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  );
});

export const LandingPageSection = React.forwardRef<
  HTMLElement,
  LandingPageSectionProps
>(({ className, children, ...props }, ref) => {
  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  );
});

export const LandingPageFooter = React.forwardRef<
  HTMLElement,
  LandingPageFooterProps
>(({ className, children, ...props }, ref) => {
  return (
    <footer ref={ref} className={className} {...props}>
      {children}
    </footer>
  );
});

LandingPage.displayName = 'LandingPage';
LandingPageHeader.displayName = 'LandingPageHeader';
LandingPageHero.displayName = 'LandingPageHero';
LandingPageSection.displayName = 'LandingPageSection';
LandingPageFooter.displayName = 'LandingPageFooter';
