/**
 * Admin Dashboard Page
 * 
 * Dedicated page for the consolidated admin dashboard with proper layout and navigation
 * Updated to follow design system foundations guidelines
 * PERFORMANCE OPTIMIZED: Memoized components, optimized re-renders, and freezing prevention
 * DESIGN SYSTEM COMPLIANT: Responsive grid, mobile-first layout, semantic breakpoints, and sizing tokens
 */

import React, { memo } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard/AdminDashboard';
import { AdminGuard } from '@/components/auth/AuthGuard';
import { AdminHeader } from '@/components/AdminDashboard/components/AdminHeader';
import { Container } from '@/design-system/stories/components';

const AdminDashboardPage: React.FC = memo(() => {
  return (
    <AdminGuard>
      <Container>
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
          <AdminHeader
            title="Admin Dashboard"
            description="Monitor and manage system performance, user activity, and system health"
            showBreadcrumb={true}
            showAdminBadge={true}
          />
        </div>
        <AdminDashboard />
      </Container>
    </AdminGuard>
  );
});

AdminDashboardPage.displayName = 'AdminDashboardPage';

export default AdminDashboardPage;
