#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface DocsFix {
  file: string;
  issues: string[];
  fixesApplied: number;
}

class DocsSyntaxFixer {
  private storiesDir: string;
  private results: DocsFix[] = [];

  constructor(storiesDir: string = 'src/design-system/stories') {
    this.storiesDir = storiesDir;
  }

  async fixAll(): Promise<void> {
    const storyFiles = this.findStoryFiles();
    
    console.log(`🔧 Fixing docs page syntax errors in ${storyFiles.length} story files...`);
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
    const result: DocsFix = {
      file: path.relative(this.storiesDir, filePath),
      issues: [],
      fixesApplied: 0
    };

    let fixedContent = content;

    // Fix the docs page function syntax
    fixedContent = this.fixDocsPageSyntax(fixedContent, result);

    if (result.fixesApplied > 0) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✓ ${result.file}: ${result.fixesApplied} fixes applied`);
      result.issues.forEach(issue => console.log(`  └─ ${issue}`));
    }

    this.results.push(result);
  }

  private fixDocsPageSyntax(content: string, result: DocsFix): string {
    let fixed = content;
    
    // Fix the specific pattern where page: () => (...) is missing closing parenthesis
    // Pattern: page: () => ( ... </>        },
    // Should be: page: () => ( ... </>      ),
    fixed = fixed.replace(
      /(page:\s*\(\)\s*=>\s*\(\s*[\s\S]*?<\/>\s*)\s*\}/g,
      (match, p1) => {
        result.issues.push('Fixed docs page function closing parenthesis');
        result.fixesApplied++;
        return p1 + '\n      )';
      }
    );

    return fixed;
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 DOCS SYNTAX FIX SUMMARY');
    console.log('='.repeat(60));
    
    const totalFixes = this.results.reduce((sum, r) => sum + r.fixesApplied, 0);
    const filesWithFixes = this.results.filter(r => r.fixesApplied > 0);
    
    console.log(`✅ Total files processed: ${this.results.length}`);
    console.log(`🔧 Files with fixes applied: ${filesWithFixes.length}`);
    console.log(`🛠️  Total docs syntax fixes: ${totalFixes}`);
    
    if (filesWithFixes.length > 0) {
      console.log('\n📋 Files that were modified:');
      filesWithFixes.forEach(result => {
        console.log(`  • ${result.file} (${result.fixesApplied} fixes)`);
      });
    }
    
    console.log('\n🎉 Docs syntax fixes completed! Testing build again...');
  }
}

// Self-executing script
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new DocsSyntaxFixer();
  fixer.fixAll().catch(console.error);
}

export { DocsSyntaxFixer };