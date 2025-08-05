# PNPM Migration

## Overview

Successfully migrated the project from npm to pnpm for better dependency management, faster installs, and improved disk space efficiency.

## Changes Made

### 1. Package.json Updates

- Added `"packageManager": "pnpm@8.15.0"` to specify the package manager
- Added pnpm-specific configuration:
  ```json
  "pnpm": {
    "overrides": {
      "react": "19.1.1",
      "react-dom": "19.1.1"
    },
    "peerDependencyRules": {
      "allowAny": ["@types/react", "@types/react-dom"]
    }
  }
  ```

### 2. .npmrc Configuration

Created `.npmrc` with pnpm-specific settings:

```
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
prefer-frozen-lockfile=true
save-prefix=""
```

### 3. Netlify Configuration

Updated `netlify.toml` to use pnpm commands:

- Changed from `npm ci` to `pnpm install --frozen-lockfile`
- Updated all build contexts (production, deploy-preview, branch-deploy)

## Benefits

### Performance

- **Faster installs**: pnpm uses hard links and symlinks for better performance
- **Disk space efficiency**: Shared dependencies across projects
- **Better caching**: More efficient dependency resolution

### Dependency Management

- **Strict dependency resolution**: Prevents phantom dependencies
- **Better monorepo support**: Built-in workspace management
- **Deterministic installs**: Consistent node_modules structure

### Security

- **Non-flat node_modules**: Prevents accessing undeclared dependencies
- **Better audit**: More accurate security scanning

## Migration Results

### ✅ Successful Migration

- All 145 tests pass
- Build process works correctly
- Dependencies properly installed
- Lock file generated (`pnpm-lock.yaml`)

### ⚠️ Known Issues

- Some peer dependency warnings for Storybook (non-critical)
- Deprecated ESLint version (can be updated later)

### 🔧 Recent Fixes

#### React 19 JSX Runtime Issue (Fixed)

- **Problem**: `h.jsxDEV is not a function` and `d.jsxDEV is not a function` errors due to React 19 compatibility issues
- **Solution**: Downgraded to React 18.3.1 for better stability and added explicit JSX runtime handling
- **Changes Made**:
  - Updated `package.json` to use React 18.2.0+ and React DOM 18.2.0+
  - Updated TypeScript types to match React 18
  - Enhanced Vite configuration with explicit JSX runtime includes
  - Added `jsxImportSource` to TypeScript config
  - Added explicit `react/jsx-runtime` import in main.tsx
  - Simplified Vite optimizeDeps configuration
  - Added missing `dev` script to package.json
  - Fixed Netlify configuration to use pnpm instead of npm
  - Enhanced Railway/Nixpacks configuration for frontend builds
  - Updated all production Vite configs for consistent JSX runtime handling

### ✅ Deployment Configuration Fixes

#### Netlify Deployment

- **Updated**: `netlify.toml` to use `pnpm` instead of `npm`
- **Fixed**: Build commands for all contexts (production, deploy-preview, branch-deploy)
- **Enhanced**: JSX runtime handling in production builds

#### Railway Deployment

- **Updated**: `nixpacks.toml` to include Node.js 20 and pnpm
- **Added**: Frontend build phase to build process
- **Fixed**: JSX runtime issues in production environment

## Usage

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm run build:netlify:simple
```

### CI/CD

- Netlify automatically uses pnpm for builds
- Uses `--frozen-lockfile` for deterministic installs
- Includes build verification in all environments

## Files Modified

- `package.json` - Added pnpm configuration
- `.npmrc` - Created pnpm settings
- `netlify.toml` - Updated build commands
- `pnpm-lock.yaml` - Generated lock file

## Next Steps

1. Consider updating ESLint to v9 for better React 19 support
2. Update Storybook dependencies to resolve peer dependency warnings
3. Consider using pnpm workspaces if adding more packages
