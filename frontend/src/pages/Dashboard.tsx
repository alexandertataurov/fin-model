import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  AttachMoney,
  Assessment,
  CloudUpload,
  Analytics,
  ArrowForward,
  Timeline,
} from '@mui/icons-material';
import { Card, Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

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
  color,
  onClick,
  badge,
}) => {
  return (
    <Card
      hover
      sx={{
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        '&:hover': {
          borderColor: color,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Box>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                backgroundColor: `${color}20`,
                color: color,
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', color: color }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Open Dashboard
          </Typography>
          <ArrowForward sx={{ ml: 0.5, fontSize: 16 }} />
        </Box>
      </Box>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'P&L Dashboard',
      subtitle: 'Analyze profit & loss statements with interactive charts and key metrics',
      icon: <TrendingUp />,
      color: 'var(--chart-3)', // DESIGN_FIX
      path: '/dashboards/pl',
      badge: 'Financial',
    },
    {
      title: 'Cash Flow',
      subtitle: 'Track cash inflows and outflows with waterfall visualizations',
      icon: <AttachMoney />,
      color: 'var(--chart-1)', // DESIGN_FIX
      path: '/dashboards/cashflow',
      badge: 'Financial',
    },
    {
      title: 'Balance Sheet',
      subtitle: 'Monitor assets, liabilities, and equity positions',
      icon: <AccountBalance />,
      color: 'var(--chart-5)', // DESIGN_FIX
      path: '/dashboards/balance-sheet',
      badge: 'Coming Soon',
    },
    {
      title: 'Reports',
      subtitle: 'Generate and export comprehensive financial reports',
      icon: <Assessment />,
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

  const hasAnalystAccess = user?.roles?.includes('analyst') || user?.roles?.includes('admin');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.first_name || 'User'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Transform your Excel financial models into interactive web dashboards
        </Typography>
      </Box>

      {/* Quick Actions */}
      {/* DESIGN_FIX: replaced Paper with Card and removed inline colors */}
      <Card className="mb-4 bg-primary text-primary-foreground p-3" hover={false}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="default"
            onClick={() => navigate('/files')}
            className="bg-background text-primary hover:bg-muted flex items-center"
          >
            <CloudUpload className="mr-2 h-4 w-4" />
            Upload Financial Model
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboards/pl')}
            className="border-border text-primary-foreground hover:bg-primary/10 flex items-center"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View P&L Dashboard
          </Button>
          {hasAnalystAccess && (
            <Button
              variant="outline"
              onClick={() => navigate('/scenarios')}
              className="border-border text-primary-foreground hover:bg-primary/10 flex items-center"
            >
              <Timeline className="mr-2 h-4 w-4" />
              Scenario Modeling
            </Button>
          )}
        </Box>
      </Card>

      {/* Dashboard Cards */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Dashboards & Tools
      </Typography>

      <Grid container spacing={3}>
        {dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <DashboardCard
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              color={card.color}
              badge={card.badge}
              onClick={() => navigate(card.path)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Getting Started
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card title="Steps to Get Started">
              <Box sx={{ '& > *': { mb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* DESIGN_FIX: use utility classes instead of inline styles */}
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <Typography>Upload your Excel financial model files</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* DESIGN_FIX: use utility classes instead of inline styles */}
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <Typography>Review and validate extracted parameters</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* DESIGN_FIX: use utility classes instead of inline styles */}
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <Typography>Explore interactive dashboards and visualizations</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* DESIGN_FIX: use utility classes instead of inline styles */}
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    4
                  </div>
                  <Typography>Generate and export comprehensive reports</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card title="Need Help?">
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get started quickly with our documentation and support resources.
              </Typography>
              <Button variant="outline" className="w-full">
                View Documentation
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
