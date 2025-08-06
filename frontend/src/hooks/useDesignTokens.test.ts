import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDesignTokens } from './useDesignTokens';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: 'light',
  }),
}));

describe('useDesignTokens', () => {
  it('should return design tokens and utilities', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.tokens).toBeDefined();
    expect(result.current.colors).toBeDefined();
    expect(result.current.componentTokens).toBeDefined();
    expect(result.current.spacing).toBeDefined();
    expect(result.current.borderRadius).toBeDefined();
    expect(result.current.fontSize).toBeDefined();
    expect(result.current.fontWeight).toBeDefined();
    expect(result.current.boxShadow).toBeDefined();
    expect(result.current.transitionDuration).toBeDefined();
    expect(result.current.zIndex).toBeDefined();
  });

  it('should provide utility functions', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(typeof result.current.getCSSVar).toBe('function');
    expect(typeof result.current.getColor).toBe('function');
    expect(typeof result.current.getSpacing).toBe('function');
    expect(typeof result.current.getBorderRadius).toBe('function');
    expect(typeof result.current.getFontSize).toBe('function');
    expect(typeof result.current.getFontWeight).toBe('function');
    expect(typeof result.current.getBoxShadow).toBe('function');
    expect(typeof result.current.getTransitionDuration).toBe('function');
    expect(typeof result.current.getZIndex).toBe('function');
    expect(typeof result.current.getComponentToken).toBe('function');
  });

  it('should return correct CSS variable references', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.getCSSVar('primary')).toBe('var(--primary)');
    expect(result.current.getCSSVar('background')).toBe('var(--background)');
  });

  it('should return correct spacing values', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.getSpacing('xs')).toBe('0.25rem');
    expect(result.current.getSpacing('sm')).toBe('0.5rem');
    expect(result.current.getSpacing('md')).toBe('1rem');
    expect(result.current.getSpacing('lg')).toBe('1.5rem');
  });

  it('should return correct border radius values', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.getBorderRadius('none')).toBe('0');
    expect(result.current.getBorderRadius('sm')).toBe('0.125rem');
    expect(result.current.getBorderRadius('default')).toBe('0.375rem');
    expect(result.current.getBorderRadius('lg')).toBe('0.75rem');
  });

  it('should return correct font size configurations', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.getFontSize('xs')).toEqual(['0.75rem', { lineHeight: '1rem' }]);
    expect(result.current.getFontSize('base')).toEqual(['1rem', { lineHeight: '1.5rem' }]);
  });

  it('should return correct font weight values', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.getFontWeight('normal')).toBe('400');
    expect(result.current.getFontWeight('medium')).toBe('500');
    expect(result.current.getFontWeight('semibold')).toBe('600');
  });

  it('should return correct component tokens', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.getComponentToken('button', 'height', 'sm')).toBe('2rem');
    expect(result.current.getComponentToken('button', 'height', 'default')).toBe('2.25rem');
    expect(result.current.getComponentToken('input', 'borderWidth')).toBe('1px');
  });

  it('should indicate correct theme', () => {
    const { result } = renderHook(() => useDesignTokens());
    
    expect(result.current.currentTheme).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
  });
});