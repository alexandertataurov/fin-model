#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Testing Build Performance...\n');

// Function to measure execution time
function measureExecutionTime(command, description) {
  console.log(`⏱️  Running: ${description}`);
  const startTime = Date.now();

  try {
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env, CI: 'true' },
    });
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(
      `✅ ${description} completed in ${duration.toFixed(2)} seconds\n`
    );
    return duration;
  } catch (error) {
    console.log(`❌ ${description} failed: ${error.message}\n`);
    return null;
  }
}

// Test different build configurations
async function testBuildPerformance() {
  const results = [];

  // Test 1: Standard build
  console.log('📊 Test 1: Standard Build');
  const standardTime = measureExecutionTime('npm run build', 'Standard build');
  if (standardTime) results.push({ name: 'Standard', time: standardTime });

  // Test 2: Fast build
  console.log('📊 Test 2: Fast Build');
  const fastTime = measureExecutionTime('npm run build:fast', 'Fast build');
  if (fastTime) results.push({ name: 'Fast', time: fastTime });

  // Test 3: Netlify build
  console.log('📊 Test 3: Netlify Build');
  const netlifyTime = measureExecutionTime(
    'npm run build:netlify',
    'Netlify build'
  );
  if (netlifyTime) results.push({ name: 'Netlify', time: netlifyTime });

  // Test 4: Ultra build
  console.log('📊 Test 4: Ultra Build');
  const ultraTime = measureExecutionTime('npm run build:ultra', 'Ultra build');
  if (ultraTime) results.push({ name: 'Ultra', time: ultraTime });

  // Display results
  console.log('📈 Build Performance Results:');
  console.log('================================');

  results.forEach((result, index) => {
    const improvement =
      index > 0
        ? (((results[0].time - result.time) / results[0].time) * 100).toFixed(1)
        : 0;

    console.log(
      `${result.name.padEnd(10)}: ${result.time.toFixed(2)}s ${
        improvement > 0 ? `(${improvement}% faster)` : ''
      }`
    );
  });

  // Calculate bundle size
  console.log('\n📦 Bundle Size Analysis:');
  console.log('========================');

  if (fs.existsSync('dist')) {
    const distStats = fs.statSync('dist');
    const totalSize = (distStats.size / 1024 / 1024).toFixed(2);
    console.log(`Total bundle size: ${totalSize} MB`);

    // Analyze individual files
    const files = fs.readdirSync('dist');
    files.forEach(file => {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const filePath = `dist/${file}`;
        const fileStats = fs.statSync(filePath);
        const fileSize = (fileStats.size / 1024).toFixed(2);
        console.log(`  ${file}: ${fileSize} KB`);
      }
    });
  }

  console.log('\n🎉 Performance test completed!');
}

// Run the test
testBuildPerformance().catch(console.error);
