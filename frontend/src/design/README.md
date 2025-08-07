# FinVision Design System

A comprehensive, unified design system for the FinVision financial modeling platform. This system provides consistent, accessible, and reusable components built with React, TypeScript, and Tailwind CSS.

## 🎯 Design Principles

- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG 2.1 AA compliant components
- **Flexibility**: Customizable variants and themes
- **Performance**: Optimized for production use
- **Developer Experience**: Type-safe props and comprehensive documentation

## 📁 Structure

```
src/
├── components/ui/           # Main UI components (source of truth)
│   ├── index.ts            # Unified export file
│   ├── button.tsx          # Button component
│   ├── card.tsx            # Card component
│   └── ...                 # Other components
├── design/                 # Design system organization
│   ├── components/ui/      # Re-exports from main components
│   │   └── index.ts        # Unified design system exports
│   ├── DesignSystem.stories.tsx  # Storybook overview
│   └── README.md           # This documentation
```

## 🧩 Component Categories

### 1. Foundation Components
Basic building blocks for user interfaces.

- **Button**: Primary interaction component with multiple variants
- **Input**: Text input with validation and styling
- **Label**: Form labels with accessibility features
- **Textarea**: Multi-line text input
- **Checkbox**: Selection control
- **Select**: Dropdown selection component
- **Slider**: Range input component
- **Switch**: Toggle control

### 2. Layout Components
Structural components for organizing content.

- **Card**: Content container with header, content, and footer
- **Tabs**: Tabbed interface for organizing content
- **Accordion**: Collapsible content sections
- **Separator**: Visual divider between content
- **AspectRatio**: Maintains aspect ratio for media

### 3. Navigation Components
Interactive navigation elements.

- **Menubar**: Horizontal menu navigation
- **NavigationMenu**: Complex navigation with dropdowns
- **DropdownMenu**: Contextual menu options
- **Breadcrumb**: Hierarchical navigation

### 4. Feedback Components
User feedback and status indicators.

- **Alert**: Status messages and notifications
- **Badge**: Small status indicators
- **Progress**: Progress indicators
- **Skeleton**: Loading placeholders
- **Toast**: Temporary notifications

### 5. Data Display Components
Components for presenting data.

- **Table**: Data table with sorting and pagination
- **Avatar**: User profile images
- **DataTable**: Enhanced table with advanced features

### 6. Overlay Components
Modal and popup components.

- **Dialog**: Modal dialogs
- **Popover**: Contextual overlays
- **Tooltip**: Hover information
- **Sheet**: Slide-out panels

### 7. Enhanced Components
Advanced components with additional features.

- **EnhancedButton**: Button with loading states and icons
- **EnhancedCard**: Card with metrics and trends
- **TextField**: Input with validation and error states
- **MultiSelect**: Multi-selection dropdown

## 🚀 Usage

### Basic Import
```tsx
import { Button, Card, Input } from '@/design/components/ui';
```

### Component Usage
```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/design/components/ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 🎨 Theming

The design system uses CSS custom properties for theming. Customize colors, spacing, and other design tokens in your Tailwind configuration.

### Color Palette
- **Primary**: Brand colors for main actions
- **Secondary**: Supporting colors for secondary actions
- **Accent**: Highlight colors for emphasis
- **Destructive**: Error and warning colors
- **Success**: Success state colors
- **Warning**: Warning state colors
- **Info**: Information state colors

### Typography
- **Font Family**: System fonts with fallbacks
- **Font Sizes**: Consistent scale from xs to 6xl
- **Font Weights**: Light, normal, medium, semibold, bold
- **Line Heights**: Optimized for readability

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: Meets accessibility standards
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper HTML structure

## 📚 Storybook

View all components in Storybook:

```bash
npm run storybook
```

The design system is organized into categories:
- **Design System/Overview**: Complete component showcase
- **Components**: Individual component documentation
- **Examples**: Real-world usage examples

## 🔧 Development

### Adding New Components

1. Create the component in `src/components/ui/`
2. Add exports to `src/components/ui/index.ts`
3. Add exports to `src/design/components/ui/index.ts`
4. Create Storybook stories
5. Update this documentation

### Component Guidelines

- Use TypeScript for type safety
- Include proper JSDoc comments
- Follow the established naming conventions
- Ensure accessibility compliance
- Add comprehensive Storybook documentation
- Include usage examples

### Testing

All components should have:
- Unit tests for functionality
- Accessibility tests
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
- Use Tailwind CSS classes
- Follow the established design tokens
- Ensure responsive design
- Maintain consistent spacing
- Use semantic color names

### Performance
- Lazy load when appropriate
- Optimize bundle size
- Use React.memo for expensive components
- Implement proper cleanup in effects

## 🤝 Contributing

1. Follow the established patterns
2. Add comprehensive documentation
3. Include usage examples
4. Test across different browsers
5. Ensure accessibility compliance
6. Update this documentation

## 📄 License

This design system is part of the FinVision platform and follows the same licensing terms. 