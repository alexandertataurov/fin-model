import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Target,
  Settings,
  CloudUpload,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/ui/EnhancedCard';
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

      {/* Main Content */}
      <main className={componentStyles.container}>
        {/* Dashboard Cards Grid */}
        <section className="py-8">
          <div className="mb-6">
            <h2 className={componentStyles.heading.h2}>
              Financial Modeling Tools
            </h2>
            <p className="text-muted-foreground">
              Access comprehensive financial modeling and analysis tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                onClick={card.onClick}
                className="cursor-pointer"
              >
                <FeatureCard
                  title={card.title}
                  description={card.subtitle}
                  icon={card.icon}
                  action={
                    <div className="flex items-center text-primary">
                      <span className="text-sm font-semibold">
                        Open Dashboard
                      </span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  }
                  variant="highlight"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 border-t">
          <div className="mb-6">
            <h2 className={componentStyles.heading.h2}>Quick Actions</h2>
            <p className="text-muted-foreground">
              Common tasks to get you started quickly
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <EnhancedButton
                key={index}
                leftIcon={action.icon}
                onClick={action.action}
                variant={action.variant}
                size="lg"
              >
                {action.title}
              </EnhancedButton>
            ))}
          </div>
        </section>

        {/* Getting Started Guide */}
        <section className="py-8 border-t">
          <div className="mb-6">
            <h2 className={componentStyles.heading.h2}>Getting Started</h2>
            <p className="text-muted-foreground">
              Follow these steps to begin your financial modeling journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <h3 className="font-semibold">Upload Your Data</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Start by uploading your financial data files (Excel, CSV) to
                begin modeling.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <h3 className="font-semibold">Configure Parameters</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Set up your modeling parameters across 12 comprehensive
                categories.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <h3 className="font-semibold">Run Analysis</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate comprehensive financial statements and DCF valuations.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
