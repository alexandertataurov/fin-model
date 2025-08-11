/**
 * Admin Dashboard Page
 * 
 * Dedicated page for the consolidated admin dashboard with proper layout and navigation
 * Updated to follow design system foundations guidelines
 */

import React from 'react';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';
import { AdminGuard } from '@/components/auth/AuthGuard';
import { PageHeader } from '@/components/Layout/PageHeader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/design-system/components/Breadcrumb';
import { Shield, Settings, Activity } from 'lucide-react';

// Import design system components
import {
    applyTypographyStyle,
    Container,
    SectionHeader,
    QuickActions
} from '@/design-system/stories/components';

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <PageHeader>
          <div className="flex items-center justify-between">
            <div>
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <div className="mt-4">
                <h1 style={applyTypographyStyle('headline')} className="text-foreground">
                  Admin Dashboard
                </h1>
                <p style={applyTypographyStyle('body')} className="text-muted-foreground mt-3">
                  Monitor and manage system performance, user activity, and system health
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 rounded-xl border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
                <span style={applyTypographyStyle('caption')} className="font-medium text-primary">
                  Admin Access
                </span>
              </div>
            </div>
          </div>
        </PageHeader>

        {/* Main Content */}
        <Container className="py-8">
          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <AdminDashboard />
          </div>
        </Container>

        {/* Quick Actions Footer */}
        <Container className="pb-8">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-8">
            <SectionHeader
              title="Quick Actions"
              subtitle="Common administrative tasks and system management"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 style={applyTypographyStyle('subtitle')} className="text-foreground">
                    System Monitoring
                  </h4>
                  <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                    View detailed system metrics
                  </p>
                </div>
              </div>
              <div className="flex items-center p-6 rounded-xl border border-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent/20 transition-colors">
                  <Settings className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 style={applyTypographyStyle('subtitle')} className="text-foreground">
                    System Settings
                  </h4>
                  <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                    Configure system preferences
                  </p>
                </div>
              </div>
              <div className="flex items-center p-6 rounded-xl border border-border hover:border-success/30 hover:bg-success/5 transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-success/20 transition-colors">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h4 style={applyTypographyStyle('subtitle')} className="text-foreground">
                    Security
                  </h4>
                  <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                    Manage security settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboardPage;
