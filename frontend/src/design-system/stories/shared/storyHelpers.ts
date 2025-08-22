import { Meta, StoryObj } from '@storybook/react';

// Unified story configuration helper
export interface StoryConfig<T> {
  title: string;
  component: T;
  category: 'foundations' | 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages';
  subcategory?: string;
}

export function createStoryMeta<T>({ title, component, category, subcategory }: StoryConfig<T>): Meta<T> {
  const categoryMap = {
    foundations: '1 - Foundations',
    atoms: '2 - Atoms',
    molecules: '3 - Molecules',
    organisms: '4 - Organisms',
    templates: '5 - Templates',
    pages: '6 - Pages'
  };

  const fullTitle = subcategory 
    ? `${categoryMap[category]} / ${subcategory} / ${title}`
    : `${categoryMap[category]} / ${title}`;

  return {
    title: fullTitle,
    component,
    parameters: {
      layout: 'padded',
      docs: {
        autodocs: true,
      },
    },
    tags: ['autodocs'],
  } as Meta<T>;
}

// Standard story templates
export interface StoryTemplate<T> {
  Default: StoryObj<T>;
  Variants?: StoryObj<T>;
  Sizes?: StoryObj<T>;
  States?: StoryObj<T>;
  Usage?: StoryObj<T>;
  Guidelines?: StoryObj<T>;
  Interactive?: StoryObj<T>;
}

// Common SVG icons for stories (optimized)
export const storyIcons = {
  atom: React.createElement('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24', 
    className: 'w-full h-full' 
  }, React.createElement('path', { 
    strokeLinecap: 'round', 
    strokeLinejoin: 'round', 
    strokeWidth: 2, 
    d: 'M13 10V3L4 14h7v7l9-11h-7z' 
  })),
  
  molecule: React.createElement('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24', 
    className: 'w-full h-full' 
  }, React.createElement('path', { 
    strokeLinecap: 'round', 
    strokeLinejoin: 'round', 
    strokeWidth: 2, 
    d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' 
  })),
  
  organism: React.createElement('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24', 
    className: 'w-full h-full' 
  }, React.createElement('path', { 
    strokeLinecap: 'round', 
    strokeLinejoin: 'round', 
    strokeWidth: 2, 
    d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' 
  })),
  
  template: React.createElement('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24', 
    className: 'w-full h-full' 
  }, React.createElement('path', { 
    strokeLinecap: 'round', 
    strokeLinejoin: 'round', 
    strokeWidth: 2, 
    d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' 
  })),
  
  foundation: React.createElement('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24', 
    className: 'w-full h-full' 
  }, React.createElement('path', { 
    strokeLinecap: 'round', 
    strokeLinejoin: 'round', 
    strokeWidth: 2, 
    d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z' 
  }))
};

// Performance optimization: Lazy load heavy components
export const LazyColorPalette = React.lazy(() => 
  import('../components/ColorComponents').then(module => ({ default: module.ColorPalette }))
);

export const LazyUIComponents = React.lazy(() => 
  import('../components/UIComponents').then(module => ({ default: module.FormField }))
);

// Common story args for consistency
export const commonArgTypes = {
  className: {
    control: 'text',
    description: 'Additional CSS classes'
  },
  children: {
    control: 'text',
    description: 'Content to display'
  }
};

// Performance helper: Memoized story component
export function createMemoizedStory<T>(
  Component: React.ComponentType<T>,
  displayName: string
) {
  const MemoizedComponent = React.memo(Component);
  MemoizedComponent.displayName = displayName;
  return MemoizedComponent;
}

import React from 'react';