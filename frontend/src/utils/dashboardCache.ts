/**
 * Dashboard Cache Manager
 * 
 * Intelligent caching and performance optimization for dashboard data
 */

import { QueryClient } from '@tanstack/react-query';
import { DashboardPeriod } from '../types/dashboard';

export class DashboardCacheManager {
  private static readonly CACHE_KEYS = {
    CASH_FLOW: 'cash-flow-dashboard',
    PL: 'pl-dashboard',
    RATIOS: 'ratio-metrics',
    VARIANCE: 'variance-metrics',
  } as const;

  private static readonly CACHE_TIMES = {
    STALE_TIME: 5 * 60 * 1000, // 5 minutes
    CACHE_TIME: 10 * 60 * 1000, // 10 minutes
    BACKGROUND_REFETCH_TIME: 2 * 60 * 1000, // 2 minutes
  } as const;

  /**
   * Generate cache key for dashboard data
   */
  static getCacheKey(
    type: keyof typeof DashboardCacheManager.CACHE_KEYS,
    period: DashboardPeriod,
    fileId?: number
  ): string[] {
    const baseKey = this.CACHE_KEYS[type];
    return [baseKey, period, fileId?.toString()].filter(Boolean) as string[];
  }

  /**
   * Invalidate cache for specific dashboard type
   */
  static async invalidateCache(
    queryClient: QueryClient,
    type?: keyof typeof DashboardCacheManager.CACHE_KEYS
  ): Promise<void> {
    if (type) {
      await queryClient.invalidateQueries([this.CACHE_KEYS[type]]);
    } else {
      // Invalidate all dashboard caches
      await Promise.all([
        queryClient.invalidateQueries([this.CACHE_KEYS.CASH_FLOW]),
        queryClient.invalidateQueries([this.CACHE_KEYS.PL]),
        queryClient.invalidateQueries([this.CACHE_KEYS.RATIOS]),
        queryClient.invalidateQueries([this.CACHE_KEYS.VARIANCE]),
      ]);
    }
  }

  /**
   * Prefetch dashboard data for better performance
   */
  static async prefetchDashboard(
    queryClient: QueryClient,
    type: keyof typeof DashboardCacheManager.CACHE_KEYS,
    period: DashboardPeriod,
    queryFn: () => Promise<unknown>,
    fileId?: number
  ): Promise<void> {
    const cacheKey = this.getCacheKey(type, period, fileId);
    
    await queryClient.prefetchQuery({
      queryKey: cacheKey,
      queryFn,
      staleTime: this.CACHE_TIMES.STALE_TIME,
      cacheTime: this.CACHE_TIMES.CACHE_TIME,
    });
  }

  /**
   * Get cached data without triggering a network request
   */
  static getCachedData<T>(
    queryClient: QueryClient,
    type: keyof typeof DashboardCacheManager.CACHE_KEYS,
    period: DashboardPeriod,
    fileId?: number
  ): T | undefined {
    const cacheKey = this.getCacheKey(type, period, fileId);
    return queryClient.getQueryData<T>(cacheKey);
  }

  /**
   * Set cache data manually
   */
  static setCacheData<T>(
    queryClient: QueryClient,
    type: keyof typeof DashboardCacheManager.CACHE_KEYS,
    period: DashboardPeriod,
    data: T,
    fileId?: number
  ): void {
    const cacheKey = this.getCacheKey(type, period, fileId);
    queryClient.setQueryData(cacheKey, data);
  }

  /**
   * Check if data is stale and needs refresh
   */
  static isDataStale(
    queryClient: QueryClient,
    type: keyof typeof DashboardCacheManager.CACHE_KEYS,
    period: DashboardPeriod,
    fileId?: number
  ): boolean {
    const cacheKey = this.getCacheKey(type, period, fileId);
    const queryState = queryClient.getQueryState(cacheKey);
    
    if (!queryState) return true;
    
    const now = Date.now();
    const lastFetch = queryState.dataUpdatedAt;
    const isStale = (now - lastFetch) > this.CACHE_TIMES.STALE_TIME;
    
    return isStale;
  }

  /**
   * Remove stale cache entries to free memory
   */
  static cleanup(queryClient: QueryClient): void {
    queryClient.clear();
  }

  /**
   * Get optimal cache configuration for dashboard queries
   */
  static getQueryConfig() {
    return {
      staleTime: this.CACHE_TIMES.STALE_TIME,
      cacheTime: this.CACHE_TIMES.CACHE_TIME,
      refetchOnWindowFocus: false,
      refetchOnMount: 'always' as const,
      refetchOnReconnect: true,
      retry: (failureCount: number, error: { response?: { status?: number } }) => {
        // Don't retry on auth errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    };
  }

  /**
   * Optimize chart data for better rendering performance
   */
  static optimizeChartData<T extends { value: number; period: string }>(
    data: T[],
    maxPoints = 100
  ): T[] {
    if (!data || data.length <= maxPoints) {
      return data;
    }

    // Use sampling for large datasets
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
  }

  /**
   * Compress large datasets for better network performance
   */
  static compressData(data: unknown): unknown {
    if (!data) return data;

    // Remove unnecessary fields and round numbers for better compression
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'object' && item !== null) {
          const compressed: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
            if (typeof value === 'number') {
              compressed[key] = Math.round(value * 100) / 100; // 2 decimal places
            } else if (value !== null && value !== undefined) {
              compressed[key] = value;
            }
          }
          return compressed;
        }
        return item;
      });
    }

    return data;
  }
}

export default DashboardCacheManager;