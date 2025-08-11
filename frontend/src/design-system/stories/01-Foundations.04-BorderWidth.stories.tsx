import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

const meta: Meta = {
    title: 'Design System/Foundations/Border Width',
    parameters: {
        docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded'
    },
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
    render: () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(tokens.borderWidth).map(([name, width]) => (
                <div key={name} className="p-4 rounded-lg border bg-card space-y-3">
                    <div className="text-sm text-muted-foreground">{name}</div>
                    <div
                        className="h-20 bg-primary/10 border"
                        style={{ borderWidth: width as string }}
                    />
                    <div className="text-xs text-muted-foreground">
                        {width as string}
                    </div>
                </div>
            ))}
        </div>
    ),
};