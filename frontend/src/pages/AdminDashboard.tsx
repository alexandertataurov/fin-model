/**
 * Admin Dashboard Page
 * 
 * Dedicated page for the consolidated admin dashboard with proper layout and navigation
 * Updated to follow design system foundations guidelines
 * PERFORMANCE OPTIMIZED: Memoized components, optimized re-renders, and freezing prevention
 * DESIGN SYSTEM COMPLIANT: Responsive grid, mobile-first layout, semantic breakpoints, and sizing tokens
 */

import React, { memo, useMemo } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard/AdminDashboard';
import { AdminGuard } from '@/components/auth/AuthGuard';
import { PageHeader } from '@/components/Layout/PageHeader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/design-system/components/Breadcrumb';
import { Shield } from 'lucide-react';
import { tokens } from '@/design-system/tokens';

// Import design system components
import {
  applyTypographyStyle,
  Container
} from '@/design-system/stories/components';

// Memoized breadcrumb items to prevent unnecessary re-renders
const MemoizedBreadcrumbItems = memo(() => (
  <>
    <BreadcrumbItem>
      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/admin/dashboard" aria-current="page">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
  </>
));

// Memoized page title and description with responsive typography
const MemoizedPageContent = memo(() => {
  const titleStyle = useMemo(() => applyTypographyStyle('headline'), []);
  const descriptionStyle = useMemo(() => ({
    ...applyTypographyStyle('body'),
    marginTop: tokens.spacing[3],
    color: tokens.colors.secondary[500]
  }), []);

  return (
    <div className="space-y-2 sm:space-y-3">
      <h1 style={titleStyle} className="text-foreground text-lg sm:text-xl lg:text-2xl">
        Admin Dashboard
      </h1>
      <p style={descriptionStyle} className="text-sm sm:text-base">
        Monitor and manage system performance, user activity, and system health
      </p>
    </div>
  );
});

// Memoized admin access badge with responsive sizing
const MemoizedAdminBadge = memo(() => {
  const badgeStyle = useMemo(() => ({
    border: `${tokens.borderWidth.base} solid ${tokens.colors.primary[200]}`,
    background: tokens.colors.primary[50],
    transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.smooth}`
  }), []);

  const iconStyle = useMemo(() => ({ color: tokens.colors.primary[500] }), []);
  const textStyle = useMemo(() => ({
    ...applyTypographyStyle('caption'),
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.primary[500]
  }), []);

  return (
    <div
      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border"
      style={badgeStyle}
    >
      <Shield
        className="h-4 w-4 sm:h-5 sm:w-5"
        style={iconStyle}
      />
      <span style={textStyle} className="text-xs sm:text-sm">
        Admin Access
      </span>
    </div>
  );
});

// Memoized header content with responsive layout
const MemoizedHeaderContent = memo(() => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
    <div className="space-y-2 sm:space-y-0 sm:flex-1">
      <Breadcrumb>
        <MemoizedBreadcrumbItems />
      </Breadcrumb>
      <div className="mt-2 sm:mt-4">
        <MemoizedPageContent />
      </div>
    </div>
    <div className="flex items-center justify-center sm:justify-end">
      <MemoizedAdminBadge />
    </div>
  </div>
));

// Memoized main content wrapper with responsive container and grid
const MemoizedMainContent = memo(() => {
  const containerStyle = useMemo(() => ({
    background: tokens.colors.background,
    minHeight: '100vh'
  }), []);

  const cardStyle = useMemo(() => ({
    background: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    boxShadow: tokens.shadows.sm,
    border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
    overflow: 'hidden'
  }), []);

  return (
    <div className="min-h-screen" style={containerStyle}>
      <PageHeader>
        <MemoizedHeaderContent />
      </PageHeader>

      {/* Responsive container with proper spacing */}
      <Container className="py-4 sm:py-6 lg:py-8">
        <div
          className="bg-surface rounded-lg sm:rounded-xl shadow-sm border border-border overflow-hidden"
          style={cardStyle}
        >
          <AdminDashboard />
        </div>
      </Container>
    </div>
  );
});

const AdminDashboardPage: React.FC = memo(() => {
  return (
    <AdminGuard>
      <MemoizedMainContent />
    </AdminGuard>
  );
});

AdminDashboardPage.displayName = 'AdminDashboardPage';

export default AdminDashboardPage;
