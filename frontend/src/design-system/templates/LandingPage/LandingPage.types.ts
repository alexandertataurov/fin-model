import React from 'react';

export interface LandingPageProps
  extends React.ComponentPropsWithoutRef<'div'> {
  header?: React.ReactNode;
  hero?: React.ReactNode;
  features?: React.ReactNode;
  testimonials?: React.ReactNode;
  pricing?: React.ReactNode;
  contact?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'default' | 'minimal' | 'marketing' | 'product';
  className?: string;
}

export interface LandingPageHeaderProps
  extends React.ComponentPropsWithoutRef<'header'> {
  className?: string;
}

export interface LandingPageHeroProps
  extends React.ComponentPropsWithoutRef<'section'> {
  className?: string;
}

export interface LandingPageSectionProps
  extends React.ComponentPropsWithoutRef<'section'> {
  className?: string;
}

export interface LandingPageFooterProps
  extends React.ComponentPropsWithoutRef<'footer'> {
  className?: string;
}

export interface LandingPageRef extends HTMLDivElement {}
