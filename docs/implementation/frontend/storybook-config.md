# Storybook Configuration Guide

## Overview

This document outlines the optimized Storybook configuration for FinVision, including performance optimizations, testing setup, and development workflows.

## Configuration Files

### .storybook/main.ts
- **Framework**: React Vite
- **Addons**: Essentials, A11y, Interactions, Links, Viewport, Backgrounds, Measure, Outline, Coverage, Jest
- **Performance**: Optimized Vite configuration with manual chunks and dependency optimization
- **TypeScript**: React docgen with prop filtering

### .storybook/preview.tsx
- **Global Decorators**: Theme provider with light/dark mode support
- **Parameters**: Enhanced controls, accessibility testing, viewport configurations
- **Testing**: Integration with Testing Library and Jest

### .storybook/manager.ts
- **Theme**: Custom FinVision branding
- **Sidebar**: Organized navigation with filters
- **Toolbar**: Enhanced developer tools

## Performance Optimizations

### Build Optimizations
- Manual chunk splitting for vendor libraries
- ESBuild minification
- Dependency pre-bundling
- Tree shaking for unused code

### Runtime Optimizations
- Lazy loading of stories
- Optimized component rendering
- Memory management for large component trees

## Testing Integration

### Accessibility Testing
- Automated a11y checks with axe-core
- Color contrast validation
- Keyboard navigation testing
- Screen reader compatibility

### Component Testing
- Interactive testing with Testing Library
- User interaction simulation
- Component behavior validation
- Error boundary testing

## Development Workflow

### Available Scripts
- `npm run storybook`: Start development server
- `npm run storybook:fast`: Optimized development server
- `npm run build-storybook`: Build for production
- `npm run build-storybook:fast`: Optimized build
- `npm run storybook:test`: Run component tests
- `npm run storybook:test:ci`: CI/CD testing

### Best Practices
1. Use TypeScript for all stories
2. Include comprehensive documentation
3. Test accessibility features
4. Optimize for performance
5. Follow component composition patterns

## Addon Configuration

### Essential Addons
- **Essentials**: Core Storybook functionality
- **A11y**: Accessibility testing
- **Interactions**: User interaction testing
- **Links**: Navigation between stories

### Performance Addons
- **Viewport**: Responsive design testing
- **Backgrounds**: Context testing
- **Measure**: Layout analysis
- **Outline**: Component structure visualization

### Testing Addons
- **Coverage**: Code coverage reporting
- **Jest**: Unit testing integration

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Vite configuration and dependencies
2. **Performance Issues**: Use performance monitoring tools
3. **TypeScript Errors**: Verify prop types and interfaces
4. **A11y Violations**: Review accessibility guidelines

### Performance Monitoring
- Use Chrome DevTools for performance analysis
- Monitor bundle sizes with bundle analyzer
- Track component rendering times
- Optimize large component trees

## Future Improvements

1. **Visual Regression Testing**: Integrate Chromatic or similar tools
2. **Component Documentation**: Enhanced MDX documentation
3. **Design Token Integration**: Automated design system validation
4. **Performance Budgets**: Set and enforce performance limits
