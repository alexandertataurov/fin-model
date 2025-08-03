import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Shield,
  BarChart3,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { FinancialRatio } from '../../types/dashboard';

interface FinancialRatiosProps {
  ratios: FinancialRatio[];
}

const FinancialRatios: React.FC<FinancialRatiosProps> = ({ ratios }) => {
  const [activeTab, setActiveTab] = useState('liquidity');

  const formatRatio = (value: number, category: string): string => {
    if (category === 'liquidity' || category === 'leverage') {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `${value.toFixed(1)}%`;
  };

  const getRatioColor = (
    ratio: FinancialRatio
  ): 'success' | 'warning' | 'error' => {
    // Simplified ratio assessment - in practice, this would be more sophisticated
    if (ratio.benchmark) {
      const deviation =
        Math.abs(ratio.value - ratio.benchmark) / ratio.benchmark;
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
        return <Zap className="text-blue-500" size={20} />;
      case 'leverage':
        return <Shield className="text-orange-500" size={20} />;
      case 'efficiency':
        return <BarChart3 className="text-purple-500" size={20} />;
      case 'profitability':
        return <DollarSign className="text-green-500" size={20} />;
      default:
        return <BarChart3 className="text-gray-500" size={20} />;
    }
  };

  const getRatioTrend = (ratio: FinancialRatio) => {
    if (!ratio.previousValue)
      return <Minus className="text-gray-400" size={16} />;

    const change = ratio.value - ratio.previousValue;
    if (change > 0) {
      return <TrendingUp className="text-green-500" size={16} />;
    } else if (change < 0) {
      return <TrendingDown className="text-red-500" size={16} />;
    }
    return <Minus className="text-gray-400" size={16} />;
  };

  const getProgressValue = (ratio: FinancialRatio): number => {
    if (ratio.benchmark) {
      return Math.min((ratio.value / ratio.benchmark) * 100, 100);
    }

    // Default progress calculation based on category
    switch (ratio.category) {
      case 'liquidity':
        return Math.min((ratio.value / 2.0) * 100, 100);
      case 'leverage':
        return Math.min((ratio.value / 1.0) * 100, 100);
      case 'efficiency':
      case 'profitability':
        return Math.min((ratio.value / 20.0) * 100, 100);
      default:
        return 50;
    }
  };

  const getRatiosByCategory = (category: string) =>
    ratios.filter(ratio => ratio.category === category);

  const RatioCard: React.FC<{ ratio: FinancialRatio }> = ({ ratio }) => {
    const color = getRatioColor(ratio);
    const progressValue = getProgressValue(ratio);

    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon(ratio.category)}
              <div>
                <h4 className="font-medium text-sm">{ratio.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {ratio.description}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {formatRatio(ratio.value, ratio.category)}
              </span>
              <div className="flex items-center gap-1">
                {getRatioTrend(ratio)}
                <Badge
                  variant={
                    color === 'success'
                      ? 'default'
                      : color === 'warning'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {color === 'success'
                    ? 'Good'
                    : color === 'warning'
                      ? 'Fair'
                      : 'Poor'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current</span>
                <span>{formatRatio(ratio.value, ratio.category)}</span>
              </div>
              <Progress value={progressValue} className="h-2" />
              {ratio.benchmark && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Benchmark</span>
                  <span>{formatRatio(ratio.benchmark, ratio.category)}</span>
                </div>
              )}
            </div>

            {ratio.previousValue && (
              <div className="text-xs text-muted-foreground">
                Previous: {formatRatio(ratio.previousValue, ratio.category)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CategorySummary: React.FC<{ category: string }> = ({ category }) => {
    const categoryRatios = getRatiosByCategory(category);
    const avgValue =
      categoryRatios.reduce((sum, ratio) => sum + ratio.value, 0) /
      categoryRatios.length;
    const goodRatios = categoryRatios.filter(
      ratio => getRatioColor(ratio) === 'success'
    ).length;
    const totalRatios = categoryRatios.length;

    return (
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <div className="flex justify-center mb-2">
          {getCategoryIcon(category)}
        </div>
        <p className="text-sm font-medium capitalize">{category}</p>
        <p className="text-2xl font-bold">{formatRatio(avgValue, category)}</p>
        <p className="text-xs text-muted-foreground">
          {goodRatios}/{totalRatios} ratios in good standing
        </p>
      </div>
    );
  };

  const categories = ['liquidity', 'leverage', 'efficiency', 'profitability'];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Financial Ratios Analysis</h3>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            {categories.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              {/* Category Summary */}
              <CategorySummary category={category} />

              {/* Ratio Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getRatiosByCategory(category).map(ratio => (
                  <RatioCard key={ratio.id} ratio={ratio} />
                ))}
              </div>

              {getRatiosByCategory(category).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No {category} ratios available
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialRatios;
