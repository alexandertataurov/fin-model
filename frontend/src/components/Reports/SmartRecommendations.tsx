import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Table, 
  TrendingUp, 
  Type, 
  Image as ImageIcon,
  PieChart,
  LineChart,
  BarChart,
  Plus,
  Sparkles,
  Brain
} from 'lucide-react';
import { ReportElementSuggestion } from '@/types/template-builder';

interface SmartRecommendationsProps {
  dataContext: Record<string, any>;
  onAddElement: (suggestion: ReportElementSuggestion) => void;
  templateId?: string;
}

interface RecommendationCardProps {
  recommendation: ReportElementSuggestion;
  onAdd: () => void;
  onDismiss?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  onAdd, 
  onDismiss 
}) => {
  const getElementIcon = (type: string, subtype?: string) => {
    if (type === 'chart') {
      switch (subtype) {
        case 'line':
          return <LineChart className="h-4 w-4" />;
        case 'bar':
          return <BarChart className="h-4 w-4" />;
        case 'pie':
          return <PieChart className="h-4 w-4" />;
        default:
          return <BarChart3 className="h-4 w-4" />;
      }
    }
    
    switch (type) {
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'metric':
        return <TrendingUp className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Highly Recommended';
    if (confidence >= 0.7) return 'Recommended';
    if (confidence >= 0.5) return 'Suggested';
    return 'Consider';
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              {getElementIcon(recommendation.type, recommendation.subtype)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {recommendation.title}
                </h4>
                <Badge 
                  variant="secondary" 
                  className="text-xs shrink-0"
                >
                  {Math.round(recommendation.confidence * 100)}%
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {recommendation.description}
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getConfidenceColor(recommendation.confidence)}`}
                      style={{ width: `${recommendation.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {getConfidenceLabel(recommendation.confidence)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <Button
              size="sm"
              onClick={onAdd}
              className="h-7 w-7 p-0 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-3 w-3" />
            </Button>
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  dataContext,
  onAddElement,
  templateId
}) => {
  const [recommendations, setRecommendations] = useState<ReportElementSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const fetchRecommendations = useCallback(async () => {
    if (!Object.keys(dataContext).length) {
      setRecommendations([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/collaboration/templates/smart-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          data_context: dataContext,
          user_preferences: {
            max_suggestions: 6,
            chart_types: ['line', 'bar', 'pie']
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.suggestions || []);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load recommendations');
      
      // Fallback to mock recommendations for development
      setRecommendations(generateMockRecommendations(dataContext));
    } finally {
      setIsLoading(false);
    }
  }, [dataContext]);

  const handleAddElement = useCallback((recommendation: ReportElementSuggestion) => {
    onAddElement(recommendation);
    
    // Mark as dismissed to remove from list
    setDismissedIds(prev => new Set([...prev, recommendation.id]));
  }, [onAddElement]);

  const handleDismiss = useCallback((recommendationId: string) => {
    setDismissedIds(prev => new Set([...prev, recommendationId]));
  }, []);

  // Fetch recommendations when data context changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRecommendations();
    }, 500); // Debounce to avoid too frequent API calls

    return () => clearTimeout(debounceTimer);
  }, [fetchRecommendations]);

  // Filter out dismissed recommendations
  const visibleRecommendations = recommendations.filter(rec => !dismissedIds.has(rec.id));

  if (!Object.keys(dataContext).length) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Add data to get smart recommendations</p>
            <p className="text-xs text-gray-400 mt-1">
              I'll suggest the best charts and metrics for your data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-500" />
          Smart Recommendations
        </CardTitle>
        <p className="text-xs text-gray-600">
          AI-suggested elements based on your data
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
              <span className="text-sm text-gray-600">Analyzing your data...</span>
            </div>
            <Progress value={66} className="h-1" />
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={fetchRecommendations}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && visibleRecommendations.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No recommendations available</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adding more data or different data types
            </p>
          </div>
        )}

        {!isLoading && !error && visibleRecommendations.length > 0 && (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {visibleRecommendations.map(recommendation => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onAdd={() => handleAddElement(recommendation)}
                onDismiss={() => handleDismiss(recommendation.id)}
              />
            ))}
            
            {dismissedIds.size > 0 && (
              <div className="pt-2 border-t">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDismissedIds(new Set())}
                  className="text-xs text-gray-500 h-6"
                >
                  Show dismissed ({dismissedIds.size})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Mock recommendations for development/fallback
function generateMockRecommendations(dataContext: Record<string, any>): ReportElementSuggestion[] {
  const recommendations: ReportElementSuggestion[] = [];
  
  // Check for time series data
  if (dataContext.revenue || dataContext.timeline) {
    recommendations.push({
      id: `mock-${Date.now()}-1`,
      type: 'chart',
      subtype: 'line',
      title: 'Revenue Trend',
      description: 'Shows revenue growth over time',
      confidence: 0.92,
      suggested_config: {
        chart: {
          chartType: 'line',
          title: 'Revenue Trend',
          xAxis: 'period',
          yAxis: ['revenue']
        }
      }
    });
  }
  
  // Check for categorical data
  if (dataContext.segments || dataContext.categories) {
    recommendations.push({
      id: `mock-${Date.now()}-2`,
      type: 'chart',
      subtype: 'pie',
      title: 'Revenue by Segment',
      description: 'Breakdown of revenue across business segments',
      confidence: 0.87,
      suggested_config: {
        chart: {
          chartType: 'pie',
          title: 'Revenue Distribution'
        }
      }
    });
  }
  
  // Always suggest key metrics
  recommendations.push({
    id: `mock-${Date.now()}-3`,
    type: 'metric',
    title: 'Total Revenue',
    description: 'Key performance indicator',
    confidence: 0.95,
    suggested_config: {
      metric: {
        label: 'Total Revenue',
        value: 0,
        format: 'currency'
      }
    }
  });
  
  return recommendations;
}