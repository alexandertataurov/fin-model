#!/usr/bin/env node

/**
 * Next Steps Standardization Script
 *
 * This script helps identify the next stories to standardize based on priority
 * and provides a systematic approach to complete the standardization.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Priority order for standardization
const PRIORITY_ORDER = {
  atoms: [
    'Label',
    'Layout',
    'Progress',
    'Radio',
    'Separator',
    'Skeleton',
    'Slider',
    'Switch',
    'Toggle',
  ],
  molecules: [
    'Accordion',
    'Alert',
    'Breadcrumb',
    'ButtonGroup',
    'Calendar',
    'Card',
    'ConfirmDialog',
    'DatePicker',
    'Dialog',
    'DropdownMenu',
    'Form',
    'FormField',
    'FormStatusAlert',
    'InputOTP',
    'Pagination',
    'ScrollArea',
    'SearchInput',
    'Select',
    'Table',
    'Tabs',
    'Tooltip',
  ],
  organisms: [
    'ActionBar',
    'BreadcrumbNav',
    'Dashboard',
    'DataTable',
    'FilterPanel',
    'Form',
    'NotificationCenter',
    'PaginationControls',
    'Sidebar',
    'StatusBar',
    'Test',
    'Wizard',
  ],
  foundations: [
    'Border',
    'BorderWidth',
    'Breakpoints',
    'Colors',
    'Display',
    'Grid',
    'Layout',
    'Motion',
    'Position',
    'Radius',
    'Shadows',
    'Sizing',
    'Spacing',
    'Transitions',
    'Typography',
    'ZIndex',
  ],
};

// Standardization checklist
const STANDARDIZATION_CHECKLIST = [
  '✅ Imports: React, Meta/StoryObj, shared components, Lucide icons',
  '✅ Meta: Consistent title format, layout: "padded", autodocs: true',
  '✅ AnimatedBanner: Proper title, subtitle, and icon',
  '✅ Stories: Variants → SizesAndShapes → UseCases → Guidelines → Interactive → Documentation',
  '✅ Styling: Consistent colors, spacing, Card components, icon usage',
  '✅ Structure: SectionHeader, Card, consistent grid layouts',
  '✅ Content: Real-world examples, proper descriptions, accessibility considerations',
];

// Function to analyze a story file
function analyzeStoryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  const analysis = {
    file: path.basename(filePath),
    path: filePath,
    hasStandardImports: false,
    hasStandardMeta: false,
    hasStandardStories: false,
    missingStories: [],
    issues: [],
  };

  // Check imports
  if (content.includes('SectionHeader') && content.includes('AnimatedBanner')) {
    analysis.hasStandardImports = true;
  } else {
    analysis.issues.push('Missing standard imports');
  }

  // Check meta configuration
  if (
    content.includes("layout: 'padded'") &&
    content.includes('autodocs: true')
  ) {
    analysis.hasStandardMeta = true;
  } else {
    analysis.issues.push('Non-standard meta configuration');
  }

  // Check story structure
  const requiredStories = [
    'Variants',
    'Guidelines',
    'Interactive',
    'Documentation',
  ];
  const missingStories = requiredStories.filter(
    story => !content.includes(`${story}: Story`)
  );

  if (missingStories.length === 0) {
    analysis.hasStandardStories = true;
  } else {
    analysis.missingStories = missingStories;
    analysis.issues.push(`Missing stories: ${missingStories.join(', ')}`);
  }

  return analysis;
}

// Function to get next stories to standardize
function getNextStoriesToStandardize() {
  const storiesDir = path.join(__dirname, '../src/design-system/stories');
  const nextStories = [];

  Object.entries(PRIORITY_ORDER).forEach(([category, components]) => {
    const categoryDir = path.join(storiesDir, category);
    if (fs.existsSync(categoryDir)) {
      components.forEach(component => {
        const filePath = path.join(categoryDir, `${component}.stories.tsx`);
        if (fs.existsSync(filePath)) {
          const analysis = analyzeStoryFile(filePath);
          if (analysis.issues.length > 0) {
            nextStories.push({
              category,
              component,
              analysis,
            });
          }
        }
      });
    }
  });

  return nextStories;
}

// Function to generate standardization plan
function generateStandardizationPlan() {
  const nextStories = getNextStoriesToStandardize();

  console.log('🎯 NEXT STEPS FOR STORY STANDARDIZATION\n');

  console.log('📋 STANDARDIZATION CHECKLIST:');
  STANDARDIZATION_CHECKLIST.forEach(item => {
    console.log(`  ${item}`);
  });

  console.log('\n📊 PRIORITY ORDER BY CATEGORY:');

  Object.entries(PRIORITY_ORDER).forEach(([category, components]) => {
    console.log(
      `\n📁 ${category.toUpperCase()} (${components.length} stories):`
    );

    components.forEach((component, index) => {
      const story = nextStories.find(
        s => s.category === category && s.component === component
      );
      const status = story ? '⚠️' : '✅';
      const issues = story ? ` - ${story.analysis.issues.join(', ')}` : '';

      console.log(`  ${index + 1}. ${status} ${component}${issues}`);
    });
  });

  console.log('\n🚀 RECOMMENDED NEXT ACTIONS:');
  console.log('1. Start with Atoms (highest impact, easiest to standardize)');
  console.log('2. Move to Molecules (medium complexity, good examples)');
  console.log(
    '3. Complete Organisms (complex components, comprehensive examples)'
  );
  console.log('4. Finish with Foundations (design tokens, reference material)');

  console.log('\n📝 TEMPLATE USAGE:');
  console.log('- Use STORY_TEMPLATE.md as the base template');
  console.log('- Follow the standardization checklist for each story');
  console.log('- Maintain consistent styling and structure');
  console.log('- Add real-world examples and accessibility considerations');

  return nextStories;
}

// Function to create a batch standardization plan
function createBatchPlan() {
  const nextStories = getNextStoriesToStandardize();

  console.log('\n🔄 BATCH STANDARDIZATION PLAN\n');

  // Group by category
  const batches = {
    atoms: nextStories.filter(s => s.category === 'atoms').slice(0, 3),
    molecules: nextStories.filter(s => s.category === 'molecules').slice(0, 3),
    organisms: nextStories.filter(s => s.category === 'organisms').slice(0, 3),
  };

  Object.entries(batches).forEach(([category, stories]) => {
    if (stories.length > 0) {
      console.log(
        `📦 ${category.toUpperCase()} BATCH (${stories.length} stories):`
      );
      stories.forEach((story, index) => {
        console.log(
          `  ${index + 1}. ${story.component} - ${story.analysis.issues.join(', ')}`
        );
      });
      console.log('');
    }
  });

  console.log('💡 BATCH PROCESSING TIPS:');
  console.log('- Work on one category at a time for consistency');
  console.log('- Use the same patterns across similar components');
  console.log('- Test each batch before moving to the next');
  console.log('- Update the work session document with progress');
}

// Main execution
function main() {
  console.log('🎯 NEXT STEPS FOR STORY STANDARDIZATION\n');

  const nextStories = generateStandardizationPlan();
  createBatchPlan();

  console.log('📈 PROGRESS TRACKING:');
  console.log(`- Total stories to standardize: ${nextStories.length}`);
  console.log(
    `- Atoms remaining: ${nextStories.filter(s => s.category === 'atoms').length}`
  );
  console.log(
    `- Molecules remaining: ${nextStories.filter(s => s.category === 'molecules').length}`
  );
  console.log(
    `- Organisms remaining: ${nextStories.filter(s => s.category === 'organisms').length}`
  );
  console.log(
    `- Foundations remaining: ${nextStories.filter(s => s.category === 'foundations').length}`
  );

  console.log('\n✅ Ready to continue standardization!');
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  getNextStoriesToStandardize,
  generateStandardizationPlan,
  createBatchPlan,
  STANDARDIZATION_CHECKLIST,
};
