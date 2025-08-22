#!/usr/bin/env node
import { promises as fs } from 'fs';
import { glob } from 'glob';

async function fixStoryCardTags(): Promise<void> {
  console.log('🔧 Fixing malformed StoryCard tags...\n');
  
  const storyFiles = await glob('src/design-system/stories/**/*.stories.tsx', {
    cwd: process.cwd()
  });
  
  let totalFixes = 0;
  
  for (const file of storyFiles) {
    try {
      let content = await fs.readFile(file, 'utf-8');
      const originalContent = content;
      
      // Fix 1: Remove orphaned </StoryCard> at start of lines
      content = content.replace(/^\s*<\/StoryCard>\s*\n<StoryCard/gm, '\n<StoryCard');
      
      // Fix 2: Fix broken StoryCard structures like "</StoryCard><StoryCard"
      content = content.replace(/<\/StoryCard>\s*\n\s*<\/StoryCard>\s*\n\s*<StoryCard/g, '</StoryCard>\n\n        <StoryCard');
      
      // Fix 3: Fix malformed opening patterns "</StoryCard><StoryCard"
      content = content.replace(/<\/StoryCard>\s*\n\s*<\/StoryCard>\s*\n<StoryCard/g, '</StoryCard>\n\n        <StoryCard');
      
      // Fix 4: Remove duplicate closing </StoryCard> tags
      content = content.replace(/<\/StoryCard>\s*\n\s*<\/StoryCard>/g, '</StoryCard>');
      
      // Fix 5: Fix orphaned </StoryCard> followed by <StoryCard> 
      content = content.replace(/\s*<\/StoryCard>\s*\n<StoryCard/g, '\n\n        <StoryCard');
      
      // Fix 6: Fix broken StoryGuidelines opening tag "<<StoryGuidelines"
      content = content.replace(/<<StoryGuidelines/g, '<StoryGuidelines');
      
      // Fix 7: Ensure proper spacing between StoryCards
      content = content.replace(/(<\/StoryCard>)\s*(\n\s*<StoryCard)/g, '$1\n$2');
      
      if (content !== originalContent) {
        await fs.writeFile(file, content, 'utf-8');
        totalFixes++;
        console.log(`✅ Fixed StoryCard issues in ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error);
    }
  }
  
  console.log(`\n📊 Fixed StoryCard issues in ${totalFixes} files`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fixStoryCardTags().catch(console.error);
}