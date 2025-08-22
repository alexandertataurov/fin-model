#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface MetaFix {
  file: string;
  issues: string[];
  fixesApplied: number;
}

class MetaSyntaxFixer {
  private storiesDir: string;
  private results: MetaFix[] = [];

  constructor(storiesDir: string = 'src/design-system/stories') {
    this.storiesDir = storiesDir;
  }

  async fixAll(): Promise<void> {
    const storyFiles = this.findStoryFiles();
    
    console.log(`🔧 Fixing meta syntax errors in ${storyFiles.length} story files...`);
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
    const result: MetaFix = {
      file: path.relative(this.storiesDir, filePath),
      issues: [],
      fixesApplied: 0
    };

    let fixedContent = content;

    // Fix the meta object syntax issues
    fixedContent = this.fixMetaObjectSyntax(fixedContent, result);

    if (result.fixesApplied > 0) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✓ ${result.file}: ${result.fixesApplied} fixes applied`);
      result.issues.forEach(issue => console.log(`  └─ ${issue}`));
    }

    this.results.push(result);
  }

  private fixMetaObjectSyntax(content: string, result: MetaFix): string {
    let fixed = content;
    
    // Fix the specific pattern: category: 'atoms' ); followed by }, }
    fixed = fixed.replace(/(\s+category:\s*['"][^'"]+['"])\s*\)\s*;\s*\},\s*\}\s*parameters:/g, (match, p1) => {
      result.issues.push('Fixed createStoryMeta syntax and meta structure');
      result.fixesApplied++;
      return p1 + '\n  }),\n  parameters:';
    });

    // Fix standalone malformed createStoryMeta calls
    fixed = fixed.replace(/(\s+category:\s*['"][^'"]+['"])\s*\)\s*;/g, (match, p1) => {
      result.issues.push('Fixed createStoryMeta call syntax');
      result.fixesApplied++;
      return p1 + '\n  }),';
    });

    // Fix broken meta object structure where we have }, } parameters
    fixed = fixed.replace(/\},\s*\}\s*parameters:/g, (match) => {
      result.issues.push('Fixed meta object parameters structure');
      result.fixesApplied++;
      return '),\n  parameters:';
    });

    return fixed;
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 META SYNTAX FIX SUMMARY');
    console.log('='.repeat(60));
    
    const totalFixes = this.results.reduce((sum, r) => sum + r.fixesApplied, 0);
    const filesWithFixes = this.results.filter(r => r.fixesApplied > 0);
    
    console.log(`✅ Total files processed: ${this.results.length}`);
    console.log(`🔧 Files with fixes applied: ${filesWithFixes.length}`);
    console.log(`🛠️  Total syntax fixes: ${totalFixes}`);
    
    if (filesWithFixes.length > 0) {
      console.log('\n📋 Files that were modified:');
      filesWithFixes.forEach(result => {
        console.log(`  • ${result.file} (${result.fixesApplied} fixes)`);
      });
    }
    
    console.log('\n🎉 Meta syntax fixes completed! Testing build again...');
  }
}

// Self-executing script
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new MetaSyntaxFixer();
  fixer.fixAll().catch(console.error);
}

export { MetaSyntaxFixer };