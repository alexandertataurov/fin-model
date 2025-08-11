import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

const meta: Meta = {
    title: 'Design System/Foundations/Motion',
    parameters: {
        docs: {
            description: {
                component: 'Motion tokens define easing functions and durations for consistent animations across the application. Use these tokens for hover states, transitions, and micro-interactions.'
            }
        },
        layout: 'padded'
    },
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

// Interactive demo component for easing functions
const EasingDemo = ({ easing, name }: { easing: string; name: string }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
        <div className="p-4 rounded-lg border bg-white shadow-sm space-y-3">
            <div className="text-sm font-medium text-gray-700">{name}</div>
            <div className="h-20 flex items-center justify-center relative">
                <div
                    className={`w-12 h-12 rounded-md bg-blue-500 transition-all duration-1000 ${isAnimating ? 'translate-x-16 scale-110' : ''
                        }`}
                    style={{ transitionTimingFunction: easing }}
                    onMouseEnter={() => setIsAnimating(true)}
                    onMouseLeave={() => setIsAnimating(false)}
                />
            </div>
            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                {easing}
            </div>
        </div>
    );
};

// Interactive demo component for durations
const DurationDemo = ({ duration, name }: { duration: string; name: string }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
        <div className="p-4 rounded-lg border bg-white shadow-sm space-y-3">
            <div className="text-sm font-medium text-gray-700">{name}</div>
            <div className="h-20 flex items-center justify-center relative">
                <div
                    className={`w-12 h-12 rounded-md bg-green-500 transition-all ${isAnimating ? 'rotate-180 scale-125' : ''
                        }`}
                    style={{ transitionDuration: duration }}
                    onMouseEnter={() => setIsAnimating(true)}
                    onMouseLeave={() => setIsAnimating(false)}
                />
            </div>
            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                {duration}
            </div>
        </div>
    );
};

// Interactive demo component for delays
const DelayDemo = ({ delay, name }: { delay: string; name: string }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
        <div className="p-4 rounded-lg border bg-white shadow-sm space-y-3">
            <div className="text-sm font-medium text-gray-700">{name}</div>
            <div className="h-20 flex items-center justify-center relative">
                <div
                    className={`w-12 h-12 rounded-md bg-purple-500 transition-all duration-500 ${isAnimating ? 'translate-x-16 scale-110' : ''
                        }`}
                    style={{ transitionDelay: delay }}
                    onMouseEnter={() => setIsAnimating(true)}
                    onMouseLeave={() => setIsAnimating(false)}
                />
            </div>
            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                {delay}
            </div>
        </div>
    );
};

// Use case components
const ButtonWithMotion = ({ easing, duration }: { easing: string; duration: string }) => (
    <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium transition-all"
        style={{
            transitionTimingFunction: easing,
            transitionDuration: duration
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }}
    >
        Interactive Button
    </button>
);

const CardWithMotion = ({ easing, duration }: { easing: string; duration: string }) => (
    <div
        className="p-6 bg-white border rounded-lg shadow-sm cursor-pointer transition-all"
        style={{
            transitionTimingFunction: easing,
            transitionDuration: duration
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }}
    >
        <h3 className="font-semibold text-gray-900 mb-2">Card Title</h3>
        <p className="text-gray-600 text-sm">Hover to see motion in action</p>
    </div>
);

export const Easing: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Easing Functions</h3>
                <p className="text-gray-600 mb-6">
                    Easing functions control the acceleration curve of animations. Hover over each demo to see the motion in action.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(tokens.motion.easing).map(([name, easing]) => (
                        <EasingDemo key={name} name={name} easing={easing as string} />
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const Duration: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Duration Values</h3>
                <p className="text-gray-600 mb-6">
                    Duration values define how long animations take to complete. Hover over each demo to see the timing in action.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(tokens.motion.duration).map(([name, duration]) => (
                        <DurationDemo key={name} name={name} duration={duration as string} />
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const Delay: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Delay Values</h3>
                <p className="text-gray-600 mb-6">
                    Delay values define when animations start after a trigger. Hover over each demo to see the delay in action.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(tokens.motion.delay).map(([name, delay]) => (
                        <DelayDemo key={name} name={name} delay={delay as string} />
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const UseCases: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Common Use Cases</h3>
                <p className="text-gray-600 mb-6">
                    Examples of how motion tokens are used in real components.
                </p>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-medium mb-3 text-gray-800">Button Interactions</h4>
                        <div className="flex gap-4 flex-wrap">
                            <ButtonWithMotion easing={tokens.motion.easing['ease-out']} duration={tokens.motion.duration.normal} />
                            <ButtonWithMotion easing={tokens.motion.easing.bounce} duration={tokens.motion.duration.slow} />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium mb-3 text-gray-800">Card Hover Effects</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CardWithMotion easing={tokens.motion.easing['ease-in-out']} duration={tokens.motion.duration.normal} />
                            <CardWithMotion easing={tokens.motion.easing['ease-out']} duration={tokens.motion.duration.fast} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const Scenarios: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Motion Scenarios</h3>
                <p className="text-gray-600 mb-6">
                    Different scenarios where motion tokens should be applied.
                </p>

                <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-medium mb-2 text-gray-800">Micro-interactions</h4>
                        <p className="text-gray-600 mb-3">Use <code className="bg-gray-200 px-1 rounded">fast</code> duration with <code className="bg-gray-200 px-1 rounded">ease-out</code> for subtle feedback.</p>
                        <div className="flex gap-2">
                            <span className="text-sm text-gray-500">Example:</span>
                            <code className="text-sm bg-blue-100 px-2 py-1 rounded">
                                transition: all {tokens.motion.duration.fast} {tokens.motion.easing['ease-out']}
                            </code>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-medium mb-2 text-gray-800">Page Transitions</h4>
                        <p className="text-gray-600 mb-3">Use <code className="bg-gray-200 px-1 rounded">slow</code> duration with <code className="bg-gray-200 px-1 rounded">ease-in-out</code> for smooth page changes.</p>
                        <div className="flex gap-2">
                            <span className="text-sm text-gray-500">Example:</span>
                            <code className="text-sm bg-blue-100 px-2 py-1 rounded">
                                transition: all {tokens.motion.duration.slow} {tokens.motion.easing['ease-in-out']}
                            </code>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-medium mb-2 text-gray-800">Attention-grabbing Elements</h4>
                        <p className="text-gray-600 mb-3">Use <code className="bg-gray-200 px-1 rounded">bounce</code> easing for playful, attention-grabbing animations.</p>
                        <div className="flex gap-2">
                            <span className="text-sm text-gray-500">Example:</span>
                            <code className="text-sm bg-blue-100 px-2 py-1 rounded">
                                transition: all {tokens.motion.duration.normal} {tokens.motion.easing.bounce}
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const ComprehensiveExample: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Comprehensive Motion Example</h3>
                <p className="text-gray-600 mb-6">
                    A complete example showing how to combine easing, duration, and delay tokens for complex animations.
                </p>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <h4 className="text-lg font-medium mb-4 text-gray-800">Staggered Animation Grid</h4>
                    <div className="grid grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-md cursor-pointer transition-all duration-700 hover:scale-110 hover:rotate-3"
                                style={{
                                    transitionTimingFunction: tokens.motion.easing.elastic,
                                    transitionDelay: tokens.motion.delay[['none', 'fast', 'normal', 'slow'][index] as keyof typeof tokens.motion.delay]
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.1) rotate(3deg)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div className="h-full flex items-center justify-center text-white font-semibold">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        <p>Hover over each card to see elastic easing with staggered delays:</p>
                        <ul className="mt-2 space-y-1">
                            <li>• Card 1: No delay</li>
                            <li>• Card 2: {tokens.motion.delay.fast} delay</li>
                            <li>• Card 3: {tokens.motion.delay.normal} delay</li>
                            <li>• Card 4: {tokens.motion.delay.slow} delay</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const Guidelines: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Motion Guidelines</h3>

                <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-medium mb-2 text-blue-900">When to Use Motion</h4>
                        <ul className="text-blue-800 space-y-1">
                            <li>• Provide feedback for user interactions</li>
                            <li>• Guide user attention to important elements</li>
                            <li>• Create smooth transitions between states</li>
                            <li>• Enhance the overall user experience</li>
                        </ul>
                    </div>

                    <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 className="text-lg font-medium mb-2 text-yellow-900">Accessibility Considerations</h4>
                        <ul className="text-yellow-800 space-y-1">
                            <li>• Respect user's motion preferences (prefers-reduced-motion)</li>
                            <li>• Ensure animations don't cause motion sickness</li>
                            <li>• Keep animations under 500ms for optimal performance</li>
                            <li>• Provide alternative states for users with disabilities</li>
                        </ul>
                    </div>

                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="text-lg font-medium mb-2 text-green-900">Performance Best Practices</h4>
                        <ul className="text-green-800 space-y-1">
                            <li>• Use transform and opacity for smooth animations</li>
                            <li>• Avoid animating layout properties (width, height, margin)</li>
                            <li>• Use will-change CSS property sparingly</li>
                            <li>• Test animations on lower-end devices</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    ),
};
