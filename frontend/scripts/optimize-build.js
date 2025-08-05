#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting build optimization...');

// Clean up unnecessary files and directories
const cleanupPaths = [
  'node_modules/.cache',
  'node_modules/.vite',
  '.vite',
  'dist',
  'coverage',
  'storybook-static',
  'cypress/videos',
  'cypress/screenshots',
  'test-results.xml',
  '.nyc_output',
  'htmlcov',
];

console.log('🧹 Cleaning up unnecessary files...');
cleanupPaths.forEach(cleanupPath => {
  const fullPath = path.join(process.cwd(), cleanupPath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Cleaned: ${cleanupPath}`);
    } catch (error) {
      console.log(`⚠️  Could not clean: ${cleanupPath}`);
    }
  }
});

// Optimize npm cache
console.log('📦 Optimizing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ NPM cache cleaned');
} catch (error) {
  console.log('⚠️  Could not clean npm cache');
}

// Create optimized .npmrc for build
console.log('⚙️  Creating optimized .npmrc...');
const optimizedNpmrc = `# Build-optimized NPM configuration
audit=false
fund=false
progress=false
save-exact=true
package-lock=true
prefer-offline=true
maxsockets=100
timeout=30000
registry=https://registry.npmjs.org/
loglevel=error
update-notifier=false
cache=.npm-cache
shamefully-hoist=true
legacy-peer-deps=true
strict-ssl=false
fetch-retries=3
fetch-retry-mintimeout=1000
fetch-retry-maxtimeout=5000
`;

fs.writeFileSync('.npmrc', optimizedNpmrc);
console.log('✅ Optimized .npmrc created');

// Set environment variables for faster builds
process.env.NODE_OPTIONS =
  '--max-old-space-size=8192 --max-semi-space-size=512';
process.env.NPM_CONFIG_AUDIT = 'false';
process.env.NPM_CONFIG_FUND = 'false';
process.env.NPM_CONFIG_OPTIONAL = 'false';
process.env.NPM_CONFIG_PROGRESS = 'false';
process.env.NPM_CONFIG_UPDATE_NOTIFIER = 'false';
process.env.NPM_CONFIG_LOGLEVEL = 'error';
process.env.NPM_CONFIG_MAXSOCKETS = '100';
process.env.NPM_CONFIG_PREFER_ONLINE = 'true';
process.env.NPM_CONFIG_INSTALL_STRATEGY = 'shallow';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.CI = 'true';

console.log('✅ Environment variables set for optimization');
console.log('🎉 Build optimization complete!');
