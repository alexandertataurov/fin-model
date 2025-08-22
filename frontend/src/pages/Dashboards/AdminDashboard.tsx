/**
 * Admin Dashboard Page
 *
 * Dedicated page for the admin dashboard using atomic design principles
 * Updated to follow design system foundations guidelines
 * PERFORMANCE OPTIMIZED: Memoized components, optimized re-renders, and freezing prevention
 * DESIGN SYSTEM COMPLIANT: Responsive grid, mobile-first layout, semantic breakpoints, and sizing tokens
 * ATOMIC DESIGN: Uses refactored components following atoms > molecules > organisms pattern
 */

import React, { memo } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard/AdminDashboard';
import { AdminGuard } from '@/components/Authentification/AuthGuard';
import { componentStyles } from '@/design-system/utils/designSystem';

const AdminDashboardPage: React.FC = memo(() => {
  return (
    <AdminGuard>
      <div className={componentStyles.container}>
        <AdminDashboard />
      </div>
    </AdminGuard>
  );
});

AdminDashboardPage.displayName = 'AdminDashboardPage';

export default AdminDashboardPage;
