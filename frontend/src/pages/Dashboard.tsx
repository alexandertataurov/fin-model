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
import {
  Card,
  Button,
  Badge,
  EnhancedCard,
  FeatureCard,
  ActionButton,
  componentStyles,
} from '../components/ui';
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
    <FeatureCard
      title={title}
      description={subtitle}
      icon={icon}
      action={
        <div className="flex items-center text-primary">
          <span className="text-sm font-semibold">Open Dashboard</span>
          <ArrowForward className="ml-2 h-4 w-4" />
        </div>
      }
      variant="highlight"
    />
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
      color: 'var(--chart-3)',
      path: '/dashboards/pl',
      badge: 'Financial',
    },
    {
      title: 'Cash Flow',
      subtitle: 'Track cash inflows and outflows with waterfall visualizations',
      icon: <DollarSign />,
      color: 'var(--chart-1)',
      path: '/dashboards/cashflow',
      badge: 'Financial',
    },
    {
      title: 'Balance Sheet',
      subtitle: 'View assets, liabilities, and equity with detailed breakdowns',
      icon: <CreditCard />,
      color: 'var(--chart-2)',
      path: '/dashboards/balance',
      badge: 'Financial',
    },
    {
      title: 'Analytics',
      subtitle: 'Advanced analytics and reporting with custom dashboards',
      icon: <Analytics />,
      color: 'var(--chart-4)',
      path: '/analytics',
      badge: 'Advanced',
    },
    {
      title: 'File Upload',
      subtitle: 'Upload and process financial documents and spreadsheets',
      icon: <CloudUpload />,
      color: 'var(--chart-5)',
      path: '/upload',
      badge: 'Tools',
    },
    {
      title: 'Real-time Metrics',
      subtitle: 'Monitor live financial data and performance indicators',
      icon: <Timeline />,
      color: 'var(--chart-6)',
      path: '/metrics',
      badge: 'Live',
    },
  ];

  const quickActions = [
    {
      title: 'Upload File',
      description: 'Process new financial data',
      icon: <CloudUpload className="h-5 w-5" />,
      action: () => navigate('/upload'),
      variant: 'default' as const,
    },
    {
      title: 'Generate Report',
      description: 'Create custom financial reports',
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => navigate('/reports'),
      variant: 'success' as const,
    },
    {
      title: 'View Analytics',
      description: 'Access advanced analytics',
      icon: <Analytics className="h-5 w-5" />,
      action: () => navigate('/analytics'),
      variant: 'info' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className={componentStyles.container}>
          <div className={`${componentStyles.flexBetween} py-6`}>
            <div>
              <h1 className={componentStyles.heading.h1}>
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's what's happening with your financial data today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success">v2.0.0</Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className={`${componentStyles.container} py-8`}>
        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Quick Actions</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <ActionButton
                key={index}
                icon={action.icon}
                label={action.title}
                onClick={action.action}
                variant={action.variant}
                size="lg"
              />
            ))}
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Financial Dashboards</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Access your financial data through our comprehensive dashboard
            suite.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <div key={index} onClick={() => navigate(card.path)}>
                <DashboardCard {...card} />
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started Guide */}
        <section className="mb-12">
          <EnhancedCard
            variant="filled"
            className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          >
            <div className="text-center space-y-4">
              <h3 className={componentStyles.heading.h3}>Getting Started</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                New to FinVision? Start by uploading your financial data or
                explore our comprehensive dashboard suite to get insights into
                your financial performance.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => navigate('/upload')}>
                  Upload Your First File
                </Button>
                <Button variant="outline" onClick={() => navigate('/docs')}>
                  View Documentation
                </Button>
              </div>
            </div>
          </EnhancedCard>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
