/**
 * Optimized Data Fetching Hook
 * 
 * Provides intelligent caching, debouncing, and error handling
 * Prevents excessive API calls and improves performance
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNetworkMonitor } from './usePerformanceMonitor';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

interface FetchOptions {
    ttl?: number; // Cache TTL in milliseconds
    debounceMs?: number; // Debounce delay in milliseconds
    retryCount?: number; // Number of retry attempts
    retryDelay?: number; // Delay between retries in milliseconds
    enabled?: boolean; // Whether to enable fetching
}

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    lastFetched: number | null;
    retryCount: number;
}

export const useOptimizedDataFetching = <T>(
    fetchFn: () => Promise<T>,
    dependencies: any[] = [],
    options: FetchOptions = {}
) => {
    const {
        ttl = 5 * 60 * 1000, // 5 minutes default
        debounceMs = 300,
        retryCount: maxRetries = 3,
        retryDelay = 1000,
        enabled = true
    } = options;

    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: false,
        error: null,
        lastFetched: null,
        retryCount: 0
    });

    const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { monitorRequest } = useNetworkMonitor();

    // Generate cache key from dependencies
    const cacheKey = useMemo(() => {
        return JSON.stringify(dependencies);
    }, dependencies);

    // Check if cached data is still valid
    const isCacheValid = useCallback((entry: CacheEntry<T>) => {
        return Date.now() - entry.timestamp < entry.ttl;
    }, []);

    // Get cached data if available and valid
    const getCachedData = useCallback((): T | null => {
        const cached = cacheRef.current.get(cacheKey);
        if (cached && isCacheValid(cached)) {
            return cached.data;
        }
        return null;
    }, [cacheKey, isCacheValid]);

    // Set cached data
    const setCachedData = useCallback((data: T) => {
        cacheRef.current.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }, [cacheKey, ttl]);

    // Clear expired cache entries
    const cleanupCache = useCallback(() => {
        const now = Date.now();
        for (const [key, entry] of cacheRef.current.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                cacheRef.current.delete(key);
            }
        }
    }, []);

    // Perform the actual fetch
    const performFetch = useCallback(async (isRetry = false) => {
        if (!enabled) return;

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setState(prev => ({
            ...prev,
            loading: true,
            error: null
        }));

        const startTime = performance.now();

        try {
            const data = await fetchFn();
            const endTime = performance.now();

            // Monitor network performance
            monitorRequest(startTime, endTime);

            // Check if request was aborted
            if (abortControllerRef.current.signal.aborted) {
                return;
            }

            setCachedData(data);
            setState(prev => ({
                ...prev,
                data,
                loading: false,
                lastFetched: Date.now(),
                retryCount: 0
            }));
        } catch (error) {
            const endTime = performance.now();
            monitorRequest(startTime, endTime);

            // Check if request was aborted
            if (abortControllerRef.current.signal.aborted) {
                return;
            }

            const isRetryable = state.retryCount < maxRetries && !isRetry;

            if (isRetryable) {
                setState(prev => ({
                    ...prev,
                    retryCount: prev.retryCount + 1
                }));

                // Retry after delay
                setTimeout(() => {
                    performFetch(true);
                }, retryDelay);
            } else {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error as Error,
                    retryCount: 0
                }));
            }
        }
    }, [enabled, fetchFn, setCachedData, state.retryCount, maxRetries, retryDelay, monitorRequest]);

    // Debounced fetch function
    const debouncedFetch = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            performFetch();
        }, debounceMs);
    }, [performFetch, debounceMs]);

    // Manual fetch function
    const fetch = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        performFetch();
    }, [performFetch]);

    // Refresh function (ignores cache)
    const refresh = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Clear cache for this key
        cacheRef.current.delete(cacheKey);
        performFetch();
    }, [performFetch, cacheKey]);

    // Initialize data on mount
    useEffect(() => {
        if (!enabled) return;

        // Check cache first
        const cachedData = getCachedData();
        if (cachedData) {
            setState(prev => ({
                ...prev,
                data: cachedData,
                lastFetched: Date.now()
            }));
        } else {
            // Fetch if no valid cache
            debouncedFetch();
        }

        // Cleanup on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [enabled, getCachedData, debouncedFetch]);

    // Cleanup cache periodically
    useEffect(() => {
        const interval = setInterval(cleanupCache, 60000); // Clean every minute
        return () => clearInterval(interval);
    }, [cleanupCache]);

    // Return state and control functions
    return {
        ...state,
        fetch,
        refresh,
        clearCache: () => cacheRef.current.clear(),
        clearError: () => setState(prev => ({ ...prev, error: null }))
    };
};

// Hook for paginated data fetching
export const usePaginatedDataFetching = <T>(
    fetchFn: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
    pageSize: number = 20,
    options: FetchOptions = {}
) => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [allData, setAllData] = useState<T[]>([]);

    const {
        data,
        loading,
        error,
        fetch,
        refresh
    } = useOptimizedDataFetching(
        () => fetchFn(page, pageSize),
        [page, pageSize],
        options
    );

    // Update data when fetch completes
    useEffect(() => {
        if (data) {
            if (page === 1) {
                setAllData(data.data);
            } else {
                setAllData(prev => [...prev, ...data.data]);
            }
            setHasMore(data.data.length === pageSize);
        }
    }, [data, page, pageSize]);

    const loadNextPage = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    const resetPagination = useCallback(() => {
        setPage(1);
        setAllData([]);
        setHasMore(true);
        refresh();
    }, [refresh]);

    return {
        data: allData,
        loading,
        error,
        hasMore,
        page,
        loadNextPage,
        resetPagination,
        refresh
    };
};

// Hook for infinite scroll data fetching
export const useInfiniteScroll = <T>(
    fetchFn: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
    pageSize: number = 20,
    options: FetchOptions = {}
) => {
    const {
        data,
        loading,
        error,
        hasMore,
        loadNextPage,
        resetPagination
    } = usePaginatedDataFetching(fetchFn, pageSize, options);

    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection observer for infinite scroll
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMore && !loading) {
                    loadNextPage();
                }
            },
            {
                rootMargin: '100px', // Load when 100px from bottom
                threshold: 0.1
            }
        );

        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loading, loadNextPage]);

    return {
        data,
        loading,
        error,
        hasMore,
        containerRef,
        resetPagination
    };
};
