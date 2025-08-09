# Token build

Run `npm run build:tokens` from the repository root to generate design tokens.

This uses [Style Dictionary](https://amzn.github.io/style-dictionary/) with configuration in `config/style-dictionary.json`. Token sources live under the `tokens/` directory and build outputs are written to:

- `dist/tokens/css/colors.css`
- `dist/tokens/ts/tokens.ts`
- `dist/tokens/json/tokens.json`

## Consuming tokens

- **Web**: `frontend/src/design-system/tokens.ts` re-exports the generated JSON for React components.
- **Mobile**: import the JSON or TypeScript output from `dist/tokens` as needed.

Re-run the build script whenever token definitions change.
