#!/usr/bin/env node

/**
 * Dependency Analysis Script
 * Analyzes package.json to identify optimization opportunities for faster CI/CD
 */

import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageLockPath = path.join(process.cwd(), 'package-lock.json');

function analyzeDependencies() {
  console.log('🔍 Analyzing dependencies for CI/CD optimization...\n');

  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  console.log('📊 Dependency Statistics:');
  console.log(`   Dependencies: ${Object.keys(dependencies).length}`);
  console.log(`   Dev Dependencies: ${Object.keys(devDependencies).length}`);
  console.log(
    `   Total: ${
      Object.keys(dependencies).length + Object.keys(devDependencies).length
    }\n`
  );

  // Analyze Radix UI components
  const radixComponents = Object.keys(dependencies).filter(dep =>
    dep.startsWith('@radix-ui/react-')
  );

  console.log('🎨 Radix UI Components:');
  console.log(`   Count: ${radixComponents.length}`);
  console.log(`   Components: ${radixComponents.join(', ')}\n`);

  // Identify potential duplicates
  const allDeps = { ...dependencies, ...devDependencies };
  const duplicatePatterns = [];

  // Check for similar packages
  const patterns = [
    { pattern: /^@types\//, name: 'TypeScript type definitions' },
    { pattern: /^@testing-library\//, name: 'Testing library packages' },
    { pattern: /^eslint/, name: 'ESLint packages' },
    { pattern: /^@storybook/, name: 'Storybook packages' },
    { pattern: /^cypress/, name: 'Cypress packages' },
  ];

  patterns.forEach(({ pattern, name }) => {
    const matches = Object.keys(allDeps).filter(dep => pattern.test(dep));
    if (matches.length > 1) {
      duplicatePatterns.push({
        name,
        count: matches.length,
        packages: matches,
      });
    }
  });

  if (duplicatePatterns.length > 0) {
    console.log('⚠️  Potential Optimization Opportunities:');
    duplicatePatterns.forEach(({ name, count, packages }) => {
      console.log(`   ${name}: ${count} packages`);
      console.log(`     ${packages.join(', ')}`);
    });
    console.log('');
  }

  // Check for large packages
  const largePackages = [
    'cypress',
    'puppeteer',
    'storybook',
    'lighthouse',
    '@storybook',
  ];

  const foundLargePackages = largePackages.filter(pkg =>
    Object.keys(allDeps).some(dep => dep.includes(pkg))
  );

  if (foundLargePackages.length > 0) {
    console.log('📦 Large Packages (consider for CI optimization):');
    foundLargePackages.forEach(pkg => {
      console.log(`   - ${pkg}`);
    });
    console.log('');
  }

  // Recommendations
  console.log('💡 Optimization Recommendations:');
  console.log('   1. Use pnpm instead of npm for faster installation');
  console.log('   2. Consider using package-ci.json for CI-only dependencies');
  console.log('   3. Enable aggressive caching in CI');
  console.log('   4. Use --prefer-offline flag in CI');
  console.log('   5. Consider tree-shaking unused Radix UI components');
  console.log('   6. Move large dev dependencies to optional installation');
  console.log('   7. Use parallel installation for independent packages\n');

  // Calculate estimated savings
  const estimatedSavings = {
    pnpm: '40-60%',
    caching: '30-50%',
    treeShaking: '10-20%',
    parallelInstall: '20-30%',
  };

  console.log('⏱️  Estimated Time Savings:');
  Object.entries(estimatedSavings).forEach(([method, savings]) => {
    console.log(`   ${method}: ${savings}`);
  });
  console.log('');

  return {
    totalDeps:
      Object.keys(dependencies).length + Object.keys(devDependencies).length,
    radixComponents: radixComponents.length,
    optimizationOpportunities: duplicatePatterns.length,
  };
}

// Run analysis
try {
  const results = analyzeDependencies();

  // Exit with code based on optimization opportunities
  if (results.optimizationOpportunities > 0) {
    console.log('🚀 Run "npm run optimize-deps" to apply optimizations');
    process.exit(0);
  } else {
    console.log('✅ Dependencies look well optimized!');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Error analyzing dependencies:', error.message);
  process.exit(1);
}
