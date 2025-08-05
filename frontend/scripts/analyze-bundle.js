#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

// Build the project first
console.log('📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Analyze the dist folder
const distPath = path.join(__dirname, '../dist');
const assetsPath = path.join(distPath, 'assets');

if (!fs.existsSync(assetsPath)) {
  console.error('❌ Assets folder not found');
  process.exit(1);
}

const files = fs.readdirSync(assetsPath);
const jsFiles = files.filter(file => file.endsWith('.js'));
const cssFiles = files.filter(file => file.endsWith('.css'));

console.log('\n📊 Bundle Analysis Results:\n');

// Analyze JS files
console.log('📁 JavaScript Files:');
let totalJsSize = 0;
jsFiles.forEach(file => {
  const filePath = path.join(assetsPath, file);
  const stats = fs.statSync(filePath);
  const sizeInKb = (stats.size / 1024).toFixed(2);
  totalJsSize += stats.size;
  
  const sizeColor = stats.size > 500 * 1024 ? '🔴' : stats.size > 200 * 1024 ? '🟡' : '🟢';
  console.log(`  ${sizeColor} ${file}: ${sizeInKb} KB`);
});

// Analyze CSS files
console.log('\n🎨 CSS Files:');
let totalCssSize = 0;
cssFiles.forEach(file => {
  const filePath = path.join(assetsPath, file);
  const stats = fs.statSync(filePath);
  const sizeInKb = (stats.size / 1024).toFixed(2);
  totalCssSize += stats.size;
  
  const sizeColor = stats.size > 100 * 1024 ? '🔴' : stats.size > 50 * 1024 ? '🟡' : '🟢';
  console.log(`  ${sizeColor} ${file}: ${sizeInKb} KB`);
});

// Total sizes
const totalJsKb = (totalJsSize / 1024).toFixed(2);
const totalCssKb = (totalCssSize / 1024).toFixed(2);
const totalKb = ((totalJsSize + totalCssSize) / 1024).toFixed(2);

console.log('\n📈 Summary:');
console.log(`  Total JS: ${totalJsKb} KB`);
console.log(`  Total CSS: ${totalCssKb} KB`);
console.log(`  Total: ${totalKb} KB`);

// Recommendations
console.log('\n💡 Optimization Recommendations:');

if (totalJsSize > 1000 * 1024) {
  console.log('  🔴 Large JS bundle detected:');
  console.log('    - Consider implementing more aggressive code splitting');
  console.log('    - Review and remove unused dependencies');
  console.log('    - Use dynamic imports for heavy components');
}

if (totalCssSize > 100 * 1024) {
  console.log('  🟡 Large CSS bundle detected:');
  console.log('    - Consider purging unused CSS');
  console.log('    - Review Tailwind configuration');
  console.log('    - Split CSS by feature');
}

if (totalJsSize < 500 * 1024 && totalCssSize < 50 * 1024) {
  console.log('  🟢 Bundle size looks good!');
}

console.log('\n✅ Analysis complete!'); 