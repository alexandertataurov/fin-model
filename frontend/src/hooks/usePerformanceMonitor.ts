/**
 * Performance Monitoring Hook
 *
 * Tracks component rendering performance and helps identify bottlenecks
 * Provides metrics for optimization and debugging
 */

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  renderCount: number;
  averageRenderTime: number;
  slowRenders: number;
  lastRenderTime: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  threshold?: number; // milliseconds
  enabled?: boolean;
  onSlowRender?: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceMonitor = ({
  componentName,
  threshold = 16, // 60fps = ~16ms per frame
  enabled = process.env.NODE_ENV === 'development',
  onSlowRender,
}: UsePerformanceMonitorOptions) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    renderCount: 0,
    averageRenderTime: 0,
    slowRenders: 0,
    lastRenderTime: 0,
  });

  const startTimeRef = useRef<number>(0);

  const startRender = useCallback(() => {
    if (!enabled) return;
    startTimeRef.current = performance.now();
  }, [enabled]);

  const endRender = useCallback(() => {
    if (!enabled) return;

    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;

    const metrics = metricsRef.current;
    metrics.renderCount++;
    metrics.lastRenderTime = renderTime;
    metrics.renderTime += renderTime;
    metrics.averageRenderTime = metrics.renderTime / metrics.renderCount;

    if (renderTime > threshold) {
      metrics.slowRenders++;
      onSlowRender?.(metrics);

      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[Performance] ${componentName} slow render detected:`,
          `${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }
    }
  }, [enabled, threshold, componentName, onSlowRender]);

  const getMetrics = useCallback(() => metricsRef.current, []);

  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderTime: 0,
      renderCount: 0,
      averageRenderTime: 0,
      slowRenders: 0,
      lastRenderTime: 0,
    };
  }, []);

  // Auto-start render timing on mount
  useEffect(() => {
    startRender();
    return () => {
      endRender();
    };
  }, [startRender, endRender]);

  return {
    startRender,
    endRender,
    getMetrics,
    resetMetrics,
  };
};

// Hook for monitoring specific operations
export const useOperationMonitor = (_operationName: string) => {
  const startTimeRef = useRef<number>(0);
  const operationCountRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  const startOperation = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endOperation = useCallback(() => {
    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;

    operationCountRef.current++;
    totalTimeRef.current += duration;

    if (process.env.NODE_ENV === 'development') {
      // console.log(
      //     `[Operation] ${operationName}:`,
      //     `${duration.toFixed(2)}ms (avg: ${(totalTimeRef.current / operationCountRef.current).toFixed(2)}ms)`
      // );
    }
  }, []);

  const getOperationMetrics = useCallback(
    () => ({
      count: operationCountRef.current,
      totalTime: totalTimeRef.current,
      averageTime:
        operationCountRef.current > 0
          ? totalTimeRef.current / operationCountRef.current
          : 0,
    }),
    []
  );

  return {
    startOperation,
    endOperation,
    getOperationMetrics,
  };
};

// Hook for monitoring memory usage
export const useMemoryMonitor = (_componentName: string) => {
  const memoryRef = useRef<{
    initialMemory: number;
    peakMemory: number;
    currentMemory: number;
  }>({
    initialMemory: 0,
    peakMemory: 0,
    currentMemory: 0,
  });

  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const currentMemory = memory.usedJSHeapSize / 1024 / 1024; // MB

      if (memoryRef.current.initialMemory === 0) {
        memoryRef.current.initialMemory = currentMemory;
      }

      memoryRef.current.currentMemory = currentMemory;
      memoryRef.current.peakMemory = Math.max(
        memoryRef.current.peakMemory,
        currentMemory
      );

      if (process.env.NODE_ENV === 'development') {
        // console.log(
        //     `[Memory] ${componentName}:`,
        //     `${currentMemory.toFixed(2)}MB (peak: ${memoryRef.current.peakMemory.toFixed(2)}MB)`
        // );
      }
    }
  }, []);

  useEffect(() => {
    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [updateMemoryUsage]);

  return {
    getMemoryMetrics: () => memoryRef.current,
    updateMemoryUsage,
  };
};

// Hook for monitoring network requests
export const useNetworkMonitor = () => {
  const networkMetricsRef = useRef<{
    requests: number;
    totalTime: number;
    averageTime: number;
    slowRequests: number;
  }>({
    requests: 0,
    totalTime: 0,
    averageTime: 0,
    slowRequests: 0,
  });

  const monitorRequest = useCallback((startTime: number, endTime: number) => {
    const duration = endTime - startTime;
    const metrics = networkMetricsRef.current;

    metrics.requests++;
    metrics.totalTime += duration;
    metrics.averageTime = metrics.totalTime / metrics.requests;

    if (duration > 1000) {
      // 1 second threshold
      metrics.slowRequests++;

      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[Network] Slow request detected:`,
          `${duration.toFixed(2)}ms`
        );
      }
    }
  }, []);

  return {
    monitorRequest,
    getNetworkMetrics: () => networkMetricsRef.current,
  };
};
