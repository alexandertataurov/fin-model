import { describe, it, expect } from 'vitest';
import { designTokens, colorTokens, componentTokens } from './tokens';

describe('Design Tokens', () => {
  it('should export design tokens with expected structure', () => {
    expect(designTokens).toBeDefined();
    expect(designTokens.spacing).toBeDefined();
    expect(designTokens.borderRadius).toBeDefined();
    expect(designTokens.fontSize).toBeDefined();
    expect(designTokens.fontWeight).toBeDefined();
    expect(designTokens.boxShadow).toBeDefined();
    expect(designTokens.transitionDuration).toBeDefined();
    expect(designTokens.zIndex).toBeDefined();
  });

  it('should have proper spacing values', () => {
    expect(designTokens.spacing.xs).toBe('0.25rem');
    expect(designTokens.spacing.sm).toBe('0.5rem');
    expect(designTokens.spacing.md).toBe('1rem');
    expect(designTokens.spacing.lg).toBe('1.5rem');
    expect(designTokens.spacing.xl).toBe('2rem');
    expect(designTokens.spacing['2xl']).toBe('3rem');
    expect(designTokens.spacing['3xl']).toBe('4rem');
  });

  it('should have proper font sizes with line heights', () => {
    expect(designTokens.fontSize.xs).toEqual(['0.75rem', { lineHeight: '1rem' }]);
    expect(designTokens.fontSize.sm).toEqual(['0.875rem', { lineHeight: '1.25rem' }]);
    expect(designTokens.fontSize.base).toEqual(['1rem', { lineHeight: '1.5rem' }]);
    expect(designTokens.fontSize.lg).toEqual(['1.125rem', { lineHeight: '1.75rem' }]);
  });

  it('should have light and dark color variants', () => {
    expect(colorTokens.light).toBeDefined();
    expect(colorTokens.dark).toBeDefined();
    
    // Test some key colors exist in both themes
    expect(colorTokens.light.background).toBeDefined();
    expect(colorTokens.light.foreground).toBeDefined();
    expect(colorTokens.light.primary).toBeDefined();
    
    expect(colorTokens.dark.background).toBeDefined();
    expect(colorTokens.dark.foreground).toBeDefined();
    expect(colorTokens.dark.primary).toBeDefined();
  });

  it('should have component-specific tokens', () => {
    expect(componentTokens.button).toBeDefined();
    expect(componentTokens.input).toBeDefined();
    expect(componentTokens.card).toBeDefined();
    
    // Test button tokens
    expect(componentTokens.button.height.sm).toBe('2rem');
    expect(componentTokens.button.height.default).toBe('2.25rem');
    expect(componentTokens.button.height.lg).toBe('2.5rem');
    
    // Test input tokens
    expect(componentTokens.input.borderWidth).toBe('1px');
    expect(componentTokens.input.focusRingWidth).toBe('2px');
  });

  it('should have consistent border radius values', () => {
    expect(designTokens.borderRadius.none).toBe('0');
    expect(designTokens.borderRadius.sm).toBe('0.125rem');
    expect(designTokens.borderRadius.default).toBe('0.375rem');
    expect(designTokens.borderRadius.md).toBe('0.5rem');
    expect(designTokens.borderRadius.lg).toBe('0.75rem');
    expect(designTokens.borderRadius.xl).toBe('1rem');
    expect(designTokens.borderRadius.full).toBe('9999px');
  });

  it('should have font weight tokens', () => {
    expect(designTokens.fontWeight.normal).toBe('400');
    expect(designTokens.fontWeight.medium).toBe('500');
    expect(designTokens.fontWeight.semibold).toBe('600');
    expect(designTokens.fontWeight.bold).toBe('700');
  });

  it('should have box shadow tokens', () => {
    expect(designTokens.boxShadow.sm).toBeDefined();
    expect(designTokens.boxShadow.default).toBeDefined();
    expect(designTokens.boxShadow.md).toBeDefined();
    expect(designTokens.boxShadow.lg).toBeDefined();
    expect(designTokens.boxShadow.xl).toBeDefined();
  });

  it('should have transition duration tokens', () => {
    expect(designTokens.transitionDuration.fast).toBe('150ms');
    expect(designTokens.transitionDuration.normal).toBe('200ms');
    expect(designTokens.transitionDuration.slow).toBe('300ms');
  });

  it('should have z-index tokens', () => {
    expect(designTokens.zIndex.dropdown).toBe('1000');
    expect(designTokens.zIndex.sticky).toBe('1020');
    expect(designTokens.zIndex.fixed).toBe('1030');
    expect(designTokens.zIndex.modal).toBe('1040');
    expect(designTokens.zIndex.popover).toBe('1050');
    expect(designTokens.zIndex.tooltip).toBe('1060');
  });
});