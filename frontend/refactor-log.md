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

### Pending
- consolidate UI directories into one
- unify theme providers
- continue replacing hard-coded colors across legacy components

