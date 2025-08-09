#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying build integrity...');

const distPath = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ index.html not found in dist');
  process.exit(1);
}

// Read index.html
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Check for common build issues
const buildChecks = [
  {
    name: 'Main JS Bundle',
    pattern: /assets\/index-.*\.js/,
    required: true,
  },
  {
    name: 'CSS Bundle',
    pattern: /assets\/.*\.css/,
    required: true,
  },
];

let allChecksPassed = true;

buildChecks.forEach(check => {
  const hasPattern = check.pattern.test(indexHtml);
  if (check.required && !hasPattern) {
    console.error(`❌ ${check.name} not found in build`);
    allChecksPassed = false;
  } else if (hasPattern) {
    console.log(`✅ ${check.name} found`);
  }
});

// Check for asset files
const assetsDir = path.join(distPath, 'assets');
if (fs.existsSync(assetsDir)) {
  const assets = fs.readdirSync(assetsDir);
  const jsFiles = assets.filter(file => file.endsWith('.js'));
  const cssFiles = assets.filter(file => file.endsWith('.css'));

  console.log(`✅ Found ${jsFiles.length} JS files`);
  console.log(`✅ Found ${cssFiles.length} CSS files`);

  if (jsFiles.length === 0) {
    console.error('❌ No JS files found in assets');
    allChecksPassed = false;
  }
} else {
  console.error('❌ assets directory not found');
  allChecksPassed = false;
}

if (allChecksPassed) {
  console.log('✅ Build verification completed successfully');
} else {
  console.error('❌ Build verification failed');
  process.exit(1);
}
