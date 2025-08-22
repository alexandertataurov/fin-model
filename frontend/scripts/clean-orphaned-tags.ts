#!/usr/bin/env node
import { promises as fs } from 'fs';
import { glob } from 'glob';

async function cleanOrphanedTags(): Promise<void> {
  console.log('🔧 Cleaning orphaned StoryCard tags...\n');
  
  const storyFiles = await glob('src/design-system/stories/**/*.stories.tsx', {
    cwd: process.cwd()
  });
  
  let totalFixes = 0;
  
  for (const file of storyFiles) {
    try {
      let content = await fs.readFile(file, 'utf-8');
      const originalContent = content;
      
      // Remove orphaned closing tags that appear after story endings
      // Pattern: }),\n        </StoryCard>\n}
      content = content.replace(/\),\s*\n\s*<\/StoryCard>\s*\n}/g, '),\n}');
      
      // Remove orphaned </StoryCard> at the end of export statements
      content = content.replace(/\s*<\/StoryCard>\s*\n};?\s*$/gm, '};');
      
      // Clean up broken StoryGuidelines structures
      content = content.replace(/StoryGuidelines doItems={\[...\]} dontItems={\[...\]} \/>\s*\n\s*<GuidelinesSection title=/g, 'StoryGuidelines\n        doItems={[\n          "Add appropriate guidelines here"\n        ]}\n        dontItems={[\n          "Add anti-patterns here"\n        ]}\n      />\n      <GuidelinesSection title=');
      
      // Fix broken closing tag patterns
      content = content.replace(/<\/<StoryGuidelines[^>]*>/g, '</GuidelinesSection>');
      
      if (content !== originalContent) {
        await fs.writeFile(file, content, 'utf-8');
        totalFixes++;
        console.log(`✅ Cleaned orphaned tags in ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Error cleaning ${file}:`, error);
    }
  }
  
  console.log(`\n📊 Cleaned orphaned tags in ${totalFixes} files`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cleanOrphanedTags().catch(console.error);
}