# Task 12: Design System Consolidation & Radix UI Migration

## Overview

Consolidate the dual design systems (Material-UI + Radix UI) into a unified Radix UI + Tailwind CSS system for maximum consistency and implement missing Radix UI components identified in the PRD analysis.

## Complexity: ⭐⭐ MEDIUM

**Estimated Time: 45-60 hours**

## Prerequisites

- Current UI components audit completed
- Radix UI foundation established
- Design tokens defined in utils/tokens.ts
- CVA variant system implemented

## Task Breakdown

### 12.1 Radix UI Component Implementation ⭐⭐

**Estimated Time: 20-25 hours**

#### Scope

Implement missing Radix UI components mentioned in PRD but not yet created

#### Missing Components to Implement

1. **Menubar Component** (3-4 hours)

   ```typescript
   // components/ui/menubar.tsx
   import * as MenubarPrimitive from "@radix-ui/react-menubar"

   const Menubar = React.forwardRef<...>({
     // Implementation with CVA variants
   })
   ```

2. **Navigation Menu Component** (4-5 hours)

   ```typescript
   // components/ui/navigation-menu.tsx
   import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
   ```

3. **Popover Component** (3-4 hours)

   ```typescript
   // components/ui/popover.tsx
   import * as PopoverPrimitive from "@radix-ui/react-popover";
   ```

4. **Toggle & Toggle Group Components** (4-5 hours)

   ```typescript
   // components/ui/toggle.tsx
   // components/ui/toggle-group.tsx
   import * as TogglePrimitive from "@radix-ui/react-toggle";
   import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
   ```

5. **Tooltip Component** (2-3 hours)

   ```typescript
   // components/ui/tooltip.tsx
   import * as TooltipPrimitive from "@radix-ui/react-tooltip";
   ```

6. **Context Menu Component** (4-5 hours)
   ```typescript
   // components/ui/context-menu.tsx
   import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
   ```

#### Implementation Steps

1. **Create Component Files** (12-15 hours)
   - Implement each missing Radix UI component
   - Apply CVA variant system for consistency
   - Add proper TypeScript interfaces
   - Include accessibility features

2. **Create Storybook Stories** (4-5 hours)
   - Document each new component
   - Show all variants and use cases
   - Include accessibility examples

3. **Write Component Tests** (4-5 hours)
   - Unit tests for each component
   - Accessibility testing
   - Variant testing

#### Acceptance Criteria

- [ ] All missing Radix UI components implemented
- [ ] CVA variant system applied consistently
- [ ] Storybook documentation complete
- [ ] Component tests with >90% coverage
- [ ] TypeScript interfaces properly defined
- [ ] Accessibility compliance verified

---

### 12.2 Material-UI to Radix UI Migration ⭐⭐⭐

**Estimated Time: 25-35 hours**

#### Scope

Migrate remaining Material-UI components to Radix UI equivalents across all pages

#### Components to Migrate

1. **Dashboard Pages** (8-10 hours)
   - Replace Material-UI `Alert` with custom Radix-based alert
   - Replace `CircularProgress` with Radix progress component
   - Replace `FormControl`, `InputLabel`, `Select` with Radix equivalents
   - Replace `Grid` with Tailwind grid classes

2. **Reports Component** (10-12 hours)
   - Replace Material-UI `Dialog` with Radix dialog
   - Replace `Table` components with custom DataTable
   - Replace `Tabs` with Radix tabs
   - Replace Material-UI icons with Lucide React icons

3. **Charts Components** (4-5 hours)
   - Ensure chart containers use Radix UI patterns
   - Replace Material-UI theming with design tokens
   - Update chart export controls

4. **Form Components** (3-4 hours)
   - Replace remaining Material-UI form controls
   - Ensure consistent focus management
   - Apply Radix UI accessibility patterns

#### Implementation Steps

1. **Create Migration Plan** (2-3 hours)
   - Audit all Material-UI usage
   - Map to Radix UI equivalents
   - Identify custom components needed

2. **Implement Component Replacements** (15-20 hours)
   - Replace components page by page
   - Maintain functionality during migration
   - Update imports and references

3. **Update Styling** (4-5 hours)
   - Remove Material-UI theme dependencies
   - Apply Tailwind CSS classes
   - Ensure design token consistency

4. **Testing and Validation** (4-7 hours)
   - Test all migrated components
   - Verify accessibility compliance
   - Check responsive behavior

#### Acceptance Criteria

- [ ] Zero Material-UI components remaining
- [ ] All functionality preserved during migration
- [ ] Consistent design token usage
- [ ] Accessibility compliance maintained
- [ ] Bundle size reduction achieved
- [ ] Performance improvement verified

---

## Dependencies

### Internal Dependencies

- Task 08: UI/UX Implementation (base design system)
- Task 11: Pages Functional Improvement (dashboard pages stability)

### External Dependencies

- @radix-ui/react-\* packages installed
- Tailwind CSS configuration complete
- Storybook setup operational

## Risks & Mitigation

### High Risk

- **Breaking Changes**: Migration may break existing functionality
  - _Mitigation_: Incremental migration, comprehensive testing
- **Design Inconsistencies**: Visual changes during migration
  - _Mitigation_: Design review at each step, use design tokens

### Medium Risk

- **Bundle Size**: Adding new Radix components before removing Material-UI
  - _Mitigation_: Remove Material-UI components immediately after replacement
- **Accessibility Regressions**: Changes in component behavior
  - _Mitigation_: Accessibility testing after each component migration

## Success Metrics

### Technical Metrics

- Bundle size reduction of 30-40% (removing Material-UI)
- 100% Radix UI component coverage
- Zero Material-UI dependencies remaining
- Consistent CVA variant usage across all components

### Quality Metrics

- WCAG 2.1 AA compliance maintained
- Component test coverage >90%
- Storybook documentation complete
- TypeScript strict mode compliance

### Performance Metrics

- Initial page load improvement
- Tree-shaking effectiveness verified
- Runtime performance maintained or improved

## Definition of Done

- [ ] All missing Radix UI components implemented and tested
- [ ] Complete migration from Material-UI to Radix UI
- [ ] Consistent design token usage across all components
- [ ] Storybook documentation updated for all components
- [ ] Component test suite with >90% coverage
- [ ] Accessibility compliance verified
- [ ] Bundle size optimization achieved
- [ ] Code review completed and approved
- [ ] Documentation updated with migration guide

## Post-Implementation

### Monitoring

- Bundle size tracking
- Performance monitoring
- Accessibility compliance checks
- Component usage analytics

### Maintenance

- Regular Radix UI updates
- Design token refinements
- Component API consistency reviews
- Developer experience improvements
