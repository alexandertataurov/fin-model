/**
 * Token validation utilities for ensuring consistency and catching issues
 */

import { tokens } from './tokens.ts';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate token structure and consistency
 */
export function validateTokens(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required token categories
  const requiredCategories = ['colors', 'typography', 'spacing', 'borderRadius', 'shadows', 'motion', 'zIndex', 'breakpoints'];
  requiredCategories.forEach(category => {
    if (!tokens[category]) {
      errors.push(`Missing required token category: ${category}`);
    }
  });

  // Validate color tokens
  if (tokens.colors) {
    validateColorTokens(tokens.colors, errors, warnings);
  }

  // Validate typography tokens
  if (tokens.typography) {
    validateTypographyTokens(tokens.typography, errors, warnings);
  }

  // Validate spacing tokens
  if (tokens.spacing) {
    validateSpacingTokens(tokens.spacing, errors, warnings);
  }

  // Validate theme consistency
  validateThemeConsistency(errors, warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate color tokens
 */
function validateColorTokens(colors: any, errors: string[], warnings: string[]) {
  const requiredColors = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info'];

  requiredColors.forEach(colorName => {
    if (!colors[colorName]) {
      errors.push(`Missing required color: ${colorName}`);
    }
  });

  // Check color scale consistency
  Object.entries(colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'object' && colorValue !== null) {
      const scales = Object.keys(colorValue);
      const expectedScales = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

      expectedScales.forEach(scale => {
        if (!scales.includes(scale)) {
          warnings.push(`Color ${colorName} missing scale: ${scale}`);
        }
      });
    }
  });
}

/**
 * Validate typography tokens
 */
function validateTypographyTokens(typography: any, errors: string[], warnings: string[]) {
  const requiredCategories = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];

  requiredCategories.forEach(category => {
    if (!typography[category]) {
      errors.push(`Missing typography category: ${category}`);
    }
  });

  // Validate font sizes
  if (typography.fontSize) {
    const fontSizeKeys = Object.keys(typography.fontSize);
    const expectedSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

    expectedSizes.forEach(size => {
      if (!fontSizeKeys.includes(size)) {
        warnings.push(`Missing font size: ${size}`);
      }
    });
  }

  // Validate font weights
  if (typography.fontWeight) {
    const fontWeightKeys = Object.keys(typography.fontWeight);
    const expectedWeights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];

    expectedWeights.forEach(weight => {
      if (!fontWeightKeys.includes(weight)) {
        warnings.push(`Missing font weight: ${weight}`);
      }
    });
  }
}

/**
 * Validate spacing tokens
 */
function validateSpacingTokens(spacing: any, errors: string[], warnings: string[]) {
  const spacingKeys = Object.keys(spacing);
  const expectedSpacing = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96'];

  expectedSpacing.forEach(space => {
    if (!spacingKeys.includes(space)) {
      warnings.push(`Missing spacing: ${space}`);
    }
  });
}

/**
 * Validate theme consistency
 */
function validateThemeConsistency(errors: string[], warnings: string[]) {
  // Check if light and dark themes have consistent structure
  if (tokens.colors?.light && tokens.colors?.dark) {
    const lightKeys = Object.keys(tokens.colors.light);
    const darkKeys = Object.keys(tokens.colors.dark);

    lightKeys.forEach(key => {
      if (!darkKeys.includes(key)) {
        warnings.push(`Dark theme missing color: ${key}`);
      }
    });

    darkKeys.forEach(key => {
      if (!lightKeys.includes(key)) {
        warnings.push(`Light theme missing color: ${key}`);
      }
    });
  }
}

/**
 * Get all token paths for debugging
 */
export function getAllTokenPaths(obj: any, prefix = ''): string[] {
  const paths: string[] = [];

  if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        paths.push(...getAllTokenPaths(value, currentPath));
      } else {
        paths.push(currentPath);
      }
    });
  }

  return paths;
}

/**
 * Validate specific token path
 */
export function validateTokenPath(path: string): boolean {
  const pathParts = path.split('.');
  let current = tokens;

  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Get token value by path
 */
export function getTokenByPath(path: string): any {
  const pathParts = path.split('.');
  let current = tokens;

  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Check if token exists
 */
export function tokenExists(path: string): boolean {
  return getTokenByPath(path) !== undefined;
}

/**
 * Get all validation errors as a formatted string
 */
export function getValidationReport(): string {
  const result = validateTokens();

  if (result.isValid) {
    return '✅ All tokens are valid!';
  }

  let report = '❌ Token validation failed:\n\n';

  if (result.errors.length > 0) {
    report += 'Errors:\n';
    result.errors.forEach(error => {
      report += `  • ${error}\n`;
    });
    report += '\n';
  }

  if (result.warnings.length > 0) {
    report += 'Warnings:\n';
    result.warnings.forEach(warning => {
      report += `  • ${warning}\n`;
    });
  }

  return report;
}
