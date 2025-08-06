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

// Remove cache directories
directoriesToRemove.forEach(dir => {
  const fullPath = path.join(currentDir, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

// Clear npm cache
try {
  console.log('Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.log('npm cache clear failed, continuing...');
}

// Clear pnpm cache if using pnpm
try {
  console.log('Clearing pnpm cache...');
  execSync('pnpm store prune', { stdio: 'inherit' });
} catch (error) {
  console.log('pnpm cache clear failed, continuing...');
}

console.log('✅ Cache cleared successfully!');
console.log('📝 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run storybook'); 