/**
 * Virtualized List Component
 * 
 * Efficiently renders large lists by only rendering visible items
 * Prevents freezing and improves performance with large datasets
 */

import React, { useState, useCallback, useMemo, useRef, useEffect, memo } from 'react';

interface VirtualizedListProps<T> {
    items: T[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    onScroll?: (scrollTop: number) => void;
    overscan?: number;
}

const VirtualizedList = <T,>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    className = '',
    onScroll,
    overscan = 5
}: VirtualizedListProps<T>) => {
    const [scrollTop, setScrollTop] = useState(0);

    const totalHeight = items.length * itemHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(items.length - 1, Math.floor(scrollTop / itemHeight) + visibleCount + overscan);

    const visibleItems = useMemo(() => {
        return items.slice(startIndex, endIndex + 1).map((item, index) => (
            <div
                key={startIndex + index}
                style={{
                    position: 'absolute',
                    top: (startIndex + index) * itemHeight,
                    height: itemHeight,
                    width: '100%'
                }}
            >
                {renderItem(item, startIndex + index)}
            </div>
        ));
    }, [items, startIndex, endIndex, itemHeight, renderItem]);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        const newScrollTop = event.currentTarget.scrollTop;
        setScrollTop(newScrollTop);
        onScroll?.(newScrollTop);
    }, [onScroll]);

    return (
        <div className={`virtualized-list ${className}`}>
            <div
                style={{
                    height: containerHeight,
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
        </div>
    );
};

VirtualizedList.displayName = 'VirtualizedList';

// Hook for managing virtualized list state
export const useVirtualizedList = <T,>(
    items: T[],
    itemHeight: number,
    containerHeight: number
) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

    const updateVisibleRange = useCallback((newScrollTop: number) => {
        const start = Math.floor(newScrollTop / itemHeight);
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const end = Math.min(items.length - 1, start + visibleCount);

        setVisibleRange({ start, end });
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
}>(({ children, height, className = '', onClick, onMouseEnter, onMouseLeave }) => (
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

export default VirtualizedList;
