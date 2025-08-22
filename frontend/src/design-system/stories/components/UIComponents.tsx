import React from 'react';
import { tokens } from '../../tokens';
import { applyTypographyStyle, Button } from './CoreComponents';

// Reusable Form Field component
export const FormField = ({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) => (
  <div>
    <label
      className="block text-sm font-medium text-gray-700 mb-2"
      style={{
        fontSize: tokens.typography.fontSize.sm,
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.secondary[700],
        marginBottom: tokens.spacing[2],
      }}
    >
      {label}
    </label>
    <input
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0"
      placeholder={placeholder}
      style={{
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        border: `${tokens.borderWidth.base} solid ${tokens.colors.secondary[300]}`,
        borderRadius: tokens.borderRadius.lg,
      }}
    />
  </div>
);

// Reusable Status Indicator component
export const StatusIndicator = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <div
      className="w-3 h-3 rounded-full"
      style={{
        background: color,
        width: tokens.spacing[3],
        height: tokens.spacing[3],
        borderRadius: tokens.borderRadius.full,
      }}
    />
    <span
      className="text-sm text-gray-700"
      style={{
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.secondary[700],
      }}
    >
      {label}
    </span>
  </div>
);

// Reusable Notification component
export const Notification = ({
  type,
  title,
  message,
  color,
}: {
  type: string;
  title: string;
  message: string;
  color: string;
}) => (
  <div
    className="p-4 rounded-lg border-l-4"
    style={{
      padding: tokens.spacing[4],
      borderRadius: tokens.borderRadius.lg,
      borderLeft: `${tokens.borderWidth[4]} solid ${color}`,
      background: `${color}10`,
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: color,
          width: tokens.spacing[2],
          height: tokens.spacing[2],
          borderRadius: tokens.borderRadius.full,
        }}
      />
      <div>
        <div
          className="font-medium text-gray-900"
          style={{ fontWeight: tokens.typography.fontWeight.medium }}
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
          {message}
        </div>
      </div>
    </div>
  </div>
);

// Reusable Dashboard Header component
export const DashboardHeader = ({
  title,
  subtitle,
  initials,
}: {
  title: string;
  subtitle: string;
  initials: string;
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
        style={{
          background: tokens.colors.primary[500],
          width: tokens.spacing[12],
          height: tokens.spacing[12],
          borderRadius: tokens.borderRadius.lg,
          fontWeight: tokens.typography.fontWeight.bold,
          color: tokens.colors.background,
        }}
      >
        {initials}
      </div>
      <div>
        <h4 style={applyTypographyStyle('title')} className="text-gray-900">
          {title}
        </h4>
        <p style={applyTypographyStyle('caption')} className="text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div
        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm"
        style={{
          padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
          borderRadius: tokens.borderRadius.lg,
          border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
          color: tokens.colors.secondary[600],
          fontSize: tokens.typography.fontSize.sm,
        }}
      >
        Settings
      </div>
      <div
        className="w-8 h-8 rounded-full"
        style={{
          background: tokens.colors.secondary[300],
          width: tokens.spacing[8],
          height: tokens.spacing[8],
          borderRadius: tokens.borderRadius.full,
        }}
      />
    </div>
  </div>
);

// Reusable Metric Card component
export const MetricCard = ({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) => (
  <div
    className="p-4 rounded-lg border border-gray-200"
    style={{
      padding: tokens.spacing[4],
      borderRadius: tokens.borderRadius.lg,
      border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
    }}
  >
    <div
      className="text-sm text-gray-500 mb-1"
      style={{
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.secondary[500],
        marginBottom: tokens.spacing[1],
      }}
    >
      {label}
    </div>
    <div style={applyTypographyStyle('title')} className="text-gray-900">
      {value}
    </div>
    <div
      className="text-sm"
      style={{
        color: tokens.colors.accent[600],
        fontSize: tokens.typography.fontSize.sm,
      }}
    >
      {change}
    </div>
  </div>
);

// Reusable Chart Area component
export const ChartArea = ({
  title,
  colors,
}: {
  title: string;
  colors: string[];
}) => (
  <div className="lg:col-span-2 p-4 rounded-lg border border-gray-200">
    <h5 style={applyTypographyStyle('subtitle')} className="text-gray-900 mb-4">
      {title}
    </h5>
    <div
      className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center"
      style={{
        height: '12rem',
        background: `linear-gradient(to bottom right, ${tokens.colors.secondary[50]}, ${tokens.colors.secondary[100]})`,
        borderRadius: tokens.borderRadius.lg,
      }}
    >
      <div className="text-center">
        <div
          className="text-sm text-gray-500 mb-2"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            color: tokens.colors.secondary[500],
            marginBottom: tokens.spacing[2],
          }}
        >
          Chart Visualization
        </div>
        <div className="flex items-center gap-2 justify-center">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full"
              style={{
                background: color,
                width: tokens.spacing[3],
                height: tokens.spacing[3],
                borderRadius: tokens.borderRadius.full,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Reusable Quick Actions component
export const QuickActions = ({
  title,
  actions,
}: {
  title: string;
  actions: Array<{ label: string; variant?: 'primary' | 'secondary' }>;
}) => (
  <div className="p-4 rounded-lg border border-gray-200">
    <h5 style={applyTypographyStyle('subtitle')} className="text-gray-900 mb-4">
      {title}
    </h5>
    <div className="space-y-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'primary'}
          className="w-full"
        >
          {action.label}
        </Button>
      ))}
    </div>
  </div>
);
