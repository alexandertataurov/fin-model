import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { Icon } from '../../atoms'; // Import Icon atom
// Keep for Icon atom usage

import {
  ModalProps,
  ModalTriggerProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseProps,
} from './Modal.types';

import {
  modalOverlayVariants,
  modalContentVariants,
  modalHeaderVariants,
  modalTitleVariants,
  modalDescriptionVariants,
  modalBodyVariants,
  modalFooterVariants,
  modalCloseButtonVariants,
} from './Modal.variants';

const ModalContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open = false,
      onOpenChange,
      size = 'md',
      variant = 'default',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(open);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        handleOpenChange(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleOpenChange(false);
      }
    };

    return (
      <ModalContext.Provider
        value={{ open: isOpen, onOpenChange: handleOpenChange }}
      >
        <div
          ref={overlayRef}
          className={cn(modalOverlayVariants({ open: isOpen }))}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div
            ref={ref}
            className={cn(
              modalContentVariants({ size, variant, open: isOpen }),
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>
    );
  }
);

export const ModalTrigger = React.forwardRef<
  HTMLButtonElement,
  ModalTriggerProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error('ModalTrigger must be used within a Modal');
  }

  const handleClick = () => {
    context.onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick,
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(modalHeaderVariants(), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2 ref={ref} className={cn(modalTitleVariants(), className)} {...props}>
        {children}
      </h2>
    );
  }
);

export const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  ModalDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(modalDescriptionVariants(), className)}
      {...props}
    >
      {children}
    </p>
  );
});

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(modalBodyVariants(), className)} {...props}>
        {children}
      </div>
    );
  }
);

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(modalFooterVariants(), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(ModalContext);

    if (!context) {
      throw new Error('ModalClose must be used within a Modal');
    }

    const handleClick = () => {
      context.onOpenChange(false);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(modalCloseButtonVariants(), className)}
        onClick={handleClick}
        aria-label="Close modal"
        {...props}
      >
        {children || <Icon name="X" size="md" />} {/* Use Icon atom */}
      </button>
    );
  }
);

Modal.displayName = 'Modal';
ModalTrigger.displayName = 'ModalTrigger';
ModalContent.displayName = 'ModalContent';
ModalHeader.displayName = 'ModalHeader';
ModalTitle.displayName = 'ModalTitle';
ModalDescription.displayName = 'ModalDescription';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ModalClose.displayName = 'ModalClose';
