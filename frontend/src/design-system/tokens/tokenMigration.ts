/**
 * Token migration utilities for transitioning from old to new token system
 */

import { tokens } from './tokens';
import { validateTokens, getAllTokenPaths } from './tokenValidator';

export interface MigrationResult {
    success: boolean;
    migratedTokens: string[];
    failedTokens: string[];
    warnings: string[];
    suggestions: string[];
}

/**
 * Migrate old token usage to new token system
 */
export function migrateTokenUsage(oldUsage: Record<string, any>): MigrationResult {
    const result: MigrationResult = {
        success: true,
        migratedTokens: [],
        failedTokens: [],
        warnings: [],
        suggestions: [],
    };

    // Validate current token system
    const validation = validateTokens();
    if (!validation.isValid) {
        result.success = false;
        result.warnings.push('Token system validation failed');
        return result;
    }

    // Get all available token paths
    const availablePaths = getAllTokenPaths(tokens);

    // Migrate each token usage
    Object.entries(oldUsage).forEach(([oldPath, value]) => {
        const newPath = migrateTokenPath(oldPath);

        if (availablePaths.includes(newPath)) {
            result.migratedTokens.push(`${oldPath} → ${newPath}`);
        } else {
            result.failedTokens.push(oldPath);
            result.suggestions.push(`Token not found: ${newPath}`);
        }
    });

    return result;
}

/**
 * Migrate old token path to new format
 */
export function migrateTokenPath(oldPath: string): string {
    // Handle common migration patterns
    const migrations: Record<string, string> = {
        // Old direct access to new path-based access
        'colors.primary': 'colors.primary.500',
        'colors.secondary': 'colors.secondary.500',
        'colors.accent': 'colors.accent.500',
        'colors.destructive': 'colors.destructive.500',
        'colors.success': 'colors.success.500',
        'colors.warning': 'colors.warning.500',
        'colors.info': 'colors.info.500',

        // Typography migrations
        'typography.fontSize.sm': 'typography.fontSize.sm',
        'typography.fontSize.base': 'typography.fontSize.base',
        'typography.fontSize.lg': 'typography.fontSize.lg',

        // Spacing migrations
        'spacing.xs': 'spacing.1',
        'spacing.sm': 'spacing.2',
        'spacing.md': 'spacing.4',
        'spacing.lg': 'spacing.6',
        'spacing.xl': 'spacing.8',
        'spacing.2xl': 'spacing.12',
        'spacing.3xl': 'spacing.16',

        // Border radius migrations
        'borderRadius.sm': 'borderRadius.sm',
        'borderRadius.md': 'borderRadius.md',
        'borderRadius.lg': 'borderRadius.lg',
        'borderRadius.xl': 'borderRadius.xl',

        // Shadow migrations
        'shadows.sm': 'shadows.sm',
        'shadows.md': 'shadows.md',
        'shadows.lg': 'shadows.lg',
        'shadows.xl': 'shadows.xl',
    };

    return migrations[oldPath] || oldPath;
}

/**
 * Generate migration report for a component
 */
export function generateMigrationReport(componentName: string, oldImports: string[]): {
    componentName: string;
    oldImports: string[];
    newImports: string[];
    migrationSteps: string[];
} {
    const newImports = [
        "import { useDesignTokens } from '@/hooks/useDesignTokens';",
    ];

    const migrationSteps = [
        `1. Replace direct token imports with useDesignTokens hook`,
        `2. Update component to use tokens.getColor(), tokens.getSpacing(), etc.`,
        `3. Use tokens.getThemeColor() for theme-aware colors`,
        `4. Add CSS custom properties for dynamic styling`,
        `5. Test component in both light and dark themes`,
    ];

    return {
        componentName,
        oldImports,
        newImports,
        migrationSteps,
    };
}

/**
 * Check for deprecated token usage in code
 */
export function findDeprecatedUsage(code: string): string[] {
    const deprecatedPatterns = [
        // Direct token imports
        /import.*getToken.*from.*tokens/g,
        /import.*tokens.*from.*tokens/g,

        // Old token access patterns
        /tokens\.colors\.\w+/g,
        /tokens\.spacing\.\w+/g,
        /tokens\.typography\.\w+/g,

        // Old theme usage
        /setTheme\(/g,
        /toggleTheme\(/g,
    ];

    const deprecatedUsage: string[] = [];

    deprecatedPatterns.forEach(pattern => {
        const matches = code.match(pattern);
        if (matches) {
            deprecatedUsage.push(...matches);
        }
    });

    return [...new Set(deprecatedUsage)];
}

/**
 * Generate migration suggestions for deprecated usage
 */
export function generateMigrationSuggestions(deprecatedUsage: string[]): Record<string, string> {
    const suggestions: Record<string, string> = {};

    deprecatedUsage.forEach(usage => {
        if (usage.includes('import.*getToken')) {
            suggestions[usage] = "Replace with: import { useDesignTokens } from '@/hooks/useDesignTokens'";
        } else if (usage.includes('tokens.colors.')) {
            suggestions[usage] = "Replace with: tokens.getColor('colorName') or tokens.getThemeColor('colorName')";
        } else if (usage.includes('tokens.spacing.')) {
            suggestions[usage] = "Replace with: tokens.getSpacing('size')";
        } else if (usage.includes('tokens.typography.')) {
            suggestions[usage] = "Replace with: tokens.getFontSize('size') or tokens.getFontWeight('weight')";
        } else if (usage.includes('setTheme(')) {
            suggestions[usage] = "Replace with: useThemeSwitcher().switchToLight() or switchToDark()";
        }
    });

    return suggestions;
}

/**
 * Validate migration completeness
 */
export function validateMigration(componentCode: string): {
    isComplete: boolean;
    remainingIssues: string[];
    nextSteps: string[];
} {
    const deprecatedUsage = findDeprecatedUsage(componentCode);
    const suggestions = generateMigrationSuggestions(deprecatedUsage);

    const isComplete = deprecatedUsage.length === 0;
    const remainingIssues = Object.keys(suggestions);
    const nextSteps = Object.values(suggestions);

    return {
        isComplete,
        remainingIssues,
        nextSteps,
    };
}
