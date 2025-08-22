# Storybook Guide

This guide outlines the standardized approach to Storybook in the FinVision project, ensuring consistency across all components and stories.

## Table of Contents

1. [Story Organization](#story-organization)
2. [File Naming Conventions](#file-naming-conventions)
3. [Story Structure](#story-structure)
4. [Documentation Standards](#documentation-standards)
5. [Testing Integration](#testing-integration)
6. [Quality Checklist](#quality-checklist)
7. [Tools and Scripts](#tools-and-scripts)

## Story Organization

### Directory Structure

```
src/
├── design-system/
│   ├── stories/
│   │   ├── *.mdx                    # Documentation files
│   │   ├── *.stories.tsx            # Design system component stories
│   │   └── StoryGuidelines.mdx      # Story writing guidelines
│   └── components/
│       └── *.tsx                    # Design system components
├── components/
│   ├── ui/
│   │   ├── *.stories.tsx            # UI component stories
│   │   └── *.tsx                    # UI components
│   └── [feature]/
│       ├── *.stories.tsx            # Feature component stories
│       └── *.tsx                    # Feature components
└── pages/
    ├── *.stories.tsx                # Page stories
    └── *.tsx                        # Page components
```

### Story Categories

1. **Design System** (`Design System/*`)

   - Core design system components
   - Documentation and guidelines
   - Design tokens and theming

2. **UI Components** (`UI/*`)

   - Reusable UI components
   - Form elements, buttons, inputs
   - Layout components

3. **Feature Components** (`Components/*`)

   - Business logic components
   - Feature-specific components
   - Complex composite components

4. **Pages** (`Pages/*`)
   - Full page components
   - Route-level components
   - Page layouts and structures

## File Naming Conventions

### Stories

- **Component Stories**: `ComponentName.stories.tsx`
- **Documentation**: `ComponentName.Guidelines.mdx` or `ComponentName.Examples.mdx`
- **Test Stories**: `ComponentName.test.stories.tsx` (for testing specific scenarios)

### Examples

```
Button.stories.tsx              # Button component stories
Button.Guidelines.mdx           # Button usage guidelines
Pagination.stories.tsx          # Pagination component stories
LoadingSkeleton.stories.tsx     # Loading skeleton stories
```

## Story Structure

Every story file must follow this standardized structure:

````tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

/**
 * ComponentName - Brief description of what this component does
 *
 * ## Usage
 * ```tsx
 * import { ComponentName } from '@/components/path/ComponentName';
 *
 * <ComponentName prop1="value" prop2={true} />
 * ```
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 * - Feature 3
 *
 * ## Accessibility
 * - Screen reader friendly
 * - Keyboard navigation support
 * - ARIA labels included
 */
const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed component description',
      },
    },
  },
  argTypes: {
    // All props with proper controls and descriptions
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Required story types in this order:
export const Default: Story = {
  /* Primary use case */
};
export const Secondary: Story = {
  /* Alternative state */
};
export const Interactive: Story = {
  /* With play function */
};
export const States: Story = {
  /* Multiple states */
};
export const UsageExamples: Story = {
  /* Real-world examples */
};
````

## Required Story Types

### 1. Default Story

- Shows the most common use case
- Uses sensible default props
- Serves as the primary example

```tsx
export const Default: Story = {
  args: {
    prop1: 'Default Value',
    prop2: false,
  },
};
```

### 2. Variant Stories

- One story per variant (if applicable)
- Clear naming: `Primary`, `Secondary`, `Destructive`, etc.

```tsx
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};
```

### 3. Interactive Story

- Demonstrates user interactions
- Includes play function for testing
- Shows click handlers, form submissions, etc.

```tsx
export const Interactive: Story = {
  args: {
    children: 'Click me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    // Add assertions here
  },
};
```

### 4. States Story

- Shows different states in one view
- Includes: normal, hover, active, disabled, loading
- Uses render function with multiple instances

```tsx
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <ComponentName prop1="Normal State" prop2={false} />
      <ComponentName prop1="Active State" prop2={true} />
      <ComponentName prop1="Disabled State" prop2={false} disabled />
    </div>
  ),
};
```

### 5. Usage Examples

- Real-world usage patterns
- Multiple examples in one story
- Shows different configurations

```tsx
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
        <ComponentName prop1="Basic Example" prop2={false} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">With Custom Styling</h3>
        <ComponentName
          prop1="Custom Styled"
          prop2={true}
          className="border-2 border-blue-500 rounded-lg"
        />
      </div>
    </div>
  ),
};
```

## Documentation Standards

### Component Description

- Clear, concise description of purpose
- Key features and capabilities
- When to use this component

### Prop Documentation

Every prop must have:

- Description of what it does
- Type information
- Default values
- Usage examples for complex props

```tsx
argTypes: {
  variant: {
    control: { type: 'select' },
    options: ['primary', 'secondary', 'destructive'],
    description: 'The visual style variant of the component',
  },
  size: {
    control: { type: 'select' },
    options: ['sm', 'md', 'lg'],
    description: 'The size of the component',
  },
  disabled: {
    control: { type: 'boolean' },
    description: 'Whether the component is disabled',
  },
  children: {
    control: { type: 'text' },
    description: 'The content to display',
  },
}
```

### Accessibility Notes

- Screen reader compatibility
- Keyboard navigation support
- ARIA attributes used
- Color contrast considerations

### Design Tokens

- List design tokens used
- Explain responsive behavior
- Note theme compatibility

## Testing Integration

### Play Functions

Use play functions to test:

- User interactions
- State changes
- Accessibility
- Form submissions

```tsx
export const Interactive: Story = {
  args: {
    /* props */
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    // Add assertions here
  },
};
```

### Interaction Testing

- Test user interactions
- Verify state changes
- Check accessibility
- Validate form submissions

## Quality Checklist

Before submitting a story, ensure:

- [ ] All props documented with argTypes
- [ ] Component description is clear and complete
- [ ] Stories cover all variants and states
- [ ] Interactive stories include play functions
- [ ] Accessibility considerations documented
- [ ] Design tokens and theming explained
- [ ] Usage examples provided
- [ ] File follows naming convention
- [ ] No hardcoded content (use controls)
- [ ] Responsive behavior demonstrated
- [ ] Story passes accessibility addon
- [ ] Story works in both light and dark themes

## Tools and Scripts

### Story Creation Script

Use the automated story creation script:

```bash
# Basic usage
node scripts/create-story.js src/components/ui/Button.tsx

# With options
node scripts/create-story.js src/components/ui/Button.tsx \
  --title "UI/Button" \
  --category "UI" \
  --description "A versatile button component" \
  --features "Multiple variants,Accessibility compliant,Responsive design" \
  --props '[{"name":"variant","type":"select","options":["primary","secondary"],"description":"Button variant"},{"name":"disabled","type":"boolean","description":"Whether button is disabled"}]'
```

### Story Verification

Run the story verification script to ensure all components have stories:

```bash
node scripts/verify-stories.cjs
```

### Storybook Commands

```bash
# Start Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook

# Test Storybook
pnpm test-storybook
```

## Common Patterns

### Form Components

- Show validation states
- Include error handling
- Demonstrate form submission

### Layout Components

- Show different content lengths
- Demonstrate responsive behavior
- Include spacing examples

### Interactive Components

- Show loading states
- Include success/error states
- Demonstrate user feedback

### Data Components

- Show empty states
- Include loading states
- Demonstrate data variations

## Performance Considerations

- Use `useMemo` for expensive computations in stories
- Avoid unnecessary re-renders
- Keep story data minimal but realistic
- Use proper loading states

## Accessibility Testing

- Run accessibility addon on all stories
- Test with screen readers
- Verify keyboard navigation
- Check color contrast
- Validate ARIA attributes

## Migration Guide

### From Old Story Format

If you have existing stories that don't follow the new format:

1. **Update file structure** to match new organization
2. **Add comprehensive documentation** with usage examples
3. **Implement required story types** (Default, States, UsageExamples, etc.)
4. **Add proper argTypes** for all props
5. **Include accessibility notes** and design token information
6. **Add interactive stories** with play functions
7. **Test with accessibility addon** and fix any issues

### Example Migration

**Before:**

```tsx
export default {
  title: 'Button',
  component: Button,
};

export const Primary = () => <Button>Click me</Button>;
```

**After:**

```tsx
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants and states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'destructive'],
      description: 'The visual style variant',
    },
    // ... more props
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

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  ),
};
```

## Support

For questions about Storybook implementation:

1. Check the [Story Guidelines](./src/design-system/stories/StoryGuidelines.mdx)
2. Review existing stories for examples
3. Use the story creation script for templates
4. Run the verification script to check compliance
