# Storybook Netlify Deployment Guide

This guide explains how to deploy your Storybook to Netlify for easy sharing and collaboration.

## 🚀 Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
cd frontend
./deploy-storybook.sh
```

### Option 2: Manual Deployment

```bash
cd frontend

# Build Storybook
pnpm run storybook:build:netlify

# Deploy to Netlify
netlify deploy --config netlify-storybook.toml --prod
```

## 📋 Prerequisites

1. **Netlify CLI**: Install globally if not already installed

   ```bash
   npm install -g netlify-cli
   ```

2. **Netlify Account**: Make sure you're logged in

   ```bash
   netlify login
   ```

3. **Project Setup**: Ensure you're in the `frontend` directory

## 🔧 Configuration Files

### `netlify-storybook.toml`

- Dedicated Netlify configuration for Storybook
- Optimized build settings with memory management
- Proper SPA routing for Storybook
- Security headers and caching rules

### Build Scripts

- `storybook:build:netlify`: Optimized build with memory settings
- `storybook:build`: Standard build command
- `storybook`: Development server

## 🌐 Deployment Options

### 1. Production Deployment

```bash
netlify deploy --config netlify-storybook.toml --prod
```

### 2. Preview Deployment

```bash
netlify deploy --config netlify-storybook.toml
```

### 3. Branch Deployment

```bash
netlify deploy --config netlify-storybook.toml --branch=feature-branch
```

## 📁 Build Output

The Storybook build creates a `storybook-static` directory containing:

- Static HTML files
- CSS and JavaScript bundles
- Assets and images
- Storybook configuration

## 🔍 Troubleshooting

### Build Failures

1. Check Node.js version (requires 20+)
2. Ensure sufficient memory (8GB+ recommended)
3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

### Deployment Issues

1. Verify Netlify CLI is installed and logged in
2. Check build output in `storybook-static` directory
3. Review Netlify build logs for errors

### Performance Issues

1. The configuration includes memory optimizations
2. Assets are cached for 1 year
3. Build processing is disabled for faster builds

## 🎯 Features

- **Optimized Build**: Memory management and performance optimizations
- **SPA Routing**: Proper routing for Storybook navigation
- **Security Headers**: CSP, HSTS, and other security measures
- **Caching**: Long-term caching for static assets
- **Environment Support**: Production, preview, and branch deployments

## 📞 Support

If you encounter issues:

1. Check the build logs in Netlify dashboard
2. Verify your Storybook configuration in `.storybook/main.ts`
3. Ensure all dependencies are properly installed

## 🔄 Continuous Deployment

To set up automatic deployments:

1. Connect your repository to Netlify
2. Set the build command: `pnpm run storybook:build:netlify`
3. Set the publish directory: `storybook-static`
4. Use the `netlify-storybook.toml` configuration file
