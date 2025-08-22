import React, { useState, useEffect } from 'react';

// Tailwind-compatible breakpoints
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Media query utilities
const createMediaQuery = (minWidth: number) => `(min-width: ${minWidth}px)`;

// Custom hook for responsive breakpoints (without Material-UI dependency)
export const useBreakpoint = () => {
  const [matches, setMatches] = useState({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  });

  useEffect(() => {
    const mediaQueries = {
      xs: window.matchMedia(createMediaQuery(breakpoints.xs)),
      sm: window.matchMedia(createMediaQuery(breakpoints.sm)),
      md: window.matchMedia(createMediaQuery(breakpoints.md)),
      lg: window.matchMedia(createMediaQuery(breakpoints.lg)),
      xl: window.matchMedia(createMediaQuery(breakpoints.xl)),
      '2xl': window.matchMedia(createMediaQuery(breakpoints['2xl'])),
    };

    const updateMatches = () => {
      setMatches({
        xs: mediaQueries.xs.matches,
        sm: mediaQueries.sm.matches,
        md: mediaQueries.md.matches,
        lg: mediaQueries.lg.matches,
        xl: mediaQueries.xl.matches,
        '2xl': mediaQueries['2xl'].matches,
      });
    };

    // Initial check
    updateMatches();

    // Add listeners
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', updateMatches);
    });

    // Cleanup
    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', updateMatches);
      });
    };
  }, []);

  // Derived values
  const isMobile = !matches.md;
  const isTablet = matches.md && !matches.lg;
  const isDesktop = matches.lg;

  // Current breakpoint (highest matching)
  let currentBreakpoint: Breakpoint = 'xs';
  if (matches['2xl']) currentBreakpoint = '2xl';
  else if (matches.xl) currentBreakpoint = 'xl';
  else if (matches.lg) currentBreakpoint = 'lg';
  else if (matches.md) currentBreakpoint = 'md';
  else if (matches.sm) currentBreakpoint = 'sm';

  return {
    // Current breakpoint
    currentBreakpoint,

    // All breakpoint matches
    ...matches,

    // Device categories
    isMobile,
    isTablet,
    isDesktop,

    // Legacy compatibility (for easier migration)
    isXs: currentBreakpoint === 'xs',
    isSm: currentBreakpoint === 'sm',
    isMd: currentBreakpoint === 'md',
    isLg: currentBreakpoint === 'lg',
    isXl: currentBreakpoint === 'xl',

    // Down breakpoints
    isSmDown: !matches.md,
    isMdDown: !matches.lg,
    isLgDown: !matches.xl,

    // Up breakpoints
    isSmUp: matches.sm,
    isMdUp: matches.md,
    isLgUp: matches.lg,
  };
};

// Responsive value utility
export const useResponsiveValue = <T>(
  values: Partial<Record<Breakpoint, T>>
) => {
  const { currentBreakpoint } = useBreakpoint();

  // Return the value for current breakpoint or the nearest smaller one
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  // Fallback to the first available value
  return (
    values['2xl'] ||
    values.xl ||
    values.lg ||
    values.md ||
    values.sm ||
    values.xs
  );
};

// Touch device detection
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
          (navigator?.maxTouchPoints ?? 0) > 0 ||
          ((navigator as Navigator & { msMaxTouchPoints?: number })
            ?.msMaxTouchPoints ?? 0) > 0
      );
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);

    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  return isTouchDevice;
};

// Viewport dimensions hook
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

// Orientation detection
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);

    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return orientation;
};

// Responsive grid columns utility
export const getResponsiveColumns = (
  totalColumns: number,
  breakpoints: Partial<Record<Breakpoint, number>> = {}
): Partial<Record<Breakpoint, number>> => {
  return {
    xs: breakpoints.xs || Math.min(1, totalColumns),
    sm: breakpoints.sm || Math.min(2, totalColumns),
    md: breakpoints.md || Math.min(3, totalColumns),
    lg: breakpoints.lg || Math.min(4, totalColumns),
    xl: breakpoints.xl || totalColumns,
    '2xl': breakpoints['2xl'] || totalColumns,
  };
};

// Swipe gesture utilities
export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipeGestures = (handlers: SwipeHandlers, threshold = 50) => {
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startPos) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }

    setStartPos(null);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

// Chart responsive configuration
export const getResponsiveChartConfig = (breakpoint: Breakpoint) => {
  const configs = {
    xs: {
      width: '100%',
      height: 250,
      margin: { top: 10, right: 10, bottom: 30, left: 40 },
      fontSize: 12,
      showLegend: false,
      showTooltip: true,
    },
    sm: {
      width: '100%',
      height: 300,
      margin: { top: 15, right: 15, bottom: 40, left: 50 },
      fontSize: 13,
      showLegend: true,
      showTooltip: true,
    },
    md: {
      width: '100%',
      height: 350,
      margin: { top: 20, right: 20, bottom: 50, left: 60 },
      fontSize: 14,
      showLegend: true,
      showTooltip: true,
    },
    lg: {
      width: '100%',
      height: 400,
      margin: { top: 20, right: 30, bottom: 60, left: 70 },
      fontSize: 14,
      showLegend: true,
      showTooltip: true,
    },
    xl: {
      width: '100%',
      height: 450,
      margin: { top: 25, right: 40, bottom: 70, left: 80 },
      fontSize: 15,
      showLegend: true,
      showTooltip: true,
    },
    '2xl': {
      width: '100%',
      height: 500,
      margin: { top: 30, right: 50, bottom: 80, left: 90 },
      fontSize: 16,
      showLegend: true,
      showTooltip: true,
    },
  };

  return configs[breakpoint] || configs.md;
};

// Progressive enhancement utilities
export const useProgressiveEnhancement = () => {
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    // Check if we can use advanced features
    const supportsAdvancedFeatures =
      'IntersectionObserver' in window &&
      'requestAnimationFrame' in window &&
      CSS.supports('display', 'grid');

    setIsEnhanced(supportsAdvancedFeatures);
  }, []);

  return isEnhanced;
};

// Modern responsive utilities for Tailwind CSS
export const responsiveUtils = {
  // Get Tailwind classes for responsive values
  getResponsiveClasses: <T extends string>(
    values: Partial<Record<Breakpoint, T>>,
    prefix = ''
  ): string => {
    const classes: string[] = [];

    if (values.xs) classes.push(`${prefix}${values.xs}`);
    if (values.sm) classes.push(`sm:${prefix}${values.sm}`);
    if (values.md) classes.push(`md:${prefix}${values.md}`);
    if (values.lg) classes.push(`lg:${prefix}${values.lg}`);
    if (values.xl) classes.push(`xl:${prefix}${values.xl}`);
    if (values['2xl']) classes.push(`2xl:${prefix}${values['2xl']}`);

    return classes.join(' ');
  },

  // Common responsive grid patterns
  gridCols: {
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    cards: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    dashboard: 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3',
  },

  // Common responsive spacing patterns
  spacing: {
    container: 'px-4 sm:px-6 lg:px-8',
    section: 'py-8 sm:py-12 lg:py-16',
    gap: 'gap-4 sm:gap-6 lg:gap-8',
  },

  // Common responsive text patterns
  text: {
    heading: 'text-2xl sm:text-3xl lg:text-4xl',
    subheading: 'text-lg sm:text-xl lg:text-2xl',
    body: 'text-sm sm:text-base',
  },
};

export default {
  useBreakpoint,
  useResponsiveValue,
  useIsTouchDevice,
  useViewport,
  useOrientation,
  getResponsiveColumns,
  useSwipeGestures,
  getResponsiveChartConfig,
  useProgressiveEnhancement,
  responsiveUtils,
};
