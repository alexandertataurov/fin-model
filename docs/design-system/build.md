# Token build

Run `npm run build:tokens` from the repository root to generate design tokens.

This uses [Style Dictionary](https://amzn.github.io/style-dictionary/) with configuration in `config/style-dictionary.json`.
Token sources live under the `tokens/` directory as individual JSON files (e.g. `colors.json`, `spacing.json`).

The build writes generated artifacts directly to `frontend/src/design-system/`:

- `tokens.css` – CSS custom properties for all tokens
- `tokens.json` – nested token object for JavaScript/TypeScript consumption
- `tokens.d.ts` – TypeScript declarations for the JSON output

## Consuming tokens

- **Web**: `frontend/src/design-system/tokens.ts` imports the generated JSON and exposes helper utilities.
  Import `tokens.css` in your global styles to expose the CSS variables.
- **Other platforms**: consume the JSON or the generated declarations as needed.

Re‑run the build script whenever token definitions in `tokens/` change.
