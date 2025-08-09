import React from 'react';
import { Button } from '../components/Button';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '../components/Toast';

const meta = {
  title: 'Design System/Toast',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Show toast</Button>
        <Toast open={open} onOpenChange={setOpen}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes have been saved.</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};
