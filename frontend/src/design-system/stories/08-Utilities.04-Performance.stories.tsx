import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';

const meta: Meta = {
    title: 'Design System/11 - Performance/Performance Monitor',
    component: React.Fragment,
    tags: ['autodocs'],
    argTypes: {
        startupTime: {
            control: { type: 'number', min: 0, max: 5000 },
            description: 'Startup time in milliseconds',
        },
        bundleSize: {
            control: { type: 'number', min: 0, max: 1000 },
            description: 'Bundle size in KB',
        },
        renderTime: {
            control: { type: 'number', min: 0, max: 50 },
            description: 'Render time in milliseconds',
        },
        memoryUsage: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'Memory usage in MB',
        },
    },
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Performance Monitor

This story tracks Storybook performance metrics and startup time.

### Metrics Tracked
- **Startup Time**: Time from initial load to interactive
- **Bundle Size**: JavaScript and CSS bundle sizes
- **Render Performance**: Component render times
- **Memory Usage**: Memory consumption patterns

### Performance Targets
- **Startup**: <2 seconds
- **Bundle**: <1MB total
- **Render**: <16ms per frame
- **Memory**: <50MB baseline
        `,
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Performance Dashboard
 *
 * Real-time performance metrics and monitoring.
 */
export const PerformanceDashboard: Story = {
    render: () => {
        const [metrics, setMetrics] = useState({
            startupTime: 0,
            bundleSize: 0,
            renderTime: 0,
            memoryUsage: 0,
        });

        useEffect(() => {
            // Simulate performance metrics
            const timer = setTimeout(() => {
                setMetrics({
                    startupTime: Math.random() * 2000 + 500, // 500ms - 2.5s
                    bundleSize: Math.random() * 500 + 200, // 200KB - 700KB
                    renderTime: Math.random() * 16 + 8, // 8ms - 24ms
                    memoryUsage: Math.random() * 30 + 20, // 20MB - 50MB
                });
            }, 100);

            return () => clearTimeout(timer);
        }, []);

        const getPerformanceColor = (value: number, target: number, good: number) => {
            if (value <= good) return 'bg-green-100 text-green-800';
            if (value <= target) return 'bg-yellow-100 text-yellow-800';
            return 'bg-red-100 text-red-800';
        };

        const getPerformanceIcon = (value: number, target: number, good: number) => {
            if (value <= good) return '✅';
            if (value <= target) return '⚠️';
            return '❌';
        };

        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Startup Time */}
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Startup Time</h4>
                                    <Badge
                                        variant={metrics.startupTime <= 1000 ? 'default' : metrics.startupTime <= 2000 ? 'secondary' : 'destructive'}
                                    >
                                        {getPerformanceIcon(metrics.startupTime, 2000, 1000)} {metrics.startupTime.toFixed(0)}ms
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Target: &lt;2s</span>
                                        <span className="text-muted-foreground">Good: &lt;1s</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getPerformanceColor(metrics.startupTime, 2000, 1000).split(' ')[0]}`}
                                            style={{ width: `${Math.min((metrics.startupTime / 2000) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bundle Size */}
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Bundle Size</h4>
                                    <Badge
                                        variant={metrics.bundleSize <= 300 ? 'default' : metrics.bundleSize <= 500 ? 'secondary' : 'destructive'}
                                    >
                                        {getPerformanceIcon(metrics.bundleSize, 500, 300)} {(metrics.bundleSize / 1024).toFixed(1)}MB
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Target: &lt;500KB</span>
                                        <span className="text-muted-foreground">Good: &lt;300KB</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getPerformanceColor(metrics.bundleSize, 500, 300).split(' ')[0]}`}
                                            style={{ width: `${Math.min((metrics.bundleSize / 500) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Render Time */}
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Render Time</h4>
                                    <Badge
                                        variant={metrics.renderTime <= 12 ? 'default' : metrics.renderTime <= 16 ? 'secondary' : 'destructive'}
                                    >
                                        {getPerformanceIcon(metrics.renderTime, 16, 12)} {metrics.renderTime.toFixed(1)}ms
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Target: &lt;16ms</span>
                                        <span className="text-muted-foreground">Good: &lt;12ms</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getPerformanceColor(metrics.renderTime, 16, 12).split(' ')[0]}`}
                                            style={{ width: `${Math.min((metrics.renderTime / 16) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Memory Usage */}
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Memory Usage</h4>
                                    <Badge
                                        variant={metrics.memoryUsage <= 35 ? 'default' : metrics.memoryUsage <= 50 ? 'secondary' : 'destructive'}
                                    >
                                        {getPerformanceIcon(metrics.memoryUsage, 50, 35)} {metrics.memoryUsage.toFixed(1)}MB
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Target: &lt;50MB</span>
                                        <span className="text-muted-foreground">Good: &lt;35MB</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getPerformanceColor(metrics.memoryUsage, 50, 35).split(' ')[0]}`}
                                            style={{ width: `${Math.min((metrics.memoryUsage / 50) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Tips */}
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Optimization Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-green-600 mb-2">✅ Startup Time</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Use code splitting with dynamic imports</li>
                                    <li>• Lazy load non-critical stories</li>
                                    <li>• Optimize bundle size with tree shaking</li>
                                    <li>• Use Vite for faster builds</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-blue-600 mb-2">💡 Bundle Size</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Analyze bundle with webpack-bundle-analyzer</li>
                                    <li>• Remove unused dependencies</li>
                                    <li>• Use dynamic imports for large components</li>
                                    <li>• Optimize images and assets</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-purple-600 mb-2">🚀 Render Performance</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Use React.memo for expensive components</li>
                                    <li>• Implement virtualization for long lists</li>
                                    <li>• Avoid unnecessary re-renders</li>
                                    <li>• Use React DevTools Profiler</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    },
};

/**
 * ## Performance Checklist
 *
 * Checklist for maintaining optimal Storybook performance.
 */
export const PerformanceChecklist: Story = {
    render: () => (
        <Card>
            <CardHeader>
                <CardTitle>Performance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Build Optimization</h4>
                        <div className="space-y-1">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span className="text-sm">Enable tree shaking and code splitting</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span className="text-sm">Use Vite for faster builds</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span className="text-sm">Optimize bundle size with manual chunks</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Implement lazy loading for stories</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Runtime Performance</h4>
                        <div className="space-y-1">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span className="text-sm">Monitor render performance</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Implement component memoization</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Use React DevTools Profiler</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Optimize image and asset loading</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Monitoring</h4>
                        <div className="space-y-1">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span className="text-sm">Track startup time metrics</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span className="text-sm">Monitor bundle size changes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Set up performance budgets</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Implement automated performance testing</span>
                            </label>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    ),
};
