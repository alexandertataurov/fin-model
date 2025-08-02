import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Info,
  TrendingUp,
  TrendingDown,
  Remove,
  Speed,
  Security,
  Assessment,
  MonetizationOn,
} from '@mui/icons-material';
import { FinancialRatio } from '../../types/dashboard';

interface FinancialRatiosProps {
  ratios: FinancialRatio[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

const FinancialRatios: React.FC<FinancialRatiosProps> = ({ ratios }) => {
  const [tabValue, setTabValue] = useState(0);

  const formatRatio = (value: number, category: string): string => {
    if (category === 'liquidity' || category === 'leverage') {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `${value.toFixed(1)}%`;
  };

  const getRatioColor = (ratio: FinancialRatio): 'success' | 'warning' | 'error' => {
    // Simplified ratio assessment - in practice, this would be more sophisticated
    if (ratio.benchmark) {
      const deviation = Math.abs(ratio.value - ratio.benchmark) / ratio.benchmark;
      if (deviation < 0.1) return 'success';
      if (deviation < 0.3) return 'warning';
      return 'error';
    }
    
    // Default assessment based on common ratio ranges
    switch (ratio.category) {
      case 'liquidity':
        if (ratio.value >= 1.5) return 'success';
        if (ratio.value >= 1.0) return 'warning';
        return 'error';
      case 'leverage':
        if (ratio.value <= 0.5) return 'success';
        if (ratio.value <= 1.0) return 'warning';
        return 'error';
      case 'efficiency':
        if (ratio.value >= 15) return 'success';
        if (ratio.value >= 5) return 'warning';
        return 'error';
      case 'profitability':
        if (ratio.value >= 15) return 'success';
        if (ratio.value >= 5) return 'warning';
        return 'error';
      default:
        return 'warning';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'liquidity':
        return <Speed color="primary" />;
      case 'leverage':
        return <Security color="warning" />;
      case 'efficiency':
        return <Assessment color="info" />;
      case 'profitability':
        return <MonetizationOn color="success" />;
      default:
        return <Assessment color="action" />;
    }
  };

  const getRatioTrend = (ratio: FinancialRatio) => {
    if (!ratio.benchmark) return <Remove color="disabled" />;
    
    if (ratio.value > ratio.benchmark) {
      // For leverage ratios, higher is worse
      if (ratio.category === 'leverage') {
        return <TrendingUp color="error" />;
      }
      return <TrendingUp color="success" />;
    } else if (ratio.value < ratio.benchmark) {
      // For leverage ratios, lower is better
      if (ratio.category === 'leverage') {
        return <TrendingDown color="success" />;
      }
      return <TrendingDown color="error" />;
    }
    return <Remove color="disabled" />;
  };

  const getProgressValue = (ratio: FinancialRatio): number => {
    if (ratio.benchmark) {
      return Math.min((ratio.value / ratio.benchmark) * 100, 100);
    }
    
    // Default progress calculation based on category
    switch (ratio.category) {
      case 'liquidity':
        return Math.min((ratio.value / 2.0) * 100, 100); // Max at 2.0 ratio
      case 'leverage':
        return Math.max(100 - (ratio.value * 100), 0); // Lower is better
      case 'efficiency':
      case 'profitability':
        return Math.min((ratio.value / 20) * 100, 100); // Max at 20%
      default:
        return 50;
    }
  };

  // Group ratios by category
  const ratioCategories = [
    { key: 'liquidity', label: 'Liquidity Ratios', description: 'Ability to meet short-term obligations' },
    { key: 'leverage', label: 'Leverage Ratios', description: 'Financial leverage and debt management' },
    { key: 'efficiency', label: 'Efficiency Ratios', description: 'Asset utilization and operational efficiency' },
    { key: 'profitability', label: 'Profitability Ratios', description: 'Profit generation capability' },
  ];

  const getRatiosByCategory = (category: string) => 
    ratios.filter(ratio => ratio.category === category);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const RatioCard: React.FC<{ ratio: FinancialRatio }> = ({ ratio }) => {
    const color = getRatioColor(ratio);
    const progressValue = getProgressValue(ratio);
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="div">
                {formatRatio(ratio.value, ratio.category)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {ratio.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getRatioTrend(ratio)}
              <Tooltip title={ratio.interpretation}>
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Benchmark Comparison */}
          {ratio.benchmark && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Benchmark: {formatRatio(ratio.benchmark, ratio.category)}
              </Typography>
              <Chip
                label={`${ratio.value > ratio.benchmark ? '+' : ''}${((ratio.value - ratio.benchmark) / ratio.benchmark * 100).toFixed(1)}%`}
                size="small"
                color={color}
                variant="outlined"
              />
            </Box>
          )}

          {/* Performance Assessment */}
          <Chip
            label={
              color === 'success' ? 'Good' : 
              color === 'warning' ? 'Fair' : 'Poor'
            }
            size="small"
            color={color}
            sx={{ width: '100%' }}
          />

          {/* Interpretation */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {ratio.interpretation}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const CategorySummary: React.FC<{ category: string }> = ({ category }) => {
    const categoryRatios = getRatiosByCategory(category);
    const avgPerformance = categoryRatios.reduce((sum, ratio) => {
      const color = getRatioColor(ratio);
      return sum + (color === 'success' ? 3 : color === 'warning' ? 2 : 1);
    }, 0) / categoryRatios.length;

    const performanceLabel = avgPerformance >= 2.5 ? 'Strong' : avgPerformance >= 2 ? 'Moderate' : 'Weak';
    const performanceColor = avgPerformance >= 2.5 ? 'success' : avgPerformance >= 2 ? 'warning' : 'error';

    return (
      <Paper sx={{ p: 2, mb: 2, bgcolor: `${performanceColor}.50` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getCategoryIcon(category)}
            <Typography variant="subtitle1" fontWeight="medium">
              {ratioCategories.find(c => c.key === category)?.label}
            </Typography>
          </Box>
          <Chip
            label={`${performanceLabel} Performance`}
            color={performanceColor}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {ratioCategories.find(c => c.key === category)?.description}
        </Typography>
      </Paper>
    );
  };

  if (!ratios || ratios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Typography variant="h6" component="div">
            Financial Ratios
          </Typography>
        </CardHeader>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No financial ratio data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6" component="div">
          Financial Ratios Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ratios.length} ratios across {ratioCategories.length} categories
        </Typography>
      </CardHeader>
      <CardContent>
        {/* Ratio Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            {ratioCategories.map((category) => (
              <Tab 
                key={category.key}
                label={category.label}
                icon={getCategoryIcon(category.key)}
                iconPosition="start"
                disabled={getRatiosByCategory(category.key).length === 0}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {ratioCategories.map((category, index) => (
          <TabPanel key={category.key} value={tabValue} index={index}>
            <CategorySummary category={category.key} />
            
            <Grid container spacing={3}>
              {getRatiosByCategory(category.key).map((ratio) => (
                <Grid item xs={12} sm={6} md={4} key={ratio.name}>
                  <RatioCard ratio={ratio} />
                </Grid>
              ))}
            </Grid>

            {getRatiosByCategory(category.key).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No {category.label.toLowerCase()} available
              </Typography>
            )}
          </TabPanel>
        ))}

        {/* Overall Summary */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Ratio Analysis Summary
          </Typography>
          <Grid container spacing={2}>
            {ratioCategories.map((category) => {
              const categoryRatios = getRatiosByCategory(category.key);
              if (categoryRatios.length === 0) return null;

              const strongRatios = categoryRatios.filter(r => getRatioColor(r) === 'success').length;
              // const weakRatios = categoryRatios.filter(r => getRatioColor(r) === 'error').length;

              return (
                <Grid item xs={12} sm={6} md={3} key={category.key}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {category.label}
                    </Typography>
                    <Typography variant="h6">
                      {strongRatios}/{categoryRatios.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Strong ratios
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialRatios;