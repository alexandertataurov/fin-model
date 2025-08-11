/**
 * Admin Dashboard Page
 * 
 * Dedicated page for the consolidated admin dashboard with proper layout and navigation
 */

import React from 'react';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';
import { AdminGuard } from '@/components/auth/AuthGuard';
import { PageHeader } from '@/components/Layout/PageHeader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/design-system/components/Breadcrumb';
import { Shield, Settings, Activity, Crown, TrendingUp, Users, Database } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        {/* Enhanced Page Header */}
        <PageHeader className="bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 border-b-2 border-blue-100 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin" className="text-blue-600 hover:text-blue-800">
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="/admin/dashboard" className="text-gray-700">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1 text-lg">
                      Monitor and manage system performance, user activity, and system health
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Enhanced Admin Access Badge */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl border border-blue-400 shadow-lg">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">Admin Access</span>
                  <div className="text-xs text-blue-100">Full System Control</div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">System Online</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Active Users</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
                  <Database className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Data Healthy</span>
                </div>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
