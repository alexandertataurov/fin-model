import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Target,
  Settings,
  CloudUpload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/Dashboard/DashboardCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { componentStyles } from '@/components/ui/utils/designSystem';

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
      title: 'P&L Statement',
      subtitle:
        'Analyze profit & loss statements with granular line items and key metrics',
      icon: <TrendingUp />,
      color: 'var(--chart-3)',
      path: '/dashboards/pl',
      badge: 'Financial',
      onClick: () => navigate('/dashboards/pl'),
    },
    {
      title: 'Cash Flow Statement',
      subtitle: 'Track cash inflows and outflows with detailed breakdowns',
      icon: <DollarSign />,
      color: 'var(--chart-1)',
      path: '/dashboards/cashflow',
      badge: 'Financial',
      onClick: () => navigate('/dashboards/cashflow'),
    },
    {
      title: 'Balance Sheet',
      subtitle:
        'View assets, liabilities, and equity with comprehensive structure',
      icon: <CreditCard />,
      color: 'var(--chart-2)',
      path: '/dashboards/balance',
      badge: 'Financial',
      onClick: () => navigate('/dashboards/balance'),
    },
    {
      title: 'DCF Valuation',
      subtitle: 'Comprehensive DCF modeling with sensitivity analysis',
      icon: <Target />,
      color: 'var(--chart-4)',
      path: '/dcf-valuation',
      badge: 'Valuation',
      onClick: () => navigate('/dcf-valuation'),
    },
    {
      title: 'Parameters',
      subtitle: 'Configure comprehensive financial modeling parameters',
      icon: <Settings />,
      color: 'var(--chart-5)',
      path: '/parameters',
      badge: 'Configuration',
      onClick: () => navigate('/parameters'),
    },
    {
      title: 'File Upload',
      subtitle: 'Upload and process financial documents and spreadsheets',
      icon: <CloudUpload />,
      color: 'var(--chart-6)',
      path: '/upload',
      badge: 'Tools',
      onClick: () => navigate('/upload'),
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
      title: 'Configure Parameters',
      description: 'Set up modeling parameters',
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate('/parameters'),
      variant: 'success' as const,
    },
    {
      title: 'Run DCF Valuation',
      description: 'Perform comprehensive valuation',
      icon: <Target className="h-5 w-5" />,
      action: () => navigate('/dcf-valuation'),
      variant: 'default' as const,
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
                Welcome back, {user?.first_name || user?.username || 'User'}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's what's happening with your financial data today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">v2.0.0</Badge>
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
