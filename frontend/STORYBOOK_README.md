# Storybook Documentation

This project includes a comprehensive Storybook setup for documenting and testing our design system and application components.

## 🚀 Quick Start

### Running Storybook

```bash
# Development mode
npm run storybook

# Build for production
npm run build-storybook

# Fast development mode (with increased memory)
npm run storybook:fast

# Clean cache and restart
npm run storybook:clean
```

### Available Scripts

- `storybook` - Start Storybook in development mode
- `build-storybook` - Build Storybook for production
- `storybook:fast` - Start with increased memory allocation
- `storybook:clean` - Clear cache and restart
- `storybook:analyze` - Analyze bundle size
- `storybook:test` - Run Storybook tests
- `storybook:test:ci` - Run tests in CI mode

## 📁 Story Structure

Our Storybook is organized into the following sections:

### Design System (`/design-system`)
Core UI components that form the foundation of our design system:

- **Button** - Interactive buttons with multiple variants
- **Input** - Form input components
- **Card** - Content containers with header, content, and footer
- **Badge** - Status indicators and labels
- **Avatar** - User representation
- **Overview** - Complete design system documentation

### Components (`/components`)
Application-specific components organized by feature:

- **Auth** - Authentication-related components
  - `AuthGuard` - Route protection components
  - `BiometricLogin` - Biometric authentication
  - `EmailVerification` - Email verification flows
  - `ForgotPasswordForm` - Password recovery
  - `ResetPasswordForm` - Password reset

- **FileUpload** - File handling components
  - `FileUploadDropzone` - Drag and drop file upload
  - `FileList` - File management interface
  - `FilePreview` - File content preview
  - `ProcessingProgress` - Upload/processing status
  - `StatementSelector` - Financial statement assignment
  - `ExcelProcessingWorkflow` - Complete workflow

- **Charts** - Data visualization components
- **Dashboard** - Dashboard-specific components
- **Parameters** - Parameter management components
- **Scenarios** - Scenario analysis components

## 🎨 Design System

### Color Palette

Our design system uses a carefully crafted color palette optimized for financial data:

- **Primary** - `#0f172a` - Main brand color
- **Secondary** - `#f1f5f9` - Supporting elements
- **Accent** - `#f8fafc` - Highlighted content
- **Destructive** - `#ef4444` - Error states
- **Success** - `#22c55e` - Positive states
- **Warning** - `#f59e0b` - Caution states

### Typography

- **Headings** - Clear hierarchy with consistent sizing
- **Body Text** - Optimized for readability
- **Monospace** - For financial data and code

### Spacing

Consistent 4px base unit system:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px
- `space-16`: 64px

## 🔧 Configuration

### Main Configuration (`.storybook/main.ts`)

- **Framework**: React with Vite
- **Addons**: Essentials, A11y, Interactions, Links
- **Stories**: Auto-discovery from `src/design-system` and `src/components`
- **TypeScript**: Full support with docgen
- **Path Aliases**: Configured for `@/` imports

### Preview Configuration (`.storybook/preview.tsx`)

- **Global Decorators**: DesignSystemProvider wrapper
- **Parameters**: A11y, viewport, backgrounds
- **Global Styles**: Tailwind CSS integration
- **Theme Support**: Light/dark mode

### Manager Configuration (`.storybook/manager.ts`)

- **Custom Theme**: Branded Storybook interface
- **Sidebar Styling**: Enhanced navigation
- **Performance**: Optimized for large component libraries

## 📝 Writing Stories

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};
```

### Story Organization

1. **Basic Stories** - Default, simple usage
2. **Variants** - Different component states
3. **Interactive** - User interactions
4. **Complex** - Real-world usage examples
5. **Edge Cases** - Error states, loading, etc.

### Best Practices

- Use descriptive story names
- Include comprehensive argTypes
- Add proper documentation
- Test all variants and states
- Include accessibility considerations
- Use consistent naming conventions

## 🧪 Testing

### Storybook Testing

```bash
# Run tests in watch mode
npm run storybook:test

# Run tests in CI
npm run storybook:test:ci
```

### Testing Addons

- **A11y** - Accessibility testing
- **Interactions** - User interaction testing
- **Viewport** - Responsive testing
- **Backgrounds** - Theme testing

## 🚀 Deployment

### Building for Production

```bash
npm run build-storybook
```

The built Storybook will be available in the `storybook-static` directory.

### Deployment Options

- **Netlify** - Automatic deployment from Git
- **Vercel** - Serverless deployment
- **GitHub Pages** - Static hosting
- **AWS S3** - Cloud storage hosting

## 🔍 Troubleshooting

### Common Issues

1. **Memory Issues**
   ```bash
   npm run storybook:clean
   npm run storybook:fast
   ```

2. **Build Failures**
   - Check TypeScript errors
   - Verify import paths
   - Clear node_modules and reinstall

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check CSS import order
   - Verify design system provider

### Performance Optimization

- Use `storybook:fast` for development
- Implement code splitting for large components
- Optimize bundle size with `storybook:analyze`
- Use lazy loading for heavy components

## 📚 Additional Resources

- [Storybook Documentation](https://storybook.js.org/)
- [Design System Best Practices](https://www.designsystem.digital/)
- [Component Testing Guide](https://storybook.js.org/docs/react/writing-tests/introduction)
- [Accessibility Testing](https://storybook.js.org/docs/react/writing-tests/accessibility-testing)

## 🤝 Contributing

When adding new components to Storybook:

1. Create comprehensive stories
2. Include all variants and states
3. Add proper documentation
4. Test accessibility
5. Update this README if needed

### Story Naming Convention

- Use PascalCase for component names
- Use descriptive names for stories
- Group related stories together
- Follow the established hierarchy

Example:
```
Design System/Button/Default
Design System/Button/Variants
Design System/Button/Interactive
Components/Auth/AuthGuard/Basic
Components/Auth/AuthGuard/RoleBased
```

## 📊 Analytics

Storybook includes analytics to track usage:

- Component usage statistics
- Story view counts
- User interaction patterns
- Performance metrics

Access analytics through the Storybook dashboard or export data for further analysis.
