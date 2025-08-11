/**
 * Admin Dashboard Page
 * 
 * Dedicated page for the consolidated admin dashboard with proper layout and navigation
 */

import React from 'react';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/design-system/components/Breadcrumb';
import { Shield, Settings, Activity } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
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
              <div className="mt-2">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Monitor and manage system performance, user activity, and system health
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Admin Access</span>
              </div>
            </div>
          </div>
        </PageHeader>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <AdminDashboard />
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">System Monitoring</h4>
                  <p className="text-sm text-gray-600">View detailed system metrics</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">System Settings</h4>
                  <p className="text-sm text-gray-600">Configure system preferences</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Security</h4>
                  <p className="text-sm text-gray-600">Manage security settings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboardPage;
