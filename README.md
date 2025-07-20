# Financial Modeling MVP

React + TypeScript frontend for a simple financial modeling tool.
It features:
- Monospaced fonts
- Clean financial report style layout
- Excel-like grid built with `ag-grid-react`
- Lightweight SVG chart visualizing revenue, profit, and cash flow

## Netlify Deployment
Netlify installs dependencies in `frontend`, runs `npm run build`, and publishes
the `frontend/dist` directory. Because this is a React single-page app, all
routes redirect to `index.html`.

An example function is provided in `netlify/functions/hello.js`. The functions
directory lives outside the frontend base, so `netlify.toml` sets
`[functions] directory = "../netlify/functions"`. Security headers are
configured via the `_headers` file in `frontend/public`.

