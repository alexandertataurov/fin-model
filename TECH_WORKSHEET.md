# Tech Worksheet: Fin Model Frontend

This document expands on the improvement suggestions for the existing frontend codebase and lists actionable tasks.

## 1. General Setup

### index.html
- **Bundle Tailwind** with Vite rather than loading from CDN to ensure consistent builds and offline capability.
- **Move theme toggle logic** into React (e.g. inside `App.tsx`) so initial HTML is purely declarative and easier to maintain.

### package.json / vite.config.ts
- **Add test script** (e.g. `"test": "vitest"`) for future unit testing.
- **Define path aliases** such as `@/components` in `vite.config.ts` and `tsconfig.json` to simplify imports.

### eslint.config.js
- **Adopt Airbnb TypeScript rules** via `eslint-config-airbnb-typescript` for stricter style checks.
- **Add `eslint-plugin-jsx-a11y`** to surface accessibility issues early in development.

## 2. Core React Files

### App.tsx
- Extract snapshot handling and keyboard shortcut logic into **custom hooks** to keep the component focused on rendering.
- Replace local theme state with a **React context** so other components can access the theme without prop‑drilling.

### main.tsx
- Wrap the root in an **ErrorBoundary** component to capture rendering errors and display a fallback UI.

## 3. Components

### TopBar.tsx
- Add `aria-label` to the `<nav>` element for improved accessibility.
- Allow passing custom action elements via `children` so the component is more flexible.

### ModelControls.tsx
- Replace hard‑coded currency array with `currencyOptions` exported from `types.ts`.
- Split the snapshot dropdown into a dedicated component for easier maintenance.
- Use semantic `<fieldset>` and `<legend>` elements for each control group.

### ModelTable.tsx
- Consider using **`ag-grid-react`** (already installed) instead of the manual `<table>` for built‑in sorting and editing features.
- Add `aria` attributes for better keyboard navigation (e.g. `role="grid"`).

### Tooltip.tsx
- Include `role="tooltip"` and allow `aria-describedby` on the trigger element for assistive technologies.

### Button.tsx / Card.tsx
- Use `React.forwardRef` to expose the DOM node to parent components if needed.
- Provide variant props (primary, secondary) instead of fixed Tailwind classes to allow style reuse.

## 4. Hooks

### useFinancialRows.ts / useSnapshots.ts
- Abstract repeated `localStorage` logic into a reusable `useLocalStorage` hook to reduce duplication and handle JSON parsing errors gracefully.

### useFxRates.ts
- Add simple **caching/throttling** so the API isn't called on every render, and expose loading/error states.

### useMetrics.ts
- Move chart data preparation into its own hook and memoize expensive calculations carefully.

## 5. Utilities

### csv.ts
- Improve parsing to support quoted values and embedded commas so exported files remain Excel‑compatible.

### format.ts
- Allow callers to specify a locale and currency display option, rather than always using `'en-US'`.

## 6. Stylesheets
- Convert the global `.field` class in `App.css` into a small React component or CSS module to avoid accidental style leakage.
- Add responsive breakpoints to `ModelTable.module.css` and `ModelControls.module.css` for better usability on smaller screens.
- Add basic fade or slide transitions in `Tooltip.module.css` to soften the tooltip appearance.

---

## Tech Worksheet

| Area | Task | Priority | Notes |
|------|------|----------|-------|
| Build | Bundle Tailwind with Vite | P2 | ensures repeatable builds |
| Build | Add path aliases (`@/components`) | P2 | update `vite.config.ts` and `tsconfig.json` |
| Lint | Integrate Airbnb + a11y ESLint rules | P3 | improves code quality |
| Components | Refactor `App.tsx` logic into hooks | P1 | reduces component size |
| Components | Replace manual table with `ag-grid-react` | P2 | adds sorting & editing |
| Components | Add aria labels and semantic markup | P2 | improves accessibility |
| Hooks | Create `useLocalStorage` helper | P2 | share logic across hooks |
| Hooks | Cache FX rate API calls | P3 | avoid excessive network usage |
| Utils | Enhance CSV parsing for quotes/commas | P3 | export/import stability |
| Styles | Convert `.field` to component/module | P3 | avoid leaking styles |

Priority key: **P1** = high priority, **P2** = medium, **P3** = lower priority.
