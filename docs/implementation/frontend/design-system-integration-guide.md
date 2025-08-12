# Design System Integration Guide

## Overview

This guide explains how to integrate the Storybook design system into your FinVision application. The design system provides consistent, accessible, and beautiful components that follow modern design principles.

## What's Been Integrated

### 1. Enhanced Design System Components

#### `EnhancedCard`

- **Purpose**: Advanced card component with multiple variants and interactive states
- **Features**:
  - Multiple variants: `default`, `outline`, `filled`, `interactive`
  - Interactive states: hover, selected, disabled
  - Header and footer sections
  - Consistent padding options
  - Smooth animations and transitions

```tsx
import { EnhancedCard, MetricCard, FeatureCard } from '@/components/ui';

// Basic usage
<EnhancedCard variant="default" padding="md">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</EnhancedCard>

// Interactive card
<EnhancedCard
  variant="interactive"
  hover={true}
  onClick={() => console.log('Card clicked')}
>
  <h3>Clickable Card</h3>
</EnhancedCard>

// Specialized cards
<MetricCard
  title="Revenue"
  value="$125,000"
  subtitle="This month"
  trend={{ value: 12, isPositive: true }}
  icon={<TrendingUp />}
  variant="success"
/>

<FeatureCard
  title="Analytics Dashboard"
  description="Advanced analytics and reporting tools"
  icon={<BarChart3 />}
  action={<Button>Learn More</Button>}
  variant="highlight"
/>
```

#### `EnhancedButton`

- **Purpose**: Advanced button component with enhanced variants and states
- **Features**:
  - Multiple variants: `default`, `success`, `warning`, `destructive`, `gradient`, `glass`
  - Loading states with spinners
  - Icon support (left/right)
  - Animation options
  - Full-width option

```tsx
import { EnhancedButton, ActionButton, IconButton, LoadingButton } from '@/components/ui';

// Basic usage
<EnhancedButton variant="default" size="lg">
  Click Me
</EnhancedButton>

// With icons
<EnhancedButton
  leftIcon={<Plus />}
  rightIcon={<ArrowRight />}
  variant="gradient"
>
  Create New
</EnhancedButton>

// Loading state
<LoadingButton
  loading={isLoading}
  onClick={handleSubmit}
  variant="success"
>
  Save Changes
</LoadingButton>

// Specialized buttons
<ActionButton
  icon={<Upload />}
  label="Upload File"
  onClick={handleUpload}
  variant="success"
/>

<IconButton
  icon={<Settings />}
  onClick={handleSettings}
  variant="ghost"
  tooltip="Settings"
/>
```

### 2. Design System Provider

The `DesignSystemProvider` provides access to design tokens and utilities throughout your application:

```tsx
import { DesignSystemProvider, useDesignSystem } from '@/components/ui';

// Wrap your app
function App() {
  return (
    <DesignSystemProvider>
      <YourApp />
    </DesignSystemProvider>
  );
}

// Use in components
function MyComponent() {
  const { tokens, DesignSystem, componentStyles } = useDesignSystem();

  return (
    <div style={{ padding: tokens.getSpacing('lg') }}>
      <h1 className={componentStyles.heading.h1}>Title</h1>
    </div>
  );
}
```

### 3. Design Tokens and Utilities

#### Available Design Tokens

- **Spacing**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- **Colors**: Semantic colors with light/dark mode support
- **Typography**: Font sizes, weights, and line heights
- **Shadows**: Elevation system for depth
- **Border Radius**: Consistent corner radius values
- **Transitions**: Animation timing and easing

#### Design System Utilities

```tsx
import { DesignSystem, componentStyles } from '@/components/ui/utils/designSystem';

// Button styles
const buttonClass = DesignSystem.button('primary', 'lg');

// Card styles
const cardClass = DesignSystem.card('default');

// Typography patterns
<h1 className={componentStyles.heading.h1}>Main Title</h1>
<h2 className={componentStyles.heading.h2}>Section Title</h2>

// Layout patterns
<div className={componentStyles.container}>
  <div className={componentStyles.flexCenter}>
    Content
  </div>
</div>
```

## Migration Guide

### Step 1: Update Existing Components

Replace basic components with enhanced versions:

```tsx
// Before
<Card className="p-6">
  <h3>Title</h3>
  <p>Content</p>
</Card>

// After
<EnhancedCard variant="default" padding="md">
  <h3>Title</h3>
  <p>Content</p>
</EnhancedCard>
```

### Step 2: Use Design System Patterns

Apply consistent styling patterns:

```tsx
// Before
<div className="max-w-7xl mx-auto px-4">
  <h1 className="text-3xl font-bold">Title</h1>
</div>

// After
<div className={componentStyles.container}>
  <h1 className={componentStyles.heading.h1}>Title</h1>
</div>
```

### Step 3: Implement Interactive States

Add hover and interactive states:

```tsx
// Before
<Card onClick={handleClick}>
  Content
</Card>

// After
<EnhancedCard
  variant="interactive"
  hover={true}
  onClick={handleClick}
>
  Content
</EnhancedCard>
```

## Best Practices

### 1. Consistent Spacing

Use design tokens for spacing instead of arbitrary values:

```tsx
// Good
<div className="p-6 space-y-4"> {/* Uses design tokens */}

// Better
<div className={cn(
  DesignSystem.spacing('p', 'lg'),
  'space-y-4'
)}>
```

### 2. Semantic Colors

Use semantic color names instead of specific color values:

```tsx
// Good
<div className="bg-blue-500 text-white">

// Better
<div className="bg-primary text-primary-foreground">
```

### 3. Responsive Design

Use the responsive grid utilities:

```tsx
const gridClass = DesignSystem.responsiveGrid({
  base: 1,
  sm: 2,
  md: 3,
  lg: 4,
});
```

### 4. Accessibility

All enhanced components include proper accessibility features:

- Focus management
- ARIA labels
- Keyboard navigation
- Screen reader support

## Component Examples

### Dashboard Layout

```tsx
import { EnhancedCard, MetricCard, componentStyles } from '@/components/ui';

function Dashboard() {
  return (
    <div className={componentStyles.container}>
      <header className="mb-8">
        <h1 className={componentStyles.heading.h1}>Dashboard</h1>
        <p className="text-muted-foreground">Overview of your financial data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Revenue"
          value="$125,000"
          trend={{ value: 12, isPositive: true }}
          icon={<TrendingUp />}
          variant="success"
        />
        <MetricCard
          title="Expenses"
          value="$85,000"
          trend={{ value: 8, isPositive: false }}
          icon={<TrendingDown />}
          variant="warning"
        />
        <MetricCard
          title="Profit"
          value="$40,000"
          trend={{ value: 15, isPositive: true }}
          icon={<DollarSign />}
          variant="info"
        />
      </div>

      <EnhancedCard variant="default">
        <h2 className={componentStyles.heading.h2}>Recent Activity</h2>
        {/* Chart or table content */}
      </EnhancedCard>
    </div>
  );
}
```

### Form Components

```tsx
import { EnhancedButton, LoadingButton } from '@/components/ui';

function Form() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      <div className="flex gap-4">
        <LoadingButton
          loading={isLoading}
          onClick={handleSubmit}
          variant="success"
        >
          Save Changes
        </LoadingButton>

        <EnhancedButton variant="outline" onClick={handleCancel}>
          Cancel
        </EnhancedButton>
      </div>
    </form>
  );
}
```

## Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { EnhancedCard, EnhancedButton } from '@/components/ui';

test('EnhancedCard renders with correct variant', () => {
  render(
    <EnhancedCard variant="outline" data-testid="card">
      Content
    </EnhancedCard>
  );

  const card = screen.getByTestId('card');
  expect(card).toHaveClass('border');
});

test('EnhancedButton shows loading state', () => {
  render(
    <LoadingButton loading={true} onClick={() => {}}>
      Submit
    </LoadingButton>
  );

  expect(screen.getByRole('button')).toBeDisabled();
});
```

## Troubleshooting

### Common Issues

1. **Design tokens not working**

   - Ensure `DesignSystemProvider` wraps your app
   - Check that CSS variables are properly defined in `globals.css`

2. **Components not styled correctly**

   - Verify Tailwind classes are included in `tailwind.config.js`
   - Check that design tokens are properly imported

3. **Theme switching issues**
   - Ensure `next-themes` is properly configured
   - Check that CSS variables have both light and dark mode values

### Performance Optimization

1. **Bundle size**: Design tokens are tree-shakeable
2. **CSS variables**: Runtime theme switching without re-renders
3. **Component composition**: Reuse existing components instead of creating new ones

## Next Steps

1. **Update remaining components** to use the design system
2. **Create custom variants** for specific use cases
3. **Add more specialized components** as needed
4. **Implement design token validation** in CI/CD
5. **Create component documentation** with Storybook

## Resources

- [Design Tokens Implementation](./DESIGN_TOKENS_IMPLEMENTATION.md)
- [Storybook Design System Showcase](./design-system-showcase.stories.tsx)
- [Color System Documentation](./color-tokens.stories.tsx)
- [Accessibility Guidelines](./accessibility.stories.tsx)
