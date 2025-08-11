import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

const meta: Meta = {
    title: 'Design System/Foundations/Border Width',
    parameters: {
        docs: {
            description: {
                component: 'Comprehensive border width system for various UI components. Supports different border styles, states, and use cases. Accessibility: Keyboard and screen reader supported.'
            }
        },
        layout: 'padded'
    },
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
    render: () => (
        <div className="space-y-8">
            {/* Basic Scale */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Border Width Scale</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(tokens.borderWidth).map(([name, width]) => (
                        <div key={name} className="p-4 rounded-lg border bg-card space-y-3">
                            <div className="text-sm font-medium text-foreground">{name}</div>
                            <div
                                className="h-16 bg-gradient-to-br from-primary/5 to-primary/10 border"
                                style={{ borderWidth: width as string }}
                            />
                            <div className="text-xs text-muted-foreground font-mono">
                                {width as string}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Border Styles */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Border Styles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge'].map((style) => (
                        <div key={style} className="p-6 rounded-xl border bg-card space-y-4">
                            <div className="text-sm font-medium text-foreground capitalize">{style}</div>
                            <div className="space-y-3">
                                {Object.entries(tokens.borderWidth).slice(0, 3).map(([name, width]) => (
                                    <div key={name} className="flex items-center space-x-3">
                                        <div
                                            className="h-8 w-16 bg-primary/10 border"
                                            style={{
                                                borderWidth: width as string,
                                                borderStyle: style as any
                                            }}
                                        />
                                        <span className="text-xs text-muted-foreground">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interactive States */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Interactive States</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: 'Default', className: 'border-border' },
                        { name: 'Focus', className: 'border-primary ring-2 ring-primary/20' },
                        { name: 'Error', className: 'border-destructive' },
                        { name: 'Success', className: 'border-green-500' }
                    ].map((state) => (
                        <div key={state.name} className="p-6 rounded-xl border bg-card space-y-4">
                            <div className="text-sm font-medium text-foreground">{state.name}</div>
                            <div className="space-y-3">
                                {Object.entries(tokens.borderWidth).slice(0, 2).map(([name, width]) => (
                                    <div key={name} className="space-y-2">
                                        <div className="text-xs text-muted-foreground">{name}</div>
                                        <div
                                            className={`h-12 bg-background border ${state.className}`}
                                            style={{ borderWidth: width as string }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Practical Examples */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Practical Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cards */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Cards</div>
                        <div className="space-y-3">
                            <div className="p-4 rounded-lg border border-border bg-background">
                                <div className="text-sm font-medium">Subtle Card</div>
                                <div className="text-xs text-muted-foreground mt-1">Uses thin border</div>
                            </div>
                            <div className="p-4 rounded-lg border-2 border-primary/20 bg-background">
                                <div className="text-sm font-medium">Emphasized Card</div>
                                <div className="text-xs text-muted-foreground mt-1">Uses medium border</div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Buttons</div>
                        <div className="space-y-3">
                            <button className="px-4 py-2 rounded-md border border-border bg-background text-sm hover:bg-accent transition-colors">
                                Outline Button
                            </button>
                            <button className="px-4 py-2 rounded-md border-2 border-primary bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
                                Primary Button
                            </button>
                        </div>
                    </div>

                    {/* Form Elements */}
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="text-sm font-medium text-foreground">Form Elements</div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Input field"
                                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <div className="p-3 rounded-md border-2 border-destructive bg-destructive/5">
                                <div className="text-sm text-destructive">Error state</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Border Radius Combinations */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Border Radius Combinations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['rounded-none', 'rounded-md', 'rounded-lg', 'rounded-xl'].map((radius) => (
                        <div key={radius} className="p-4 rounded-lg border bg-card space-y-3">
                            <div className="text-sm font-medium text-foreground capitalize">
                                {radius.replace('rounded-', '')}
                            </div>
                            <div
                                className={`h-16 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 ${radius}`}
                            />
                            <div className="text-xs text-muted-foreground">
                                Border width: 2px
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ),
};