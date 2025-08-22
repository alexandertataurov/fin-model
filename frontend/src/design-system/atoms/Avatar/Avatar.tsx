import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from './Avatar.types';

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

type AvatarState = {
  loaded: boolean;
  error: boolean;
  setLoaded: (v: boolean) => void;
  setError: (v: boolean) => void;
};
const AvatarCtx = createContext<AvatarState | null>(null);

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { size = 'md', shape = 'circle', className = '', children, ...props },
    ref
  ) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const value = useMemo(
      () => ({ loaded, error, setLoaded, setError }),
      [loaded, error]
    );

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center overflow-hidden bg-secondary-100 ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
        {...props}
      >
        <AvatarCtx.Provider value={value}>{children}</AvatarCtx.Provider>
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt, className = '', onLoad, onError, ...props }, ref) => {
    const ctx = useContext(AvatarCtx);
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onLoad={e => {
          ctx?.setLoaded(true);
          ctx?.setError(false);
          onLoad?.(e);
        }}
        onError={e => {
          ctx?.setLoaded(false);
          ctx?.setError(true);
          onError?.(e);
        }}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ delayMs = 600, className = '', children, ...props }, ref) => {
    const ctx = useContext(AvatarCtx);
    const [show, setShow] = useState(true);
    useEffect(() => {
      // Show fallback until image loads; delay initial display if delayMs > 0
      if (ctx?.loaded) {
        setShow(false);
        return;
      }
      if (ctx?.error) {
        setShow(true);
        return;
      }
      const t = setTimeout(() => setShow(true), delayMs);
      return () => clearTimeout(t);
    }, [ctx?.loaded, ctx?.error, delayMs]);

    if (!show) return null;
    return (
      <div
        ref={ref}
        className={`flex items-center justify-center w-full h-full text-sm font-medium text-secondary-600 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';
