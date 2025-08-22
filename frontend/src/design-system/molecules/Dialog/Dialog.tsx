import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '../Modal';
import {
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogTriggerProps,
} from './Dialog.types'; // Import from types file

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {children}
    </Modal>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => {
  return <ModalContent className={className}>{children}</ModalContent>;
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => {
  return <ModalHeader className={className}>{children}</ModalHeader>;
};

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
}) => {
  return <ModalTitle className={className}>{children}</ModalTitle>;
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className,
}) => {
  return <ModalDescription className={className}>{children}</ModalDescription>;
};

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className,
}) => {
  return <ModalFooter className={className}>{children}</ModalFooter>;
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  asChild,
  children,
  className,
}) => {
  return (
    <ModalClose asChild={asChild} className={className}>
      {children}
    </ModalClose>
  );
};
