import React from 'react';
import { tokens } from '../../tokens';
import { Card, applyTypographyStyle } from './CoreComponents';

// Border Width Scale component
export const BorderWidthScale = () => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <h3
        style={applyTypographyStyle('headline')}
        className="text-gray-900 mb-4"
      >
        Border Width Scale
      </h3>
      <p
        style={applyTypographyStyle('subtitle')}
        className="text-gray-600 max-w-2xl mx-auto"
      >
        Complete border width scale from thinnest to thickest
      </p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Object.entries(tokens.borderWidth).map(([name, width]) => (
        <Card key={name} className="p-4 space-y-3">
          <div
            className="text-sm font-medium text-gray-900"
            style={{
              fontSize: tokens.typography.fontSize.sm,
              fontWeight: tokens.typography.fontWeight.medium,
              color: tokens.colors.foreground,
            }}
          >
            {name}
          </div>
          <div
            className="h-16 bg-gradient-to-br from-primary/5 to-primary/10 border"
            style={{
              borderWidth: width as string,
              height: tokens.spacing[16],
              background: `linear-gradient(to bottom right, ${tokens.colors.primary[50]}, ${tokens.colors.primary[100]})`,
              border: `${width} solid ${tokens.colors.primary[300]}`,
            }}
          />
          <div
            className="text-xs text-gray-500 font-mono"
            style={{
              fontSize: tokens.typography.fontSize.xs,
              color: tokens.colors.secondary[500],
              fontFamily: tokens.typography.fontFamily.mono.join(', '),
            }}
          >
            {width as string}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// Border Style Showcase component
export const BorderStyleShowcase = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge'].map(style => (
      <Card key={style} className="p-6 space-y-4">
        <div
          className="text-sm font-medium text-gray-900 capitalize"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.medium,
            color: tokens.colors.foreground,
          }}
        >
          {style}
        </div>
        <div className="space-y-3">
          {Object.entries(tokens.borderWidth)
            .slice(0, 3)
            .map(([name, width]) => (
              <div key={name} className="flex items-center space-x-3">
                <div
                  className="h-8 w-16 bg-primary/10 border"
                  style={{
                    height: tokens.spacing[8],
                    width: tokens.spacing[16],
                    background: tokens.colors.primary[100],
                    borderWidth: width as string,
                    borderStyle: style as any,
                    borderColor: tokens.colors.primary[400],
                  }}
                />
                <span
                  className="text-xs text-gray-500"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500],
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
        </div>
      </Card>
    ))}
  </div>
);

// Interactive Border States component
export const InteractiveBorderStates = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      {
        name: 'Default',
        className: 'border-border',
        color: tokens.colors.border,
      },
      {
        name: 'Focus',
        className: 'border-primary ring-2 ring-primary/20',
        color: tokens.colors.primary[500],
      },
      {
        name: 'Error',
        className: 'border-destructive',
        color: tokens.colors.destructive[500],
      },
      {
        name: 'Success',
        className: 'border-green-500',
        color: tokens.colors.accent[500],
      },
    ].map(state => (
      <Card key={state.name} className="p-6 space-y-4">
        <div
          className="text-sm font-medium text-gray-900"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.medium,
            color: tokens.colors.foreground,
          }}
        >
          {state.name}
        </div>
        <div className="space-y-3">
          {Object.entries(tokens.borderWidth)
            .slice(0, 2)
            .map(([name, width]) => (
              <div key={name} className="space-y-2">
                <div
                  className="text-xs text-gray-500"
                  style={{
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.secondary[500],
                  }}
                >
                  {name}
                </div>
                <div
                  className="h-12 bg-background border"
                  style={{
                    height: tokens.spacing[12],
                    background: tokens.colors.background,
                    borderWidth: width as string,
                    borderColor: state.color,
                    borderStyle: 'solid',
                  }}
                />
              </div>
            ))}
        </div>
      </Card>
    ))}
  </div>
);

// Practical Examples component
export const PracticalExamples = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Cards */}
    <Card className="p-6 space-y-4">
      <div
        className="text-sm font-medium text-gray-900"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.foreground,
        }}
      >
        Cards
      </div>
      <div className="space-y-3">
        <div
          className="p-4 rounded-lg border border-border bg-background"
          style={{
            padding: tokens.spacing[4],
            borderRadius: tokens.borderRadius.lg,
            border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
            background: tokens.colors.background,
          }}
        >
          <div
            className="text-sm font-medium"
            style={{
              fontSize: tokens.typography.fontSize.sm,
              fontWeight: tokens.typography.fontWeight.medium,
            }}
          >
            Subtle Card
          </div>
          <div
            className="text-xs text-gray-500 mt-1"
            style={{
              fontSize: tokens.typography.fontSize.xs,
              color: tokens.colors.secondary[500],
              marginTop: tokens.spacing[1],
            }}
          >
            Uses thin border
          </div>
        </div>
        <div
          className="p-4 rounded-lg border-2 border-primary/20 bg-background"
          style={{
            padding: tokens.spacing[4],
            borderRadius: tokens.borderRadius.lg,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.primary[200]}`,
            background: tokens.colors.background,
          }}
        >
          <div
            className="text-sm font-medium"
            style={{
              fontSize: tokens.typography.fontSize.sm,
              fontWeight: tokens.typography.fontWeight.medium,
            }}
          >
            Emphasized Card
          </div>
          <div
            className="text-xs text-gray-500 mt-1"
            style={{
              fontSize: tokens.typography.fontSize.xs,
              color: tokens.colors.secondary[500],
              marginTop: tokens.spacing[1],
            }}
          >
            Uses medium border
          </div>
        </div>
      </div>
    </Card>

    {/* Buttons */}
    <Card className="p-6 space-y-4">
      <div
        className="text-sm font-medium text-gray-900"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.foreground,
        }}
      >
        Buttons
      </div>
      <div className="space-y-3">
        <button
          className="px-4 py-2 rounded-md border border-border bg-background text-sm hover:bg-accent transition-colors"
          style={{
            padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
            background: tokens.colors.background,
            fontSize: tokens.typography.fontSize.sm,
            transition: `background-color ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`,
          }}
        >
          Outline Button
        </button>
        <button
          className="px-4 py-2 rounded-md border-2 border-primary bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          style={{
            padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.primary[500]}`,
            background: tokens.colors.primary[500],
            color: tokens.colors.background,
            fontSize: tokens.typography.fontSize.sm,
            transition: `background-color ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`,
          }}
        >
          Primary Button
        </button>
      </div>
    </Card>

    {/* Form Elements */}
    <Card className="p-6 space-y-4">
      <div
        className="text-sm font-medium text-gray-900"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.foreground,
        }}
      >
        Form Elements
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Input field"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          style={{
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            borderRadius: tokens.borderRadius.md,
            border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
            background: tokens.colors.background,
            fontSize: tokens.typography.fontSize.sm,
          }}
        />
        <div
          className="p-3 rounded-md border-2 border-destructive bg-destructive/5"
          style={{
            padding: tokens.spacing[3],
            borderRadius: tokens.borderRadius.md,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.destructive[500]}`,
            background: `${tokens.colors.destructive[500]}10`,
          }}
        >
          <div
            className="text-sm text-destructive"
            style={{
              fontSize: tokens.typography.fontSize.sm,
              color: tokens.colors.destructive[500],
            }}
          >
            Error state
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// Border Radius Combinations component
export const BorderRadiusCombinations = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {['rounded-none', 'rounded-md', 'rounded-lg', 'rounded-xl'].map(radius => (
      <Card key={radius} className="p-4 space-y-3">
        <div
          className="text-sm font-medium text-gray-900 capitalize"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.medium,
            color: tokens.colors.foreground,
          }}
        >
          {radius.replace('rounded-', '')}
        </div>
        <div
          className="h-16 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30"
          style={{
            height: tokens.spacing[16],
            background: `linear-gradient(to bottom right, ${tokens.colors.primary[50]}, ${tokens.colors.primary[100]})`,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.primary[300]}`,
            borderRadius:
              radius === 'rounded-none'
                ? '0'
                : radius === 'rounded-md'
                  ? tokens.borderRadius.md
                  : radius === 'rounded-lg'
                    ? tokens.borderRadius.lg
                    : tokens.borderRadius.xl,
          }}
        />
        <div
          className="text-xs text-gray-500"
          style={{
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.secondary[500],
          }}
        >
          Border width: 2px
        </div>
      </Card>
    ))}
  </div>
);
