#!/usr/bin/env node

/**
 * Storybook Stories Fix Script
 *
 * This script helps identify and fix common issues in Storybook story files:
 * 1. Export pattern issues (missing StoryObj type)
 * 2. Empty args (args: {})
 * 3. Missing argTypes
 * 4. Inconsistent patterns
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - use absolute path from script location
const STORIES_PATTERN = path.join(__dirname, '../src/**/*.stories.tsx');
const IGNORE_PATTERNS = ['node_modules', 'dist', 'build', '.storybook'];

// Issue detection patterns
const PATTERNS = {
  emptyArgs: /args:\s*\{\s*\}/g,
  missingStoryObj: /export const \w+:\s*Story\s*=\s*\{/g,
  missingMetaType: /const meta\s*=\s*\{/g,
  missingComponentProp: /component:\s*[A-Z][a-zA-Z]*/g,
  missingArgTypes: /argTypes:\s*\{/g,
};

// Statistics
let stats = {
  totalFiles: 0,
  emptyArgs: 0,
  missingStoryObj: 0,
  missingMetaType: 0,
  missingComponentProp: 0,
  missingArgTypes: 0,
  fixedFiles: 0,
};

/**
 * Find all story files
 */
function findStoryFiles() {
  const files = glob.sync(STORIES_PATTERN, {
    ignore: IGNORE_PATTERNS.map(pattern => `**/${pattern}/**`),
  });

  console.log(`📁 Found ${files.length} story files`);
  return files;
}

/**
 * Analyze a single story file
 */
function analyzeStoryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check for empty args
  if (PATTERNS.emptyArgs.test(content)) {
    issues.push('empty-args');
    stats.emptyArgs++;
  }

  // Check for missing StoryObj type
  if (!PATTERNS.missingStoryObj.test(content)) {
    issues.push('missing-story-obj');
    stats.missingStoryObj++;
  }

  // Check for missing Meta type
  if (PATTERNS.missingMetaType.test(content)) {
    issues.push('missing-meta-type');
    stats.missingMetaType++;
  }

  // Check for missing component prop
  if (!PATTERNS.missingComponentProp.test(content)) {
    issues.push('missing-component-prop');
    stats.missingComponentProp++;
  }

  // Check for missing argTypes
  if (!PATTERNS.missingArgTypes.test(content)) {
    issues.push('missing-arg-types');
    stats.missingArgTypes++;
  }

  return {
    filePath,
    issues,
    content,
  };
}

/**
 * Generate fix suggestions for a file
 */
function generateFixSuggestions(analysis) {
  const suggestions = [];

  if (analysis.issues.includes('empty-args')) {
    suggestions.push({
      type: 'empty-args',
      description: 'Add meaningful args with realistic values',
      example: `export const Default: Story = {
  args: {
    // Add meaningful props here
    prop1: 'value1',
    prop2: true,
  },
};`,
    });
  }

  if (analysis.issues.includes('missing-story-obj')) {
    suggestions.push({
      type: 'missing-story-obj',
      description: 'Convert to modern StoryObj pattern',
      example: `import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Component> = {
  title: 'Category/Component',
  component: Component,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // story content
};`,
    });
  }

  if (analysis.issues.includes('missing-meta-type')) {
    suggestions.push({
      type: 'missing-meta-type',
      description: 'Add proper Meta type annotation',
      example: `const meta: Meta<typeof Component> = {
  // meta content
};`,
    });
  }

  if (analysis.issues.includes('missing-component-prop')) {
    suggestions.push({
      type: 'missing-component-prop',
      description: 'Add component prop to meta',
      example: `const meta: Meta<typeof Component> = {
  title: 'Category/Component',
  component: Component, // Add this line
  // other props
};`,
    });
  }

  if (analysis.issues.includes('missing-arg-types')) {
    suggestions.push({
      type: 'missing-arg-types',
      description: 'Add comprehensive argTypes for better controls',
      example: `const meta: Meta<typeof Component> = {
  // other props
  argTypes: {
    prop1: {
      control: { type: 'text' },
      description: 'Description of prop1',
    },
    prop2: {
      control: { type: 'boolean' },
      description: 'Description of prop2',
    },
  },
};`,
    });
  }

  return suggestions;
}

/**
 * Main analysis function
 */
function analyzeStories() {
  console.log('🔍 Analyzing Storybook stories...\n');

  const files = findStoryFiles();
  const analyses = [];

  for (const file of files) {
    stats.totalFiles++;
    const analysis = analyzeStoryFile(file);
    if (analysis.issues.length > 0) {
      analyses.push(analysis);
    }
  }

  // Print summary
  console.log('📊 Analysis Summary:');
  console.log(`Total files: ${stats.totalFiles}`);
  console.log(`Files with issues: ${analyses.length}`);
  console.log(`Empty args: ${stats.emptyArgs}`);
  console.log(`Missing StoryObj: ${stats.missingStoryObj}`);
  console.log(`Missing Meta type: ${stats.missingMetaType}`);
  console.log(`Missing component prop: ${stats.missingComponentProp}`);
  console.log(`Missing argTypes: ${stats.missingArgTypes}\n`);

  // Print detailed issues
  if (analyses.length > 0) {
    console.log('🚨 Files with issues:');
    analyses.forEach(analysis => {
      console.log(`\n📄 ${analysis.filePath}`);
      const suggestions = generateFixSuggestions(analysis);
      suggestions.forEach(suggestion => {
        console.log(`  ❌ ${suggestion.description}`);
      });
    });
  }

  return analyses;
}

/**
 * Generate fix report
 */
function generateFixReport(analyses) {
  const report = {
    summary: stats,
    files: analyses.map(analysis => ({
      file: analysis.filePath,
      issues: analysis.issues,
      suggestions: generateFixSuggestions(analysis),
    })),
  };

  const reportPath = path.join(__dirname, 'storybook-fix-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📋 Fix report saved to: ${reportPath}`);

  return report;
}

/**
 * Main execution
 */
function main() {
  try {
    const analyses = analyzeStories();
    const report = generateFixReport(analyses);

    console.log('\n✅ Analysis complete!');
    console.log('\nNext steps:');
    console.log('1. Review the generated report');
    console.log('2. Apply fixes using the established patterns');
    console.log('3. Run this script again to verify fixes');
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
  }
}

// Run if called directly
main();
