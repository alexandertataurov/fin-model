import React from 'react';
import { tokens } from '../../tokens';
import { Card, applyTypographyStyle } from './CoreComponents';

// Reusable Animated Banner component
export const AnimatedBanner = ({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) => (
  <div
    className="relative overflow-hidden rounded-2xl mb-8"
    style={{
      background: tokens.colors.background,
      boxShadow: tokens.shadows.xl,
      borderRadius: tokens.borderRadius['2xl'],
      border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
    }}
  >
    {/* Content Container */}
    <div
      className="relative flex flex-col items-center justify-center px-8 py-16 text-center"
      style={{
        padding: `${tokens.spacing[16]} ${tokens.spacing[8]}`,
        minHeight: '320px',
      }}
    >
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary[500]} 0%, ${tokens.colors.primary[600]} 100%)`,
          border: `${tokens.borderWidth.base} solid ${tokens.colors.primary[200]}`,
          borderRadius: tokens.borderRadius.full,
          marginBottom: tokens.spacing[8],
          boxShadow: tokens.shadows.lg,
        }}
      >
        <div
          className="w-10 h-10 text-white"
          style={{
            width: tokens.spacing[10],
            height: tokens.spacing[10],
          }}
        >
          {icon}
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-gray-900 mb-6"
        style={{
          ...applyTypographyStyle('headline'),
          color: tokens.colors.foreground,
          marginBottom: tokens.spacing[6],
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="text-gray-600 max-w-3xl mx-auto leading-relaxed"
        style={{
          ...applyTypographyStyle('subtitle'),
          color: tokens.colors.secondary[600],
          maxWidth: '48rem',
          lineHeight: tokens.typography.lineHeight.relaxed,
        }}
      >
        {subtitle}
      </p>
    </div>

    {/* Bottom Accent */}
    <div
      className="h-2"
      style={{
        background: `linear-gradient(90deg, ${tokens.colors.primary[500]} 0%, ${tokens.colors.accent[500]} 50%, ${tokens.colors.secondary[500]} 100%)`,
        height: tokens.spacing[2],
      }}
    />
  </div>
);

// Reusable Color Wheel component
export const ColorWheel = () => (
  <div className="mb-12">
    <div className="text-center mb-6">
      <h4 style={applyTypographyStyle('title')} className="text-gray-900 mb-2">
        Color Harmony Visualization
      </h4>
      <p style={applyTypographyStyle('body')} className="text-gray-600">
        Our palette creates sophisticated harmony for financial applications
      </p>
    </div>
    <div
      className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden"
      style={{
        height: '24rem',
        borderRadius: tokens.borderRadius['2xl'],
        border: `${tokens.borderWidth[2]} solid ${tokens.colors.border}`,
        background: `linear-gradient(to bottom right, ${tokens.colors.secondary[50]}, ${tokens.colors.secondary[100]})`,
      }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Primary Indigo Center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className="w-28 h-28 rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: tokens.colors.primary[500],
            width: tokens.spacing[32],
            height: tokens.spacing[32],
            borderRadius: tokens.borderRadius.full,
            border: `${tokens.borderWidth[4]} solid ${tokens.colors.background}`,
            boxShadow: tokens.shadows['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            fontSize: tokens.typography.fontSize.sm,
            color: tokens.colors.background,
          }}
        >
          Primary
        </div>
      </div>

      {/* Secondary Gray Orbit - Larger radius */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div
          className="w-16 h-16 rounded-full shadow-lg border-2 border-white absolute -top-20 -left-8 flex items-center justify-center text-white font-medium text-xs"
          style={{
            background: tokens.colors.secondary[500],
            width: tokens.spacing[16],
            height: tokens.spacing[16],
            borderRadius: tokens.borderRadius.full,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.background}`,
            boxShadow: tokens.shadows.lg,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.background,
          }}
        >
          Text
        </div>
        <div
          className="w-14 h-14 rounded-full shadow-lg border-2 border-white absolute -top-7 -right-20 flex items-center justify-center text-white font-medium text-xs"
          style={{
            background: tokens.colors.secondary[400],
            width: tokens.spacing[16],
            height: tokens.spacing[16],
            borderRadius: tokens.borderRadius.full,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.background}`,
            boxShadow: tokens.shadows.lg,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.background,
          }}
        >
          Muted
        </div>
        <div
          className="w-12 h-12 rounded-full shadow-lg border-2 border-white absolute -bottom-7 -left-20 flex items-center justify-center text-white font-medium text-xs"
          style={{
            background: tokens.colors.secondary[300],
            width: tokens.spacing[12],
            height: tokens.spacing[12],
            borderRadius: tokens.borderRadius.full,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.background}`,
            boxShadow: tokens.shadows.lg,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.background,
          }}
        >
          Border
        </div>
      </div>

      {/* Accent Teal Orbit - Medium radius */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5">
        <div
          className="w-18 h-18 rounded-full shadow-lg border-2 border-white absolute -top-16 -right-8 flex items-center justify-center text-white font-medium text-xs"
          style={{
            background: tokens.colors.accent[500],
            width: tokens.spacing[20],
            height: tokens.spacing[20],
            borderRadius: tokens.borderRadius.full,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.background}`,
            boxShadow: tokens.shadows.lg,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.background,
          }}
        >
          Success
        </div>
        <div
          className="w-16 h-16 rounded-full shadow-lg border-2 border-white absolute -bottom-16 -right-8 flex items-center justify-center text-white font-medium text-xs"
          style={{
            background: tokens.colors.accent[600],
            width: tokens.spacing[16],
            height: tokens.spacing[16],
            borderRadius: tokens.borderRadius.full,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.background}`,
            boxShadow: tokens.shadows.lg,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.background,
          }}
        >
          Hover
        </div>
      </div>

      {/* Destructive Red - Static position */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15">
        <div
          className="w-20 h-20 rounded-full shadow-lg border-2 border-white absolute -bottom-20 -left-8 flex items-center justify-center text-white font-medium text-xs"
          style={{
            background: tokens.colors.destructive[500],
            width: tokens.spacing[20],
            height: tokens.spacing[20],
            borderRadius: tokens.borderRadius.full,
            border: `${tokens.borderWidth[2]} solid ${tokens.colors.background}`,
            boxShadow: tokens.shadows.lg,
            fontWeight: tokens.typography.fontWeight.medium,
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.background,
          }}
        >
          Error
        </div>
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Center connection lines */}
        <circle
          cx="50%"
          cy="50%"
          r="60"
          fill="none"
          stroke="rgba(99, 102, 241, 0.1)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <circle
          cx="50%"
          cy="50%"
          r="80"
          fill="none"
          stroke="rgba(20, 184, 166, 0.1)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  </div>
);

// Reusable Characteristic Card component
export const CharacteristicCard = ({
  color,
  title,
  description,
  details,
}: {
  color: string;
  title: string;
  description: string;
  details: Array<{ label: string; value: string }>;
}) => (
  <Card className="group p-8 hover:shadow-lg">
    <div className="flex items-center gap-4 mb-6">
      <div
        className="h-12 w-12 rounded-full shadow-md"
        style={{ background: color }}
      />
      <h4 style={applyTypographyStyle('title')} className="text-gray-900">
        {title}
      </h4>
    </div>
    <p style={applyTypographyStyle('body')} className="text-gray-600 mb-6">
      {description}
    </p>
    <div className="space-y-2 text-sm">
      {details.map(({ label, value }) => (
        <div key={label} className="flex justify-between items-center">
          <span
            className="text-gray-700 font-medium"
            style={{ fontWeight: tokens.typography.fontWeight.medium }}
          >
            {label}:
          </span>
          <span
            className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded"
            style={{
              fontFamily: tokens.typography.fontFamily.mono.join(', '),
              color: tokens.colors.secondary[500],
              background: tokens.colors.secondary[50],
              padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
              borderRadius: tokens.borderRadius.base,
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

// Reusable Philosophy Item component
export const PhilosophyItem = ({
  color,
  title,
  description,
}: {
  color: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-center gap-3">
    <div
      className="w-4 h-4 rounded-full"
      style={{
        background: color,
        width: tokens.spacing[4],
        height: tokens.spacing[4],
        borderRadius: tokens.borderRadius.full,
      }}
    />
    <div>
      <div
        className="font-semibold text-gray-900"
        style={{ fontWeight: tokens.typography.fontWeight.semibold }}
      >
        {title}
      </div>
      <div
        className="text-sm text-gray-600"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          color: tokens.colors.secondary[600],
        }}
      >
        {description}
      </div>
    </div>
  </div>
);

// Reusable Guidelines Section component
export const GuidelinesSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div>
    <h5
      className="font-semibold text-gray-900 mb-3"
      style={{ fontWeight: tokens.typography.fontWeight.semibold }}
    >
      {title}
    </h5>
    <ul className="space-y-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

// Reusable Guidelines Card component
export const GuidelinesCard = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <Card className="group p-6 hover:shadow-md">
    <h4
      className="font-semibold text-lg text-gray-900 mb-4"
      style={{ fontWeight: tokens.typography.fontWeight.semibold }}
    >
      {title}
    </h4>
    <ul
      className="text-base text-gray-600 space-y-2 leading-relaxed"
      style={{
        fontSize: tokens.typography.fontSize.base,
        color: tokens.colors.secondary[600],
        lineHeight: tokens.typography.lineHeight.relaxed,
      }}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </Card>
);
