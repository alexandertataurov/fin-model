# FinVision Design System Refinement PRD

## 1. Introduction
This PRD outlines the improvements required to unify and refine the FinVision frontend design system. The goal is to provide a single, consistent component library and theme implementation across the project.

## 2. Current Issues
- **Duplicate global styles**: both `src/styles/globals.css` and `src/design/styles/globals.css` define the same CSS variables.
- **Multiple `cn` utilities**: `src/lib/utils.ts`, `src/utils/cn.ts`, and `src/design/components/ui/utils.ts` each define a `cn()` helper.
- **Component duplication**: there are two UI component folders—`src/components/ui` (PascalCase filenames) and `src/design/components/ui` (lowercase filenames)—with overlapping implementations such as `Button`/`button`.
- **Theme provider mismatch**: `src/contexts/ThemeContext.tsx` uses Material‑UI while `src/design/components/ThemeProvider.tsx` implements a custom CSS variable approach.
- **Hard‑coded colors**: chart tabs in `src/design/components/tabs` use hex colors instead of design tokens.
- **Mixed component usage**: pages like `NewDashboard.tsx` import from the new `design` path, while other pages rely on the old components.
- **Legacy Material‑UI usage**: many components and pages still depend on Material‑UI widgets while newer parts of the app use Tailwind and Radix UI. This leads to duplicated styling approaches and larger bundle size.

### 2.1 Component Audit

**Material‑UI based files**

```
frontend/src/components/Analytics/AnalyticsDashboard.tsx
frontend/src/components/Charts/BaseChart.tsx
frontend/src/components/Charts/CustomTooltip.tsx
frontend/src/components/Charts/PieChart.tsx
frontend/src/components/Charts/WaterfallChart.tsx
frontend/src/components/Dashboard/DashboardGrid.tsx
frontend/src/components/FileUpload/FileList.tsx
frontend/src/components/FileUpload/FileUploadDropzone.tsx
frontend/src/components/Layout/Layout.tsx
frontend/src/components/Layout/Sidebar.tsx
frontend/src/components/Parameters/ParameterEditor.tsx
frontend/src/components/Parameters/ParameterList.tsx
frontend/src/components/ProtectedRoute.tsx
frontend/src/components/ui/BottomNavigation.tsx
frontend/src/components/ui/DataTable.tsx
frontend/src/components/ui/DateRangePicker.tsx
frontend/src/components/ui/ErrorHandling.tsx
frontend/src/components/ui/FileUploadZone.tsx
frontend/src/components/ui/HelpCenter.tsx
frontend/src/components/ui/LoadingStates.tsx
frontend/src/components/ui/MultiSelect.tsx
frontend/src/components/ui/TextField.tsx
frontend/src/components/ui/ThemeToggle.tsx
frontend/src/contexts/ThemeContext.tsx
frontend/src/pages/Analytics.tsx
frontend/src/pages/CashFlowDashboard.tsx
frontend/src/pages/Dashboard.tsx
frontend/src/pages/FileUpload.tsx
frontend/src/pages/PLDashboard.tsx
frontend/src/pages/Reports.tsx
frontend/src/pages/ScenarioModeling.tsx
frontend/src/test/test-utils.tsx
frontend/src/theme/index.ts
frontend/src/utils/responsive.ts
```

**Tailwind/Radix based files**

```
frontend/src/design/**/*
frontend/src/components/theme-toggle.tsx
frontend/src/lib/shadcn-registry.tsx
frontend/src/pages/Login.tsx
frontend/src/pages/Register.tsx
frontend/src/pages/NewDashboard.tsx
```

## 3. Goals
1. Consolidate the design system into a single source of truth.
2. Enforce consistent theming and component usage across the application.
3. Remove redundant utilities and style definitions.
4. Replace hard‑coded values with configurable tokens.
5. Provide clear documentation for developers and designers.

## 4. Functional Requirements
- **FR1**: Merge all global CSS variables into one `globals.css` file under `src/styles` and remove duplicates from `src/design/styles`.
- **FR2**: Expose a single `cn()` utility under `src/utils/cn.ts` and update all imports.
- **FR3**: Consolidate UI components into one directory. Prefer lowercase file names following the new design system (e.g., `src/components/ui/button.tsx`).
- **FR4**: Standardize on one theme provider using CSS variables and remove the Material‑UI theme wrapper.
- **FR5**: Replace all hex color codes in components with Tailwind CSS variables defined in `globals.css`.
- **FR6**: Update pages to import components from the unified library.
- **FR7**: Document component usage and tokens in `STYLE_GUIDE.md` or a new Storybook instance.

## 5. Non‑Functional Requirements
- **Consistency**: All UI elements must follow the same naming conventions and theme tokens.
- **Accessibility**: Ensure dark mode and focus styles remain intact after consolidation.
- **Maintainability**: The design system should allow easy addition of new components without duplication.

## 6. Success Metrics
- All components import from a single path and pass linting/tests.
- No duplicate utility or style files remain in the repository.
- UI snapshots in Storybook match the Figma reference designs.

## 7. Milestones
1. **Week 1**: Audit existing components and remove redundant files.
2. **Week 2**: Unify theme provider and global styles.
3. **Week 3**: Refactor pages to use the consolidated components.
4. **Week 4**: Document components and publish Storybook.

## 8. Progress Tracker

| Task | Status | Notes |
| ---- | ------ | ----- |
| FR1 Merge globals | [x] | Removed duplicate design/styles/globals.css |
| FR2 Single cn utility | [x] | Consolidated cn imports |
| FR3 Consolidate UI directory | [~] | Migrated Button, Accordion, Alert, Badge and dashboard layout components |
| FR4 One theme provider | [~] | Removed legacy ThemeContext and using unified provider |
| FR5 Replace hex colors with variables | [~] | Most chart and form components migrated |
| FR6 Update page imports | [~] | NewDashboard imports updated |
| FR7 Document components | [ ] | |

## Refactor Log

### Completed
- `src/styles/globals.css` consolidated
- single `cn` helper in `src/utils/cn.ts`
- replaced hex chart colors in `src/design/components/tabs/BalanceTab.tsx`
- updated scrollbar and background styles in `src/index.css`
- replaced hex colors in pages (`PLDashboard`, `CashFlowDashboard`, `Dashboard`, `ScenarioModeling`) and `BarChart` defaults
- replaced hex colors in design tab components (`PLTab`, `CashFlowTab`, `SalesTab`, `ParametersTab`)
- meta theme-color now reads from CSS variable
- replaced quick actions container with Card and utility classes
- updated Register page footer color token
- tokenized colors in `AnalyticsDashboard`, `LineChart`, and `PieChart`
- replaced inline styles in `FileUploadDropzone` with tokens
- applied design tokens in `WaterfallChart` and `ParameterEditor`
- removed MUI-based `ThemeToggle` and switched to design component
- switched App and tests to new ThemeProvider

### Pending
- consolidate UI directories into one
- unify theme providers
- continue replacing hard-coded colors across legacy components
