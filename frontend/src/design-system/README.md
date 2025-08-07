# FinVision Design System

A modern, accessible, and performant design system built specifically for financial applications. This system provides consistent components, comprehensive theming, and excellent developer experience.

## 🚀 Key Improvements

### Architecture

- **Unified Structure**: Single source of truth with centralized design system
- **Modern Patterns**: Enhanced component composition and prop patterns
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Performance**: Optimized bundle size and rendering performance

### Design System

- **Enhanced Tokens**: Comprehensive design tokens for colors, typography, spacing
- **Flexible Theming**: Runtime theme switching with CSS custom properties
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Responsive**: Mobile-first design with adaptive layouts

### Developer Experience

- **Better Documentation**: Comprehensive Storybook stories with examples
- **Improved Testing**: Enhanced accessibility and visual regression testing
- **Streamlined API**: Clean, consistent component interfaces
- **Modern Tooling**: Latest Storybook and build optimizations

## 📁 Structure

```
src/design-system/
├── index.ts              # Main entry point
├── provider.tsx          # Design system context provider
├── tokens.ts             # Design tokens and CSS variables
├── components/           # Enhanced component library
│   ├── Button.tsx        # Enhanced button with loading states
│   ├── Card.tsx          # Flexible card system
│   └── ...               # Other components
├── stories/              # Comprehensive Storybook stories
│   ├── DesignSystem.stories.tsx  # System overview
│   ├── Button.stories.tsx        # Button documentation
│   └── ...               # Component stories
└── README.md             # This documentation
```

## 🎨 Design Tokens

### Colors

- **Primary**: Brand colors for main actions
- **Secondary**: Supporting colors for secondary actions
- **Semantic**: Success, warning, error, info colors
- **Neutral**: Grayscale palette for text and backgrounds

### Typography

- **Font Families**: Inter (sans), JetBrains Mono (mono), Georgia (serif)
- **Font Sizes**: XS to 6XL with optimized line heights
- **Font Weights**: Light to Extra Bold

### Spacing

- **Consistent Scale**: 4px base unit with logical progression
- **Responsive**: Adapts to different screen sizes
- **Flexible**: Supports custom spacing when needed

### Border Radius

- **Multiple Options**: None, SM, MD, LG, XL, Full
- **Consistent**: Applied consistently across components
- **Accessible**: Meets contrast and touch target requirements

## 🧩 Components

### Button

Enhanced button component with:

- **9 Variants**: Default, secondary, outline, ghost, link, and semantic variants
- **5 Sizes**: XS, SM, MD, LG, XL with icon-only options
- **Loading States**: Built-in spinner with automatic disabling
- **Icon Support**: Left/right icons with automatic sizing
- **Accessibility**: Full keyboard navigation and ARIA support

### Card

Flexible card system with:

- **5 Variants**: Default, elevated, outline, ghost, interactive
- **Flexible Padding**: None, SM, MD, LG, XL options
- **Composition**: Header, content, footer with independent styling
- **Interactive**: Hover and focus states for clickable cards

## 🚀 Usage

### Basic Import

```tsx
import { Button, Card, DesignSystemProvider } from '@/design-system';
```

### Setup Provider

```tsx
import { DesignSystemProvider } from '@/design-system';

function App() {
  return (
    <DesignSystemProvider
      defaultTheme="light"
      defaultDensity="comfortable"
      defaultRadius="md"
    >
      <YourApp />
    </DesignSystemProvider>
  );
}
```

### Component Usage

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system';

function MyComponent() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Plus />}
          loading={isLoading}
        >
          Add Item
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 🎭 Theming

### Theme Switching

```tsx
import { useDesignSystem } from '@/design-system';

function ThemeToggle() {
  const { theme, setTheme } = useDesignSystem();

  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </Button>
  );
}
```

### Custom Theming

```css
/* Custom CSS variables */
:root {
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --background: #ffffff;
  --foreground: #0f172a;
}

[data-theme='dark'] {
  --primary: #60a5fa;
  --primary-foreground: #0f172a;
  --background: #0f172a;
  --foreground: #f8fafc;
}
```

## ♿ Accessibility

### Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels, roles, and descriptions
- **Color Contrast**: Meets WCAG AA contrast requirements
- **Focus Management**: Clear focus indicators and logical tab order
- **Semantic HTML**: Proper HTML structure and landmarks

### Best Practices

```tsx
// Always provide accessible labels
<Button aria-label="Add new item">
  <Plus />
</Button>

// Use semantic variants for meaning
<Button variant="destructive" aria-describedby="delete-help">
  Delete
</Button>
<p id="delete-help">This action cannot be undone</p>

// Support keyboard navigation
<Button onKeyDown={handleKeyDown}>
  Interactive Button
</Button>
```

## 🧪 Testing

### Storybook

```bash
# Start Storybook
npm run storybook

# Build for production
npm run build-storybook

# Run tests
npm run storybook:test
```

### Accessibility Testing

- Automated a11y checks with axe-core
- Color contrast validation
- Keyboard navigation testing
- Screen reader compatibility

### Visual Regression

- Chromatic integration for visual testing
- Responsive design validation
- Cross-browser compatibility

## 📚 Documentation

### Storybook Stories

- **Overview**: Complete system showcase
- **Components**: Individual component documentation
- **Examples**: Real-world usage patterns
- **Accessibility**: Testing and best practices

### API Documentation

- **Props**: Comprehensive prop documentation
- **Types**: TypeScript interfaces and types
- **Examples**: Code examples and patterns
- **Migration**: Upgrade guides and breaking changes

## 🔧 Development

### Adding Components

1. Create component in `src/design-system/components/`
2. Add to `src/design-system/index.ts` exports
3. Create Storybook stories
4. Add accessibility tests
5. Update documentation

### Component Guidelines

- Use TypeScript for type safety
- Include comprehensive JSDoc comments
- Follow established naming conventions
- Ensure accessibility compliance
- Add Storybook documentation
- Include usage examples

### Testing Requirements

- Unit tests for functionality
- Accessibility tests with axe-core
- Visual regression tests
- Integration tests for complex interactions

## 🎯 Best Practices

### Component Design

- Keep components focused and single-purpose
- Use composition over inheritance
- Provide sensible defaults
- Support customization through props
- Maintain backward compatibility

### Styling

- Use design tokens consistently
- Follow established patterns
- Ensure responsive design
- Maintain consistent spacing
- Use semantic color names

### Performance

- Lazy load when appropriate
- Optimize bundle size
- Use React.memo for expensive components
- Implement proper cleanup in effects

## 🤝 Contributing

1. Follow established patterns and conventions
2. Add comprehensive documentation
3. Include usage examples
4. Test across different browsers
5. Ensure accessibility compliance
6. Update this documentation

## 📄 License

This design system is part of the FinVision platform and follows the same licensing terms.

## 🔄 Migration Guide

### From Old Structure

1. Update imports to use `@/design-system`
2. Replace old component usage with new patterns
3. Update theme provider to use `DesignSystemProvider`
4. Test accessibility and functionality
5. Update any custom styling to use new tokens

### Breaking Changes

- Component prop interfaces have been enhanced
- Theme provider API has changed
- Some class names may have been updated
- Icon sizing has been standardized

For detailed migration instructions, see the migration guide in the documentation.
