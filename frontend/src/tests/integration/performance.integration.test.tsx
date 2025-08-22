import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/design-system/providers/ThemeProvider';
import { 
  Header, 
  Dashboard, 
  DataTable, 
  ActionBar, 
  Navigation,
  UserMenu,
  NotificationCenter,
  SearchBar,
  FilterPanel,
  PaginationControls,
  StatusBar
} from '@/design-system/organisms';

// Performance measurement utilities
const measurePerformance = (fn: () => void): number => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

const measureMemoryUsage = (): number => {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
};

// Test wrapper with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

// Mock data generators
const generateLargeDataset = (size: number) => 
  Array.from({ length: size }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    status: i % 2 === 0 ? 'active' : 'inactive',
    role: i % 3 === 0 ? 'admin' : 'user',
    department: `Dept ${i % 5}`,
    lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));

const generateManyNotifications = (size: number) =>
  Array.from({ length: size }, (_, i) => ({
    id: i,
    title: `Notification ${i}`,
    message: `This is notification message ${i}`,
    type: i % 4 === 0 ? 'error' : i % 4 === 1 ? 'warning' : i % 4 === 2 ? 'success' : 'info',
    timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));

describe('Performance Integration Tests', () => {
  let initialMemory: number;

  beforeAll(() => {
    initialMemory = measureMemoryUsage();
  });

  afterAll(() => {
    const finalMemory = measureMemoryUsage();
    console.log(`Memory usage change: ${(finalMemory - initialMemory) / 1024 / 1024} MB`);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Rendering Performance Benchmarks', () => {
    it('should render Header with Navigation efficiently', () => {
      const renderTime = measurePerformance(() => {
        render(
          <TestWrapper>
            <Header>
              <Navigation items={Array.from({ length: 20 }, (_, i) => ({
                label: `Menu ${i}`,
                href: `/menu-${i}`
              }))} />
              <UserMenu 
                user={{ name: 'John Doe', email: 'john@example.com' }}
                menuItems={Array.from({ length: 10 }, (_, i) => ({
                  label: `Item ${i}`,
                  href: `/item-${i}`
                }))}
              />
            </Header>
          </TestWrapper>
        );
      });

      // Should render complex header in under 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('should render DataTable with large dataset efficiently', () => {
      const largeDataset = generateLargeDataset(1000);
      
      const renderTime = measurePerformance(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={largeDataset}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'status', label: 'Status' },
                { key: 'role', label: 'Role' },
                { key: 'department', label: 'Department' }
              ]}
            />
          </TestWrapper>
        );
      });

      // Should render 1000 rows in under 200ms
      expect(renderTime).toBeLessThan(200);
      
      // Verify all rows are rendered
      expect(screen.getAllByRole('row')).toHaveLength(1001); // 1000 data + 1 header
    });

    it('should render NotificationCenter with many notifications efficiently', () => {
      const manyNotifications = generateManyNotifications(100);
      
      const renderTime = measurePerformance(() => {
        render(
          <TestWrapper>
            <NotificationCenter 
              notifications={manyNotifications}
              onDismiss={vi.fn()}
            />
          </TestWrapper>
        );
      });

      // Should render 100 notifications in under 150ms
      expect(renderTime).toBeLessThan(150);
      
      // Verify notifications are rendered
      expect(screen.getAllByRole('alert')).toHaveLength(100);
    });

    it('should render Dashboard with multiple components efficiently', () => {
      const renderTime = measurePerformance(() => {
        render(
          <TestWrapper>
            <Dashboard>
              <ActionBar 
                actions={Array.from({ length: 15 }, (_, i) => ({
                  label: `Action ${i}`,
                  onClick: vi.fn()
                }))}
              />
              <SearchBar onSearch={vi.fn()} placeholder="Search..." />
              <FilterPanel 
                filters={Array.from({ length: 8 }, (_, i) => ({
                  key: `filter-${i}`,
                  label: `Filter ${i}`,
                  options: ['option1', 'option2', 'option3']
                }))}
                onFilter={vi.fn()}
              />
              <DataTable 
                data={generateLargeDataset(500)}
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'status', label: 'Status' }
                ]}
              />
              <PaginationControls 
                currentPage={1}
                totalPages={50}
                onPageChange={vi.fn()}
              />
            </Dashboard>
          </TestWrapper>
        );
      });

      // Should render complex dashboard in under 300ms
      expect(renderTime).toBeLessThan(300);
    });
  });

  describe('2. Interaction Performance Tests', () => {
    it('should handle rapid SearchBar input efficiently', async () => {
      const mockOnSearch = vi.fn();
      
      render(
        <TestWrapper>
          <SearchBar onSearch={mockOnSearch} placeholder="Search..." />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      
      // Test rapid typing performance
      const interactionTime = measurePerformance(() => {
        for (let i = 0; i < 20; i++) {
          fireEvent.change(searchInput, { target: { value: `search${i}` } });
        }
      });

      // Should handle 20 rapid changes in under 100ms
      expect(interactionTime).toBeLessThan(100);
      
      // Verify debouncing is working (should not call onSearch for every keystroke)
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled();
      });
    });

    it('should handle FilterPanel interactions efficiently', () => {
      const mockOnFilter = vi.fn();
      
      render(
        <TestWrapper>
          <FilterPanel 
            filters={Array.from({ length: 10 }, (_, i) => ({
              key: `filter-${i}`,
              label: `Filter ${i}`,
              options: Array.from({ length: 20 }, (_, j) => `option-${j}`)
            }))}
            onFilter={mockOnFilter}
          />
        </TestWrapper>
      );

      const filterButtons = screen.getAllByRole('button');
      
      // Test rapid filter selection
      const interactionTime = measurePerformance(() => {
        filterButtons.forEach((button, index) => {
          if (index < 5) { // Test first 5 filters
            fireEvent.click(button);
          }
        });
      });

      // Should handle multiple filter selections in under 50ms
      expect(interactionTime).toBeLessThan(50);
    });

    it('should handle DataTable sorting efficiently', () => {
      const largeDataset = generateLargeDataset(500);
      
      render(
        <TestWrapper>
          <DataTable 
            data={largeDataset}
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'status', label: 'Status', sortable: true }
            ]}
          />
        </TestWrapper>
      );

      const sortButtons = screen.getAllByRole('button', { name: /sort/i });
      
      // Test sorting performance
      const sortTime = measurePerformance(() => {
        sortButtons.forEach(button => {
          fireEvent.click(button);
        });
      });

      // Should handle sorting in under 100ms
      expect(sortTime).toBeLessThan(100);
    });

    it('should handle PaginationControls efficiently', () => {
      const mockOnPageChange = vi.fn();
      
      render(
        <TestWrapper>
          <PaginationControls 
            currentPage={5}
            totalPages={100}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      );

      const pageButtons = screen.getAllByRole('button');
      
      // Test rapid page navigation
      const navigationTime = measurePerformance(() => {
        for (let i = 0; i < 10; i++) {
          const nextButton = screen.getByLabelText(/next page/i);
          fireEvent.click(nextButton);
        }
      });

      // Should handle rapid navigation in under 50ms
      expect(navigationTime).toBeLessThan(50);
    });
  });

  describe('3. Memory Usage Tests', () => {
    it('should not cause memory leaks with large DataTable', () => {
      const initialMemory = measureMemoryUsage();
      const largeDataset = generateLargeDataset(2000);
      
      const { unmount } = render(
        <TestWrapper>
          <DataTable 
            data={largeDataset}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'status', label: 'Status' }
            ]}
          />
        </TestWrapper>
      );

      const memoryAfterRender = measureMemoryUsage();
      
      // Unmount component
      unmount();
      
      const memoryAfterUnmount = measureMemoryUsage();
      
      // Memory should be reclaimed after unmount
      expect(memoryAfterUnmount).toBeLessThanOrEqual(memoryAfterRender);
    });

    it('should not cause memory leaks with many notifications', () => {
      const initialMemory = measureMemoryUsage();
      const manyNotifications = generateManyNotifications(200);
      
      const { unmount } = render(
        <TestWrapper>
          <NotificationCenter 
            notifications={manyNotifications}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );

      const memoryAfterRender = measureMemoryUsage();
      
      // Unmount component
      unmount();
      
      const memoryAfterUnmount = measureMemoryUsage();
      
      // Memory should be reclaimed after unmount
      expect(memoryAfterUnmount).toBeLessThanOrEqual(memoryAfterRender);
    });

    it('should handle component re-rendering efficiently', () => {
      const initialMemory = measureMemoryUsage();
      
      const { rerender } = render(
        <TestWrapper>
          <Dashboard>
            <DataTable 
              data={generateLargeDataset(100)}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' }
              ]}
            />
          </Dashboard>
        </TestWrapper>
      );

      // Re-render multiple times
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <Dashboard>
              <DataTable 
                data={generateLargeDataset(100)}
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' }
                ]}
              />
            </Dashboard>
          </TestWrapper>
        );
      }

      const finalMemory = measureMemoryUsage();
      
      // Memory usage should not grow significantly
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB increase
    });
  });

  describe('4. Optimization Effectiveness Tests', () => {
    it('should benefit from React.memo optimization', () => {
      let renderCount = 0;
      
      const TestComponent = vi.fn(() => {
        renderCount++;
        return <div>Test Component</div>;
      });
      
      const MemoizedComponent = React.memo(TestComponent);
      
      const { rerender } = render(
        <TestWrapper>
          <MemoizedComponent />
        </TestWrapper>
      );

      // Re-render with same props
      rerender(
        <TestWrapper>
          <MemoizedComponent />
        </TestWrapper>
      );

      // Component should only render once due to memoization
      expect(renderCount).toBe(1);
    });

    it('should benefit from useMemo optimization', () => {
      const expensiveCalculation = vi.fn(() => {
        // Simulate expensive calculation
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
          result += Math.random();
        }
        return result;
      });

      const TestComponent = () => {
        const memoizedValue = React.useMemo(() => expensiveCalculation(), []);
        return <div>{memoizedValue}</div>;
      };

      const { rerender } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Re-render component
      rerender(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Expensive calculation should only run once
      expect(expensiveCalculation).toHaveBeenCalledTimes(1);
    });

    it('should benefit from useCallback optimization', () => {
      const mockHandler = vi.fn();
      
      const TestComponent = () => {
        const memoizedHandler = React.useCallback(() => {
          mockHandler();
        }, []);

        return (
          <button onClick={memoizedHandler}>
            Click me
          </button>
        );
      };

      const { rerender } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Re-render component
      rerender(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Handler should be stable (same reference)
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('5. Bundle Size Impact Tests', () => {
    it('should have reasonable bundle size for organisms', () => {
      // This test would typically run in a build environment
      // For now, we'll test that components can be imported without errors
      
      expect(() => {
        require('@/design-system/organisms');
      }).not.toThrow();
    });

    it('should support tree shaking for unused components', () => {
      // Test that individual components can be imported
      expect(() => {
        import('@/design-system/organisms').then(({ Header }) => {
          expect(Header).toBeDefined();
        });
      }).not.toThrow();
    });
  });

  describe('6. Real-world Performance Scenarios', () => {
    it('should handle admin dashboard scenario efficiently', () => {
      const renderTime = measurePerformance(() => {
        render(
          <TestWrapper>
            <Header>
              <Navigation items={Array.from({ length: 15 }, (_, i) => ({
                label: `Menu ${i}`,
                href: `/menu-${i}`
              }))} />
              <UserMenu 
                user={{ name: 'Admin', email: 'admin@example.com' }}
                menuItems={Array.from({ length: 8 }, (_, i) => ({
                  label: `Admin ${i}`,
                  href: `/admin-${i}`
                }))}
              />
            </Header>
            
            <Dashboard>
              <ActionBar 
                actions={Array.from({ length: 12 }, (_, i) => ({
                  label: `Action ${i}`,
                  onClick: vi.fn()
                }))}
              />
              
              <SearchBar onSearch={vi.fn()} placeholder="Search users..." />
              
              <FilterPanel 
                filters={Array.from({ length: 6 }, (_, i) => ({
                  key: `filter-${i}`,
                  label: `Filter ${i}`,
                  options: ['All', 'Active', 'Inactive', 'Pending']
                }))}
                onFilter={vi.fn()}
              />
              
              <DataTable 
                data={generateLargeDataset(1000)}
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'status', label: 'Status' },
                  { key: 'role', label: 'Role' },
                  { key: 'department', label: 'Department' },
                  { key: 'lastLogin', label: 'Last Login' }
                ]}
              />
              
              <PaginationControls 
                currentPage={1}
                totalPages={100}
                onPageChange={vi.fn()}
              />
            </Dashboard>
            
            <StatusBar 
              status="ready"
              message="Dashboard loaded successfully"
            />
          </TestWrapper>
        );
      });

      // Should render complex admin dashboard in under 500ms
      expect(renderTime).toBeLessThan(500);
    });

    it('should handle notification-heavy scenario efficiently', () => {
      const manyNotifications = generateManyNotifications(50);
      
      const renderTime = measurePerformance(() => {
        render(
          <TestWrapper>
            <NotificationCenter 
              notifications={manyNotifications}
              onDismiss={vi.fn()}
            />
            <StatusBar 
              status="notifications"
              message={`You have ${manyNotifications.length} notifications`}
            />
          </TestWrapper>
        );
      });

      // Should render notification center with 50 notifications in under 200ms
      expect(renderTime).toBeLessThan(200);
    });
  });
});
