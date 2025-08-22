#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

interface StoryFix {
  file: string;
  fixes: number;
  errors: string[];
}

class StoryFixer {
  private results: StoryFix[] = [];
  
  async fixAllStories(): Promise<void> {
    console.log('🔧 Fixing story issues...\n');
    
    const storyFiles = await glob('src/design-system/stories/**/*.stories.tsx', {
      cwd: process.cwd()
    });
    
    for (const file of storyFiles) {
      await this.fixStoryFile(file);
    }
    
    this.printResults();
  }
  
  private async fixStoryFile(filePath: string): Promise<void> {
    const result: StoryFix = { file: filePath, fixes: 0, errors: [] };
    
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      const originalContent = content;
      
      // Fix 1: Remove duplicate React imports
      content = this.fixDuplicateReactImports(content);
      
      // Fix 2: Fix unclosed StoryCard tags
      content = this.fixUnclosedStoryCards(content);
      
      // Fix 3: Fix syntax errors in specific patterns
      content = this.fixSyntaxErrors(content);
      
      if (content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf-8');
        result.fixes = this.countFixes(originalContent, content);
        console.log(`✅ Fixed ${result.fixes} issues in ${filePath}`);
      }
      
      this.results.push(result);
    } catch (error) {
      result.errors.push(`Error processing file: ${error}`);
      console.error(`❌ Error fixing ${filePath}:`, error);
      this.results.push(result);
    }
  }
  
  private fixDuplicateReactImports(content: string): string {
    // Pattern 1: import React from 'react'; import * as React from 'react';
    content = content.replace(
      /import React from 'react';\s*\nimport \* as React from 'react';/g,
      "import * as React from 'react';"
    );
    
    // Pattern 2: import * as React from 'react'; import React from 'react';
    content = content.replace(
      /import \* as React from 'react';\s*\nimport React from 'react';/g,
      "import * as React from 'react';"
    );
    
    // Pattern 3: Multiple React imports on separate lines
    const lines = content.split('\n');
    const reactImportIndices: number[] = [];
    
    lines.forEach((line, index) => {
      if (line.trim().startsWith('import React') || line.trim().startsWith('import * as React')) {
        reactImportIndices.push(index);
      }
    });
    
    if (reactImportIndices.length > 1) {
      // Keep only the first React import (preferring * as React)
      const reactImports = reactImportIndices.map(i => lines[i]);
      const preferredImport = reactImports.find(imp => imp.includes('* as React')) || reactImports[0];
      
      // Remove all React imports
      for (let i = reactImportIndices.length - 1; i >= 0; i--) {
        lines.splice(reactImportIndices[i], 1);
      }
      
      // Add back the preferred import at the first position
      lines.splice(reactImportIndices[0], 0, preferredImport);
      content = lines.join('\n');
    }
    
    return content;
  }
  
  private fixUnclosedStoryCards(content: string): string {
    // Fix pattern: <StoryCard...>...</Card>
    content = content.replace(
      /<StoryCard([^>]*)>([\s\S]*?)<\/Card>/g,
      '<StoryCard$1>$2</StoryCard>'
    );
    
    return content;
  }
  
  private fixSyntaxErrors(content: string): string {
    // Fix unexpected tokens in specific files
    
    // Fix Select.stories.tsx - remove stray closing bracket
    if (content.includes('Select.stories.tsx')) {
      content = content.replace(/}\s*\n\s*export const Variants/g, '\nexport const Variants');
    }
    
    // Fix Text.stories.tsx - common syntax issues
    content = content.replace(/}\s*;(\s*export)/g, '}$1');
    
    // Fix BorderWidth.stories.tsx - remove extra tokens
    content = content.replace(/BorderWidthComponents\s*,\s*}/g, 'BorderWidthComponents }');
    
    // Fix Motion.stories.tsx - close StoryCard properly
    content = content.replace(/(<StoryCard[^>]*>[\s\S]*?)(<StoryCard)/g, '$1</StoryCard>\n$2');
    
    return content;
  }
  
  private countFixes(original: string, fixed: string): number {
    const originalLines = original.split('\n').length;
    const fixedLines = fixed.split('\n').length;
    return Math.abs(originalLines - fixedLines) + (original !== fixed ? 1 : 0);
  }
  
  private printResults(): void {
    const totalFiles = this.results.length;
    const fixedFiles = this.results.filter(r => r.fixes > 0).length;
    const totalFixes = this.results.reduce((sum, r) => sum + r.fixes, 0);
    const errors = this.results.filter(r => r.errors.length > 0).length;
    
    console.log('\n📊 STORY FIXES SUMMARY');
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
    
    console.log('\n✅ Story fixes complete!');
  }
}

async function main() {
  const fixer = new StoryFixer();
  await fixer.fixAllStories();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}