import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  isValidNumber,
} from './index';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235');
      expect(formatCurrency(1000000)).toBe('$1,000,000');
    });

    it('handles different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,235');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.3%');
      expect(formatPercentage(0.05, 2)).toBe('5.00%');
    });
  });

  describe('formatLargeNumber', () => {
    it('formats large numbers with suffixes', () => {
      expect(formatLargeNumber(1234)).toBe('1.2K');
      expect(formatLargeNumber(1234567)).toBe('1.2M');
      expect(formatLargeNumber(1234567890)).toBe('1.2B');
      expect(formatLargeNumber(500)).toBe('500');
    });
  });

  describe('isValidNumber', () => {
    it('validates numbers correctly', () => {
      expect(isValidNumber(123)).toBe(true);
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
    });
  });
});
