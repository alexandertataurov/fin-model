import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { FinancialDashboard } from '../components/Dashboard';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6" />
            <span>Financial Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Comprehensive financial analytics and modeling dashboard based on the lean financial modeling approach.
          </p>
        </CardContent>
      </Card>
      
      <FinancialDashboard />
    </div>
  );
};

export default Analytics; 