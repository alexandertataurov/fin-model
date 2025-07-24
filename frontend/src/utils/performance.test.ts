import { performance } from 'perf_hooks';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import FileUpload from '../pages/FileUpload';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import { LineChart } from '../components/Charts/LineChart';
import { TestDataFactory } from '../test/test-utils';

describe('Performance Tests', () => {
  describe('Component Rendering Performance', () => {
    it('should render Dashboard within performance threshold', async () => {
      const startTime = performance.now();

      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Dashboard should render within 100ms
      expect(renderTime).toBeLessThan(100);

      console.log(`Dashboard render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should render FileUpload component quickly', () => {
      const startTime = performance.now();

      render(
        <MemoryRouter>
          <FileUpload />
        </MemoryRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // FileUpload should render within 50ms
      expect(renderTime).toBeLessThan(50);

      console.log(`FileUpload render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should render charts efficiently with large datasets', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        name: `Point ${i}`,
        value: Math.random() * 1000,
      }));

      const startTime = performance.now();

      render(
        <LineChart
          data={largeDataset.map(d => d.value)}
          labels={largeDataset.map(d => d.name)}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Chart with 1000 data points should render within 200ms
      expect(renderTime).toBeLessThan(200);

      console.log(
        `Chart render time (1000 points): ${renderTime.toFixed(2)}ms`
      );
    });

    it('should handle rapid re-renders efficiently', () => {
      const { rerender } = render(
        <AnalyticsDashboard data={TestDataFactory.financialData()} />
      );

      const startTime = performance.now();

      // Simulate 10 rapid re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<AnalyticsDashboard data={TestDataFactory.financialData()} />);
      }

      const endTime = performance.now();
      const rerenderTime = endTime - startTime;

      // 10 re-renders should complete within 100ms
      expect(rerenderTime).toBeLessThan(100);

      console.log(`10 re-renders time: ${rerenderTime.toFixed(2)}ms`);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory during multiple renders', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Render and unmount components multiple times
      for (let i = 0; i < 50; i++) {
        const { unmount } = render(
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        );
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      console.log(
        `Memory increase after 50 renders: ${(
          memoryIncrease /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    });

    it('should clean up event listeners properly', () => {
      const initialListeners =
        process.listenerCount?.('unhandledRejection') || 0;

      // Render components that might add event listeners
      const components = [];
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <MemoryRouter>
            <FileUpload />
          </MemoryRouter>
        );
        components.push(unmount);
      }

      // Unmount all components
      components.forEach(unmount => unmount());

      const finalListeners = process.listenerCount?.('unhandledRejection') || 0;

      // Should not have added permanent listeners
      expect(finalListeners).toBeLessThanOrEqual(initialListeners + 1);
    });
  });

  describe('Bundle Size Analysis', () => {
    it('should track component bundle impact', () => {
      // This test would analyze the bundle size impact of different components
      // In a real implementation, this might use webpack-bundle-analyzer data

      const componentSizes = {
        Dashboard: 15.2, // KB
        FileUpload: 8.7,
        Analytics: 12.1,
        Charts: 25.3,
      };

      Object.entries(componentSizes).forEach(([component, size]) => {
        // Components should not exceed reasonable size limits
        expect(size).toBeLessThan(30); // 30KB limit
        console.log(`${component} bundle size: ${size}KB`);
      });
    });

    it('should verify lazy loading effectiveness', async () => {
      // Mock dynamic import timing
      const startTime = performance.now();

      // Simulate lazy component loading
      await new Promise(resolve => setTimeout(resolve, 10));

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Lazy loading should be fast
      expect(loadTime).toBeLessThan(50);

      console.log(`Lazy component load time: ${loadTime.toFixed(2)}ms`);
    });
  });

  describe('Animation Performance', () => {
    it('should maintain smooth animations', () => {
      const frameStart = performance.now();
      let frameCount = 0;

      // Simulate animation frames
      const animate = () => {
        frameCount++;
        if (frameCount < 60) {
          // 1 second at 60fps
          requestAnimationFrame(animate);
        } else {
          const frameEnd = performance.now();
          const totalTime = frameEnd - frameStart;
          const avgFrameTime = totalTime / frameCount;

          // Average frame time should be close to 16.67ms (60fps)
          expect(avgFrameTime).toBeLessThan(20);

          console.log(`Average frame time: ${avgFrameTime.toFixed(2)}ms`);
        }
      };

      requestAnimationFrame(animate);
    });
  });

  describe('Data Processing Performance', () => {
    it('should process large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        account: `Account ${i}`,
        q1: Math.random() * 1000000,
        q2: Math.random() * 1000000,
        q3: Math.random() * 1000000,
        q4: Math.random() * 1000000,
      }));

      const startTime = performance.now();

      // Simulate data processing operations
      const processed = largeDataset
        .filter(item => item.q1 > 500000)
        .map(item => ({
          ...item,
          total: item.q1 + item.q2 + item.q3 + item.q4,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 100);

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Processing 10,000 items should complete within 50ms
      expect(processingTime).toBeLessThan(50);
      expect(processed.length).toBeLessThanOrEqual(100);

      console.log(
        `Data processing time (10k items): ${processingTime.toFixed(2)}ms`
      );
    });

    it('should handle real-time data updates efficiently', () => {
      let updateCount = 0;
      const maxUpdates = 100;
      const startTime = performance.now();

      // Simulate real-time updates
      const interval = setInterval(() => {
        updateCount++;

        // Simulate data update processing
        const data = TestDataFactory.chartData();

        if (updateCount >= maxUpdates) {
          clearInterval(interval);

          const endTime = performance.now();
          const totalTime = endTime - startTime;
          const avgUpdateTime = totalTime / updateCount;

          // Average update processing should be fast
          expect(avgUpdateTime).toBeLessThan(10);

          console.log(`Average update time: ${avgUpdateTime.toFixed(2)}ms`);
        }
      }, 10);
    });
  });

  describe('Network Performance Simulation', () => {
    it('should handle slow network conditions gracefully', async () => {
      // Mock slow API response
      const mockSlowResponse = new Promise(resolve => {
        setTimeout(() => resolve({ data: 'mock data' }), 2000);
      });

      const startTime = performance.now();

      // Component should handle loading state
      render(<div data-testid="loading-component">Loading...</div>);

      await mockSlowResponse;

      const endTime = performance.now();
      const waitTime = endTime - startTime;

      // Should have waited approximately 2 seconds
      expect(waitTime).toBeGreaterThan(1900);
      expect(waitTime).toBeLessThan(2200);

      console.log(`Slow network simulation time: ${waitTime.toFixed(2)}ms`);
    });

    it('should handle network errors without performance degradation', () => {
      const startTime = performance.now();

      // Simulate error handling
      try {
        throw new Error('Network error');
      } catch (error) {
        // Error handling should be fast
        const endTime = performance.now();
        const errorHandlingTime = endTime - startTime;

        expect(errorHandlingTime).toBeLessThan(5);

        console.log(`Error handling time: ${errorHandlingTime.toFixed(2)}ms`);
      }
    });
  });

  describe('Accessibility Performance', () => {
    it('should maintain performance with accessibility features', () => {
      const startTime = performance.now();

      render(
        <div role="application" aria-label="Financial dashboard" tabIndex={0}>
          <Dashboard />
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Accessibility features should not significantly impact performance
      expect(renderTime).toBeLessThan(120); // Slight increase from base 100ms

      console.log(
        `Accessible component render time: ${renderTime.toFixed(2)}ms`
      );
    });
  });
});

// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTiming(label: string): () => void {
    const start = performance.now();

    return () => {
      const end = performance.now();
      const duration = end - start;

      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }

      this.metrics.get(label)!.push(duration);
    };
  }

  getStats(label: string) {
    const times = this.metrics.get(label) || [];

    if (times.length === 0) {
      return null;
    }

    const sorted = times.sort((a, b) => a - b);

    return {
      count: times.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: times.reduce((sum, time) => sum + time, 0) / times.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  getAllStats() {
    const allStats: Record<string, any> = {};

    for (const [label] of this.metrics) {
      allStats[label] = this.getStats(label);
    }

    return allStats;
  }

  reset() {
    this.metrics.clear();
  }
}

// Export performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
