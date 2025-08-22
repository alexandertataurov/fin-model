#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to fix a single story file
function fixStoryFile(filePath) {
  console.log(`Fixing: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove duplicate export default meta statements (keep only the last one)
    const exportDefaultMetaRegex = /export default meta;/g;
    const matches = content.match(exportDefaultMetaRegex);

    if (matches && matches.length > 1) {
      // Remove all but the last occurrence
      const lastIndex = content.lastIndexOf('export default meta;');
      content = content.replace(/export default meta;/g, '');
      content =
        content.substring(0, lastIndex) +
        'export default meta;' +
        content.substring(lastIndex + 'export default meta;'.length);
      modified = true;
      console.log(
        `  - Removed ${matches.length - 1} duplicate export default meta statements`
      );
    }

    // Fix common JSX closing tag issues
    const originalContent = content;

    // Fix missing closing tags for StoryCard
    content = content.replace(
      /<StoryCard([^>]*)>([\s\S]*?)(?=<StoryCard|<\/div>|<\/StorySection>|export const|export default)/g,
      (match, attrs, innerContent) => {
        if (!innerContent.includes('</StoryCard>')) {
          return `<StoryCard${attrs}>${innerContent}</StoryCard>`;
        }
        return match;
      }
    );

    // Fix missing closing parentheses for story objects
    content = content.replace(
      /export const (\w+): Story = \{([\s\S]*?)(?=export const|export default)/g,
      (match, storyName, storyContent) => {
        if (!storyContent.trim().endsWith('};')) {
          return `export const ${storyName}: Story = {${storyContent}};`;
        }
        return match;
      }
    );

    if (content !== originalContent) {
      modified = true;
      console.log(`  - Fixed JSX structure`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Fixed successfully`);
    } else {
      console.log(`  - No changes needed`);
    }
  } catch (error) {
    console.error(`  ❌ Error fixing ${filePath}:`, error.message);
  }
}

// Main execution
async function main() {
  console.log('🔧 Fixing Storybook syntax errors...\n');

  // Find all story files
  const storyFiles = await glob('src/design-system/stories/**/*.stories.tsx');

  console.log(`Found ${storyFiles.length} story files to check\n`);

  let fixedCount = 0;

  for (const file of storyFiles) {
    try {
      fixStoryFile(file);
      fixedCount++;
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\n🎉 Completed! Processed ${fixedCount} files.`);
}

main().catch(console.error);
