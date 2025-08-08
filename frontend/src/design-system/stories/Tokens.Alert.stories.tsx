import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert';
import { Info, TriangleAlert, CheckCircle2, OctagonAlert } from 'lucide-react';

const meta = {
  title: 'Design System/Tokens/Alert',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Variants = {
  render: () => (
    <div className="grid gap-3">
      <Alert>
        <Info />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Neutral information.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2 />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Check your inputs.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>FYI, here’s something.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <OctagonAlert />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    </div>
  ),
};
