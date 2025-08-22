#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

/**
 * ComponentName - Brief description of what this component does
 * 
 * ## Usage
 * \`\`\`tsx
 * import { ComponentName } from '@/components/path/ComponentName';
 * 
 * <ComponentName prop1="value" prop2={true} />
 * \`\`\`
 * 
 * ## Features
 * - Feature 1
 * - Feature 2
 * - Feature 3
 * 
 * ## Accessibility
 * - Screen reader friendly
 * - Keyboard navigation support
 * - ARIA labels included
 */
const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed description of the component, its purpose, and key features.',
      },
    },
  },
  argTypes: {
    // Define all props with proper controls and descriptions
    prop1: {
      control: { type: 'text' },
      description: 'Description of prop1',
    },
    prop2: {
      control: { type: 'boolean' },
      description: 'Description of prop2',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story - shows the most common use case
export const Default: Story = {
  args: {
    prop1: 'Default Value',
    prop2: false,
  },
};

// Secondary story - shows an alternative state
export const Secondary: Story = {
  args: {
    prop1: 'Secondary Value',
    prop2: true,
  },
};

// Interactive story - demonstrates user interactions
export const Interactive: Story = {
  args: {
    prop1: 'Interactive',
    prop2: false,
  },
  play: async ({ canvasElement }) => {
    // Add interaction tests here
  },
};

// States story - shows different states
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <ComponentName prop1="Normal State" prop2={false} />
      <ComponentName prop1="Active State" prop2={true} />
      <ComponentName prop1="Disabled State" prop2={false} disabled />
    </div>
  ),
};

// Usage examples story - shows real-world usage patterns
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
        <ComponentName prop1="Basic Example" prop2={false} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">With Custom Styling</h3>
        <ComponentName 
          prop1="Custom Styled" 
          prop2={true}
          className="border-2 border-blue-500 rounded-lg"
        />
      </div>
    </div>
  ),
};
`;

function createStory(componentPath, options = {}) {
  const {
    title = 'Category/ComponentName',
    category = 'Components',
    description = 'Component description',
    features = ['Feature 1', 'Feature 2', 'Feature 3'],
    props = [
      { name: 'prop1', type: 'text', description: 'Description of prop1' },
      { name: 'prop2', type: 'boolean', description: 'Description of prop2' },
    ],
  } = options;

  // Extract component name from path
  const componentName = path.basename(
    componentPath,
    path.extname(componentPath)
  );
  const storyPath = componentPath.replace(/\.(tsx|ts)$/, '.stories.tsx');

  // Generate argTypes from props
  const argTypes = props
    .map(prop => {
      const control =
        prop.type === 'boolean'
          ? "{ type: 'boolean' }"
          : prop.type === 'select' && prop.options
          ? `{ type: 'select', options: [${prop.options
              .map(o => `'${o}'`)
              .join(', ')}] }`
          : `{ type: '${prop.type}' }`;

      return `    ${prop.name}: {
      control: ${control},
      description: '${prop.description}',
    },`;
    })
    .join('\n');

  // Generate features list
  const featuresList = features.map(f => ` * - ${f}`).join('\n');

  // Replace placeholders in template
  let storyContent = storyTemplate
    .replace(/ComponentName/g, componentName)
    .replace(/Category\/ComponentName/g, title)
    .replace(/Category/g, category)
    .replace(
      /Detailed description of the component, its purpose, and key features\./g,
      description
    )
    .replace(/\* - Feature 1\n \* - Feature 2\n \* - Feature 3/g, featuresList)
    .replace(
      /\/\/ Define all props with proper controls and descriptions\n    \/\/ Define all props with proper controls and descriptions\n    prop1: {\n      control: { type: 'text' },\n      description: 'Description of prop1',\n    },\n    prop2: {\n      control: { type: 'boolean' },\n      description: 'Description of prop2',\n    },/g,
      argTypes
    );

  // Write the story file
  fs.writeFileSync(storyPath, storyContent);
  console.log(`✅ Created story file: ${storyPath}`);

  return storyPath;
}

// CLI usage
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node create-story.js <component-path> [options]');
  console.log('');
  console.log('Options:');
  console.log(
    '  --title <title>        Story title (default: Category/ComponentName)'
  );
  console.log('  --category <category>  Story category (default: Components)');
  console.log('  --description <desc>   Component description');
  console.log('  --features <features>  Comma-separated list of features');
  console.log('  --props <props>        JSON string of props configuration');
  console.log('');
  console.log('Example:');
  console.log(
    '  node create-story.js src/components/ui/Button.tsx --title "UI/Button" --category "UI"'
  );
  process.exit(1);
}

const componentPath = args[0];
const options = {};

for (let i = 1; i < args.length; i += 2) {
  const flag = args[i];
  const value = args[i + 1];

  switch (flag) {
    case '--title':
      options.title = value;
      break;
    case '--category':
      options.category = value;
      break;
    case '--description':
      options.description = value;
      break;
    case '--features':
      options.features = value.split(',').map(f => f.trim());
      break;
    case '--props':
      try {
        options.props = JSON.parse(value);
      } catch (e) {
        console.error('Invalid JSON for props:', e.message);
        process.exit(1);
      }
      break;
  }
}

if (!fs.existsSync(componentPath)) {
  console.error(`❌ Component file not found: ${componentPath}`);
  process.exit(1);
}

createStory(componentPath, options);

export { createStory };
