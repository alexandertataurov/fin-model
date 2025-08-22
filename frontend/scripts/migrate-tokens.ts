#!/usr/bin/env node

/**
 * Token migration script
 * Usage: node scripts/migrate-tokens.ts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { 
  findDeprecatedUsage, 
  generateMigrationSuggestions, 
  validateMigration,
  generateMigrationReport 
} from '../src/design-system/tokens/tokenMigration.js';

interface MigrationStats {
  totalFiles: number;
  migratedFiles: number;
  failedFiles: number;
  totalIssues: number;
  resolvedIssues: number;
}

function findFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const files: string[] = [];
  
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFiles(fullPath, extensions));
    } else if (stat.isFile() && extensions.includes(extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function migrateFile(filePath: string): {
  success: boolean;
  issues: string[];
  suggestions: string[];
  migrated: boolean;
} {
  try {
    const content = readFileSync(filePath, 'utf8');
    const deprecatedUsage = findDeprecatedUsage(content);
    const suggestions = generateMigrationSuggestions(deprecatedUsage);
    const validation = validateMigration(content);
    
    if (deprecatedUsage.length === 0) {
      return {
        success: true,
        issues: [],
        suggestions: [],
        migrated: false,
      };
    }
    
    // Apply basic migrations
    let migratedContent = content;
    
    // Replace imports
    migratedContent = migratedContent.replace(
      /import\s+\{\s*getToken\s*\}\s+from\s+['"]@\/design-system\/tokens['"]/g,
      "import { useDesignTokens } from '@/hooks/useDesignTokens'"
    );
    
    // Replace direct token access with hook usage
    migratedContent = migratedContent.replace(
      /tokens\.colors\.(\w+)/g,
      'tokens.getColor("$1")'
    );
    
    migratedContent = migratedContent.replace(
      /tokens\.spacing\.(\w+)/g,
      'tokens.getSpacing("$1")'
    );
    
    // Add hook usage if not present
    if (migratedContent.includes('useDesignTokens') && !migratedContent.includes('const tokens = useDesignTokens()')) {
      // Find the component function and add hook
      const componentMatch = migratedContent.match(/(function\s+\w+\s*\([^)]*\)\s*\{)/);
      if (componentMatch) {
        migratedContent = migratedContent.replace(
          componentMatch[1],
          `${componentMatch[1]}\n  const tokens = useDesignTokens();`
        );
      }
    }
    
    // Write migrated content
    if (migratedContent !== content) {
      writeFileSync(filePath, migratedContent, 'utf8');
      return {
        success: true,
        issues: Object.keys(suggestions),
        suggestions: Object.values(suggestions),
        migrated: true,
      };
    }
    
    return {
      success: false,
      issues: Object.keys(suggestions),
      suggestions: Object.values(suggestions),
      migrated: false,
    };
  } catch (error) {
    return {
      success: false,
      issues: [`Error processing file: ${error}`],
      suggestions: [],
      migrated: false,
    };
  }
}

function main() {
  console.log('🔄 Starting token system migration...\n');
  
  const srcDir = join(process.cwd(), 'src');
  const files = findFiles(srcDir);
  
  const stats: MigrationStats = {
    totalFiles: files.length,
    migratedFiles: 0,
    failedFiles: 0,
    totalIssues: 0,
    resolvedIssues: 0,
  };
  
  console.log(`📁 Found ${files.length} files to process\n`);
  
  for (const file of files) {
    const relativePath = file.replace(process.cwd(), '');
    console.log(`Processing: ${relativePath}`);
    
    const result = migrateFile(file);
    
    if (result.success) {
      if (result.migrated) {
        stats.migratedFiles++;
        console.log(`  ✅ Migrated successfully`);
      } else {
        console.log(`  ℹ️  No migration needed`);
      }
    } else {
      stats.failedFiles++;
      console.log(`  ❌ Migration failed`);
    }
    
    if (result.issues.length > 0) {
      stats.totalIssues += result.issues.length;
      console.log(`  ⚠️  ${result.issues.length} issues found`);
      
      result.suggestions.forEach(suggestion => {
        console.log(`     💡 ${suggestion}`);
      });
    }
    
    console.log('');
  }
  
  // Print summary
  console.log('📊 Migration Summary:');
  console.log(`  Total files: ${stats.totalFiles}`);
  console.log(`  Successfully migrated: ${stats.migratedFiles}`);
  console.log(`  Failed migrations: ${stats.failedFiles}`);
  console.log(`  Total issues found: ${stats.totalIssues}`);
  console.log(`  Issues resolved: ${stats.resolvedIssues}`);
  
  if (stats.failedFiles > 0) {
    console.log('\n⚠️  Some files failed to migrate. Please review manually.');
    process.exit(1);
  } else {
    console.log('\n✅ Migration completed successfully!');
  }
}

main();
