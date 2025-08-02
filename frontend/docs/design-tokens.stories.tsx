import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  parameters: {
    docs: {
      description: {
        component: `
# Design Tokens

Design tokens are the foundation of the FinVision design system. They ensure consistency across all components and enable theming capabilities.

## Token Categories

- **Colors**: Semantic color system with light/dark mode support
- **Spacing**: Consistent spacing scale for layouts and components  
- **Typography**: Font sizes, weights, and line heights
- **Shadows**: Elevation system for depth and hierarchy
- **Borders**: Border radius and width values
- **Transitions**: Animation timing and easing functions

## Implementation

Tokens are implemented using Tailwind CSS custom properties and CSS variables, enabling runtime theming and easy customization.
        `,
      },
    },
  },
};

export default meta;

export const Colors: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              name: 'Primary',
              class: 'bg-primary',
              text: 'text-primary-foreground',
            },
            {
              name: 'Secondary',
              class: 'bg-secondary',
              text: 'text-secondary-foreground',
            },
            {
              name: 'Accent',
              class: 'bg-accent',
              text: 'text-accent-foreground',
            },
            { name: 'Muted', class: 'bg-muted', text: 'text-muted-foreground' },
          ].map(color => (
            <div key={color.name} className="space-y-2">
              <div
                className={`${color.class} ${color.text} p-4 rounded-md text-center font-medium`}
              >
                {color.name}
              </div>
              <p className="text-sm text-muted-foreground">{color.class}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Status Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: 'Destructive',
              class: 'bg-destructive',
              text: 'text-destructive-foreground',
            },
            {
              name: 'Success',
              class: 'bg-success',
              text: 'text-success-foreground',
            },
            {
              name: 'Warning',
              class: 'bg-warning',
              text: 'text-warning-foreground',
            },
          ].map(color => (
            <div key={color.name} className="space-y-2">
              <div
                className={`${color.class} ${color.text} p-4 rounded-md text-center font-medium`}
              >
                {color.name}
              </div>
              <p className="text-sm text-muted-foreground">{color.class}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Grayscale Colors</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Gray 100', css: 'var(--gray-100)', class: 'bg-gray-100' },
            { name: 'Gray 300', css: 'var(--gray-300)', class: 'bg-gray-300' },
            { name: 'Gray 500', css: 'var(--gray-500)', class: 'bg-gray-500' },
            { name: 'Gray 700', css: 'var(--gray-700)', class: 'bg-gray-700' },
            { name: 'Gray 900', css: 'var(--gray-900)', class: 'bg-gray-900' },
          ].map(color => (
            <div key={color.name} className="space-y-2">
              <div
                className={`h-16 rounded-md border`}
                style={{ backgroundColor: color.css }}
              />
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground">{color.css}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Chart Colors</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'Chart 1', css: 'var(--chart-1)' },
            { name: 'Chart 2', css: 'var(--chart-2)' },
            { name: 'Chart 3', css: 'var(--chart-3)' },
            { name: 'Chart 4', css: 'var(--chart-4)' },
            { name: 'Chart 5', css: 'var(--chart-5)' },
            { name: 'Chart 6', css: 'var(--chart-6)' },
            { name: 'Chart 7', css: 'var(--chart-7)' },
            { name: 'Chart 8', css: 'var(--chart-8)' },
          ].map(color => (
            <div key={color.name} className="space-y-2">
              <div
                className="h-16 rounded-md border"
                style={{ backgroundColor: color.css }}
              />
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground">{color.css}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Spacing: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Spacing Scale</h3>
      <div className="space-y-4">
        {[
          { name: '1', value: '0.25rem', class: 'w-1' },
          { name: '2', value: '0.5rem', class: 'w-2' },
          { name: '4', value: '1rem', class: 'w-4' },
          { name: '6', value: '1.5rem', class: 'w-6' },
          { name: '8', value: '2rem', class: 'w-8' },
          { name: '12', value: '3rem', class: 'w-12' },
          { name: '16', value: '4rem', class: 'w-16' },
          { name: '24', value: '6rem', class: 'w-24' },
        ].map(space => (
          <div key={space.name} className="flex items-center gap-4">
            <div className={`${space.class} h-4 bg-primary rounded`} />
            <span className="font-mono text-sm">{space.name}</span>
            <span className="text-sm text-muted-foreground">{space.value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Typography Scale</h3>
      <div className="space-y-4">
        {[
          { name: 'text-xs', example: 'Extra small text', class: 'text-xs' },
          { name: 'text-sm', example: 'Small text', class: 'text-sm' },
          { name: 'text-base', example: 'Base text', class: 'text-base' },
          { name: 'text-lg', example: 'Large text', class: 'text-lg' },
          { name: 'text-xl', example: 'Extra large text', class: 'text-xl' },
          { name: 'text-2xl', example: 'Heading text', class: 'text-2xl' },
          { name: 'text-3xl', example: 'Large heading', class: 'text-3xl' },
        ].map(type => (
          <div key={type.name} className="flex items-center gap-4">
            <div className={`${type.class} font-medium min-w-32`}>
              {type.example}
            </div>
            <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              {type.name}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};
