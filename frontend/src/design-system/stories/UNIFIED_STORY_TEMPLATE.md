# Unified Story Template (Optimized)

## Performance-Optimized Story Structure

```typescript
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../../path/to/component';
import {
  StoryBanner,
  StorySection,
  StoryCard,
  StoryGuidelines,
  StoryVariants,
  StoryPlayground,
  StorySizes,
  StoryUsage,
  createStoryMeta,
  storyIcons,
  commonArgTypes
} from '../shared';
import { Title, Stories } from '@storybook/blocks';

// Unified meta configuration
const meta: Meta<typeof ComponentName> = {
  ...createStoryMeta({
    title: 'ComponentName',
    component: ComponentName,
    category: 'atoms', // or 'molecules', 'organisms', etc.
  }),
  parameters: {
    ...createStoryMeta({} as any).parameters,
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <StoryBanner
            title="ComponentName"
            subtitle="Brief description of the component and its purpose in the design system."
            icon={storyIcons.atom}
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {
    ...commonArgTypes,
    // Component-specific argTypes
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Visual variant of the component'
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// OPTIMIZED STORIES
// ============================================================================

export const Variants: Story = {
  render: () => (
    <StorySection 
      title="Variants" 
      subtitle="Different visual styles available for this component"
    >
      <StoryVariants>
        <StoryCard title="Default">
          <ComponentName />
        </StoryCard>
        <StoryCard title="Primary">
          <ComponentName variant="primary" />
        </StoryCard>
        <StoryCard title="Secondary">
          <ComponentName variant="secondary" />
        </StoryCard>
      </StoryVariants>
    </StorySection>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StorySection 
      title="Sizes" 
      subtitle="Available size options"
    >
      <StorySizes
        items={[
          {
            name: 'Small',
            component: <ComponentName size="sm" />,
            description: 'Compact size for limited space'
          },
          {
            name: 'Medium', 
            component: <ComponentName size="md" />,
            description: 'Default size for most use cases'
          },
          {
            name: 'Large',
            component: <ComponentName size="lg" />, 
            description: 'Prominent size for emphasis'
          }
        ]}
      />
    </StorySection>
  ),
};

export const States: Story = {
  render: () => (
    <StorySection 
      title="Interactive States" 
      subtitle="How the component behaves in different states"
    >
      <StoryVariants>
        <StoryCard title="Normal">
          <ComponentName />
        </StoryCard>
        <StoryCard title="Disabled">
          <ComponentName disabled />
        </StoryCard>
        <StoryCard title="Loading">
          <ComponentName loading />
        </StoryCard>
      </StoryVariants>
    </StorySection>
  ),
};

export const Usage: Story = {
  render: () => (
    <StorySection 
      title="Usage Examples" 
      subtitle="Common implementation patterns"
    >
      <div className="space-y-6">
        <StoryUsage
          title="Basic Usage"
          code={`<ComponentName>Content</ComponentName>`}
        >
          <ComponentName>Basic Example</ComponentName>
        </StoryUsage>
        
        <StoryUsage
          title="With Props"
          code={`<ComponentName variant="primary" size="lg">
  Advanced Example
</ComponentName>`}
        >
          <ComponentName variant="primary" size="lg">
            Advanced Example
          </ComponentName>
        </StoryUsage>
      </div>
    </StorySection>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <StorySection 
      title="Usage Guidelines" 
      subtitle="Best practices for using this component"
    >
      <StoryGuidelines
        doItems={[
          'Use for primary actions in forms',
          'Maintain consistent spacing',
          'Use appropriate size for context'
        ]}
        dontItems={[
          'Use more than one primary variant per section',
          'Combine with conflicting colors',
          'Use without proper labels'
        ]}
      />
    </StorySection>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <StorySection 
      title="Interactive Playground" 
      subtitle="Experiment with different props and configurations"
    >
      <StoryPlayground description="Adjust the controls to see how the component responds">
        <ComponentName {...args} />
      </StoryPlayground>
    </StorySection>
  ),
  args: {
    children: 'Interactive Example',
    variant: 'default',
    size: 'md',
    disabled: false,
  },
};
```

## Key Improvements

### 1. Performance Optimizations
- ✅ **Lightweight imports**: Only import necessary components
- ✅ **Lazy loading**: Heavy components loaded on demand  
- ✅ **Memoization**: Prevent unnecessary re-renders
- ✅ **Tree shaking**: Better bundle optimization

### 2. Design Consistency
- ✅ **Unified meta creation**: Standardized story configuration
- ✅ **Consistent layout**: All stories follow same structure
- ✅ **Common argTypes**: Shared prop controls
- ✅ **Standard icons**: Reusable SVG icons

### 3. Developer Experience
- ✅ **Simple imports**: Single import for all story components
- ✅ **Type safety**: Full TypeScript support
- ✅ **Consistent patterns**: Predictable story structure
- ✅ **Easy customization**: Configurable components

### 4. Reduced Bundle Size
- ✅ **Modular components**: Import only what's needed
- ✅ **Optimized styles**: Minimal CSS classes
- ✅ **Lazy loading**: Heavy components loaded on demand
- ✅ **Better caching**: Improved component reuse

## Migration Guide

### Before (Heavy imports):
```typescript
import {
  SectionHeader,
  AnimatedBanner, 
  GuidelinesSection,
  GuidelinesCard,
  ColorPalette,
  SemanticColor,
  SurfaceColor,
  // ... 15+ more imports
} from '../components';
```

### After (Lightweight):
```typescript
import {
  StoryBanner,
  StorySection,
  StoryCard,
  StoryGuidelines,
  createStoryMeta,
  storyIcons
} from '../shared';
```

## Story Standards

1. **Always use `createStoryMeta()`** for consistent meta configuration
2. **Use shared story components** instead of custom implementations  
3. **Follow the 6-story pattern**: Variants, Sizes, States, Usage, Guidelines, Interactive
4. **Implement lazy loading** for heavy components
5. **Use memoization** for complex stories
6. **Include performance considerations** in story design