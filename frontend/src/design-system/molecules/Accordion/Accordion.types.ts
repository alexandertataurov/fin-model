import React from 'react';

export interface AccordionProps extends React.ComponentPropsWithoutRef<'div'> {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<'button'> {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  className?: string;
}

export interface AccordionContextValue {
  type: 'single' | 'multiple';
  collapsible: boolean;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
}

export interface AccordionRef extends HTMLDivElement {}
export interface AccordionItemRef extends HTMLDivElement {}
export interface AccordionTriggerRef extends HTMLButtonElement {}
export interface AccordionContentRef extends HTMLDivElement {}
