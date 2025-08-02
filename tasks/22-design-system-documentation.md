# 22 - Design System Documentation & Standards

**Purpose:**  
Create comprehensive documentation for the Radix UI design system, establishing it as the authoritative guide for component usage, patterns, and best practices across the FinVision platform.

**Complexity:** ⭐⭐ MEDIUM  
**Estimated Time:** 10–15 hours

## Background

With the Login and Reports components serving as reference implementations and the migration to Radix UI complete, this task creates the documentation and standards that will guide all future development on the FinVision platform.

## Documentation Requirements

### Phase 1: Component Documentation (4-6 hours)

- **Component Library**: Comprehensive documentation for all 25+ Radix UI components
- **Usage Examples**: Real-world examples from Login and Reports components
- **Variant Documentation**: Complete CVA variant documentation with examples
- **API Reference**: TypeScript interfaces and prop documentation
- **Accessibility Guidelines**: WCAG compliance patterns for each component

### Phase 2: Design System Guide (3-4 hours)

- **Design Principles**: Core principles behind the design system
- **Design Tokens**: Complete token system documentation
- **Layout Patterns**: Grid systems, spacing, and responsive patterns
- **Color System**: Semantic color usage and theming
- **Typography Scale**: Font sizes, weights, and line heights

### Phase 3: Developer Guidelines (2-3 hours)

- **Component Creation**: Guidelines for creating new components
- **Testing Standards**: Testing patterns for Radix UI components
- **Performance Guidelines**: Best practices for optimal performance
- **Accessibility Standards**: Implementation patterns for accessibility
- **Migration Patterns**: Patterns for migrating legacy components

### Phase 4: Interactive Documentation (1-2 hours)

- **Storybook Integration**: Interactive component playground
- **Live Examples**: Working examples with editable code
- **Design Token Visualizer**: Interactive token system browser
- **Component Status**: Current implementation status and roadmap

## Technical Implementation

### Storybook Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../docs/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-design-tokens",
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-viewport",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  features: {
    buildStoriesJson: true,
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
```

### Component Documentation Template

```typescript
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Plus, Download, Trash2, Edit } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Button Component

The Button component is built on top of Radix UI's Slot primitive and uses Class Variance Authority (CVA) for type-safe variant management. It provides consistent styling and behavior across the FinVision platform.

## Key Features

- **Polymorphic**: Can render as any element using \`asChild\` prop
- **Type-safe variants**: Compile-time validation of variant combinations
- **Accessibility**: Built-in focus management and ARIA attributes
- **Icon support**: Automatic icon sizing and spacing
- **Loading states**: Built-in loading state support

## Usage in FinVision

- **Login Component**: Primary CTA for authentication
- **Reports Component**: Template creation, report generation, export actions
- **Dashboard**: Quick actions and navigation
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "Size variant",
    },
    asChild: {
      control: "boolean",
      description: "Render as child element (polymorphic)",
    },
    disabled: {
      control: "boolean",
      description: "Disable button interaction",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available button variants with their visual styles.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Create
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
      <Button variant="secondary">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons with icons following the FinVision icon guidelines.",
      },
    },
  },
};

export const LoginExample: Story = {
  render: () => (
    <div className="w-80 space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Login Form Example</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter password"
          />
        </div>
        <Button className="w-full" size="lg">
          Sign In
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example usage from the Login component showing the primary CTA button.",
      },
    },
  },
};

export const ReportsExample: Story = {
  render: () => (
    <div className="space-y-4 p-6 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Report Templates</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="secondary" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example usage from the Reports component showing various button patterns.",
      },
    },
  },
};
```

### Design Token Documentation

```typescript
// docs/design-tokens.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundation/Design Tokens",
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
              name: "Primary",
              class: "bg-primary",
              text: "text-primary-foreground",
            },
            {
              name: "Secondary",
              class: "bg-secondary",
              text: "text-secondary-foreground",
            },
            {
              name: "Accent",
              class: "bg-accent",
              text: "text-accent-foreground",
            },
            { name: "Muted", class: "bg-muted", text: "text-muted-foreground" },
          ].map((color) => (
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
              name: "Destructive",
              class: "bg-destructive",
              text: "text-destructive-foreground",
            },
            { name: "Success", class: "bg-green-600", text: "text-white" },
            { name: "Warning", class: "bg-yellow-600", text: "text-white" },
          ].map((color) => (
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
    </div>
  ),
};

export const Spacing: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Spacing Scale</h3>
      <div className="space-y-4">
        {[
          { name: "1", value: "0.25rem", class: "w-1" },
          { name: "2", value: "0.5rem", class: "w-2" },
          { name: "4", value: "1rem", class: "w-4" },
          { name: "6", value: "1.5rem", class: "w-6" },
          { name: "8", value: "2rem", class: "w-8" },
          { name: "12", value: "3rem", class: "w-12" },
          { name: "16", value: "4rem", class: "w-16" },
          { name: "24", value: "6rem", class: "w-24" },
        ].map((space) => (
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
          { name: "text-xs", example: "Extra small text", class: "text-xs" },
          { name: "text-sm", example: "Small text", class: "text-sm" },
          { name: "text-base", example: "Base text", class: "text-base" },
          { name: "text-lg", example: "Large text", class: "text-lg" },
          { name: "text-xl", example: "Extra large text", class: "text-xl" },
          { name: "text-2xl", example: "Heading text", class: "text-2xl" },
          { name: "text-3xl", example: "Large heading", class: "text-3xl" },
        ].map((type) => (
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
```

### Developer Guidelines Documentation

````markdown
# FinVision Design System Developer Guide

## Overview

The FinVision design system is built on three core technologies:

- **Radix UI**: Unstyled, accessible component primitives
- **Class Variance Authority (CVA)**: Type-safe variant management
- **Tailwind CSS**: Utility-first styling with semantic design tokens

## Component Creation Guidelines

### 1. Component Structure

Every component should follow this structure:

```typescript
import * as React from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define variants using CVA
const componentVariants = cva(
  "base-classes", // Base styles that always apply
  {
    variants: {
      variant: {
        default: "variant-specific-classes",
        secondary: "variant-specific-classes",
      },
      size: {
        default: "size-specific-classes",
        sm: "size-specific-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Define component props interface
export interface ComponentProps
  extends React.ComponentPropsWithoutRef<typeof Primitive>,
    VariantProps<typeof componentVariants> {
  // Additional component-specific props
}

// Component implementation
export const Component = React.forwardRef<
  React.ElementRef<typeof Primitive>,
  ComponentProps
>(({ className, variant, size, ...props }, ref) => (
  <Primitive
    ref={ref}
    className={cn(componentVariants({ variant, size }), className)}
    {...props}
  />
));

Component.displayName = "Component";
```
````

### 2. Styling Guidelines

#### Use Semantic Classes

```typescript
// ✅ Good - semantic classes
"bg-primary text-primary-foreground";
"border-destructive text-destructive";

// ❌ Bad - hardcoded colors
"bg-blue-600 text-white";
"border-red-500 text-red-500";
```

#### Follow Design Token Patterns

```typescript
// ✅ Good - consistent with design tokens
"focus-visible:ring-ring focus-visible:ring-2";
"disabled:opacity-50 disabled:pointer-events-none";

// ❌ Bad - inconsistent patterns
"focus:outline-blue-500 focus:outline-2";
"disabled:opacity-40 disabled:cursor-not-allowed";
```

### 3. Accessibility Requirements

Every component must:

- Include proper ARIA attributes
- Support keyboard navigation
- Work with screen readers
- Maintain focus management
- Follow WCAG 2.1 AA guidelines

#### Example Implementation

```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        // Accessibility attributes
        role={asChild ? undefined : "button"}
        aria-disabled={props.disabled}
        tabIndex={props.disabled ? -1 : 0}
        {...props}
      />
    );
  }
);
```

### 4. Testing Standards

Every component requires:

- Unit tests for all variants
- Accessibility tests
- Visual regression tests
- Integration tests for complex components

#### Test Template

```typescript
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "./button";

expect.extend(toHaveNoViolations);

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies variants correctly", () => {
    const { rerender } = render(<Button variant="destructive">Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Accessible button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports keyboard navigation", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Button</Button>);

    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Component Status and Roadmap

### ✅ Completed Components

- Button (variants: default, destructive, outline, secondary, ghost, link)
- Input (with validation states and icons)
- Label (with required indicator support)
- Checkbox (with indeterminate state)
- Dialog (with proper focus management)
- Tabs (with keyboard navigation)
- Card (with header, content, footer variants)
- Badge (with status variants)
- Alert (with icon and variant support)

### 🚧 In Progress

- DataTable (sorting, filtering, pagination)
- Form (with validation integration)
- Select (with search and multi-select)
- DatePicker (with range selection)

### 📋 Planned

- Command (command palette)
- NavigationMenu (complex navigation)
- Sheet (slide-out panels)
- Popover (with arrow positioning)
- ContextMenu (right-click menus)

## Migration Patterns

### From Material-UI to Radix UI

```typescript
// Before: Material-UI
import { Button as MuiButton } from "@mui/material";
<MuiButton variant="contained" color="primary">
  Click me
</MuiButton>;

// After: Radix UI + CVA
import { Button } from "@/components/ui/button";
<Button variant="default">Click me</Button>;
```

### Form Migration Pattern

```typescript
// Before: Material-UI forms
import { TextField, FormControl, FormHelperText } from "@mui/material";

// After: Radix UI forms
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="Enter email" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

```

## Documentation Structure

```

docs/
├── components/
│ ├── button.stories.tsx
│ ├── input.stories.tsx
│ ├── dialog.stories.tsx
│ └── ...
├── foundation/
│ ├── design-tokens.stories.tsx
│ ├── typography.stories.tsx
│ ├── colors.stories.tsx
│ └── spacing.stories.tsx
├── patterns/
│ ├── forms.stories.tsx
│ ├── navigation.stories.tsx
│ ├── data-display.stories.tsx
│ └── feedback.stories.tsx
├── examples/
│ ├── login-form.stories.tsx
│ ├── reports-dashboard.stories.tsx
│ └── data-tables.stories.tsx
└── guidelines/
├── developer-guide.mdx
├── accessibility.mdx
├── testing.mdx
└── migration.mdx

```

## Acceptance Criteria

### Component Documentation
- [ ] All 25+ Radix UI components documented with examples
- [ ] Each component includes usage guidelines and best practices
- [ ] Real-world examples from Login and Reports components
- [ ] Complete API reference with TypeScript interfaces
- [ ] Accessibility guidelines for each component

### Design System Guide
- [ ] Design principles clearly articulated
- [ ] Complete design token documentation with visual examples
- [ ] Layout and spacing guidelines with practical examples
- [ ] Color system documentation with semantic usage
- [ ] Typography scale with implementation examples

### Developer Resources
- [ ] Step-by-step component creation guide
- [ ] Testing standards and templates
- [ ] Performance optimization guidelines
- [ ] Accessibility implementation patterns
- [ ] Migration guides from legacy patterns

### Interactive Documentation
- [ ] Storybook deployed with all components
- [ ] Live code examples for each component
- [ ] Interactive design token browser
- [ ] Component status dashboard
- [ ] Search functionality across all documentation

### Quality Standards
- [ ] All documentation follows consistent formatting
- [ ] Code examples are tested and functional
- [ ] Screenshots and visual examples are up-to-date
- [ ] Documentation is accessible and keyboard navigable
- [ ] Mobile-responsive documentation experience

## Success Metrics

1. **Completeness**: 100% of components documented with examples
2. **Usability**: Developers can implement new components without additional guidance
3. **Consistency**: All documentation follows established patterns
4. **Accessibility**: Documentation meets WCAG 2.1 AA standards
5. **Adoption**: Development team actively uses and contributes to documentation
6. **Maintenance**: Documentation stays current with component updates

This documentation establishes the FinVision design system as a comprehensive, accessible, and maintainable foundation for all future development, ensuring consistency and quality across the entire platform.
```
