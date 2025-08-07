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
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { Button } from '@/design-system';
import { componentStyles } from '@/components/ui/utils/designSystem';
import { CoreFinancialModeling } from '@/components/CoreFinancialModeling';

/**
 * Main Dashboard/Home Page
 *
 * This component serves as the application's landing page after login, providing:
 * - Core Financial Modeling interface (primary)
 * - Navigation cards to different app sections (secondary)
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

  // Core Financial Modeling handlers
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    // TODO: Integrate with backend API
  };

  const handleParameterChange = (parameters: any) => {
    console.log('Parameters changed:', parameters);
    // TODO: Integrate with backend API
  };

  const handleScenarioCreate = (scenario: any) => {
    console.log('Scenario created:', scenario);
    // TODO: Integrate with backend API
  };

  const handleValuationChange = (valuation: any) => {
    console.log('Valuation changed:', valuation);
    // TODO: Integrate with backend API
  };

  const handleExportResults = (results: any) => {
    console.log('Export results:', results);
    // TODO: Implement export functionality
  };

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
        {/* Core Financial Modeling Interface */}
        <section className="py-8">
          <CoreFinancialModeling
            onFileUpload={handleFileUpload}
            onParameterChange={handleParameterChange}
            onScenarioCreate={handleScenarioCreate}
            onValuationChange={handleValuationChange}
            onExportResults={handleExportResults}
          />
        </section>

        {/* Quick Actions */}
        <section className="py-8 border-t">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={componentStyles.heading.h2}>Quick Actions</h2>
              <p className="text-muted-foreground">
                Get started with common financial modeling tasks
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
                className="h-auto p-6 flex flex-col items-start space-y-3"
              >
                <div className="flex items-center space-x-3">
                  {action.icon}
                  <div className="text-left">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </section>

        {/* Navigation Cards */}
        <section className="py-8 border-t">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={componentStyles.heading.h2}>Financial Tools</h2>
              <p className="text-muted-foreground">
                Access specialized financial analysis tools
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <Card
                key={index}
                onClick={card.onClick}
                className="cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {card.icon}
                    <CardTitle>{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {card.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Getting Started Guide */}
        <section className="py-8 border-t">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={componentStyles.heading.h2}>Getting Started</h2>
              <p className="text-muted-foreground">
                Learn how to use the financial modeling platform
              </p>
            </div>
            <Button variant="outline" size="sm">
              View All Guides
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              onClick={() => navigate('/upload')}
              className="cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CloudUpload />
                  <CardTitle>Upload Your Data</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Start by uploading your financial spreadsheets and documents
                </p>
              </CardContent>
            </Card>
            <Card
              onClick={() => navigate('/parameters')}
              className="cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings />
                  <CardTitle>Configure Parameters</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set up your modeling parameters and assumptions
                </p>
              </CardContent>
            </Card>
            <Card
              onClick={() => navigate('/dcf-valuation')}
              className="cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target />
                  <CardTitle>Run Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate comprehensive financial statements and valuations
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
