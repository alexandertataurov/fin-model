import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { cn } from '../../../utils/cn';

import {
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipContextValue,
} from './Tooltip.types';

import {
  tooltipContainerVariants,
  tooltipTriggerVariants,
  tooltipContentVariants,
  tooltipArrowVariants,
} from './Tooltip.variants';

const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error(
      'Tooltip components must be used within a Tooltip component'
    );
  }
  return context;
};

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      delayDuration = 500,
      side = 'top',
      sideOffset = 4,
      align = 'center',
      alignOffset = 0, // alignOffset is not directly used in CVA, but kept for prop consistency
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
      if (disabled) return;

      timeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, delayDuration);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setOpen(false);
    };

    const handleFocus = () => {
      if (disabled) return;
      setOpen(true);
    };

    const handleBlur = () => {
      setOpen(false);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const contextValue: TooltipContextValue = {
      open,
      setOpen,
      triggerRef,
      contentRef,
      side,
      align,
      sideOffset,
      alignOffset,
    };

    return (
      <TooltipContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(tooltipContainerVariants(), className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {children}
          {content && (
            <div
              ref={contentRef}
              className={cn(
                tooltipContentVariants({ open, side, align }),
                className
              )}
              role="tooltip"
              aria-hidden={!open}
              style={
                {
                  // Apply sideOffset dynamically if needed, CVA handles base positioning
                  // For now, CVA assumes sideOffset of 4px
                }
              }
            >
              {content}
              {/* Arrow element */}
              <div className={cn(tooltipArrowVariants({ side }))} />
            </div>
          )}
        </div>
      </TooltipContext.Provider>
    );
  }
);

export const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  TooltipTriggerProps
>(({ children, asChild = false, className, ...props }, ref) => {
  const { triggerRef } = useTooltipContext();

  return (
    <div
      ref={node => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        if (triggerRef) {
          triggerRef.current = node;
        }
      }}
      className={cn(tooltipTriggerVariants(), className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ children, className, ...props }, ref) => {
  const { open, contentRef, side, align, sideOffset, alignOffset } =
    useTooltipContext();

  return (
    <div
      ref={node => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        if (contentRef) {
          contentRef.current = node;
        }
      }}
      className={cn(tooltipContentVariants({ open, side, align }), className)}
      role="tooltip"
      aria-hidden={!open}
      style={
        {
          // Apply sideOffset dynamically if needed, CVA handles base positioning
          // For now, CVA assumes sideOffset of 4px
        }
      }
      {...props}
    >
      {children}
      {/* Arrow element */}
      <div className={cn(tooltipArrowVariants({ side }))} />
    </div>
  );
});

Tooltip.displayName = 'Tooltip';
TooltipTrigger.displayName = 'TooltipTrigger';
TooltipContent.displayName = 'TooltipContent';
