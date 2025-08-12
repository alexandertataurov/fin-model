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
import { Container } from '@/design-system/stories/components';

const AdminDashboardPage: React.FC = memo(() => {
  return (
    <AdminGuard>
      <Container>
        <AdminDashboard />
      </Container>
    </AdminGuard>
  );
});

AdminDashboardPage.displayName = 'AdminDashboardPage';

export default AdminDashboardPage;
