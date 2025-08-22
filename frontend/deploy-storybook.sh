#!/bin/bash

# Storybook Netlify Deployment Script
# This script deploys Storybook to Netlify using the dedicated configuration

set -e

echo "🚀 Starting Storybook deployment to Netlify..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build Storybook locally first to test
echo "🔨 Building Storybook..."
pnpm run storybook:build:netlify

# Check if build was successful
if [ ! -d "storybook-static" ]; then
    echo "❌ Error: Storybook build failed. storybook-static directory not found."
    exit 1
fi

echo "✅ Storybook built successfully!"

# Deploy to Netlify using the storybook-specific config
echo "🌐 Deploying to Netlify..."
netlify deploy --config netlify-storybook.toml --prod

echo "🎉 Storybook deployed successfully!"
echo "📖 Your Storybook is now live on Netlify!"
