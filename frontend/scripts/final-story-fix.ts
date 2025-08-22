#!/usr/bin/env node
import { promises as fs } from 'fs';
import { glob } from 'glob';

async function finalStoryFix(): Promise<void> {
  console.log('🔧 Applying final story structure fixes...\n');
  
  const storyFiles = await glob('src/design-system/stories/**/*.stories.tsx', {
    cwd: process.cwd()
  });
  
  let totalFixes = 0;
  
  for (const file of storyFiles) {
    try {
      let content = await fs.readFile(file, 'utf-8');
      const originalContent = content;
      
      // Fix 1: Find all StoryCard opening and closing tags and properly match them
      const lines = content.split('\n');
      const result: string[] = [];
      const stack: string[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for StoryCard opening tags
        if (line.includes('<StoryCard') && !line.includes('</StoryCard>')) {
          stack.push('StoryCard');
          result.push(line);
        }
        // Check for StoryCard closing tags
        else if (line.includes('</StoryCard>')) {
          if (stack.length > 0 && stack[stack.length - 1] === 'StoryCard') {
            stack.pop();
            result.push(line);
          } else {
            // Orphaned closing tag - skip it
            console.log(`  Removing orphaned </StoryCard> at line ${i + 1}`);
          }
        }
        // Regular lines
        else {
          result.push(line);
        }
        
        // Check for component story endings that need StoryCard closing
        if (line.includes('  ),') && stack.length > 0 && stack[stack.length - 1] === 'StoryCard') {
          // Look ahead to see if there's a closing StoryCard tag
          let hasClosingTag = false;
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            if (lines[j].includes('</StoryCard>')) {
              hasClosingTag = true;
              break;
            }
          }
          if (!hasClosingTag) {
            result.push('        </StoryCard>');
            stack.pop();
            console.log(`  Added missing </StoryCard> after line ${i + 1}`);
          }
        }
      }
      
      // Close any remaining open StoryCard tags
      while (stack.length > 0 && stack[stack.length - 1] === 'StoryCard') {
        result.push('      </StoryCard>');
        stack.pop();
        console.log(`  Added missing closing </StoryCard> at end of file`);
      }
      
      content = result.join('\n');
      
      // Fix 2: Remove duplicate closing tags
      content = content.replace(/(\s*<\/StoryCard>)\s*\n\s*<\/StoryCard>/g, '$1');
      
      // Fix 3: Fix broken structure patterns
      content = content.replace(/\s*<\/div>\s*\n\s*<\/div>\s*\n\s*}\s*\n\s*}/g, '\n    </div>\n  ),\n}');
      
      // Fix 4: Fix StoryGuidelines broken tags  
      content = content.replace(/StoryGuidelines\s+doItems={[^}]+}\s+dontItems={[^}]+}\s+\/>\s+title=/g, 'StoryGuidelines doItems={[...]} dontItems={[...]} />\n        <GuidelinesSection title=');
      
      if (content !== originalContent) {
        await fs.writeFile(file, content, 'utf-8');
        totalFixes++;
        console.log(`✅ Applied structural fixes to ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error);
    }
  }
  
  console.log(`\n📊 Applied final fixes to ${totalFixes} files`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  finalStoryFix().catch(console.error);
}