# 21 - Legacy Code Cleanup & Material-UI Removal

**Purpose:**  
Systematically remove all Material-UI dependencies and legacy code patterns to complete the migration to Radix UI design system.

**Complexity:** ⭐⭐ MEDIUM  
**Estimated Time:** 12–18 hours

## Background

After migrating the Login and Reports components to Radix UI, this task focuses on cleaning up remaining Material-UI dependencies, legacy code patterns, and consolidating the design system approach across the entire codebase.

## Scope Analysis

### Current Material-UI Usage

Based on package.json analysis, the following Material-UI packages need removal:

```json
{
  "@mui/material": "^5.11.10",
  "@mui/icons-material": "^5.11.9",
  "@emotion/react": "^11.10.5",
  "@emotion/styled": "^11.10.5"
}
```

### Components Requiring Migration

Components that still use Material-UI patterns:

- `frontend/src/components/ui/TextField.tsx` (hybrid Material-UI component)
- `frontend/src/components/ui/ErrorHandling.tsx` (uses Material-UI icons and components)
- `frontend/src/components/ui/BottomNavigation.tsx` (Material-UI navigation)
- `frontend/src/components/ui/HelpCenter.tsx` (Material-UI dialog and components)
- Any remaining dashboard components using Material-UI

## Functional Requirements

### Phase 1: Component Inventory & Assessment (2-3 hours)

- **Dependency Analysis**: Scan entire codebase for Material-UI imports
- **Component Mapping**: Create mapping of Material-UI to Radix UI equivalents
- **Usage Assessment**: Identify critical vs non-critical Material-UI usage
- **Migration Planning**: Prioritize components by impact and complexity

### Phase 2: Component Migration (6-8 hours)

- **TextField Component**: Migrate to pure Radix + Tailwind implementation
- **Error Handling**: Replace Material-UI with Radix Alert and Toast components
- **Navigation Components**: Migrate to Radix Navigation Menu primitives
- **Dialog Components**: Ensure all dialogs use Radix Dialog primitives
- **Icon Standardization**: Replace all Material-UI icons with Lucide React

### Phase 3: Dependencies & Build System (2-3 hours)

- **Package Removal**: Remove Material-UI packages from package.json
- **Import Cleanup**: Remove all Material-UI imports from codebase
- **Build Optimization**: Update build configuration for new dependencies
- **Bundle Analysis**: Verify bundle size reduction

### Phase 4: Testing & Validation (2-4 hours)

- **Functionality Testing**: Ensure all features work without Material-UI
- **Visual Regression**: Verify UI consistency after migration
- **Performance Testing**: Validate bundle size and runtime improvements
- **Accessibility Testing**: Ensure no accessibility regressions

## Technical Implementation

### TextField Component Migration

```typescript
// Before: Hybrid Material-UI TextField
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

// After: Pure Radix + Tailwind TextField
import { forwardRef, useState, useCallback } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Alert, AlertDescription } from "./alert";
import { Progress } from "./progress";
import { Eye, EyeOff, CheckCircle, AlertCircle, Save } from "lucide-react";
import { cn } from "./utils";

export interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  showPasswordToggle?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onAutoSave?: (value: string) => Promise<void>;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  showValidationIcon?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      showPasswordToggle = false,
      autoSave = false,
      autoSaveDelay = 1000,
      onAutoSave,
      validationRules,
      showValidationIcon = true,
      className,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const isPasswordField = type === "password" || showPasswordToggle;
    const actualType = isPasswordField && showPassword ? "text" : type;

    const validateValue = useCallback(
      (val: string): string | null => {
        if (!validationRules) return null;

        if (validationRules.required && !val.trim()) {
          return "This field is required";
        }

        if (
          validationRules.minLength &&
          val.length < validationRules.minLength
        ) {
          return `Minimum length is ${validationRules.minLength} characters`;
        }

        if (
          validationRules.maxLength &&
          val.length > validationRules.maxLength
        ) {
          return `Maximum length is ${validationRules.maxLength} characters`;
        }

        if (validationRules.pattern && !validationRules.pattern.test(val)) {
          return "Invalid format";
        }

        if (validationRules.custom) {
          return validationRules.custom(val);
        }

        return null;
      },
      [validationRules]
    );

    const handleAutoSave = useCallback(
      async (value: string) => {
        if (!autoSave || !onAutoSave) return;

        setIsSaving(true);
        try {
          await onAutoSave(value);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
          console.error("Auto-save failed:", error);
        } finally {
          setIsSaving(false);
        }
      },
      [autoSave, onAutoSave]
    );

    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-sm font-medium">
            {label}
            {validationRules?.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
        )}

        <div className="relative">
          <Input
            ref={ref}
            type={actualType}
            className={cn(
              "pr-10",
              error || validationError ? "border-destructive" : "",
              className
            )}
            onChange={(e) => {
              const value = e.target.value;
              const validationErr = validateValue(value);
              setValidationError(validationErr);

              if (!validationErr) {
                handleAutoSave(value);
              }

              props.onChange?.(e);
            }}
            {...props}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSaving && <Progress value={50} className="w-4 h-4" />}

            {isSaved && <Save className="h-4 w-4 text-success" />}

            {showValidationIcon && props.value && (
              <>
                {validationError ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
              </>
            )}

            {isPasswordField && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>

        {(helperText || errorMessage || validationError) && (
          <div className="text-sm">
            {errorMessage || validationError ? (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage || validationError}
                </AlertDescription>
              </Alert>
            ) : (
              <p className="text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
```

### Enhanced Error Handling Component

```typescript
// Migrated Error Handling without Material-UI
import { AlertTriangle, RefreshCw, Home, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  type?: "error" | "warning" | "info";
  onRetry?: () => void;
  onDismiss?: () => void;
  onGoHome?: () => void;
  details?: string;
  actions?: React.ReactNode;
  fullHeight?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Error",
  message = "An error occurred",
  type = "error",
  onRetry,
  onDismiss,
  onGoHome,
  details,
  actions,
  fullHeight = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-warning" />;
      case "info":
        return <AlertCircle className="h-12 w-12 text-info" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-destructive" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "warning":
        return "default";
      case "info":
        return "default";
      default:
        return "destructive";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center p-8",
        fullHeight && "min-h-[400px]"
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {details && (
            <Alert variant={getVariant()}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Details</AlertTitle>
              <AlertDescription className="mt-2 font-mono text-xs">
                {details}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}

            {onGoHome && (
              <Button variant="outline" onClick={onGoHome} className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            )}

            {onDismiss && (
              <Button variant="ghost" onClick={onDismiss} className="w-full">
                Dismiss
              </Button>
            )}

            {actions}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorDisplayProps>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorDisplay;
      return (
        <FallbackComponent
          title="Something went wrong"
          message="An unexpected error occurred. Please try refreshing the page."
          details={this.state.error?.message}
          onRetry={() => this.setState({ hasError: false, error: undefined })}
          onGoHome={() => (window.location.href = "/")}
        />
      );
    }

    return this.props.children;
  }
}
```

### Navigation Component Migration

```typescript
// Migrated Bottom Navigation without Material-UI
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./navigation-menu";
import { Badge } from "./badge";
import { cn } from "./utils";

interface NavigationItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface BottomNavigationProps {
  items: NavigationItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  value,
  onValueChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t",
        className
      )}
    >
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="flex w-full justify-around">
          {items.map((item) => (
            <NavigationMenuItem key={item.value}>
              <NavigationMenuLink
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 text-xs font-medium transition-colors",
                  "min-w-[64px] h-16",
                  value === item.value
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !item.disabled && onValueChange(item.value)}
              >
                <div className="relative mb-1">
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
```

## Migration Checklist

### Pre-Migration Assessment

- [ ] Complete dependency scan of entire codebase
- [ ] Document all Material-UI usage locations
- [ ] Create component migration mapping
- [ ] Backup current functionality tests

### Component Migration

- [ ] Migrate `TextField.tsx` to pure Radix implementation
- [ ] Migrate `ErrorHandling.tsx` components
- [ ] Migrate `BottomNavigation.tsx` component
- [ ] Migrate `HelpCenter.tsx` component
- [ ] Replace all Material-UI icons with Lucide React
- [ ] Update all remaining Material-UI component usage

### Dependency Cleanup

- [ ] Remove `@mui/material` from package.json
- [ ] Remove `@mui/icons-material` from package.json
- [ ] Remove `@emotion/react` from package.json
- [ ] Remove `@emotion/styled` from package.json
- [ ] Clean up any orphaned Material-UI configuration

### Testing & Validation

- [ ] Run full test suite to ensure no breakages
- [ ] Perform visual regression testing
- [ ] Validate accessibility compliance maintained
- [ ] Check bundle size reduction
- [ ] Verify performance improvements

### Documentation Updates

- [ ] Update component documentation
- [ ] Remove Material-UI references from guides
- [ ] Update development setup instructions
- [ ] Create migration completion report

## Automated Migration Tools

### Codemod Script

```bash
#!/bin/bash
# Automated Material-UI removal script

echo "Starting Material-UI cleanup..."

# Find all Material-UI imports
echo "Finding Material-UI imports..."
grep -r "@mui" src/ --include="*.tsx" --include="*.ts" > mui-usage.txt

# Find all Material-UI icon usage
echo "Finding Material-UI icon usage..."
grep -r "@mui/icons-material" src/ --include="*.tsx" --include="*.ts" > mui-icons.txt

# Replace common Material-UI components with Radix equivalents
echo "Replacing common patterns..."
find src -name "*.tsx" -type f -exec sed -i 's/import.*@mui\/material.*//g' {} \;
find src -name "*.tsx" -type f -exec sed -i 's/import.*@mui\/icons-material.*//g' {} \;

echo "Manual review required for files listed in mui-usage.txt and mui-icons.txt"
```

### Bundle Analysis Script

```bash
#!/bin/bash
# Analyze bundle size before/after cleanup

echo "Analyzing bundle size changes..."

# Before cleanup
npm run build
du -sh dist/ > bundle-size-before.txt

# After cleanup (run after migration)
npm run build
du -sh dist/ > bundle-size-after.txt

echo "Bundle size comparison:"
echo "Before: $(cat bundle-size-before.txt)"
echo "After: $(cat bundle-size-after.txt)"
```

## Acceptance Criteria

### Complete Material-UI Removal

- [ ] Zero Material-UI packages in package.json dependencies
- [ ] No Material-UI imports found in codebase
- [ ] All Material-UI icons replaced with Lucide React equivalents
- [ ] No Material-UI theming or configuration files remain

### Functionality Preservation

- [ ] All existing component functionality works correctly
- [ ] No visual regressions in component appearance
- [ ] All interactive behaviors preserved
- [ ] Accessibility features maintained or improved

### Performance Improvements

- [ ] Bundle size reduced by at least 15%
- [ ] No performance regressions in component rendering
- [ ] Tree-shaking works effectively for all components
- [ ] Build times improved or maintained

### Code Quality

- [ ] All TypeScript errors resolved
- [ ] No ESLint warnings related to missing dependencies
- [ ] Consistent code patterns across all components
- [ ] Updated component documentation

### Testing Coverage

- [ ] All existing tests pass without modification
- [ ] New tests added for migrated components
- [ ] Visual regression tests pass
- [ ] E2E tests continue to work

## Risk Mitigation

### Functionality Risks

- **Component Behavior Changes**: Thorough testing of all component interactions
- **Styling Inconsistencies**: Visual regression testing throughout migration
- **Accessibility Regressions**: Comprehensive accessibility audit

### Performance Risks

- **Bundle Size Monitoring**: Continuous monitoring during migration
- **Runtime Performance**: Benchmark critical user interactions
- **Memory Usage**: Test for memory leaks in new components

### Development Risks

- **Team Productivity**: Provide clear migration guidelines and support
- **Knowledge Transfer**: Document new patterns and best practices
- **Rollback Plan**: Maintain ability to rollback if critical issues arise

## Success Metrics

1. **Dependency Reduction**: 100% Material-UI dependencies removed
2. **Bundle Size**: 15%+ reduction in JavaScript bundle size
3. **Performance**: No degradation in component rendering speed
4. **Accessibility**: Maintain 100% WCAG 2.1 AA compliance
5. **Code Quality**: Zero TypeScript/ESLint errors post-migration
6. **Test Coverage**: Maintain or improve test coverage percentages

This cleanup task completes the migration to a pure Radix UI design system, eliminating legacy dependencies and establishing a consistent, maintainable component architecture for the FinVision platform.
