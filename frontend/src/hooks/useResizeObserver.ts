/**
 * Resize Observer Hook
 *
 * Efficiently monitors element size changes using ResizeObserver
 * Provides performance benefits over window resize listeners
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface ResizeObserverEntry {
  contentRect: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  target: Element;
}

type ResizeObserverCallback = (entry: ResizeObserverEntry) => void;

export const useResizeObserver = (
  ref: React.RefObject<Element>,
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions
) => {
  const callbackRef = useRef<ResizeObserverCallback>(callback);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create and manage ResizeObserver
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create observer
    observerRef.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        callbackRef.current({
          contentRect: {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
            top: entry.contentRect.top,
            left: entry.contentRect.left,
          },
          target: entry.target,
        });
      }
    });

    // Start observing
    observerRef.current.observe(element, options);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [ref, options]);

  // Manual disconnect function
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  return { disconnect };
};

// Hook for getting element dimensions
export const useElementSize = <T extends Element = Element>(
  ref: React.RefObject<T>
) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useResizeObserver(ref, entry => {
    setSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    });
  });

  return size;
};

// Hook for getting element position
export const useElementPosition = <T extends Element = Element>(
  ref: React.RefObject<T>
) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useResizeObserver(ref, entry => {
    setPosition({
      top: entry.contentRect.top,
      left: entry.contentRect.left,
    });
  });

  return position;
};

// Hook for detecting when element enters/exits viewport
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        setIsIntersecting(entry.isIntersecting);
        setIntersectionRatio(entry.intersectionRatio);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { isIntersecting, intersectionRatio };
};

// Hook for detecting element visibility changes
export const useVisibilityObserver = (
  ref: React.RefObject<Element>,
  threshold: number = 0.1
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibilityRatio, setVisibilityRatio] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const ratio = entry.intersectionRatio;
          setVisibilityRatio(ratio);
          setIsVisible(ratio >= threshold);
        }
      },
      {
        threshold: [0, threshold, 1],
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  return { isVisible, visibilityRatio };
};
