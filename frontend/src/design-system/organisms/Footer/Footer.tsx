import React from 'react';
import { Layout, Text, Icon } from '../../atoms';
import {
  FooterProps,
  FooterBrandProps,
  FooterLinksProps,
  FooterSocialProps,
  FooterBottomProps,
} from './Footer.types';

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    return (
      <Layout
        as="footer"
        layout="block"
        padding={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
        className={className}
        aria-label="Footer"
        {...props}
      >
        {children}
      </Layout>
    );
  }
);

export const FooterContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => {
  return (
    <Layout
      as="div"
      maxWidth="wide"
      centered
      padding="md"
      layout="grid"
      gridColumns={3}
      gap={8}
      className={className}
      {...props}
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        ...props.style,
      }}
      ref={ref}
    >
      {children}
    </Layout>
  );
});

export const FooterBrand = React.forwardRef<HTMLDivElement, FooterBrandProps>(
  ({ logo, alt, className, children, ...props }, ref) => {
    return (
      <Layout
        as="div"
        layout="flex"
        flexDirection="col"
        gap={4}
        className={className}
        {...props}
        ref={ref}
      >
        {logo && <img src={logo} alt={alt} style={{ height: '2rem', width: 'auto' }} />}
        {React.Children.map(children, child => {
          if (typeof child === 'string') {
            return (
              <Text as="p" variant="body" size="sm" color="muted">
                {child}
              </Text>
            );
          }
          return child;
        })}
      </Layout>
    );
  }
);

export const FooterLinks = React.forwardRef<HTMLDivElement, FooterLinksProps>(
  ({ title, links = [], className, ...props }, ref) => {
    return (
      <Layout
        as="div"
        layout="flex"
        flexDirection="col"
        gap={4}
        className={className}
        {...props}
        ref={ref}
      >
        {title && (
          <Text as="h3" variant="h3" size="lg" weight="semibold">
            {title}
          </Text>
        )}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                aria-label={link.label}
                style={{ textDecoration: 'none' }}
              >
                <Text as="span" variant="body" size="sm" color="muted">
                  {link.label}
                </Text>
              </a>
            </li>
          ))}
        </ul>
      </Layout>
    );
  }
);

export const FooterSocial = React.forwardRef<HTMLDivElement, FooterSocialProps>(
  ({ title, links = [], className, ...props }, ref) => {
    return (
      <Layout
        as="div"
        layout="flex"
        flexDirection="col"
        gap={4}
        className={className}
        {...props}
        ref={ref}
      >
        {title && (
          <Text as="h3" variant="h3" size="lg" weight="semibold">
            {title}
          </Text>
        )}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                aria-label={link.label}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Icon name={link.icon as any} size="sm" />
                <Text as="span" variant="body" size="sm" color="muted">
                  {link.label}
                </Text>
              </a>
            </li>
          ))}
        </ul>
      </Layout>
    );
  }
);

export const FooterBottom = React.forwardRef<HTMLDivElement, FooterBottomProps>(
  ({ copyright, links = [], className, ...props }, ref) => {
    return (
      <Layout
        as="div"
        layout="flex"
        flexJustify="between"
        flexAlign="center"
        flexWrap="wrap"
        gap={4}
        margin="none"
        className={className}
        style={{ borderTop: '1px solid var(--border-color, #e5e7eb)', paddingTop: '1.5rem', marginTop: '2rem' }}
        {...props}
        ref={ref}
      >
        {copyright && (
          <Text as="p" variant="body" size="sm" color="muted">
            {copyright}
          </Text>
        )}
        {links.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.label}
                  style={{ textDecoration: 'none' }}
                >
                  <Text as="span" variant="body" size="sm" color="muted">
                    {link.label}
                  </Text>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Layout>
    );
  }
);

Footer.displayName = 'Footer';
FooterContent.displayName = 'FooterContent';
FooterBrand.displayName = 'FooterBrand';
FooterLinks.displayName = 'FooterLinks';
FooterSocial.displayName = 'FooterSocial';
FooterBottom.displayName = 'FooterBottom';
