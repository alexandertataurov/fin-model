import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LandingPage } from './LandingPage';
import { Header, HeaderLogo, HeaderActions } from '../../organisms/Header';
import {
  Footer,
  FooterContent,
  FooterBrand,
  FooterLinks,
  FooterBottom,
} from '../../organisms/Footer';
import { Button } from '../../atoms';

const meta: Meta<typeof LandingPage> = {
  title: 'Templates / LandingPage',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'marketing', 'product'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export const Default: Story = {
  args: {
    header: (
      <Header variant="minimal">
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderActions>
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </HeaderActions>
      </Header>
    ),
    hero: (
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to MyApp
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#666' }}>
          The ultimate solution for modern web applications. Build faster, scale
          better, and deliver exceptional user experiences.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    ),
    features: (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Features</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Fast Performance</h3>
            <p>Lightning-fast loading times and smooth interactions.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Scalable Architecture</h3>
            <p>Built to grow with your business needs.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Modern Design</h3>
            <p>Beautiful, responsive design that works everywhere.</p>
          </div>
        </div>
      </div>
    ),
    testimonials: (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
          What Our Customers Say
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <p>"MyApp has transformed how we build applications."</p>
            <strong>- John Doe, CEO</strong>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <p>"The best development experience we've ever had."</p>
            <strong>- Jane Smith, CTO</strong>
          </div>
        </div>
      </div>
    ),
    pricing: (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Pricing</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          >
            <h3>Starter</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$9/month</p>
            <Button variant="outline">Choose Plan</Button>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
            }}
          >
            <h3>Pro</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$29/month</p>
            <Button>Choose Plan</Button>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          >
            <h3>Enterprise</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$99/month</p>
            <Button variant="outline">Choose Plan</Button>
          </div>
        </div>
      </div>
    ),
    contact: (
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Get in Touch</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          Ready to get started? Contact us today to learn more about how MyApp
          can help your business.
        </p>
        <Button size="lg">Contact Us</Button>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Building the future of web applications.</p>
          </FooterBrand>
          <FooterLinks title="Product" links={footerLinks} />
          <FooterLinks title="Company" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
    ),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    header: (
      <Header variant="minimal">
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderActions>
          <Button variant="outline">Sign In</Button>
        </HeaderActions>
      </Header>
    ),
    hero: (
      <div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Simple & Clean
        </h1>
        <p
          style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#666' }}
        >
          A minimal landing page focused on content and conversion.
        </p>
        <Button size="lg">Get Started</Button>
      </div>
    ),
    footer: (
      <Footer variant="minimal">
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Simple solutions for complex problems.</p>
          </FooterBrand>
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </Footer>
    ),
  },
};

export const Marketing: Story = {
  args: {
    variant: 'marketing',
    header: (
      <Header variant="minimal">
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderActions>
          <Button variant="outline">Sign In</Button>
          <Button>Start Free Trial</Button>
        </HeaderActions>
      </Header>
    ),
    hero: (
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Transform Your Business
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#666' }}>
          Join thousands of companies using MyApp to accelerate growth and
          improve efficiency.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button size="lg">Start Free Trial</Button>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>
      </div>
    ),
    features: (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Why Choose MyApp?
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>🚀 Lightning Fast</h3>
            <p>Built for speed and performance at scale.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>🛡️ Enterprise Security</h3>
            <p>Bank-level security for your peace of mind.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>📱 Mobile First</h3>
            <p>Perfect experience on every device.</p>
          </div>
        </div>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Empowering businesses to succeed.</p>
          </FooterBrand>
          <FooterLinks title="Product" links={footerLinks} />
          <FooterLinks title="Company" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
    ),
  },
};

export const Product: Story = {
  args: {
    variant: 'product',
    header: (
      <Header variant="minimal">
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderActions>
          <Button variant="outline">Documentation</Button>
          <Button>Download</Button>
        </HeaderActions>
      </Header>
    ),
    hero: (
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          The Developer's Choice
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#666' }}>
          A powerful toolkit for building modern web applications with ease and
          confidence.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button size="lg">Download Now</Button>
          <Button variant="outline" size="lg">
            View Documentation
          </Button>
        </div>
      </div>
    ),
    features: (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Key Features
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>TypeScript Support</h3>
            <p>Full TypeScript support with excellent type safety.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Component Library</h3>
            <p>Rich set of pre-built, accessible components.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Customizable</h3>
            <p>Highly customizable to match your brand and needs.</p>
          </div>
        </div>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Built by developers, for developers.</p>
          </FooterBrand>
          <FooterLinks title="Documentation" links={footerLinks} />
          <FooterLinks title="Community" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
    ),
  },
};

export const NoHeader: Story = {
  args: {
    hero: (
      <div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          No Header Layout
        </h1>
        <p
          style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#666' }}
        >
          This landing page has no header, providing a cleaner, more focused
          experience.
        </p>
        <Button size="lg">Get Started</Button>
      </div>
    ),
    footer: (
      <Footer variant="minimal">
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Simple and focused.</p>
          </FooterBrand>
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </Footer>
    ),
  },
};
