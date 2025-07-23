import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Performance monitoring utilities
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  networkLatency?: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureRenderTime<T extends object>(
    Component: React.ComponentType<T>,
    componentName: string
  ): React.ComponentType<T> {
    return (props: T) => {
      const startTime = useRef<number>();
      const endTime = useRef<number>();

      useEffect(() => {
        startTime.current = performance.now();
        
        return () => {
          endTime.current = performance.now();
          if (startTime.current) {
            const renderTime = endTime.current - startTime.current;
            this.recordMetric({ 
              loadTime: 0, 
              renderTime,
              memoryUsage: this.getMemoryUsage()
            });
            
            if (renderTime > 16.67) { // 60fps threshold
              console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
            }
          }
        };
      });

      return React.createElement(Component, props);
    };
  }

  // Measure page load time
  measurePageLoad(pageName: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      
      this.recordMetric({
        loadTime,
        renderTime: 0,
        memoryUsage: this.getMemoryUsage()
      });

      if (loadTime > 3000) { // 3 second threshold
        console.warn(`Slow page load detected for ${pageName}: ${loadTime}ms`);
      }
    }
  }

  // Get memory usage (if available)
  private getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const perfMemory = performance as any;
      return perfMemory.memory?.usedJSHeapSize;
    }
    return undefined;
  }

  // Record performance metric
  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    this.observers.forEach(observer => observer(metric));
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  // Subscribe to performance metrics
  subscribe(observer: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  // Get performance summary
  getSummary(): {
    averageLoadTime: number;
    averageRenderTime: number;
    slowComponents: number;
    memoryTrend: number[];
  } {
    if (this.metrics.length === 0) {
      return {
        averageLoadTime: 0,
        averageRenderTime: 0,
        slowComponents: 0,
        memoryTrend: []
      };
    }

    const loadTimes = this.metrics.map(m => m.loadTime).filter(t => t > 0);
    const renderTimes = this.metrics.map(m => m.renderTime).filter(t => t > 0);
    
    return {
      averageLoadTime: loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length || 0,
      averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length || 0,
      slowComponents: renderTimes.filter(t => t > 16.67).length,
      memoryTrend: this.metrics.map(m => m.memoryUsage).filter(Boolean) as number[]
    };
  }
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    const unsubscribe = monitor.subscribe((metric) => {
      setMetrics(prev => [...prev.slice(-99), metric]);
    });

    return unsubscribe;
  }, [monitor]);

  return {
    metrics,
    summary: monitor.getSummary(),
    measurePageLoad: monitor.measurePageLoad.bind(monitor),
  };
};

// Memoization utilities are available directly from React:
// - useMemo for expensive calculations
// - useCallback for function memoization
// Use these hooks directly in your components

// Deep comparison hook for object dependencies
export const useDeepMemo = <T>(fn: () => T, deps: any[]): T => {
  const ref = useRef<{ deps: any[]; value: T }>();
  
  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: fn() };
  }
  
  return ref.current.value;
};

// Deep equality check
function deepEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (typeof a[i] === 'object' && typeof b[i] === 'object') {
      if (!deepEqualObjects(a[i], b[i])) return false;
    } else if (a[i] !== b[i]) {
      return false;
    }
  }
  
  return true;
}

function deepEqualObjects(a: any, b: any): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (typeof a[key] === 'object' && typeof b[key] === 'object') {
      if (!deepEqualObjects(a[key], b[key])) return false;
    } else if (a[key] !== b[key]) {
      return false;
    }
  }
  
  return true;
}

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsIntersecting(isIntersecting);
        
        if (isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
};

// Virtual scrolling hook
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
    offsetY: (startIndex + index) * itemHeight,
  }));

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex,
  };
};

// Image lazy loading hook
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const { hasIntersected } = useIntersectionObserver(imgRef);

  useEffect(() => {
    if (hasIntersected && src) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setIsError(true);
      };
      
      img.src = src;
    }
  }, [hasIntersected, src]);

  return {
    imageSrc,
    isLoaded,
    isError,
    imgRef,
  };
};

// Debounced state hook
export const useDebouncedState = <T>(
  initialValue: T,
  delay: number
): [T, T, (value: T) => void] => {
  const [immediateValue, setImmediateValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(immediateValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [immediateValue, delay]);

  return [immediateValue, debouncedValue, setImmediateValue];
};

// Throttled callback hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('Bundle Analysis');
    
    // Analyze chunk sizes
    if (typeof window !== 'undefined' && window.performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      console.log('JavaScript bundles:', jsResources.map(r => ({
        name: r.name.split('/').pop(),
        size: `${Math.round(r.transferSize / 1024)}KB`,
        loadTime: `${Math.round(r.duration)}ms`
      })));
      
      console.log('CSS bundles:', cssResources.map(r => ({
        name: r.name.split('/').pop(),
        size: `${Math.round(r.transferSize / 1024)}KB`,
        loadTime: `${Math.round(r.duration)}ms`
      })));
    }
    
    console.groupEnd();
  }
};

export default {
  PerformanceMonitor,
  usePerformanceMonitor,
  createStableMemo,
  createStableCallback,
  useDeepMemo,
  useIntersectionObserver,
  useVirtualScrolling,
  useLazyImage,
  useDebouncedState,
  useThrottledCallback,
  analyzeBundleSize,
}; 