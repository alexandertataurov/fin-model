import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  BarChart3,
  Upload as CloudUpload,
  BarChart3 as Analytics,
  ArrowRight as ArrowForward,
  Activity as Timeline,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

/**
 * Main Dashboard/Home Page
 *
 * This component serves as the application's landing page after login, providing:
 * - Navigation cards to different app sections
 * - Quick action buttons for common tasks
 * - Getting started guide for new users
 * - User welcome message and overview
 */

interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  badge?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  onClick,
  badge,
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs font-semibold">
              {badge}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          {subtitle}
        </p>

        <div className="flex items-center text-primary">
          <span className="text-sm font-semibold">
            Open Dashboard
          </span>
          <ArrowForward className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'P&L Dashboard',
      subtitle:
        'Analyze profit & loss statements with interactive charts and key metrics',
      icon: <TrendingUp />,
      color: 'var(--chart-3)', // DESIGN_FIX
      path: '/dashboards/pl',
      badge: 'Financial',
    },
    {
      title: 'Cash Flow',
      subtitle: 'Track cash inflows and outflows with waterfall visualizations',
      icon: <DollarSign />,
      color: 'var(--chart-1)', // DESIGN_FIX
      path: '/dashboards/cashflow',
      badge: 'Financial',
    },
    {
      title: 'Balance Sheet',
      subtitle: 'Monitor assets, liabilities, and equity positions',
      icon: <CreditCard />,
      color: 'var(--chart-5)', // DESIGN_FIX
      path: '/dashboards/balance-sheet',
      badge: 'Coming Soon',
    },
    {
      title: 'Reports',
      subtitle: 'Generate and export comprehensive financial reports',
      icon: <BarChart3 />,
      color: 'var(--chart-4)', // DESIGN_FIX
      path: '/reports',
    },
    {
      title: 'File Upload',
      subtitle: 'Upload and process Excel financial models',
      icon: <CloudUpload />,
      color: 'var(--chart-2)', // DESIGN_FIX
      path: '/files',
    },
    {
      title: 'Analytics',
      subtitle: 'Advanced analytics and performance insights',
      icon: <Analytics />,
      color: 'var(--chart-1)', // DESIGN_FIX
      path: '/analytics',
    },
  ];

  const hasAnalystAccess =
    user?.roles?.includes('analyst') || user?.roles?.includes('admin');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.first_name || 'User'}
        </h1>
        <p className="text-lg text-muted-foreground">
          Transform your Excel financial models into interactive web dashboards
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="bg-primary text-primary-foreground">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Quick Actions
          </h2>
          <div className="flex gap-3 flex-wrap">
          <Button
            type="button"
            variant="default"
            onClick={() => navigate('/files')}
            className="bg-background text-primary hover:bg-muted flex items-center"
          >
            <CloudUpload className="mr-2 h-4 w-4" />
            Upload Financial Model
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboards/pl')}
            className="border-border text-primary-foreground hover:bg-primary/10 flex items-center"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View P&L Dashboard
          </Button>
          {hasAnalystAccess && (
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/scenarios')}
              className="border-border text-primary-foreground hover:bg-primary/10 flex items-center"
            >
              <Timeline className="mr-2 h-4 w-4" />
              Scenario Modeling
            </Button>
          )}
          </div>
        </div>
      </Card>

      {/* Dashboard Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Dashboards & Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map(card => (
            <DashboardCard
              key={card.title}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              color={card.color}
              badge={card.badge}
              onClick={() => navigate(card.path)}
            />
          ))}
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Getting Started
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Steps to Get Started</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <p className="text-sm">
                      Upload your Excel financial model files
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <p className="text-sm">
                      Review and validate extracted parameters
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <p className="text-sm">
                      Explore interactive dashboards and visualizations
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <p className="text-sm">
                      Generate and export comprehensive reports
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started quickly with our documentation and support
                  resources.
                </p>
                <Button type="button" variant="outline" className="w-full">
                  View Documentation
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
