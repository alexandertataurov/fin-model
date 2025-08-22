import React from 'react';

export interface TooltipProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  content?: React.ReactNode;
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  disabled?: boolean;
  className?: string;
}

export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  className?: string;
}

export interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
  sideOffset: number;
  alignOffset: number;
}

export interface TooltipRef extends HTMLDivElement {}
export interface TooltipTriggerRef extends HTMLDivElement {}
export interface TooltipContentRef extends HTMLDivElement {}
