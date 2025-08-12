/**
 * Virtualized List Component
 * 
 * Efficiently renders large lists by only rendering visible items
 * Prevents freezing and improves performance with large datasets
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useResizeObserver } from '@/hooks/useResizeObserver';

interface VirtualizedListProps<T> {
    items: T[];
    height: number | string;
    itemHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    overscan?: number; // Number of items to render outside viewport
    className?: string;
    onScroll?: (scrollTop: number) => void;
    onEndReached?: () => void;
    endReachedThreshold?: number; // Distance from bottom to trigger onEndReached
}

interface VirtualizedListState {
    scrollTop: number;
    containerHeight: number;
    startIndex: number;
    endIndex: number;
    visibleItems: number;
}

export const VirtualizedList = memo(<T extends any>({
    items,
    height,
    itemHeight,
    renderItem,
    overscan = 5,
    className = '',
    onScroll,
    onEndReached,
    endReachedThreshold = 100
}: VirtualizedListProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<VirtualizedListState>({
        scrollTop: 0,
        containerHeight: 0,
        startIndex: 0,
        endIndex: 0,
        visibleItems: 0
    });

    // Calculate visible range based on scroll position
    const calculateVisibleRange = useCallback((scrollTop: number, containerHeight: number) => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const visibleItems = Math.ceil(containerHeight / itemHeight);
        const endIndex = Math.min(
            items.length - 1,
            Math.floor(scrollTop / itemHeight) + visibleItems + overscan
        );

        return {
            startIndex,
            endIndex,
            visibleItems
        };
    }, [itemHeight, overscan, items.length]);

    // Handle scroll events
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = event.currentTarget.scrollTop;
        const containerHeight = event.currentTarget.clientHeight;

        const { startIndex, endIndex, visibleItems } = calculateVisibleRange(scrollTop, containerHeight);

        setState(prev => ({
            ...prev,
            scrollTop,
            containerHeight,
            startIndex,
            endIndex,
            visibleItems
        }));

        onScroll?.(scrollTop);

        // Check if we're near the end
        if (onEndReached && scrollTop + containerHeight >= (items.length * itemHeight) - endReachedThreshold) {
            onEndReached();
        }
    }, [calculateVisibleRange, onScroll, onEndReached, items.length, itemHeight, endReachedThreshold]);

    // Update visible range when items change
    useEffect(() => {
        if (containerRef.current) {
            const { startIndex, endIndex, visibleItems } = calculateVisibleRange(
                state.scrollTop,
                state.containerHeight
            );

            setState(prev => ({
                ...prev,
                startIndex,
                endIndex,
                visibleItems
            }));
        }
    }, [items.length, calculateVisibleRange, state.scrollTop, state.containerHeight]);

    // Use resize observer to handle container size changes
    useResizeObserver(containerRef, (entry) => {
        const containerHeight = entry.contentRect.height;
        if (containerHeight !== state.containerHeight) {
            const { startIndex, endIndex, visibleItems } = calculateVisibleRange(state.scrollTop, containerHeight);

            setState(prev => ({
                ...prev,
                containerHeight,
                startIndex,
                endIndex,
                visibleItems
            }));
        }
    });

    // Memoized total height
    const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

    // Memoized transform offset
    const transformOffset = useMemo(() => state.startIndex * itemHeight, [state.startIndex, itemHeight]);

    // Memoized visible items
    const visibleItems = useMemo(() => {
        return items.slice(state.startIndex, state.endIndex + 1).map((item, index) => {
            const actualIndex = state.startIndex + index;
            return (
                <div
                    key={actualIndex}
                    style={{
                        position: 'absolute',
                        top: actualIndex * itemHeight,
                        height: itemHeight,
                        width: '100%'
                    }}
                >
                    {renderItem(item, actualIndex)}
                </div>
            );
        });
    }, [items, state.startIndex, state.endIndex, itemHeight, renderItem]);

    return (
        <div
            ref={containerRef}
            className={`virtualized-list ${className}`}
            style={{
                height,
                overflow: 'auto',
                position: 'relative'
            }}
            onScroll={handleScroll}
        >
            <div
                style={{
                    height: totalHeight,
                    position: 'relative'
                }}
            >
                {visibleItems}
            </div>
        </div>
    );
});

VirtualizedList.displayName = 'VirtualizedList';

// Hook for managing virtualized list state
export const useVirtualizedList = <T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
    const [visibleRange, setVisibleRange] = useState({start: 0, end: 0 });

  const updateVisibleRange = useCallback((newScrollTop: number) => {
    const start = Math.floor(newScrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount);

    setVisibleRange({start, end});
  }, [itemHeight, containerHeight, items.length]);

  const handleScroll = useCallback((newScrollTop: number) => {
        setScrollTop(newScrollTop);
    updateVisibleRange(newScrollTop);
  }, [updateVisibleRange]);

    return {
        scrollTop,
        visibleRange,
        handleScroll,
        updateVisibleRange
    };
};

    // Optimized list item wrapper
    export const VirtualizedListItem = memo<{
  children: React.ReactNode;
    height: number;
    className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}>(({children, height, className = '', onClick, onMouseEnter, onMouseLeave}) => (
    <div
        className={`virtualized-list-item ${className}`}
        style={{
            height,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'background-color 0.2s ease'
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        {children}
    </div>
    ));

    VirtualizedListItem.displayName = 'VirtualizedListItem';

    // Performance monitoring wrapper for virtualized lists
    export const withPerformanceMonitoring = <T extends any>(
        Component: React.ComponentType<VirtualizedListProps<T>>
) => {
  return memo<VirtualizedListProps<T>>((props) => {
    const renderCount = useRef(0);
                const lastRenderTime = useRef(performance.now());

    useEffect(() => {
                    renderCount.current++;
                const now = performance.now();
                const renderTime = now - lastRenderTime.current;
                lastRenderTime.current = now;

      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
                    console.warn(
                        `[VirtualizedList] Slow render detected: ${renderTime.toFixed(2)}ms`,
                        `(items: ${props.items.length}, visible: ${props.items.length})`
                    );
      }
    });

                return <Component {...props} />;
  });
};

                // Export the monitored version
                export const MonitoredVirtualizedList = withPerformanceMonitoring(VirtualizedList);
