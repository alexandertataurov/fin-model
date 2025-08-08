import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';

const meta = {
  title: 'Design System/Tokens/Card',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

const variants = ['default','elevated','outline','ghost','interactive'] as const;
const paddings = ['none','sm','md','lg','xl'] as const;

export const Variants = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {variants.map(v => (
        <Card key={v} variant={v as any}>
          <CardHeader>
            <CardTitle>{v}</CardTitle>
            <CardDescription>Card in {v} variant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Token-driven styles</div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">Footer</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

export const Padding = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {paddings.map(p => (
        <Card key={p} padding={p as any}>
          <CardHeader>
            <CardTitle>padding: {p}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-12 rounded border bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
