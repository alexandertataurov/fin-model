#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface CleanupResult {
  file: string;
  duplicatesRemoved: number;
  issues: string[];
}

class DuplicateTagCleaner {
  private storiesDir: string;
  private results: CleanupResult[] = [];

  constructor(storiesDir: string = 'src/design-system/stories') {
    this.storiesDir = storiesDir;
  }

  async cleanupAll(): Promise<void> {
    const storyFiles = this.findStoryFiles();
    
    console.log(`🧹 Cleaning up duplicate tags in ${storyFiles.length} story files...`);
    console.log('─'.repeat(60));

    for (const file of storyFiles) {
      await this.cleanupFile(file);
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

  private async cleanupFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result: CleanupResult = {
      file: path.relative(this.storiesDir, filePath),
      duplicatesRemoved: 0,
      issues: []
    };

    // Clean up duplicate closing tags
    let cleanedContent = this.removeDuplicateClosingTags(content, result);
    
    // Clean up extra closing braces and parentheses at the end
    cleanedContent = this.cleanupTrailingClosures(cleanedContent, result);
    
    // Clean up malformed JSX patterns
    cleanedContent = this.fixMalformedJSX(cleanedContent, result);

    if (result.duplicatesRemoved > 0 || result.issues.length > 0) {
      fs.writeFileSync(filePath, cleanedContent);
      console.log(`✓ ${result.file}: ${result.duplicatesRemoved} duplicates removed`);
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`  └─ ${issue}`));
      }
    }

    this.results.push(result);
  }

  private removeDuplicateClosingTags(content: string, result: CleanupResult): string {
    const lines = content.split('\n');
    const cleanedLines: string[] = [];
    let lastNonEmptyLine = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip duplicate closing tags
      if (this.isDuplicateClosingTag(trimmedLine, lastNonEmptyLine)) {
        result.duplicatesRemoved++;
        continue;
      }
      
      cleanedLines.push(line);
      
      if (trimmedLine) {
        lastNonEmptyLine = trimmedLine;
      }
    }
    
    return cleanedLines.join('\n');
  }

  private isDuplicateClosingTag(currentLine: string, lastLine: string): boolean {
    if (!currentLine || !lastLine) return false;
    
    const closingTags = [
      '</StoryCard>',
      '),',
      '))',
      '})',
      '},'
    ];
    
    return closingTags.some(tag => 
      currentLine === tag && lastLine === tag
    );
  }

  private cleanupTrailingClosures(content: string, result: CleanupResult): string {
    // Remove trailing empty closures and fix indentation issues
    const lines = content.split('\n');
    const cleanedLines: string[] = [];
    let inCleanupMode = false;
    
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Start cleanup from the end
      if (trimmed === '' || trimmed === '),') {
        if (!inCleanupMode) {
          inCleanupMode = true;
        }
        continue;
      }
      
      // Add back non-empty meaningful lines
      cleanedLines.unshift(line);
      inCleanupMode = false;
    }
    
    return cleanedLines.join('\n');
  }

  private fixMalformedJSX(content: string, result: CleanupResult): string {
    let fixed = content;
    
    // Fix missing opening StoryCard tags where we have orphaned closing tags
    const orphanClosingTagPattern = /^\s*<\/StoryCard>\s*$/gm;
    const matches = [...fixed.matchAll(orphanClosingTagPattern)];
    
    if (matches.length > 0) {
      result.issues.push(`Fixed ${matches.length} orphaned closing tags`);
      fixed = fixed.replace(orphanClosingTagPattern, '');
    }
    
    // Fix incomplete JSX patterns
    fixed = fixed.replace(/\s+},\s*$/, '');
    
    // Fix trailing commas in wrong places
    fixed = fixed.replace(/,\s*}\s*\)\s*,?\s*$/gm, '\n    );\n  },\n}');
    
    // Ensure proper story ending
    if (!fixed.match(/}\s*;?\s*$/)) {
      fixed = fixed.replace(/,\s*$/, '');
    }
    
    return fixed;
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 CLEANUP SUMMARY');
    console.log('='.repeat(60));
    
    const totalDuplicates = this.results.reduce((sum, r) => sum + r.duplicatesRemoved, 0);
    const filesWithIssues = this.results.filter(r => r.duplicatesRemoved > 0 || r.issues.length > 0);
    
    console.log(`✅ Total files processed: ${this.results.length}`);
    console.log(`🔧 Files with issues fixed: ${filesWithIssues.length}`);
    console.log(`🗑️  Total duplicate tags removed: ${totalDuplicates}`);
    
    if (filesWithIssues.length > 0) {
      console.log('\n📋 Files that were modified:');
      filesWithIssues.forEach(result => {
        console.log(`  • ${result.file} (${result.duplicatesRemoved} duplicates)`);
      });
    }
    
    console.log('\n🎉 Cleanup completed! Run "pnpm storybook:build" to verify fixes.');
  }
}

// Self-executing script
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleaner = new DuplicateTagCleaner();
  cleaner.cleanupAll().catch(console.error);
}

export { DuplicateTagCleaner };