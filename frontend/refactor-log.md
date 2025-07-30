## Refactor Log

### Completed
- `src/styles/globals.css` consolidated
- single `cn` helper in `src/utils/cn.ts`
- replaced hex chart colors in `src/design/components/tabs/BalanceTab.tsx`
- updated scrollbar and background styles in `src/index.css`
- replaced hex colors in pages (`PLDashboard`, `CashFlowDashboard`, `Dashboard`,
  `ScenarioModeling`) and `BarChart` defaults
- replaced hex colors in design tab components (`PLTab`, `CashFlowTab`, `SalesTab`, `ParametersTab`)
- meta theme-color now reads from CSS variable
- replaced inline colors in `FileUploadDropzone` and `AnalyticsDashboard`
- mapped sensitivity colors in `ParameterEditor` to design tokens
- updated color tokens in `src/components/Layout/Layout.tsx`
- tokenized colors in `AnalyticsDashboard` charts
- migrated default colors in `LineChart` to design tokens
- converted PieChart colors to design tokens
- replaced hard-coded colors in `FileUploadDropzone`
- tokenized colors in `WaterfallChart`
- replaced sensitivity colors in `ParameterEditor`
- removed MUI-based `ThemeToggle` component and updated imports
- switched App and tests to new ThemeProvider
- moved DashboardLayout and related tabs to `src/components`
- replaced legacy Button component with design-system `button`
- migrated Accordion, Alert and Badge to `src/components/ui` and updated registry imports
- removed obsolete `ThemeContext` provider
- updated NewDashboard to use unified theme provider

### Pending
- consolidate UI directories into one
- unify theme providers
- continue replacing hard-coded colors across legacy components
