import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Footer,
  FooterContent,
  FooterBrand,
  FooterLinks,
  FooterSocial,
  FooterBottom,
} from '../../organisms/Footer/Footer';
import { Text, Icon } from '../../atoms';

const meta: Meta<typeof Footer> = {
  title: 'Organisms / Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'elevated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const productLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Documentation', href: '/docs' },
  { label: 'API Reference', href: '/api' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

const socialLinks = [
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: 'twitter',
    external: true,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: 'facebook',
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: 'instagram',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: 'linkedin',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: 'github',
    external: true,
  },
];

export const Default: Story = {
  args: {
    children: (
      <>
        <FooterContent>
          <FooterBrand>
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">
              Building the future of web applications with modern design and powerful features.
            </Text>
          </FooterBrand>
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterSocial title="Follow us" links={socialLinks.map(l => ({ ...l, icon: <Icon name={l.icon.charAt(0).toUpperCase() + l.icon.slice(1)} size="sm" /> }))} />
        </FooterContent>
        <FooterBottom
          copyright="© 2024 MyApp. All rights reserved."
          links={legalLinks}
        />
      </>
    ),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    children: (
      <>
        <FooterContent>
          <FooterBrand>
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">Simple and clean footer design.</Text>
          </FooterBrand>
          <FooterLinks title="Links" links={productLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <FooterContent>
          <FooterBrand>
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">Elevated footer with enhanced visual presence.</Text>
          </FooterBrand>
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterSocial title="Social" links={socialLinks.map(l => ({ ...l, icon: <Icon name={l.icon.charAt(0).toUpperCase() + l.icon.slice(1)} size="sm" /> }))} />
        </FooterContent>
        <FooterBottom
          copyright="© 2024 MyApp. All rights reserved."
          links={legalLinks}
        />
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <>
        <FooterContent>
          <FooterBrand>
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">Compact footer design.</Text>
          </FooterBrand>
          <FooterLinks title="Links" links={productLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <FooterContent>
          <FooterBrand>
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">Large footer with generous spacing and comprehensive content.</Text>
          </FooterBrand>
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterSocial title="Follow us" links={socialLinks.map(l => ({ ...l, icon: <Icon name={l.icon.charAt(0).toUpperCase() + l.icon.slice(1)} size="sm" /> }))} />
        </FooterContent>
        <FooterBottom
          copyright="© 2024 MyApp. All rights reserved."
          links={legalLinks}
        />
      </>
    ),
  },
};

export const WithLogo: Story = {
  args: {
    children: (
      <>
        <FooterContent>
          <FooterBrand logo="/logo.png" alt="Company Logo">
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">
              Building the future of web applications with modern design and powerful features.
            </Text>
          </FooterBrand>
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterSocial title="Follow us" links={socialLinks.map(l => ({ ...l, icon: <Icon name={l.icon.charAt(0).toUpperCase() + l.icon.slice(1)} size="sm" /> }))} />
        </FooterContent>
        <FooterBottom
          copyright="© 2024 MyApp. All rights reserved."
          links={legalLinks}
        />
      </>
    ),
  },
};

export const SocialOnly: Story = {
  args: {
    children: (
      <>
        <FooterContent>
          <FooterBrand>
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">Connect with us on social media.</Text>
          </FooterBrand>
          <FooterSocial title="Follow us" links={socialLinks.map(l => ({ ...l, icon: <Icon name={l.icon.charAt(0).toUpperCase() + l.icon.slice(1)} size="sm" /> }))} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </>
    ),
  },
};

export const LinksOnly: Story = {
  args: {
    children: (
      <>
        <FooterContent>
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterLinks title="Legal" links={legalLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </>
    ),
  },
};

export const BrandOnly: Story = {
  args: {
    children: (
      <>
        <FooterContent>
          <FooterBrand>
            <Text as="h2" variant="h2" size="xl" weight="bold">MyApp</Text>
            <Text as="p" variant="body" size="md" color="muted">Simple brand-focused footer.</Text>
          </FooterBrand>
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </>
    ),
  },
};
