import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricConfig } from '@/types/template-builder';

interface MetricElementProps {
  config?: MetricConfig;
}

export const MetricElement: React.FC<MetricElementProps> = ({ config }) => {
  if (!config) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
        <div className="text-center text-gray-500">
          <div className="text-sm">Key Metric</div>
          <div className="text-xs mt-1">Configure value and format</div>
        </div>
      </div>
    );
  }

  const formatValue = (value: string | number, format: string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(numValue);
      case 'percentage':
        return `${numValue.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(numValue);
      default:
        return String(value);
    }
  };

  const getComparisonIcon = (currentValue: number, comparisonValue: number) => {
    if (currentValue > comparisonValue) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (currentValue < comparisonValue) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getComparisonColor = (currentValue: number, comparisonValue: number) => {
    if (currentValue > comparisonValue) {
      return 'text-green-500';
    } else if (currentValue < comparisonValue) {
      return 'text-red-500';
    } else {
      return 'text-gray-500';
    }
  };

  const currentValue = typeof config.value === 'string' ? parseFloat(config.value) : config.value;
  const comparisonValue = config.comparison ? 
    (typeof config.comparison.value === 'string' ? parseFloat(config.comparison.value) : config.comparison.value) : 
    null;

  return (
    <div className="w-full h-full p-3 flex flex-col justify-center">
      <div className="text-center">
        <div className="text-lg font-bold text-gray-800 mb-1">
          {formatValue(config.value, config.format)}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {config.label}
        </div>
        
        {config.comparison && comparisonValue !== null && (
          <div className="flex items-center justify-center space-x-1">
            {getComparisonIcon(currentValue, comparisonValue)}
            <span className={`text-xs ${getComparisonColor(currentValue, comparisonValue)}`}>
              {Math.abs(((currentValue - comparisonValue) / comparisonValue) * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">
              vs {config.comparison.type.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};