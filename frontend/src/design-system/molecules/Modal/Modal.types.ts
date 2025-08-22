import React from 'react';

export interface ModalProps extends React.ComponentPropsWithoutRef<'div'> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'drawer';
  className?: string;
}

export interface ModalTriggerProps
  extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
  className?: string;
}

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface ModalHeaderProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface ModalTitleProps extends React.ComponentPropsWithoutRef<'h2'> {
  className?: string;
}

export interface ModalDescriptionProps
  extends React.ComponentPropsWithoutRef<'p'> {
  className?: string;
}

export interface ModalBodyProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface ModalFooterProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface ModalCloseProps
  extends React.ComponentPropsWithoutRef<'button'> {
  className?: string;
}

export interface ModalRef extends HTMLDivElement {}
