import React from 'react';
import { Toaster } from '../components/Sonner';
import { Button } from '../components/Button';
import { toast } from 'sonner';

const meta = {
  title: 'Design System/Toaster (Sonner)',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <div className="space-x-2">
      <Button onClick={() => toast('Saved successfully')}>Notify</Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Something went wrong')}
      >
        Error
      </Button>
      <Toaster richColors />
    </div>
  ),
};
