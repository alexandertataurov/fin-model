#!/usr/bin/env ts-node

/**
 * Story Optimization Script
 * 
 * This script analyzes and optimizes Storybook stories for:
 * - Performance improvements
 * - Consistency in imports and structure
 * - Bundle size reduction
 * - Unified presentation
 */

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

interface StoryAnalysis {
  file: string;
  issues: string[];
  suggestions: string[];
  size: number;
  imports: string[];
  hasHeavyComponents: boolean;
}

interface OptimizationReport {
  totalFiles: number;
  issuesFound: number;
  potentialSavings: number;
  recommendations: string[];
}

class StoryOptimizer {
  private storiesDir: string;
  private results: StoryAnalysis[] = [];

  constructor(storiesDir: string = 'src/design-system/stories') {
    this.storiesDir = storiesDir;
  }

  async analyze(): Promise<OptimizationReport> {
    console.log('🔍 Analyzing Storybook stories for optimization opportunities...\n');

    const storyFiles = await glob(`${this.storiesDir}/**/*.stories.tsx`);
    
    for (const file of storyFiles) {
      const analysis = await this.analyzeFile(file);
      this.results.push(analysis);
    }

    return this.generateReport();
  }

  private async analyzeFile(filePath: string): Promise<StoryAnalysis> {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    
    const analysis: StoryAnalysis = {
      file: filePath,
      issues: [],
      suggestions: [],
      size: stats.size,
      imports: this.extractImports(content),
      hasHeavyComponents: false
    };

    // Check for performance issues
    this.checkImportOptimizations(content, analysis);
    this.checkComponentUsage(content, analysis);
    this.checkConsistencyIssues(content, analysis);
    this.checkBundleImpact(content, analysis);

    return analysis;
  }

  private extractImports(content: string): string[] {
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"`]([^'"`]+)['"`]/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const components = match[1].split(',').map(c => c.trim());
      imports.push(...components);
    }

    return imports;
  }

  private checkImportOptimizations(content: string, analysis: StoryAnalysis) {
    // Check for heavy component imports
    const heavyComponents = [
      'ColorPalette', 'SemanticColor', 'SurfaceColor', 'InteractiveState',
      'FormField', 'StatusIndicator', 'Notification', 'DashboardHeader',
      'MetricCard', 'QuickActions', 'PhilosophyItem', 'ColorWheel'
    ];

    heavyComponents.forEach(component => {
      if (content.includes(component)) {
        analysis.hasHeavyComponents = true;
        analysis.issues.push(`Heavy component '${component}' imported`);
        analysis.suggestions.push(`Consider lazy loading '${component}' or using simpler alternatives`);
      }
    });

    // Check for massive import lists
    const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"`]\.\.\/components['"`]/);
    if (importMatch && importMatch[1].split(',').length > 8) {
      analysis.issues.push('Large component import list detected');
      analysis.suggestions.push('Split imports or use shared story components');
    }

    // Check for inconsistent import patterns
    if (content.includes("from '../components'") && content.includes("from '../shared'")) {
      analysis.issues.push('Mixed import patterns detected');
      analysis.suggestions.push('Standardize to use unified shared components');
    }
  }

  private checkComponentUsage(content: string, analysis: StoryAnalysis) {
    // Check for inline styles instead of design tokens
    if (content.includes('style={{') && !content.includes('tokens.')) {
      analysis.issues.push('Inline styles detected without design tokens');
      analysis.suggestions.push('Use design tokens for consistent styling');
    }

    // Check for repetitive code patterns
    const storyPatterns = (content.match(/export const \w+: Story/g) || []).length;
    if (storyPatterns > 6) {
      analysis.suggestions.push('Consider consolidating similar stories');
    }

    // Check for missing memoization in complex stories
    if (content.includes('render: ()') && content.length > 10000) {
      analysis.suggestions.push('Consider memoizing large story components');
    }
  }

  private checkConsistencyIssues(content: string, analysis: StoryAnalysis) {
    // Check title consistency
    const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
    if (titleMatch) {
      const title = titleMatch[1];
      if (!title.match(/^\d+\s-\s(Foundations|Atoms|Molecules|Organisms|Templates|Pages)\s\/\s/)) {
        analysis.issues.push('Inconsistent story title format');
        analysis.suggestions.push('Use standardized title format: "X - Category / Component"');
      }
    }

    // Check for inconsistent story structure
    const standardStories = ['Variants', 'Sizes', 'States', 'Usage', 'Guidelines', 'Interactive'];
    const foundStories = standardStories.filter(story => 
      content.includes(`export const ${story}: Story`)
    );

    if (foundStories.length < 3) {
      analysis.suggestions.push('Consider adding more standard story types for completeness');
    }

    // Check for AnimatedBanner vs StoryBanner inconsistency
    if (content.includes('AnimatedBanner') && !content.includes('../shared')) {
      analysis.issues.push('Using old AnimatedBanner instead of unified StoryBanner');
      analysis.suggestions.push('Migrate to unified StoryBanner from shared components');
    }
  }

  private checkBundleImpact(content: string, analysis: StoryAnalysis) {
    // Estimate bundle impact based on file size and imports
    if (analysis.size > 15000) { // 15KB
      analysis.issues.push('Large story file detected');
      analysis.suggestions.push('Consider splitting into multiple files or optimizing content');
    }

    if (analysis.imports.length > 20) {
      analysis.issues.push('High number of imports detected');
      analysis.suggestions.push('Reduce imports using unified shared components');
    }
  }

  private generateReport(): OptimizationReport {
    const totalFiles = this.results.length;
    const issuesFound = this.results.reduce((sum, result) => sum + result.issues.length, 0);
    const heavyFiles = this.results.filter(r => r.hasHeavyComponents).length;
    const largeFiles = this.results.filter(r => r.size > 15000).length;

    // Estimate potential savings
    const potentialSavings = Math.round(
      (heavyFiles * 30) + (largeFiles * 20) + (issuesFound * 5) // Percentage points
    );

    const recommendations = this.generateRecommendations();

    // Print detailed report
    this.printDetailedReport(totalFiles, issuesFound, potentialSavings, heavyFiles, largeFiles);

    return {
      totalFiles,
      issuesFound,
      potentialSavings,
      recommendations
    };
  }

  private generateRecommendations(): string[] {
    return [
      'Migrate to unified story components from shared directory',
      'Replace heavy component imports with lazy loading',
      'Standardize story titles using createStoryMeta helper',
      'Use StoryBanner instead of AnimatedBanner',
      'Consolidate similar stories to reduce file size',
      'Implement design token usage throughout stories',
      'Add memoization for complex story components',
      'Split large story files into smaller modules'
    ];
  }

  private printDetailedReport(
    totalFiles: number, 
    issuesFound: number, 
    potentialSavings: number,
    heavyFiles: number,
    largeFiles: number
  ) {
    console.log('📊 STORY OPTIMIZATION REPORT');
    console.log('=' .repeat(50));
    console.log(`📁 Total story files analyzed: ${totalFiles}`);
    console.log(`⚠️  Issues found: ${issuesFound}`);
    console.log(`🎯 Potential performance improvement: ${potentialSavings}%`);
    console.log(`📦 Files with heavy components: ${heavyFiles}`);
    console.log(`📏 Large files (>15KB): ${largeFiles}`);
    console.log('');

    // Show worst offenders
    const worstFiles = this.results
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 5);

    console.log('🚨 FILES NEEDING MOST ATTENTION:');
    console.log('-'.repeat(50));
    worstFiles.forEach((file, index) => {
      const relativePath = path.relative(process.cwd(), file.file);
      console.log(`${index + 1}. ${relativePath}`);
      console.log(`   📊 ${file.issues.length} issues, ${Math.round(file.size/1024)}KB`);
      console.log(`   🔧 ${file.suggestions[0] || 'No specific suggestions'}`);
      console.log('');
    });

    // Show recommendations
    console.log('💡 OPTIMIZATION RECOMMENDATIONS:');
    console.log('-'.repeat(50));
    const recommendations = this.generateRecommendations();
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.log('');

    // Migration command
    console.log('🚀 TO APPLY OPTIMIZATIONS:');
    console.log('-'.repeat(50));
    console.log('1. Review the unified story template: UNIFIED_STORY_TEMPLATE.md');
    console.log('2. Use shared components from: stories/shared/');
    console.log('3. Run: npm run stories:migrate (when implemented)');
    console.log('4. Test with: npm run storybook');
  }
}

// CLI execution
async function main() {
  try {
    const optimizer = new StoryOptimizer();
    const report = await optimizer.analyze();
    
    console.log(`✅ Analysis complete! Check report above for optimization opportunities.`);
    console.log(`💾 Potential bundle size reduction: ~${report.potentialSavings}%`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during story optimization analysis:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { StoryOptimizer };