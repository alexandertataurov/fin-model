import React from 'react';
import { tokens } from '../../tokens';
import { Card, applyTypographyStyle } from './CoreComponents';

// Reusable Swatch component
export const Swatch = ({
    name,
    value,
    description,
    size = '16',
    showCode = true
}: {
    name: string;
    value: string;
    description?: string;
    size?: string;
    showCode?: boolean;
}) => (
    <Card className="hover:border-gray-300">
        <div className="flex items-center gap-4">
            <div
                className="rounded-lg border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-200"
                style={{
                    background: value,
                    width: tokens.spacing[size as keyof typeof tokens.spacing] || `${size}px`,
                    height: tokens.spacing[size as keyof typeof tokens.spacing] || `${size}px`,
                    borderRadius: tokens.borderRadius.lg,
                    border: `${tokens.borderWidth[2]} solid ${tokens.colors.secondary[100]}`,
                    boxShadow: tokens.shadows.sm,
                    transition: `box-shadow ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`
                }}
            />
            <div className="flex-1 min-w-0">
                <div
                    className="font-semibold text-sm text-gray-900 mb-1"
                    style={{
                        fontWeight: tokens.typography.fontWeight.semibold,
                        fontSize: tokens.typography.fontSize.sm,
                        color: tokens.colors.foreground,
                        marginBottom: tokens.spacing[1]
                    }}
                >
                    {name}
                </div>
                {showCode && (
                    <div
                        className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border"
                        style={{
                            fontSize: tokens.typography.fontSize.xs,
                            color: tokens.colors.secondary[500],
                            fontFamily: tokens.typography.fontFamily.mono.join(', '),
                            background: tokens.colors.secondary[50],
                            padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                            borderRadius: tokens.borderRadius.base,
                            border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`
                        }}
                    >
                        {value}
                    </div>
                )}
                {description && (
                    <div
                        className="text-xs text-gray-600 mt-2 italic"
                        style={{
                            fontSize: tokens.typography.fontSize.xs,
                            color: tokens.colors.secondary[600],
                            marginTop: tokens.spacing[2]
                        }}
                    >
                        {description}
                    </div>
                )}
            </div>
        </div>
    </Card>
);

// Reusable Color Palette component
export const ColorPalette = ({
    title,
    subtitle,
    colors,
    descriptionMap = {}
}: {
    title: string;
    subtitle: string;
    colors: Record<string, string>;
    descriptionMap?: Record<string, string>;
}) => (
    <div className="space-y-8">
        <div className="text-center mb-8">
            <h3
                style={applyTypographyStyle('headline')}
                className="text-gray-900 mb-4"
            >
                {title}
            </h3>
            <p
                style={applyTypographyStyle('subtitle')}
                className="text-gray-600 max-w-2xl mx-auto"
            >
                {subtitle}
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(colors).map(([key, value]) => (
                <Swatch
                    key={key}
                    name={`${title} ${key}`}
                    value={value}
                    description={descriptionMap[key]}
                />
            ))}
        </div>
    </div>
);

// Reusable Color Scale component
export const ColorScale = ({
    name,
    colors
}: {
    name: string;
    colors: Record<string, string>;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-8">
            <h3
                style={applyTypographyStyle('headline')}
                className="text-gray-900 mb-4"
            >
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </h3>
            <p
                style={applyTypographyStyle('subtitle')}
                className="text-gray-600 max-w-2xl mx-auto"
            >
                Complete color scale from lightest to darkest
            </p>
        </div>
        <div className="grid grid-cols-11 gap-3">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => {
                const colorValue = colors[String(shade) as keyof typeof colors];
                return (
                    <div key={shade} className="text-center group">
                        <div
                            className="h-20 w-full rounded-lg border-2 border-gray-200 shadow-sm mb-3 group-hover:shadow-md transition-shadow duration-200"
                            style={{
                                background: colorValue,
                                borderRadius: tokens.borderRadius.lg,
                                border: `${tokens.borderWidth[2]} solid ${tokens.colors.secondary[200]}`,
                                boxShadow: tokens.shadows.sm,
                                marginBottom: tokens.spacing[3],
                                transition: `box-shadow ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`
                            }}
                        />
                        <div
                            className="text-sm font-semibold text-gray-900 mb-1"
                            style={{
                                fontSize: tokens.typography.fontSize.sm,
                                fontWeight: tokens.typography.fontWeight.semibold,
                                color: tokens.colors.foreground,
                                marginBottom: tokens.spacing[1]
                            }}
                        >
                            {shade}
                        </div>
                        <div
                            className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border"
                            style={{
                                fontSize: tokens.typography.fontSize.xs,
                                color: tokens.colors.secondary[500],
                                fontFamily: tokens.typography.fontFamily.mono.join(', '),
                                background: tokens.colors.secondary[50],
                                padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                                borderRadius: tokens.borderRadius.base,
                                border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`
                            }}
                        >
                            {colorValue}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

// Reusable Interactive State component
export const InteractiveState = ({
    name,
    defaultColor,
    hover,
    active,
    focus
}: {
    name: string;
    defaultColor: string;
    hover: string;
    active: string;
    focus: string;
}) => (
    <Card>
        <h4
            className="font-semibold text-gray-900 capitalize mb-4 text-lg"
            style={{
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.foreground,
                marginBottom: tokens.spacing[4],
                fontSize: tokens.typography.fontSize.lg
            }}
        >
            {name}
        </h4>
        <div className="space-y-3">
            {[
                { name: 'Default', value: defaultColor },
                { name: 'Hover', value: hover },
                { name: 'Active', value: active },
                { name: 'Focus', value: focus },
            ].map(({ name: stateName, value }) => (
                <div
                    key={stateName}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100"
                    style={{
                        gap: tokens.spacing[4],
                        padding: tokens.spacing[3],
                        borderRadius: tokens.borderRadius.lg,
                        background: tokens.colors.secondary[50],
                        border: `${tokens.borderWidth.base} solid ${tokens.colors.secondary[100]}`
                    }}
                >
                    <div
                        className="h-10 w-10 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{
                            background: value,
                            borderRadius: tokens.borderRadius.lg,
                            border: `${tokens.borderWidth[2]} solid ${tokens.colors.secondary[200]}`,
                            boxShadow: tokens.shadows.sm
                        }}
                    />
                    <div className="flex-1">
                        <div
                            className="font-medium text-gray-900"
                            style={{
                                fontWeight: tokens.typography.fontWeight.medium,
                                color: tokens.colors.foreground
                            }}
                        >
                            {stateName}
                        </div>
                        <div
                            className="text-xs text-gray-500 font-mono"
                            style={{
                                fontSize: tokens.typography.fontSize.xs,
                                color: tokens.colors.secondary[500],
                                fontFamily: tokens.typography.fontFamily.mono.join(', ')
                            }}
                        >
                            {value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

// Reusable Semantic Color component
export const SemanticColor = ({
    name,
    value,
    description
}: {
    name: string;
    value: string;
    description: string;
}) => (
    <Card>
        <div
            className="text-sm font-medium text-gray-700 mb-4"
            style={{
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.secondary[700],
                marginBottom: tokens.spacing[4]
            }}
        >
            {name}
        </div>
        <div
            className="h-24 rounded-lg flex items-center justify-center font-semibold text-white mb-4 shadow-sm"
            style={{
                background: value,
                borderRadius: tokens.borderRadius.lg,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.background,
                marginBottom: tokens.spacing[4],
                boxShadow: tokens.shadows.sm
            }}
        >
            {name}
        </div>
        <div
            className="text-sm text-gray-600 leading-relaxed"
            style={{
                fontSize: tokens.typography.fontSize.sm,
                color: tokens.colors.secondary[600],
                lineHeight: tokens.typography.lineHeight.relaxed
            }}
        >
            {description}
        </div>
    </Card>
);

// Reusable Surface Color component
export const SurfaceColor = ({
    name,
    value,
    fg
}: {
    name: string;
    value: string;
    fg: string;
}) => (
    <Card>
        <div
            className="text-sm font-medium text-gray-700 mb-4"
            style={{
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.secondary[700],
                marginBottom: tokens.spacing[4]
            }}
        >
            {name}
        </div>
        <div
            className="h-24 rounded-lg flex items-center justify-center font-semibold border-2 border-gray-200 shadow-sm"
            style={{
                background: value,
                color: fg,
                borderRadius: tokens.borderRadius.lg,
                fontWeight: tokens.typography.fontWeight.semibold,
                border: `${tokens.borderWidth[2]} solid ${tokens.colors.border}`,
                boxShadow: tokens.shadows.sm
            }}
        >
            {name}
        </div>
    </Card>
);
