#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface StructuralFix {
  file: string;
  issues: string[];
  fixesApplied: number;
}

class FinalStructureFixer {
  private storiesDir: string;
  private results: StructuralFix[] = [];

  constructor(storiesDir: string = 'src/design-system/stories') {
    this.storiesDir = storiesDir;
  }

  async fixAll(): Promise<void> {
    const storyFiles = this.findStoryFiles();
    
    console.log(`🔧 Applying final structural fixes to ${storyFiles.length} story files...`);
    console.log('─'.repeat(60));

    for (const file of storyFiles) {
      await this.fixFile(file);
    }

    this.printSummary();
  }

  private findStoryFiles(): string[] {
    const files: string[] = [];
    
    const scanDir = (dir: string): void => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith('.stories.tsx')) {
          files.push(fullPath);
        }
      }
    };

    scanDir(this.storiesDir);
    return files.sort();
  }

  private async fixFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result: StructuralFix = {
      file: path.relative(this.storiesDir, filePath),
      issues: [],
      fixesApplied: 0
    };

    let fixedContent = content;

    // Fix missing closing tags in various patterns
    fixedContent = this.fixMissingClosingTags(fixedContent, result);
    
    // Fix object structure issues
    fixedContent = this.fixObjectStructure(fixedContent, result);
    
    // Fix JSX component structure
    fixedContent = this.fixJSXStructure(fixedContent, result);
    
    // Fix export structure
    fixedContent = this.fixExportStructure(fixedContent, result);

    if (result.fixesApplied > 0) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✓ ${result.file}: ${result.fixesApplied} fixes applied`);
      result.issues.forEach(issue => console.log(`  └─ ${issue}`));
    }

    this.results.push(result);
  }

  private fixMissingClosingTags(content: string, result: StructuralFix): string {
    let fixed = content;
    
    // Fix StoryCard tags that are missing closing tags
    const storyCardPattern = /(<StoryCard[^>]*>[\s\S]*?)(<StoryCard)/g;
    fixed = fixed.replace(storyCardPattern, (match, p1, p2) => {
      if (!p1.includes('</StoryCard>')) {
        result.issues.push('Added missing </StoryCard> tag');
        result.fixesApplied++;
        return p1 + '</StoryCard>\n\n        ' + p2;
      }
      return match;
    });

    return fixed;
  }

  private fixObjectStructure(content: string, result: StructuralFix): string {
    let fixed = content;
    
    // Fix malformed meta object structure
    const metaPattern = /const meta: Meta[^=]*= \{([^}]*)\)\s*;\s*\}/g;
    fixed = fixed.replace(metaPattern, (match, p1) => {
      result.issues.push('Fixed malformed meta object');
      result.fixesApplied++;
      return match.replace(');\n}', '),\n}');
    });

    // Fix createStoryMeta calls with malformed syntax
    fixed = fixed.replace(/createStoryMeta\(\{([^}]*)\)\s*\)\s*;/g, (match, p1) => {
      result.issues.push('Fixed createStoryMeta call syntax');
      result.fixesApplied++;
      return match.replace('))', '})');
    });

    return fixed;
  }

  private fixJSXStructure(content: string, result: StructuralFix): string {
    let fixed = content;
    
    // Fix incomplete JSX closing patterns
    fixed = fixed.replace(/\s+},\s*$/g, '  ),\n}');
    
    // Fix story ending patterns
    fixed = fixed.replace(/}\s*export const/g, '}\n\nexport const');
    
    // Fix missing semicolons in story objects
    fixed = fixed.replace(/(\n\s*})\s*(\n\s*export const)/g, '$1;\n$2');

    return fixed;
  }

  private fixExportStructure(content: string, result: StructuralFix): string {
    let fixed = content;
    
    // Ensure proper story export structure
    const storyExportPattern = /export const (\w+): Story = \{([^}]*)\}/g;
    fixed = fixed.replace(storyExportPattern, (match, name, body) => {
      if (!body.includes('render:') && !body.includes('args:')) {
        return match;
      }
      
      // Check if missing semicolon
      if (!match.endsWith('};') && !match.endsWith('}')) {
        result.issues.push(`Fixed missing semicolon for ${name} story`);
        result.fixesApplied++;
        return match.endsWith('}') ? match + ';' : match;
      }
      
      return match;
    });

    return fixed;
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 FINAL STRUCTURE FIX SUMMARY');
    console.log('='.repeat(60));
    
    const totalFixes = this.results.reduce((sum, r) => sum + r.fixesApplied, 0);
    const filesWithFixes = this.results.filter(r => r.fixesApplied > 0);
    
    console.log(`✅ Total files processed: ${this.results.length}`);
    console.log(`🔧 Files with fixes applied: ${filesWithFixes.length}`);
    console.log(`🛠️  Total structural fixes: ${totalFixes}`);
    
    if (filesWithFixes.length > 0) {
      console.log('\n📋 Files that were modified:');
      filesWithFixes.forEach(result => {
        console.log(`  • ${result.file} (${result.fixesApplied} fixes)`);
      });
    }
    
    console.log('\n🎉 Final structural fixes completed! Ready to test Storybook build.');
  }
}

// Self-executing script
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new FinalStructureFixer();
  fixer.fixAll().catch(console.error);
}

export { FinalStructureFixer };