#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Clearing Storybook cache and dependencies...');

const directoriesToRemove = [
  'node_modules/.cache',
  'node_modules/.vite',
  '.storybook-static',
  'storybook-static',
];

const currentDir = process.cwd();

directoriesToRemove.forEach(dir => {
  const fullPath = path.join(currentDir, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

try {
  console.log('Clearing pnpm store...');
  execSync('pnpm store prune', { stdio: 'inherit' });
} catch {}

console.log('✅ Cache cleared successfully!');
