import React from 'react';

const DesignTokenTest: React.FC = () => {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-8">
                Design Token Test
            </h1>

            {/* Color Tests */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-primary-500 text-white rounded-lg">
                        Primary 500
                    </div>
                    <div className="p-4 bg-secondary-500 text-white rounded-lg">
                        Secondary 500
                    </div>
                    <div className="p-4 bg-accent-500 text-white rounded-lg">
                        Accent 500
                    </div>
                    <div className="p-4 bg-destructive-500 text-white rounded-lg">
                        Destructive 500
                    </div>
                    <div className="p-4 bg-success-500 text-white rounded-lg">
                        Success 500
                    </div>
                    <div className="p-4 bg-warning-500 text-white rounded-lg">
                        Warning 500
                    </div>
                    <div className="p-4 bg-info-500 text-white rounded-lg">
                        Info 500
                    </div>
                    <div className="p-4 bg-muted-500 text-white rounded-lg">
                        Muted 500
                    </div>
                </div>
            </section>

            {/* Spacing Tests */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Spacing</h2>
                <div className="space-y-2">
                    <div className="bg-primary-100 p-1 text-xs">p-1 (0.25rem)</div>
                    <div className="bg-primary-200 p-2 text-xs">p-2 (0.5rem)</div>
                    <div className="bg-primary-300 p-4 text-xs">p-4 (1rem)</div>
                    <div className="bg-primary-400 p-6 text-xs">p-6 (1.5rem)</div>
                    <div className="bg-primary-500 p-8 text-xs text-white">p-8 (2rem)</div>
                </div>
            </section>

            {/* Typography Tests */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Typography</h2>
                <div className="space-y-2">
                    <p className="text-xs text-muted-600">text-xs (0.75rem)</p>
                    <p className="text-sm text-muted-600">text-sm (0.875rem)</p>
                    <p className="text-base text-muted-600">text-base (1rem)</p>
                    <p className="text-lg text-muted-600">text-lg (1.125rem)</p>
                    <p className="text-xl text-muted-600">text-xl (1.25rem)</p>
                    <p className="text-2xl text-muted-600">text-2xl (1.5rem)</p>
                    <p className="text-3xl text-muted-600">text-3xl (1.875rem)</p>
                    <p className="text-4xl text-muted-600">text-4xl (2.25rem)</p>
                </div>
            </section>

            {/* Border Radius Tests */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Border Radius</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-primary-100 rounded-none border">rounded-none</div>
                    <div className="p-4 bg-primary-200 rounded-sm border">rounded-sm</div>
                    <div className="p-4 bg-primary-300 rounded border">rounded</div>
                    <div className="p-4 bg-primary-400 rounded-md border">rounded-md</div>
                    <div className="p-4 bg-primary-500 rounded-lg border">rounded-lg</div>
                    <div className="p-4 bg-primary-600 rounded-xl border">rounded-xl</div>
                    <div className="p-4 bg-primary-700 rounded-2xl border">rounded-2xl</div>
                    <div className="p-4 bg-primary-800 rounded-3xl border">rounded-3xl</div>
                </div>
            </section>

            {/* Shadow Tests */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Shadows</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white shadow-sm border rounded">shadow-sm</div>
                    <div className="p-4 bg-white shadow border rounded">shadow</div>
                    <div className="p-4 bg-white shadow-md border rounded">shadow-md</div>
                    <div className="p-4 bg-white shadow-lg border rounded">shadow-lg</div>
                    <div className="p-4 bg-white shadow-xl border rounded">shadow-xl</div>
                    <div className="p-4 bg-white shadow-2xl border rounded">shadow-2xl</div>
                </div>
            </section>

            {/* CSS Variables Test */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">CSS Variables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Primary Colors:</strong>
                        <div className="mt-2 space-y-1">
                            <div>Primary 50: <span style={{ color: 'var(--colors-primary-50)' }}>■</span> var(--colors-primary-50)</div>
                            <div>Primary 500: <span style={{ color: 'var(--colors-primary-500)' }}>■</span> var(--colors-primary-500)</div>
                            <div>Primary 900: <span style={{ color: 'var(--colors-primary-900)' }}>■</span> var(--colors-primary-900)</div>
                        </div>
                    </div>
                    <div>
                        <strong>Spacing:</strong>
                        <div className="mt-2 space-y-1">
                            <div>Spacing 1: var(--spacing-1)</div>
                            <div>Spacing 4: var(--spacing-4)</div>
                            <div>Spacing 8: var(--spacing-8)</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DesignTokenTest;
