#!/usr/bin/env ts-node

/**
 * Story Migration Script
 * 
 * Automatically migrates existing stories to use the unified design system:
 * - Updates imports to use shared components
 * - Standardizes story structure and titles
 * - Optimizes performance by reducing heavy imports
 * - Ensures consistent presentation
 */

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

interface MigrationConfig {
  dryRun: boolean;
  backupOriginals: boolean;
  targetDirectory: string;
}

class StoryMigrator {
  private config: MigrationConfig;
  private migratedFiles: string[] = [];
  private errors: Array<{file: string, error: string}> = [];

  constructor(config: MigrationConfig) {
    this.config = config;
  }

  async migrate(): Promise<void> {
    console.log(`🚀 Starting story migration${this.config.dryRun ? ' (DRY RUN)' : ''}...\n`);

    const storyFiles = await glob(`${this.config.targetDirectory}/**/*.stories.tsx`);
    console.log(`📁 Found ${storyFiles.length} story files to migrate\n`);

    for (const file of storyFiles) {
      await this.migrateFile(file);
    }

    this.printSummary();
  }

  private async migrateFile(filePath: string): Promise<void> {
    try {
      const originalContent = await fs.readFile(filePath, 'utf-8');
      
      // Skip if already migrated
      if (originalContent.includes("from '../shared'")) {
        console.log(`⏭️  ${path.basename(filePath)} - Already migrated`);
        return;
      }

      let migratedContent = originalContent;

      // Apply migrations
      migratedContent = this.updateImports(migratedContent);
      migratedContent = this.updateMetaConfiguration(migratedContent, filePath);
      migratedContent = this.updateStoryStructure(migratedContent);
      migratedContent = this.updateComponents(migratedContent);
      migratedContent = this.optimizePerformance(migratedContent);

      if (this.config.dryRun) {
        console.log(`🔍 ${path.basename(filePath)} - Would be migrated`);
        this.logChanges(originalContent, migratedContent);
      } else {
        // Backup original if requested
        if (this.config.backupOriginals) {
          await fs.writeFile(`${filePath}.backup`, originalContent);
        }

        await fs.writeFile(filePath, migratedContent);
        console.log(`✅ ${path.basename(filePath)} - Migrated successfully`);
        this.migratedFiles.push(filePath);
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ ${path.basename(filePath)} - Migration failed: ${errorMsg}`);
      this.errors.push({ file: filePath, error: errorMsg });
    }
  }

  private updateImports(content: string): string {
    // Replace heavy component imports with shared components
    const oldImportPattern = /import\s+{([^}]+)}\s+from\s+['"`]\.\.\/components['"`];/g;
    
    return content.replace(oldImportPattern, (match, imports) => {
      const importList = imports.split(',').map((imp: string) => imp.trim());
      
      // Map old components to new shared components
      const componentMap: Record<string, string> = {
        'SectionHeader': 'StorySection',
        'AnimatedBanner': 'StoryBanner',
        'GuidelinesSection': 'StoryGuidelines',
        'GuidelinesCard': 'StoryGuidelines',
        'Card': 'StoryCard',
        'ColorPalette': 'LazyColorPalette',
        'FormField': 'LazyUIComponents'
      };

      const newImports: string[] = [];
      const sharedImports: string[] = [];

      importList.forEach((imp: string) => {
        if (componentMap[imp]) {
          sharedImports.push(componentMap[imp]);
        } else if (['SemanticColor', 'SurfaceColor', 'InteractiveState', 'StatusIndicator', 'Notification', 'DashboardHeader', 'MetricCard', 'QuickActions', 'PhilosophyItem'].includes(imp)) {
          // These are heavy components, suggest lazy loading
          sharedImports.push('LazyUIComponents');
        } else {
          newImports.push(imp);
        }
      });

      // Add helper imports
      sharedImports.push('createStoryMeta', 'storyIcons', 'commonArgTypes');

      let result = '';
      if (sharedImports.length > 0) {
        const uniqueSharedImports = [...new Set(sharedImports)];
        result += `import {\n  ${uniqueSharedImports.join(',\n  ')}\n} from '../shared';\n`;
      }
      if (newImports.length > 0) {
        result += `import { ${newImports.join(', ')} } from '../components';\n`;
      }

      return result;
    });
  }

  private updateMetaConfiguration(content: string, filePath: string): string {
    // Extract component and category information
    const componentMatch = content.match(/const meta: Meta<typeof (\w+)>/);
    const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
    
    if (!componentMatch || !titleMatch) return content;

    const componentName = componentMatch[1];
    const currentTitle = titleMatch[1];
    
    // Determine category from file path
    let category = 'atoms';
    if (filePath.includes('/molecules/')) category = 'molecules';
    else if (filePath.includes('/organisms/')) category = 'organisms';
    else if (filePath.includes('/templates/')) category = 'templates';
    else if (filePath.includes('/foundations/')) category = 'foundations';

    // Update meta configuration
    const metaPattern = /const meta: Meta<typeof \w+> = {[\s\S]*?};/;
    
    return content.replace(metaPattern, (match) => {
      return `const meta: Meta<typeof ${componentName}> = {
  ...createStoryMeta({
    title: '${componentName}',
    component: ${componentName},
    category: '${category}',
  }),
  parameters: {
    ...createStoryMeta({} as any).parameters,
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <StoryBanner
            title="${componentName}"
            subtitle="Brief description of the component and its purpose in the design system."
            icon={storyIcons.${category === 'foundations' ? 'foundation' : category.slice(0, -1)}}
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {
    ...commonArgTypes,
    // Add component-specific argTypes here
  },
};`;
    });
  }

  private updateStoryStructure(content: string): string {
    // Replace AnimatedBanner with StoryBanner
    content = content.replace(/AnimatedBanner/g, 'StoryBanner');
    
    // Replace SectionHeader with StorySection
    content = content.replace(/SectionHeader/g, 'StorySection');
    
    // Replace Card with StoryCard in story contexts
    content = content.replace(/(<\s*)Card(\s)/g, '$1StoryCard$2');
    
    // Update GuidelinesSection usage
    content = content.replace(/GuidelinesSection.*?GuidelinesCard.*?/gs, (match) => {
      // Extract do/don't items if possible
      return `<StoryGuidelines
        doItems={[
          'Add appropriate guidelines here'
        ]}
        dontItems={[
          'Add anti-patterns here'
        ]}
      />`;
    });

    return content;
  }

  private updateComponents(content: string): string {
    // Replace complex component usage with simpler alternatives
    const componentReplacements: Record<string, string> = {
      'ColorPalette': 'div className="text-sm text-muted-foreground">Color palette component - use LazyColorPalette for heavy color displays</div>',
      'PhilosophyItem': 'div className="p-4 border rounded-lg">Philosophy component - consider using StoryCard instead</div>',
      'MetricCard': 'StoryCard',
      'StatusIndicator': 'div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Status</span></div>'
    };

    Object.entries(componentReplacements).forEach(([oldComp, newComp]) => {
      const pattern = new RegExp(`<${oldComp}[^>]*>.*?<\/${oldComp}>`, 'gs');
      content = content.replace(pattern, `<${newComp}>`);
    });

    return content;
  }

  private optimizePerformance(content: string): string {
    // Add React.memo for large stories
    if (content.length > 15000) {
      content = `import React from 'react';\n${content}`;
      
      // Wrap complex render functions with memo
      content = content.replace(
        /render: \(\) => \(/g,
        'render: React.memo(() => ('
      );
    }

    // Add Suspense for lazy components if needed
    if (content.includes('LazyColorPalette') || content.includes('LazyUIComponents')) {
      const suspenseImport = "import { Suspense } from 'react';";
      if (!content.includes(suspenseImport)) {
        content = `${suspenseImport}\n${content}`;
      }
    }

    return content;
  }

  private logChanges(original: string, migrated: string): void {
    const originalLines = original.split('\n').length;
    const migratedLines = migrated.split('\n').length;
    const sizeDiff = migrated.length - original.length;
    
    console.log(`   📊 Lines: ${originalLines} → ${migratedLines} (${migratedLines - originalLines > 0 ? '+' : ''}${migratedLines - originalLines})`);
    console.log(`   📦 Size: ${Math.round(original.length/1024)}KB → ${Math.round(migrated.length/1024)}KB (${sizeDiff > 0 ? '+' : ''}${Math.round(sizeDiff/1024)}KB)`);
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📋 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${this.migratedFiles.length} files`);
    console.log(`❌ Failed migrations: ${this.errors.length} files`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 MIGRATION ERRORS:');
      this.errors.forEach(({ file, error }) => {
        console.log(`   ${path.basename(file)}: ${error}`);
      });
    }

    if (!this.config.dryRun && this.migratedFiles.length > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n📝 NEXT STEPS:');
      console.log('1. Review migrated files for any manual adjustments needed');
      console.log('2. Update story content and descriptions');
      console.log('3. Test with: npm run storybook');
      console.log('4. Run type checking: npm run type-check');
      
      if (this.config.backupOriginals) {
        console.log('\n💾 Original files backed up with .backup extension');
        console.log('   Remove backups after confirming migration success');
      }
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const backup = args.includes('--backup');
  const targetDir = args.find(arg => arg.startsWith('--dir='))?.split('=')[1] 
    || 'src/design-system/stories';

  const config: MigrationConfig = {
    dryRun,
    backupOriginals: backup,
    targetDirectory: targetDir
  };

  console.log('🔧 Story Migration Tool');
  console.log('========================\n');
  console.log(`Target directory: ${config.targetDirectory}`);
  console.log(`Dry run: ${config.dryRun ? 'Yes' : 'No'}`);
  console.log(`Backup originals: ${config.backupOriginals ? 'Yes' : 'No'}\n`);

  try {
    const migrator = new StoryMigrator(config);
    await migrator.migrate();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { StoryMigrator };