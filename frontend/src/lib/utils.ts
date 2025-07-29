export { cn } from '@/utils/cn';

/**
 * Formats a number as currency
 *
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formats a date using Intl.DateTimeFormat
 *
 * @param date - The date to format
 * @param options - DateTimeFormat options
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
  locale = 'en-US'
): string {
  return new Intl.DateTimeFormat(locale, options).format(
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  );
}

/**
 * Truncates text to a specified length
 *
 * @param text - The text to truncate
 * @param length - Maximum length (default: 50)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length = 50): string {
  if (text.length <= length) return text;
  return `${text.substring(0, length).trim()}...`;
}

/**
 * Delays execution by a specified time
 *
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
