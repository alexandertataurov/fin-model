# Unified Design System

A comprehensive, unified design system that consolidates all components into one cohesive system for building financial applications.

## 🎯 Overview

This design system provides a single source of truth for all UI components, ensuring consistency, accessibility, and performance across the entire application.

## ✨ Key Features

- **🎨 Unified Components**: All components in one place with consistent APIs
- **♿ Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **📱 Responsive**: Mobile-first design with adaptive layouts
- **🎯 Type Safe**: Full TypeScript support with comprehensive prop validation
- **⚡ Performance**: Optimized for speed with minimal bundle impact
- **🎭 Theming**: Flexible theming system with light/dark mode support
- **🧪 Tested**: Comprehensive testing with accessibility and visual regression tests

## 🏗️ Architecture

```
frontend/src/design-system/
├── components/          # All UI components
│   ├── Button.tsx      # Enhanced button with variants
│   ├── Card.tsx        # Flexible card system
│   ├── Input.tsx       # Form inputs
│   ├── Badge.tsx       # Status indicators
│   ├── Alert.tsx       # Feedback messages
│   ├── Dialog.tsx      # Modal dialogs
│   ├── Select.tsx      # Dropdown selects
│   ├── Switch.tsx      # Toggle switches
│   ├── Checkbox.tsx    # Checkboxes
│   ├── Textarea.tsx    # Multi-line inputs
│   └── ...            # Additional components
├── stories/            # Storybook stories
│   ├── Button.stories.tsx
│   ├── Card.stories.tsx
│   ├── UnifiedDesignSystem.stories.tsx
│   └── ...
├── provider.tsx        # Design system provider
├── tokens.ts          # Design tokens
├── index.ts           # Main export file
└── README.md          # This file
```

## 🚀 Quick Start

### Installation

All components are available through the main export:

```tsx
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Alert,
  DesignSystemProvider 
} from '@/design-system';
```

### Setup Provider

Wrap your app with the DesignSystemProvider:

```tsx
import { DesignSystemProvider } from '@/design-system';

function App() {
  return (
    <DesignSystemProvider>
      <YourApp />
    </DesignSystemProvider>
  );
}
```

## 🧩 Component Categories

### Core Components
- **Button**: Primary interaction component with 9 variants and 5 sizes
- **Card**: Flexible container with 5 variants and customizable padding
- **Input**: Form input with validation states and icons
- **Label**: Accessible form labels
- **Badge**: Status indicators with semantic variants

### Form Components
- **Form**: React Hook Form integration with validation
- **Checkbox**: Accessible checkbox with custom styling
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection with search and grouping
- **Switch**: Toggle component with labels
- **RadioGroup**: Radio button groups

### Feedback Components
- **Alert**: Status messages with semantic variants
- **Dialog**: Modal dialogs with backdrop and focus management
- **Toast**: Notification system for user feedback
- **Tooltip**: Contextual information overlays

### Layout Components
- **Separator**: Visual dividers
- **Skeleton**: Loading state placeholders
- **Sheet**: Slide-out panels
- **Drawer**: Bottom sheet dialogs

### Navigation Components
- **Tabs**: Tabbed interface
- **Breadcrumb**: Navigation hierarchy
- **Pagination**: Page navigation
- **Command**: Command palette interface

### Data Display
- **Table**: Data tables with sorting and selection
- **Chart**: Data visualization components
- **Progress**: Progress indicators
- **Avatar**: User profile images

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

## 📝 Usage Examples

### Button Variants

```tsx
import { Button } from '@/design-system';

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button leftIcon={<Plus />}>Add Item</Button>
<Button rightIcon={<ArrowRight />}>Continue</Button>

// Loading state
<Button loading>Processing...</Button>
```

### Card System

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/design-system';

<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Components

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/design-system';

const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Enter your email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Alert System

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/design-system';

<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>
```

## 🎭 Theming

The design system supports comprehensive theming:

```tsx
import { DesignSystemProvider } from '@/design-system';

<DesignSystemProvider
  defaultTheme="light"
  defaultDensity="comfortable"
  defaultRadius="md"
>
  <YourApp />
</DesignSystemProvider>
```

### Theme Options
- **Theme**: `light`, `dark`, `system`
- **Density**: `compact`, `comfortable`, `spacious`
- **Radius**: `none`, `sm`, `md`, `lg`, `xl`

## ♿ Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG 2.1 AA compliant color ratios
- **Touch Targets**: Minimum 44px touch targets for mobile

## 🧪 Testing

### Storybook
Run Storybook to explore components:

```bash
npm run storybook
```

### Component Testing
Each component includes comprehensive tests:

```bash
npm test
```

### Accessibility Testing
Automated accessibility testing with axe-core:

```bash
npm run test:a11y
```

## 📚 Documentation

- **Component Stories**: Interactive examples in Storybook
- **API Reference**: TypeScript definitions for all props
- **Design Tokens**: Complete token system documentation
- **Migration Guide**: Upgrading from legacy components

## 🤝 Contributing

1. **Component Development**: Create new components in `components/`
2. **Story Creation**: Add stories in `stories/`
3. **Testing**: Include unit and accessibility tests
4. **Documentation**: Update README and component docs

## 📦 Bundle Size

The design system is optimized for minimal bundle impact:

- **Tree Shaking**: Only import what you use
- **Code Splitting**: Components are individually importable
- **CSS Optimization**: Tailwind CSS with PurgeCSS
- **Type Safety**: Zero runtime overhead for TypeScript

## 🔄 Migration

### From Legacy Components

```tsx
// Old
import { Button } from '@/components/ui/button';

// New
import { Button } from '@/design-system';
```

### From Multiple Providers

```tsx
// Old
import { ThemeProvider } from 'next-themes';
import { DesignSystemProvider } from '@/components/ui/DesignSystemProvider';

// New
import { DesignSystemProvider } from '@/design-system';
```

## 📄 License

This design system is part of the FinVision project and follows the same licensing terms.
