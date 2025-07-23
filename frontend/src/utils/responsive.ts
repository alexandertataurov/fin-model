import { useTheme, useMediaQuery, Theme } from '@mui/material';
import { useState, useEffect } from 'react';

// Breakpoint utilities
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Custom hook for responsive breakpoints
export const useBreakpoint = () => {
  const theme = useTheme();
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));
  
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  
  const isMobile = isXs || isSm;
  const isTablet = isMd;
  const isDesktop = isLg || isXl;

  return {
    // Exact breakpoints
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    
    // Down breakpoints
    isSmDown,
    isMdDown,
    isLgDown,
    
    // Up breakpoints
    isSmUp,
    isMdUp,
    isLgUp,
    
    // Device categories
    isMobile,
    isTablet,
    isDesktop,
  };
};

// Responsive value utility
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>) => {
  const { isXs, isSm, isMd, isLg, isXl } = useBreakpoint();
  
  if (isXl && values.xl !== undefined) return values.xl;
  if (isLg && values.lg !== undefined) return values.lg;
  if (isMd && values.md !== undefined) return values.md;
  if (isSm && values.sm !== undefined) return values.sm;
  if (isXs && values.xs !== undefined) return values.xs;
  
  // Fallback to the first available value
  return values.xl || values.lg || values.md || values.sm || values.xs;
};

// Touch device detection
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
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
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
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
  };
};

// Responsive spacing utility
export const getResponsiveSpacing = (theme: Theme) => ({
  xs: theme.spacing(1),
  sm: theme.spacing(2),
  md: theme.spacing(3),
  lg: theme.spacing(4),
  xl: theme.spacing(5),
});

// Mobile-friendly styling utilities
export const getMobileStyles = (theme: Theme) => ({
  mobileContainer: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(4),
    },
  },
  
  mobileButton: {
    minHeight: 44, // iOS touch target minimum
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.125rem',
      minHeight: 48,
    },
  },
  
  mobileInput: {
    '& .MuiInputBase-input': {
      fontSize: '1rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px', // Prevents zoom on iOS
      },
    },
  },
  
  mobileCard: {
    margin: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(2),
    },
  },
  
  mobileTouchTarget: {
    minHeight: 44,
    minWidth: 44,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      minHeight: 48,
      minWidth: 48,
      padding: theme.spacing(1.5),
    },
  },
});

// Swipe gesture utilities
export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipeGestures = (handlers: SwipeHandlers, threshold = 50) => {
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

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

export default {
  useBreakpoint,
  useResponsiveValue,
  useIsTouchDevice,
  useViewport,
  useOrientation,
  getResponsiveColumns,
  getResponsiveSpacing,
  getMobileStyles,
  useSwipeGestures,
  getResponsiveChartConfig,
  useProgressiveEnhancement,
}; 