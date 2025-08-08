/**
 * Shared formatting utilities for financial data
 * Eliminates duplicate formatting functions across components
 */

/**
 * Format currency values with consistent styling
 */
export const formatCurrency = (
  value: number,
  currency = '$'
): string => {
  if (isNaN(value) || !isFinite(value)) {
    return `${currency}0.00`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage values with consistent styling
 */
export const formatPercentage = (
  value: number,
  decimals = 2
): string => {
  if (isNaN(value) || !isFinite(value)) {
    return '0.00%';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Format number values with consistent styling
 */
export const formatNumber = (value: number, decimals = 0): string => {
  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format ratio values (e.g., debt-to-equity)
 */
export const formatRatio = (value: number, decimals = 2): string => {
  if (isNaN(value) || !isFinite(value)) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date in consistent format
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Calculate and format percentage change
 */
export const formatPercentageChange = (
  current: number,
  previous: number
): string => {
  if (previous === 0) return '0.00%';

  const change = ((current - previous) / previous) * 100;
  return formatPercentage(change);
};

/**
 * Get percentage change with sign
 */
export const getPercentageChangeDisplay = (
  current: number,
  previous: number
): string => {
  if (previous === 0) return '0.00%';

  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${formatPercentage(change)}`;
};
