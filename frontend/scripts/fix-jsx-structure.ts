#!/usr/bin/env node
import { promises as fs } from 'fs';
import { glob } from 'glob';

interface JSXFix {
  file: string;
  fixes: number;
  errors: string[];
}

class JSXStructureFixer {
  private results: JSXFix[] = [];
  
  async fixAllStoryFiles(): Promise<void> {
    console.log('🔧 Fixing JSX structural issues in story files...\n');
    
    const storyFiles = await glob('src/design-system/stories/**/*.stories.tsx', {
      cwd: process.cwd()
    });
    
    for (const file of storyFiles) {
      await this.fixStoryFile(file);
    }
    
    this.printResults();
  }
  
  private async fixStoryFile(filePath: string): Promise<void> {
    const result: JSXFix = { file: filePath, fixes: 0, errors: [] };
    
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      const originalContent = content;
      
      // Parse and fix the JSX structure
      content = this.fixJSXStructure(content, result);
      
      if (content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Fixed ${result.fixes} JSX issues in ${filePath}`);
      }
      
      this.results.push(result);
    } catch (error) {
      result.errors.push(`Error processing file: ${error}`);
      console.error(`❌ Error fixing ${filePath}:`, error);
      this.results.push(result);
    }
  }
  
  private fixJSXStructure(content: string, result: JSXFix): string {
    let fixes = 0;
    
    // Split into lines for easier processing
    const lines = content.split('\n');
    const fixedLines: string[] = [];
    const openTags: Array<{tag: string, line: number}> = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Track StoryCard opening tags
      if (line.includes('<StoryCard') && !line.includes('</StoryCard>') && !line.includes('/>')) {
        openTags.push({tag: 'StoryCard', line: i});
        fixedLines.push(line);
      }
      // Track StoryCard closing tags
      else if (line.includes('</StoryCard>')) {
        if (openTags.length > 0 && openTags[openTags.length - 1].tag === 'StoryCard') {
          openTags.pop();
          fixedLines.push(line);
        } else {
          // Orphaned closing tag - remove it
          console.log(`  Removing orphaned </StoryCard> at line ${i + 1}`);
          fixes++;
          continue; // Skip this line
        }
      }
      // Check for story endings that need closing tags
      else if (line.match(/^\s*\)\s*,?\s*$/) && openTags.length > 0) {
        // Look ahead to see if there's already a closing tag
        let hasClosingTag = false;
        for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
          if (lines[j].includes('</StoryCard>')) {
            hasClosingTag = true;
            break;
          }
        }
        
        if (!hasClosingTag) {
          // Add missing closing tags before the story ending
          while (openTags.length > 0 && openTags[openTags.length - 1].tag === 'StoryCard') {
            fixedLines.push('        </StoryCard>');
            openTags.pop();
            fixes++;
            console.log(`  Added missing </StoryCard> before line ${i + 1}`);
          }
        }
        fixedLines.push(line);
      }
      else {
        fixedLines.push(line);
      }
    }
    
    // Close any remaining open tags at the end
    while (openTags.length > 0 && openTags[openTags.length - 1].tag === 'StoryCard') {
      fixedLines.push('      </StoryCard>');
      openTags.pop();
      fixes++;
      console.log(`  Added missing closing </StoryCard> at end of file`);
    }
    
    let fixedContent = fixedLines.join('\n');
    
    // Additional cleanup patterns
    fixedContent = this.cleanupPatterns(fixedContent, result);
    
    result.fixes = fixes + result.fixes;
    return fixedContent;
  }
  
  private cleanupPatterns(content: string, result: JSXFix): string {
    let fixes = 0;
    
    // Fix broken StoryGuidelines patterns
    content = content.replace(
      /StoryGuidelines\s+doItems={\[[^\]]*\]}\s+dontItems={\[[^\]]*\]}\s+\/>\s*<GuidelinesSection/g,
      'StoryGuidelines\n        doItems={[\n          "Use component appropriately"\n        ]}\n        dontItems={[\n          "Avoid misuse"\n        ]}\n      />\n      <GuidelinesSection'
    );
    
    // Fix malformed closing tags
    content = content.replace(/<\/<[^>]*StoryGuidelines[^>]*>/g, '</GuidelinesSection>');
    
    // Remove duplicate closing div tags that don't match structure
    content = content.replace(/(\s*<\/div>)\s*\n\s*<\/div>\s*\n\s*\)\s*,/g, '$1\n    ),');
    
    // Fix export statement endings
    content = content.replace(/\),\s*\n\s*<\/\w+>\s*\n}/g, '),\n}');
    
    result.fixes += fixes;
    return content;
  }
  
  private printResults(): void {
    const totalFiles = this.results.length;
    const fixedFiles = this.results.filter(r => r.fixes > 0).length;
    const totalFixes = this.results.reduce((sum, r) => sum + r.fixes, 0);
    const errors = this.results.filter(r => r.errors.length > 0).length;
    
    console.log('\n📊 JSX STRUCTURE FIXES SUMMARY');
    console.log('='.repeat(40));
    console.log(`📁 Files processed: ${totalFiles}`);
    console.log(`✅ Files fixed: ${fixedFiles}`);
    console.log(`🔧 Total fixes applied: ${totalFixes}`);
    console.log(`❌ Files with errors: ${errors}`);
    
    if (errors > 0) {
      console.log('\n🚨 Files with errors:');
      this.results
        .filter(r => r.errors.length > 0)
        .forEach(r => {
          console.log(`  - ${r.file}: ${r.errors.join(', ')}`);
        });
    }
    
    console.log('\n✅ JSX structure fixes complete!');
  }
}

async function main() {
  const fixer = new JSXStructureFixer();
  await fixer.fixAllStoryFiles();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}