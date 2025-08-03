import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader2, ThumbsUp, ThumbsDown, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { AIInsight } from '@/types/template-builder';

interface AIInsightsProps {
  reportData: Record<string, any>;
  templateId?: string;
  onInsightGenerated?: (insight: AIInsight) => void;
}

interface InsightCardProps {
  insight: AIInsight;
  onFeedback?: (insightId: string, rating: number) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, onFeedback }) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedback = async (rating: number) => {
    if (onFeedback) {
      await onFeedback(insight.id, rating);
      setFeedbackSubmitted(true);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend_analysis':
        return <TrendingUp className="h-4 w-4" />;
      case 'risk_assessment':
        return <AlertTriangle className="h-4 w-4" />;
      case 'ratio_analysis':
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getInsightIcon(insight.insight_type)}
            <CardTitle className="text-base capitalize">
              {insight.insight_type.replace('_', ' ')}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              Confidence: {Math.round(insight.confidence_score * 100)}%
            </Badge>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getConfidenceColor(insight.confidence_score)}`}
                style={{ width: `${insight.confidence_score * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <p className="text-sm text-gray-700">{insight.ai_response.summary}</p>
          </TabsContent>

          <TabsContent value="insights" className="mt-4 space-y-2">
            {insight.ai_response.insights.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="mt-4 space-y-2">
            {insight.ai_response.recommendations.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="risks" className="mt-4 space-y-2">
            {insight.ai_response.risks.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Generated {new Date(insight.created_at).toLocaleDateString()}
          </div>
          
          {!feedbackSubmitted && !insight.feedback_rating && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Helpful?</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleFeedback(5)}
                className="h-6 w-6 p-0"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleFeedback(1)}
                className="h-6 w-6 p-0"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {(feedbackSubmitted || insight.feedback_rating) && (
            <Badge variant="outline" className="text-xs">
              Thanks for your feedback!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AIInsights: React.FC<AIInsightsProps> = ({ 
  reportData, 
  templateId,
  onInsightGenerated 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsightType, setSelectedInsightType] = useState<string>('comprehensive');
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateInsights = useCallback(async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await fetch('/api/v1/collaboration/templates/ai-insights/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          data: reportData,
          analysis_type: selectedInsightType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const result = await response.json();
      
      // Create insight object from response
      const newInsight: AIInsight = {
        id: result.id || `insight-${Date.now()}`,
        report_id: templateId || '',
        user_id: '', // Would be filled by backend
        insight_type: selectedInsightType as any,
        input_data: reportData,
        ai_response: result.insights,
        confidence_score: result.confidence || 0.85,
        created_at: new Date().toISOString()
      };

      setInsights(prev => [newInsight, ...prev]);
      
      if (onInsightGenerated) {
        onInsightGenerated(newInsight);
      }

      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 1000);

    } catch (error) {
      console.error('Failed to generate insights:', error);
      clearInterval(progressInterval);
      setGenerationProgress(0);
    } finally {
      setIsGenerating(false);
    }
  }, [reportData, selectedInsightType, templateId, onInsightGenerated]);

  const handleFeedback = async (insightId: string, rating: number) => {
    try {
      const response = await fetch(`/api/v1/collaboration/ai-insights/${insightId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ rating })
      });

      if (response.ok) {
        // Update local insight with feedback
        setInsights(prev => prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, feedback_rating: rating }
            : insight
        ));
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const loadExistingInsights = useCallback(async () => {
    if (!templateId) return;

    try {
      const response = await fetch(`/api/v1/collaboration/templates/${templateId}/ai-insights`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Failed to load existing insights:', error);
    }
  }, [templateId]);

  // Load existing insights on component mount
  React.useEffect(() => {
    loadExistingInsights();
  }, [loadExistingInsights]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI-Powered Insights
        </CardTitle>
        <p className="text-sm text-gray-600">
          Get intelligent analysis and recommendations for your financial data
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedInsightType} onValueChange={setSelectedInsightType}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                <SelectItem value="trend_analysis">Trend Analysis</SelectItem>
                <SelectItem value="ratio_analysis">Ratio Analysis</SelectItem>
                <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={generateInsights} 
              disabled={isGenerating || !Object.keys(reportData).length}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>

          {isGenerating && generationProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Analyzing data...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          {!Object.keys(reportData).length && (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Add data to your report to generate insights</p>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-4">
            {insights.length === 0 && Object.keys(reportData).length > 0 && !isGenerating && (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">No insights generated yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click "Generate Insights" to analyze your data
                </p>
              </div>
            )}

            {insights.map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onFeedback={handleFeedback}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};