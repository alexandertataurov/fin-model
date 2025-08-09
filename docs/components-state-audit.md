# Component State Audit

The following components under `frontend/src/design-system/components` were scanned for interactive states and primitive usage.

| Component | Hover | Active | Focus | Missing primitives |
|-----------|-------|--------|-------|--------------------|
| Button | ✓ | ✓ | ✓ | border width, letter spacing, easing |
| Input | – | – | ✓ | border width, letter spacing |
| Toggle | ✓ | ✓ | ✓ | easing |
| Select | ✓ | – | ✓ | border width |
| Checkbox | – | – | ✓ | border width |

`✓` indicates the component implements the state. `–` indicates the state is not present.

Additional primitives identified as missing across components include:

- `border.width.*` for consistent border thickness
- `typography.letterSpacing.*` to control text tracking
- `motion.easing.*` for transition timing curves
