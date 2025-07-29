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

