import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

const meta: Meta = {
    title: 'Design System/Foundations/Motion',
    parameters: {
        docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded'
    },
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Easing: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Easing Functions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(tokens.motion.easing).map(([name, easing]) => (
                        <div key={name} className="p-4 rounded-lg border bg-card space-y-3">
                            <div className="text-sm text-muted-foreground">{name}</div>
                            <div className="h-20 flex items-center justify-center">
                                <div
                                    className="size-12 rounded-md bg-primary/20 hover:bg-primary transition-all duration-1000"
                                    style={{ transitionTimingFunction: easing as string }}
                                />
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                                {easing as string}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Duration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(tokens.motion.duration).map(([name, duration]) => (
                        <div key={name} className="p-4 rounded-lg border bg-card space-y-3">
                            <div className="text-sm text-muted-foreground">{name}</div>
                            <div className="h-20 flex items-center justify-center">
                                <div
                                    className="size-12 rounded-md bg-primary/20 hover:bg-primary transition-all"
                                    style={{ transitionDuration: duration as string }}
                                />
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                                {duration as string}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
