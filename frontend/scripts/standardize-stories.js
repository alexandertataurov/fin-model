#!/usr/bin/env node

/**
 * Story Standardization Script
 * 
 * This script helps standardize all Storybook stories to follow the same pattern:
 * - Consistent imports
 * - Standard story structure
 * - Uniform styling and layout
 * - Proper documentation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard imports template
const STANDARD_IMPORTS = `import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../../path/to/component';
import {
  SectionHeader,
  AnimatedBanner,
  GuidelinesSection,
  GuidelinesCard,
  Card
} from '../components';
import { Check, AlertTriangle, IconName } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';`;

// Standard meta template
const STANDARD_META = `const meta: Meta<typeof ComponentName> = {
  title: 'Category / ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Category: ComponentName"
            subtitle="A sophisticated component for [purpose]. Perfect for [use case]."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="[SVG path]"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Component-specific props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;`;

// Standard story structure
const STANDARD_STORIES = `// ============================================================================
// STORIES
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="ComponentName Variants"
        subtitle="Explore the different visual styles and states available for the ComponentName component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <IconName className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="space-y-3">
            <ComponentName />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Description</p>
              <p className="text-gray-600">Use case</p>
              <p className="text-xs font-mono text-gray-500 mt-1">props: values</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Common Use Cases"
        subtitle="Real-world examples of ComponentName usage in typical UI patterns."
      />
      {/* Use case examples */}
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Usage Guidelines"
        subtitle="Guidelines for using the ComponentName component effectively."
      />
      <Card className="p-8">
        <GuidelinesSection title="Do">
          <GuidelinesCard
            title="Do"
            variant="success"
            icon={<Check />}
            items={[
              'Guideline 1',
              'Guideline 2',
            ]}
          />
        </GuidelinesSection>
        <GuidelinesSection title="Don't">
          <GuidelinesCard
            title="Don't"
            variant="warning"
            icon={<AlertTriangle />}
            items={[
              'Anti-pattern 1',
              'Anti-pattern 2',
            ]}
          />
        </GuidelinesSection>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <IconName className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Interactive ComponentName</h3>
        </div>

        <div className="flex items-center justify-center mb-6">
          <ComponentName {...args} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Prop</p>
            <p className="font-mono text-gray-600">{args.propName}</p>
          </div>
        </div>
      </Card>
    </div>
  ),
  args: {
    // Default props
  },
  argTypes: {
    // Interactive controls
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete ComponentName Documentation"
        subtitle="Comprehensive guide to using the sophisticated ComponentName component."
      />
      {/* Documentation content */}
    </div>
  ),
};`;

// Standardization rules
const STANDARDIZATION_RULES = {
  // Import structure
  imports: {
    required: ['React', 'Meta', 'StoryObj', 'SectionHeader', 'AnimatedBanner', 'GuidelinesSection', 'GuidelinesCard', 'Card'],
    optional: ['Check', 'AlertTriangle', 'Title', 'Stories']
  },
  
  // Meta configuration
  meta: {
    layout: 'padded',
    autodocs: true,
    tags: ['autodocs']
  },
  
  // Story organization
  stories: [
    'Variants',
    'SizesAndShapes', 
    'UseCases',
    'InteractiveStates',
    'Guidelines',
    'Interactive',
    'Documentation'
  ],
  
  // Styling consistency
  styling: {
    spacing: 'space-y-16',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    card: 'Card className="p-6"',
    colors: {
      primary: 'bg-indigo-500',
      secondary: 'bg-gray-500',
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500'
    }
  }
};

// Function to analyze a story file
function analyzeStoryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const analysis = {
    file: filePath,
    hasStandardImports: false,
    hasStandardMeta: false,
    hasStandardStories: false,
    issues: []
  };
  
  // Check imports
  if (content.includes('SectionHeader') && content.includes('AnimatedBanner')) {
    analysis.hasStandardImports = true;
  } else {
    analysis.issues.push('Missing standard imports');
  }
  
  // Check meta configuration
  if (content.includes('layout: \'padded\'') && content.includes('autodocs: true')) {
    analysis.hasStandardMeta = true;
  } else {
    analysis.issues.push('Non-standard meta configuration');
  }
  
  // Check story structure
  if (content.includes('Variants: Story') && content.includes('Guidelines: Story')) {
    analysis.hasStandardStories = true;
  } else {
    analysis.issues.push('Missing standard story structure');
  }
  
  return analysis;
}

// Function to standardize a story file
function standardizeStoryFile(filePath) {
  console.log(`Standardizing: ${filePath}`);
  
  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract component name from file path
  const fileName = path.basename(filePath, '.stories.tsx');
  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  
  // TODO: Implement actual standardization logic
  // This would involve:
  // 1. Updating imports
  // 2. Standardizing meta configuration
  // 3. Adding missing stories
  // 4. Fixing styling inconsistencies
  
  console.log(`  - Component: ${componentName}`);
  console.log(`  - Status: Analysis complete`);
}

// Main execution
function main() {
  const storiesDir = path.join(__dirname, '../src/design-system/stories');
  
  console.log('🔍 Analyzing Storybook stories for standardization...\n');
  
  // Analyze all story files
  const categories = ['atoms', 'molecules', 'organisms', 'foundations'];
  const allAnalyses = [];
  
  categories.forEach(category => {
    const categoryDir = path.join(storiesDir, category);
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.stories.tsx'));
      
      console.log(`📁 ${category.toUpperCase()} (${files.length} files):`);
      
      files.forEach(file => {
        const filePath = path.join(categoryDir, file);
        const analysis = analyzeStoryFile(filePath);
        allAnalyses.push(analysis);
        
        const status = analysis.issues.length === 0 ? '✅' : '⚠️';
        console.log(`  ${status} ${file}`);
        
        if (analysis.issues.length > 0) {
          analysis.issues.forEach(issue => {
            console.log(`    - ${issue}`);
          });
        }
      });
      console.log('');
    }
  });
  
  // Summary
  const standardized = allAnalyses.filter(a => a.issues.length === 0).length;
  const total = allAnalyses.length;
  
  console.log('📊 SUMMARY:');
  console.log(`  Total stories: ${total}`);
  console.log(`  Standardized: ${standardized}`);
  console.log(`  Need updates: ${total - standardized}`);
  console.log(`  Coverage: ${Math.round((standardized / total) * 100)}%`);
  
  if (total - standardized > 0) {
    console.log('\n🚀 To standardize all stories, run:');
    console.log('  npm run standardize-stories');
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  analyzeStoryFile,
  standardizeStoryFile,
  STANDARDIZATION_RULES
};
